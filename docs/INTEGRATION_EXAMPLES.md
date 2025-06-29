# Integration Examples

Real-world examples of integrating OpenRockChat UI into different applications.

## Next.js Application

```jsx
// pages/_app.tsx
import { ChatPopup } from '@/components/ChatPopup';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ChatPopup 
        apiType={process.env.NEXT_PUBLIC_OPENAI_API_TYPE}
        knowledgeBaseId={process.env.NEXT_PUBLIC_BEDROCK_KNOWLEDGE_BASE_ID}
        region={process.env.NEXT_PUBLIC_AWS_REGION}
      />
    </>
  );
}

export default MyApp;
```

## WordPress Plugin

```php
// wp-content/plugins/openrockchat/openrockchat.php
<?php
function openrockchat_enqueue_scripts() {
    wp_enqueue_script(
        'openrockchat-widget',
        plugin_dir_url(__FILE__) . 'js/chat-widget.js'
    );
    
    wp_localize_script('openrockchat-widget', 'openrockchat_config', array(
        'api_type' => get_option('openrockchat_api_type', 'bedrock'),
        'knowledge_base_id' => get_option('openrockchat_kb_id'),
        'region' => get_option('openrockchat_region', 'us-east-1')
    ));
}
add_action('wp_enqueue_scripts', 'openrockchat_enqueue_scripts');
?>
```

## E-commerce Integration

```jsx
// Customer support chat for product pages
import { useState, useEffect } from 'react';
import { ChatPopup } from 'openrockchat-ui';

function ProductPage({ product }) {
  const [chatContext, setChatContext] = useState('');
  
  useEffect(() => {
    // Set context based on current product
    setChatContext(`Customer is viewing: ${product.name} - ${product.description}`);
  }, [product]);
  
  return (
    <div>
      <ProductDetails product={product} />
      
      <ChatPopup 
        apiType="bedrock"
        knowledgeBaseId="customer-support-kb"
        systemPrompt={`You are a customer support assistant. Current context: ${chatContext}`}
        welcomeMessage={`Hi! I can help you with questions about ${product.name}.`}
      />
    </div>
  );
}
```

## Documentation Site

```jsx
// Gitbook/Docusaurus integration
import { ChatPopup } from 'openrockchat-ui';

function DocsLayout({ children }) {
  return (
    <div className="docs-layout">
      <Sidebar />
      <main>{children}</main>
      
      <ChatPopup 
        apiType="bedrock"
        knowledgeBaseId="documentation-kb"
        position="bottom-right"
        welcomeMessage="Hi! I can help you find information in our docs."
        systemPrompt="You are a documentation assistant. Answer questions based on the knowledge base content."
      />
    </div>
  );
}
```

## Mobile App Integration

```jsx
// React Native with WebView
import { WebView } from 'react-native-webview';

function ChatScreen() {
  const chatHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { margin: 0; padding: 0; }
            .chat-container { height: 100vh; }
        </style>
    </head>
    <body>
        <div id="chat-container" class="chat-container"></div>
        <script src="https://your-domain.com/chat-widget.js"></script>
        <script>
            OpenRockChatWidget.init({
                containerId: 'chat-container',
                fullscreen: true,
                apiType: 'bedrock',
                knowledgeBaseId: 'mobile-app-kb'
            });
        </script>
    </body>
    </html>
  `;
  
  return (
    <WebView 
      source={{ html: chatHTML }}
      style={{ flex: 1 }}
    />
  );
}
```

## API Integration

```javascript
// Server-side chat API
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  
  const response = await fetch('http://localhost:3000/api/chat-bedrock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      knowledgeBaseId: process.env.BEDROCK_KNOWLEDGE_BASE_ID,
      modelArn: process.env.BEDROCK_MODEL_ARN,
      sessionId
    })
  });
  
  const chatResponse = await response.json();
  res.json(chatResponse);
});
```

## Custom Styling

```css
/* themes/corporate.css */
.openrockchat-popup {
  --primary-color: #003366;
  --secondary-color: #0066cc;
  --text-color: #333333;
  --background-color: #ffffff;
  --border-color: #e0e0e0;
  --font-family: 'Corporate Sans', sans-serif;
}

.openrockchat-message.bot {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.openrockchat-input {
  border: 2px solid var(--primary-color);
  border-radius: 20px;
}
```