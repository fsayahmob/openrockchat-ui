import React, { useState, useRef, useEffect } from 'react';
import { IconMessageCircle, IconX, IconSend, IconPlayerStop } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';

export interface ChatPopupProps {
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
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  
  // Callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
  onError?: (error: string) => void;
  
  // Comportement
  autoOpen?: boolean;
  welcomeMessage?: string;
}

export const ChatPopup: React.FC<ChatPopupProps> = ({
  apiEndpoint = '/api/chat',
  systemPrompt = 'Vous êtes un assistant IA utile et intelligent.',
  modelConfig = {
    id: 'amazon.nova-pro-v1:0',
    name: 'Amazon Nova Pro',
    maxLength: 200000,
    tokenLimit: 200000,
  },
  position = 'bottom-right',
  primaryColor = '#2563eb',
  title = 'Assistant IA',
  subtitle = 'Comment puis-je vous aider ?',
  onOpen,
  onClose,
  onMessageSent,
  onResponseReceived,
  onError,
  autoOpen = false,
  welcomeMessage = 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
}) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const stopConversationRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialiser avec le message de bienvenue
  useEffect(() => {
    if (welcomeMessage && messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={handleOpen}
          className="group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <IconMessageCircle size={24} className="text-white" />
          
          {/* Indicateur de notification (optionnel) */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ouvrir le chat
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        
        {/* Header */}
        <div 
          className="p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
          style={{ backgroundColor: primaryColor }}
          onClick={handleMinimize}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <IconMessageCircle size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">{title}</h3>
              {!isMinimized && (
                <p className="text-xs text-white text-opacity-80">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            >
              <span className="text-lg leading-none">{isMinimized ? '□' : '−'}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    style={message.role === 'user' ? { backgroundColor: primaryColor } : {}}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
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
            <div className="p-3 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  disabled={isLoading}
                />
                
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="w-8 h-8 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center transition-colors"
                  >
                    <IconPlayerStop size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <IconSend size={14} />
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};