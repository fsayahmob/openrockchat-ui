# NPM Package

How to package OpenRockChat UI components for NPM distribution.

## Overview

Extract the chat components into a standalone NPM package for easy integration into other React projects.

## Package Structure

```
openrockchat-ui-package/
├── src/
│   ├── ChatPopup.tsx
│   ├── SimpleChatWidget.tsx
│   └── index.ts
├── package.json
├── README.md
└── dist/
```

## Build Script

```bash
# Install build dependencies
npm install --save-dev @rollup/plugin-typescript rollup

# Build the package
npm run build:package
```

## Usage Example

```jsx
import { ChatPopup } from 'openrockchat-ui';

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <ChatPopup 
        apiKey="your-key"
        apiType="bedrock"
        knowledgeBaseId="your-kb-id"
      />
    </div>
  );
}
```

## Configuration Options

```typescript
interface ChatPopupProps {
  apiKey?: string;
  apiType?: 'openai' | 'bedrock';
  knowledgeBaseId?: string;
  modelArn?: string;
  region?: string;
  streamingMode?: 'character' | 'chunk';
  charDelay?: number;
  systemPrompt?: string;
}
```

## Publishing

```bash
# Build the package
npm run build:package

# Test locally
npm pack

# Publish to NPM
npm publish
```

Note: This feature is planned for Phase 2 development.