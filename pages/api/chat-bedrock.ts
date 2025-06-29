import { NextApiRequest, NextApiResponse } from 'next';
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockAgentRuntimeClient, RetrieveCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { AWS_REGION, BEDROCK_KNOWLEDGE_BASE_ID, BEDROCK_MODEL_ARN, DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, knowledgeBaseId, modelArn, region, temperature = 0 } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const lastMessage = messages[messages.length - 1];
    const inputText = { text: lastMessage.content };

    const credentialsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    };

    const regionConfig = region || AWS_REGION || 'us-east-1';

    // 1. D'abord récupérer le contexte depuis la knowledge base
    const agentClient = new BedrockAgentRuntimeClient({
      region: regionConfig,
      credentials: credentialsConfig,
    });

    const retrieveRequest = {
      knowledgeBaseId: knowledgeBaseId || BEDROCK_KNOWLEDGE_BASE_ID,
      retrievalQuery: {
        text: lastMessage.content
      },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: 3
        }
      }
    };

    let context = '';
    try {
      const retrieveCommand = new RetrieveCommand(retrieveRequest);
      const retrieveResponse = await agentClient.send(retrieveCommand);
      
      if (retrieveResponse.retrievalResults) {
        context = retrieveResponse.retrievalResults
          .map(result => result.content?.text || '')
          .join('\n\n');
      }
    } catch (error) {
      console.log('Warning: Could not retrieve context from knowledge base:', error);
    }

    // 2. Créer le prompt utilisateur avec le contexte
    const userPrompt = context 
      ? `Contexte: ${context}\n\nQuestion: ${lastMessage.content}`
      : lastMessage.content;

    // 3. Utiliser le streaming avec le modèle directement
    const runtimeClient = new BedrockRuntimeClient({
      region: regionConfig,
      credentials: credentialsConfig,
    });

    const modelId = (modelArn || BEDROCK_MODEL_ARN).split('/').pop();
    
    // Structure spécifique pour Amazon Nova
    const modelRequest = {
      modelId: modelId,
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              {
                text: userPrompt
              }
            ]
          }
        ],
        system: [
          {
            text: DEFAULT_SYSTEM_PROMPT
          }
        ],
        inferenceConfig: {
          max_new_tokens: 1000,
          temperature: temperature
        }
      }),
      contentType: 'application/json',
      accept: 'application/json'
    };

    try {
      const command = new InvokeModelWithResponseStreamCommand(modelRequest);
      const response = await runtimeClient.send(command);

      // Set up streaming response
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (response.body) {
        let buffer = '';
        let lastFlushTime = 0;
        const FLUSH_INTERVAL = 100; // Flush toutes les 100ms
        const MIN_CHUNK_SIZE = 5; // Minimum 5 caractères avant d'envoyer
        
        for await (const chunk of response.body) {
          if (chunk.chunk?.bytes) {
            try {
              const chunkData = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
              console.log('Chunk data:', chunkData); // Debug
              
              let text = '';
              // Pour Amazon Nova, le format peut être différent
              if (chunkData.contentBlockDelta?.delta?.text) {
                text = chunkData.contentBlockDelta.delta.text;
              } else if (chunkData.delta?.text) {
                text = chunkData.delta.text;
              } else if (chunkData.completion) {
                text = chunkData.completion;
              } else if (chunkData.outputText) {
                text = chunkData.outputText;
              }

              if (text) {
                buffer += text;
                const now = Date.now();
                
                // Envoyer si le buffer est assez grand OU si assez de temps s'est écoulé
                if (buffer.length >= MIN_CHUNK_SIZE || now - lastFlushTime > FLUSH_INTERVAL) {
                  console.log('Sending buffered text:', buffer); // Debug
                  res.write(buffer);
                  if (res.flush) res.flush();
                  buffer = '';
                  lastFlushTime = now;
                }
              }

              if (chunkData.messageStop) {
                // Envoyer le reste du buffer
                if (buffer) {
                  res.write(buffer);
                  if (res.flush) res.flush();
                }
                break;
              }
            } catch (parseError) {
              console.error('Error parsing chunk:', parseError);
              // Si le parsing échoue, essayer de traiter comme du texte brut
              const rawText = new TextDecoder().decode(chunk.chunk.bytes);
              if (rawText.trim()) {
                buffer += rawText;
                if (buffer.length >= MIN_CHUNK_SIZE) {
                  res.write(buffer);
                  if (res.flush) res.flush();
                  buffer = '';
                }
              }
            }
          }
        }
        
        // Envoyer tout ce qui reste dans le buffer
        if (buffer) {
          res.write(buffer);
          if (res.flush) res.flush();
        }
      }
      
      res.end();
    } catch (bedrockError) {
      console.error('Bedrock API error:', bedrockError);
      res.status(500).json({ error: bedrockError.message });
    }

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const config = {
  runtime: 'nodejs',
};

export default handler;