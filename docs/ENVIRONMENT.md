# Environment Variables

Complete reference for all environment variables in OpenRockChat UI.

## Required Variables

### For OpenAI
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

### For AWS Bedrock
```bash
OPENAI_API_TYPE=bedrock
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
```

## Public Variables (Client-side)

These are exposed to the browser:

```bash
NEXT_PUBLIC_OPENAI_API_TYPE=bedrock
NEXT_PUBLIC_BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id
NEXT_PUBLIC_BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
NEXT_PUBLIC_AWS_REGION=us-east-1
```

## Optional Variables

### Streaming Configuration
```bash
STREAMING_MODE=character          # "character" or "chunk"
CHAR_DELAY=25                     # Delay between characters (ms)
CHUNK_SIZE=5                      # Minimum characters per chunk
BUFFER_FLUSH_INTERVAL=100         # Buffer flush interval (ms)
```

### System Prompt
```bash
DEFAULT_SYSTEM_PROMPT="You are a helpful AI assistant."
```

## Environment Files

- `.env.local` - Local development (git ignored)
- `.env.example` - Template file (committed to git)
- `.env.production` - Production environment (for deployments)

## Security Notes

- Never commit `.env.local` to git
- Use quotes for values with special characters
- AWS credentials should have minimal permissions
- Rotate credentials regularly