export interface BedrockAgentConfiguration {
  knowledgeBaseId: string;
  modelArn: string;
  retrievalConfiguration?: {
    vectorSearchConfiguration: {
      numberOfResults: number;
    };
  };
  generationConfiguration?: {
    inferenceConfig: {
      textInferenceConfig: {
        temperature: number;
        topP: number;
        maxTokens: number;
        stopSequences: string[];
      };
    };
  };
  orchestrationConfiguration?: {
    inferenceConfig: {
      textInferenceConfig: {
        temperature: number;
        topP: number;
        maxTokens: number;
        stopSequences: string[];
      };
    };
  };
}

export interface BedrockRetrieveAndGenerateConfig {
  type: 'KNOWLEDGE_BASE';
  knowledgeBaseConfiguration: BedrockAgentConfiguration;
}

export interface BedrockRequest {
  input: {
    text: string;
  };
  retrieveAndGenerateConfiguration: BedrockRetrieveAndGenerateConfig;
}

export interface BedrockStreamResponse {
  chunk?: {
    bytes?: Uint8Array;
  };
  metadata?: any;
}

export interface BedrockConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
}

export interface BedrockModel {
  id: string;
  name: string;
  provider: 'bedrock';
  knowledgeBaseId?: string;
  modelArn?: string;
}

export const defaultBedrockModels: BedrockModel[] = [
  {
    id: 'amazon.nova-pro-v1:0',
    name: 'Amazon Nova Pro',
    provider: 'bedrock',
    modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-pro-v1:0',
  },
  {
    id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    name: 'Claude 3.5 Sonnet',
    provider: 'bedrock',
    modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
  },
  {
    id: 'anthropic.claude-3-5-haiku-20241022-v1:0',
    name: 'Claude 3.5 Haiku',
    provider: 'bedrock',
    modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0',
  },
];