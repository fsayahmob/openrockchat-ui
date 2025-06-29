import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconPlayerStop } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';

interface Props {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export const DemoChat: React.FC<Props> = ({
  messages,
  onSendMessage,
  isLoading,
  onStop,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-medium mb-2">Commencez une conversation</h3>
            <p className="text-sm">
              Tapez votre message ci-dessous pour démarrer une conversation avec l'assistant IA.
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <p>💡 Essayez des questions comme :</p>
              <ul className="mt-2 space-y-1">
                <li>• "Explique-moi React en 3 points"</li>
                <li>• "Comment intégrer ce chat dans mon app ?"</li>
                <li>• "Quels sont les avantages d'AWS Bedrock ?"</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Assistant en train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message..."
              rows={1}
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
              disabled={isLoading}
            />
          </div>
          
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <IconPlayerStop size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconSend size={16} />
            </button>
          )}
        </form>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Appuyez sur Entrée pour envoyer, Maj+Entrée pour nouvelle ligne</span>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Assistant connecté</span>
          </span>
        </div>
      </div>
    </div>
  );
};