# AWS Amplify Deployment

Deploy OpenRockChat UI on AWS Amplify for seamless AWS integration.

## Prerequisites

- AWS Account
- GitHub repository
- AWS CLI (optional)

## Step 1: Connect to GitHub

1. Go to AWS Amplify Console
2. Click "New app" > "Host web app"
3. Select "GitHub" as source
4. Authorize AWS Amplify to access your repo
5. Select your `openrockchat-ui` repository

## Step 2: Build Settings

Amplify will auto-detect Next.js. If needed, customize:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 3: Environment Variables

Add in Amplify Console > App settings > Environment variables:

```bash
OPENAI_API_TYPE=bedrock
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0

# Public variables (client-side)
NEXT_PUBLIC_OPENAI_API_TYPE=bedrock
NEXT_PUBLIC_BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id
NEXT_PUBLIC_BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
NEXT_PUBLIC_AWS_REGION=us-east-1
```

## Step 4: IAM Permissions

Create an IAM role for Amplify with Bedrock permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:Retrieve"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/*",
        "arn:aws:bedrock:*:*:knowledge-base/*"
      ]
    }
  ]
}
```

## Step 5: Custom Domain (Optional)

1. Go to Domain management
2. Add your domain (e.g., `chat.yourdomain.com`)
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Step 6: Deploy

1. Click "Save and deploy"
2. Wait for build to complete (5-10 minutes)
3. Access your app at the provided URL

## Benefits of Amplify

- **Automatic builds** on git push
- **Built-in CDN** with CloudFront
- **SSL certificates** automatically managed
- **Environment management** for staging/production
- **Native AWS integration** (no additional setup for Bedrock)
- **Monitoring** and logs included

## Branch-based Deployments

- `main` branch → Production environment
- `develop` branch → Staging environment
- Feature branches → Preview deployments

## Monitoring

Access logs and metrics in Amplify Console:
- Build logs
- Access logs
- Performance metrics
- Error tracking

## Cost Estimation

- **Free tier**: 1,000 build minutes/month
- **Build minutes**: $0.01/minute after free tier
- **Data transfer**: $0.15/GB
- **Storage**: $0.023/GB/month

For a typical chat application: ~$10-50/month depending on traffic.