# Popup Widget

Add a chat popup to any website with minimal code.

## Demo

See the popup in action: [http://localhost:3000/demo-popin](http://localhost:3000/demo-popin)

## Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to my website</h1>
    
    <!-- Chat popup button -->
    <div id="chat-popup"></div>
    
    <script src="/api/chat-widget.js"></script>
    <script>
        OpenRockChatWidget.init({
            containerId: 'chat-popup',
            apiType: 'bedrock',
            knowledgeBaseId: 'your-kb-id',
            region: 'us-east-1'
        });
    </script>
</body>
</html>
```

## React Integration

```jsx
import { ChatPopup } from '@/components/ChatPopup';

function MyComponent() {
  return (
    <div>
      <h1>My App</h1>
      <ChatPopup 
        position="bottom-right"
        theme="dark"
        apiType="bedrock"
        knowledgeBaseId="your-kb-id"
      />
    </div>
  );
}
```

## Configuration Options

```typescript
interface PopupConfig {
  // Positioning
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  // Styling
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  
  // Behavior
  autoOpen?: boolean;
  minimized?: boolean;
  
  // API Configuration
  apiType: 'openai' | 'bedrock';
  apiKey?: string;
  knowledgeBaseId?: string;
  modelArn?: string;
  region?: string;
  
  // Chat Settings
  welcomeMessage?: string;
  placeholder?: string;
  systemPrompt?: string;
}
```

## Styling

```css
/* Custom styling for the popup */
.chat-popup {
  --primary-color: #007bff;
  --text-color: #333;
  --background-color: #fff;
  --border-radius: 8px;
}

.chat-popup.dark {
  --text-color: #fff;
  --background-color: #1a1a1a;
}
```

## Events

```javascript
// Listen to chat events
OpenRockChatWidget.on('message', (data) => {
  console.log('New message:', data);
});

OpenRockChatWidget.on('open', () => {
  console.log('Chat opened');
});

OpenRockChatWidget.on('close', () => {
  console.log('Chat closed');
});
```