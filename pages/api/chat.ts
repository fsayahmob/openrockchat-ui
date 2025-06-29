import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, OPENAI_API_TYPE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { BedrockStream } from '@/utils/server/bedrock-stream';
import { OpenAIModelID, OpenAITokenizers } from '@/types/openai'

import { ChatBody, Message } from '@/types/chat';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, key, prompt, temperature } = (await req.json()) as ChatBody;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    // Route vers Bedrock si configuré
    if (OPENAI_API_TYPE === 'bedrock') {
      // Pour Bedrock, pas besoin de tokenizer, utiliser directement tous les messages
      const messagesToSend = messages;
      
      // Utiliser l'endpoint Bedrock avec le bon host
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : req.headers.get('origin') || '';
        
      const bedrockResponse = await fetch(`${baseUrl}/api/chat-bedrock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          knowledgeBaseId: process.env.BEDROCK_KNOWLEDGE_BASE_ID,
          modelArn: process.env.BEDROCK_MODEL_ARN,
          region: process.env.AWS_REGION,
          temperature: temperatureToUse,
        }),
      });

      if (!bedrockResponse.ok) {
        console.error('Bedrock API error:', bedrockResponse.statusText);
        return new Response('Error', { status: 500 });
      }

      return new Response(bedrockResponse.body, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Pour OpenAI, utiliser le tokenizer
    const tokenizer = OpenAITokenizers[model.id as OpenAIModelID];
    if (!tokenizer) {
      console.error('No tokenizer found for model:', model.id);
      return new Response('Model not supported', { status: 400 });
    }
    
    const prompt_tokens = tokenizer.encode(promptToSend, false);

    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = tokenizer.encode(message.content, false);

      if (tokenCount + tokens.length + 768 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
