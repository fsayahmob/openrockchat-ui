import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockAgentRuntimeClient, RetrieveCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { AWS_REGION, BEDROCK_KNOWLEDGE_BASE_ID, BEDROCK_MODEL_ARN } from '@/utils/app/const';
import { Message } from '@/types/chat';

export async function BedrockStream(
  messages: Message[],
  temperature: number = 0
): Promise<ReadableStream> {
  const credentialsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };

  const regionConfig = AWS_REGION || 'us-east-1';
  const lastMessage = messages[messages.length - 1];

  // 1. Récupérer le contexte depuis la knowledge base
  const agentClient = new BedrockAgentRuntimeClient({
    region: regionConfig,
    credentials: credentialsConfig,
  });

  const retrieveRequest = {
    knowledgeBaseId: BEDROCK_KNOWLEDGE_BASE_ID,
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

  // 2. Créer le prompt avec le contexte
  const prompt = `Contexte: ${context}\n\nQuestion: ${lastMessage.content}\n\nRéponse:`;

  // 3. Client Bedrock Runtime
  const runtimeClient = new BedrockRuntimeClient({
    region: regionConfig,
    credentials: credentialsConfig,
  });

  const modelId = BEDROCK_MODEL_ARN?.split('/').pop() || 'amazon.nova-pro-v1:0';
  
  const modelRequest = {
    modelId: modelId,
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: [
            {
              text: prompt
            }
          ]
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

  // 4. Créer le ReadableStream
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const command = new InvokeModelWithResponseStreamCommand(modelRequest);
        const response = await runtimeClient.send(command);

        if (response.body) {
          for await (const chunk of response.body) {
            if (chunk.chunk?.bytes) {
              try {
                const chunkData = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
                
                let text = '';
                // Gérer différents formats de réponse Nova
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
                  console.log('Streaming text:', text); // Debug
                  controller.enqueue(encoder.encode(text));
                }

                if (chunkData.messageStop) {
                  break;
                }
              } catch (parseError) {
                console.error('Error parsing chunk:', parseError);
                // Si le parsing échoue, essayer comme texte brut
                const rawText = new TextDecoder().decode(chunk.chunk.bytes);
                if (rawText.trim()) {
                  controller.enqueue(encoder.encode(rawText));
                }
              }
            }
          }
        }
        
        controller.close();
      } catch (error) {
        console.error('Bedrock streaming error:', error);
        controller.error(error);
      }
    },
  });
}