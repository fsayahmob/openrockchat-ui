# Knowledge Base Setup

Guide to configure AWS Bedrock Knowledge Base for RAG capabilities.

## Prerequisites

- AWS Bedrock access
- S3 bucket for documents
- OpenSearch Serverless (automatically created)

## Step 1: Create Knowledge Base

1. Go to AWS Bedrock Console > Knowledge bases
2. Click "Create knowledge base"
3. Configure:
   - Name: `openrockchat-kb`
   - Description: `Knowledge base for OpenRockChat UI`

## Step 2: Data Source

1. Select "S3" as data source
2. Provide S3 bucket name with your documents
3. Supported formats: PDF, TXT, DOCX, HTML, Markdown

## Step 3: Embeddings Model

- Choose: `amazon.titan-embed-text-v1`
- This model converts your documents to searchable vectors

## Step 4: Vector Database

- Select "Amazon OpenSearch Serverless"
- Collection will be created automatically

## Step 5: Sync and Test

1. Click "Sync" to process your documents
2. Wait for processing to complete (5-30 minutes)
3. Test with sample queries in the console

## Configuration

Once created, add to your `.env.local`:

```bash
BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id-here
```

The Knowledge Base ID can be found in the Bedrock console under Knowledge bases.