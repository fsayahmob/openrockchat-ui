export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "Vous êtes un assistant IA utile et intelligent. Suivez attentivement les instructions de l'utilisateur. Répondez en utilisant le format Markdown pour une meilleure lisibilité.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';

export const AWS_REGION =
  process.env.AWS_REGION || 'us-east-1';

export const BEDROCK_KNOWLEDGE_BASE_ID =
  process.env.BEDROCK_KNOWLEDGE_BASE_ID || '';

export const BEDROCK_MODEL_ARN =
  process.env.BEDROCK_MODEL_ARN || '';
