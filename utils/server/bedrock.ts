import { BedrockConfig, BedrockRequest, BedrockStreamResponse } from '@/types/bedrock';

export class BedrockStream {
  private decoder = new TextDecoder();

  async *streamResponse(
    request: BedrockRequest,
    config: BedrockConfig
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch('/api/bedrock/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bedrock API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = this.decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                yield parsed.text;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Bedrock streaming error:', error);
      throw error;
    }
  }
}

export function createBedrockStream(
  request: BedrockRequest,
  config: BedrockConfig
): ReadableStream {
  const encoder = new TextEncoder();
  const bedrockStream = new BedrockStream();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of bedrockStream.streamResponse(request, config)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}