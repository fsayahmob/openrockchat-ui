# Docker Deployment

Containerize OpenRockChat UI for easy deployment anywhere.

## Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

## Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  openrockchat-ui:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_TYPE=bedrock
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION}
      - BEDROCK_KNOWLEDGE_BASE_ID=${BEDROCK_KNOWLEDGE_BASE_ID}
      - BEDROCK_MODEL_ARN=${BEDROCK_MODEL_ARN}
      - NEXT_PUBLIC_OPENAI_API_TYPE=bedrock
      - NEXT_PUBLIC_BEDROCK_KNOWLEDGE_BASE_ID=${BEDROCK_KNOWLEDGE_BASE_ID}
      - NEXT_PUBLIC_BEDROCK_MODEL_ARN=${BEDROCK_MODEL_ARN}
      - NEXT_PUBLIC_AWS_REGION=${AWS_REGION}
    restart: unless-stopped
    networks:
      - openrockchat-network

networks:
  openrockchat-network:
    driver: bridge
```

## Environment File

Create `.env.docker`:

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
```

## Build and Run

```bash
# Build the image
docker build -t openrockchat-ui .

# Run with docker-compose
docker-compose --env-file .env.docker up -d

# Or run directly
docker run -d \
  --name openrockchat-ui \
  -p 3000:3000 \
  --env-file .env.docker \
  openrockchat-ui
```

## Multi-stage Build Optimization

For smaller production images:

```dockerfile
# ... (previous Dockerfile content)

# Add this at the end of builder stage
RUN npm run build && npm prune --production

# In runner stage, only copy production node_modules
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
```

## Health Check

Add to Dockerfile:

```dockerfile
# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

Create health endpoint in `pages/api/health.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
}
```

## Production Deployment

### Using Docker Swarm

```yaml
version: '3.8'

services:
  openrockchat-ui:
    image: openrockchat-ui:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        max_attempts: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    networks:
      - openrockchat-network
```

### Using Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openrockchat-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: openrockchat-ui
  template:
    metadata:
      labels:
        app: openrockchat-ui
    spec:
      containers:
      - name: openrockchat-ui
        image: openrockchat-ui:latest
        ports:
        - containerPort: 3000
        env:
        - name: OPENAI_API_TYPE
          value: "bedrock"
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: access-key-id
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: openrockchat-ui-service
spec:
  selector:
    app: openrockchat-ui
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## AWS ECR Integration

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t openrockchat-ui .
docker tag openrockchat-ui:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/openrockchat-ui:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/openrockchat-ui:latest
```