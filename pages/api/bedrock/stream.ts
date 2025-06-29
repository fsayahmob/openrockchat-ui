import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import { BedrockRequest, BedrockConfig } from '@/types/bedrock';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { request, config }: { request: BedrockRequest; config: BedrockConfig } = req.body;

  if (!request || !config) {
    return res.status(400).json({ error: 'Missing request or config' });
  }

  try {
    const awsConfig: AWS.Config = new AWS.Config({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
      accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: config.sessionToken || process.env.AWS_SESSION_TOKEN,
    });

    const bedrockAgentRuntime = new AWS.BedrockAgentRuntime(awsConfig);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const response = await bedrockAgentRuntime.retrieveAndGenerate(request).promise();
    
    if (response.$response && response.$response.httpResponse && response.$response.httpResponse.stream) {
      const stream = response.$response.httpResponse.stream;
      
      stream.on('data', (chunk: any) => {
        try {
          const decoder = new TextDecoder();
          const text = decoder.decode(chunk);
          
          const eventData = parseEventStream(text);
          if (eventData && eventData.text) {
            res.write(`data: ${JSON.stringify({ text: eventData.text })}\n\n`);
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      });

      stream.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
      });

      stream.on('error', (error: any) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });
    } else {
      if (response.output && response.output.text) {
        res.write(`data: ${JSON.stringify({ text: response.output.text })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error) {
    console.error('Bedrock API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function parseEventStream(text: string): any {
  try {
    const lines = text.split('\n');
    let eventData: any = {};
    
    for (const line of lines) {
      if (line.startsWith(':content-type:')) continue;
      if (line.startsWith(':message-type:')) continue;
      if (line.startsWith(':event-type:')) continue;
      
      const match = line.match(/^([^:]+):(.*)$/);
      if (match) {
        const [, field, value] = match;
        if (field === 'data') {
          try {
            const parsed = JSON.parse(value.trim());
            if (parsed.bytes) {
              const decoder = new TextDecoder();
              const decodedText = decoder.decode(Buffer.from(parsed.bytes, 'base64'));
              const innerData = JSON.parse(decodedText);
              
              if (innerData.completion) {
                eventData.text = innerData.completion;
              } else if (innerData.chunk && innerData.chunk.bytes) {
                const chunkText = decoder.decode(Buffer.from(innerData.chunk.bytes, 'base64'));
                const chunkData = JSON.parse(chunkText);
                if (chunkData.delta && chunkData.delta.text) {
                  eventData.text = chunkData.delta.text;
                }
              }
            }
          } catch (e) {
            console.error('Error parsing event data:', e);
          }
        }
      }
    }
    
    return eventData;
  } catch (error) {
    console.error('Error parsing event stream:', error);
    return null;
  }
}