import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconPlayerStop, IconMessageCircle, IconX } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';

interface Props {
  // Configuration
  apiEndpoint?: string;
  systemPrompt?: string;
  modelConfig?: {
    id: string;
    name: string;
    maxLength: number;
    tokenLimit: number;
  };
  
  // Styling
  className?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'inline';
  
  // Callbacks
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
  onError?: (error: string) => void;
}

export const SimpleChatWidget: React.FC<Props> = ({
  apiEndpoint = '/api/chat',
  systemPrompt = 'Vous êtes un assistant IA utile et intelligent.',
  modelConfig = {
    id: 'amazon.nova-pro-v1:0',
    name: 'Amazon Nova Pro',
    maxLength: 200000,
    tokenLimit: 200000,
  },
  className = '',
  theme = 'light',
  position = 'bottom-right',
  onMessageSent,
  onResponseReceived,
  onError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const stopConversationRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    stopConversationRef.current = false;

    onMessageSent?.(content);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelConfig,
          messages: newMessages,
          key: '',
          prompt: systemPrompt,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }

      // Créer le message assistant initial
      const assistantMessage: Message = { role: 'assistant', content: '' };
      const messagesWithAssistant = [...newMessages, assistantMessage];
      setMessages(messagesWithAssistant);

      // Traiter le streaming avec effet typewriter
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      // Queue pour les caractères à afficher
      let charQueue: string[] = [];
      let isTyping = false;
      const CHAR_DELAY = 25;
      
      const processCharQueue = () => {
        if (charQueue.length === 0 || stopConversationRef.current) {
          isTyping = false;
          return;
        }
        
        isTyping = true;
        const nextChar = charQueue.shift()!;
        assistantContent += nextChar;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantContent
          };
          return updated;
        });
        
        setTimeout(processCharQueue, CHAR_DELAY);
      };

      if (reader) {
        let done = false;
        while (!done && !stopConversationRef.current) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            
            // Ajouter chaque caractère du chunk à la queue
            for (const char of chunk) {
              charQueue.push(char);
            }
            
            // Démarrer le traitement si pas déjà en cours
            if (!isTyping) {
              processCharQueue();
            }
          }
        }
        
        // Attendre que tous les caractères soient affichés
        const waitForCompletion = () => {
          if (charQueue.length > 0 || isTyping) {
            setTimeout(waitForCompletion, 100);
          } else {
            onResponseReceived?.(assistantContent);
          }
        };
        waitForCompletion();
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur s\'est produite';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${errorMessage}`
      }]);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleStop = () => {
    stopConversationRef.current = true;
    setIsLoading(false);
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-800 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200';

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'inline': 'relative'
  };

  if (position !== 'inline') {
    return (
      <div className={`${positionClasses[position]} ${className}`}>
        {!isOpen ? (
          // Bouton flottant
          <button
            onClick={() => setIsOpen(true)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            <IconMessageCircle size={24} />
          </button>
        ) : (
          // Widget de chat
          <div className={`w-80 h-96 rounded-lg shadow-xl border ${themeClasses} flex flex-col`}>
            {/* Header */}
            <div className={`p-3 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className="font-medium">💬 Assistant IA</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <IconX size={18} />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-8">
                  <div className="text-2xl mb-2">🤖</div>
                  <p>Bonjour ! Comment puis-je vous aider ?</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-lg px-3 py-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tapez votre message..."
                  className={`flex-1 text-sm rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  disabled={isLoading}
                />
                
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="w-8 h-8 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                  >
                    <IconPlayerStop size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <IconSend size={14} />
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode inline
  return (
    <div className={`${themeClasses} rounded-lg border ${className}`}>
      {/* Contenu inline similaire... */}
      <div className="p-4">
        <h3 className="font-medium mb-4">💬 Chat Assistant</h3>
        {/* ... reste du contenu ... */}
      </div>
    </div>
  );
};