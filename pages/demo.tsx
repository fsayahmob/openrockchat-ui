import { useState, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { Message } from '@/types/chat';
import { DemoChat } from '@/components/Demo/DemoChat';

interface Props {
  serverSideApiKeyIsSet: boolean;
}

const DemoPage = ({ serverSideApiKeyIsSet }: Props) => {
  const { t } = useTranslation('common');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const stopConversationRef = useRef<boolean>(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Simulation d'appel API - vous pouvez remplacer par votre logique
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: {
            id: 'amazon.nova-pro-v1:0',
            name: 'Amazon Nova Pro',
            maxLength: 200000,
            tokenLimit: 200000,
          },
          messages: newMessages,
          key: '',
          prompt: 'Vous êtes un assistant IA utile et intelligent.',
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
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
          }
        };
        waitForCompletion();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    stopConversationRef.current = false;
  };

  const handleStop = () => {
    stopConversationRef.current = true;
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Démo Chat Integration</title>
        <meta name="description" content="Démonstration d'intégration du chat dans une page React" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header de démonstration */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  🤖 Démo Chat Integration
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Intégration dans votre application React
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Panneau d'information */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    💡 À propos de cette démo
                  </h2>
                  <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      Cette page démontre comment intégrer le composant de chat dans votre application React existante.
                    </p>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">🚀 Fonctionnalités :</h3>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Streaming en temps réel</li>
                        <li>Support Markdown</li>
                        <li>Interface responsive</li>
                        <li>Facile à intégrer</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">🔧 Technologies :</h3>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>React + TypeScript</li>
                        <li>Next.js</li>
                        <li>AWS Bedrock / OpenAI</li>
                        <li>Tailwind CSS</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Stats de démonstration */}
                <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    📊 Statistiques
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Messages envoyés:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {messages.filter(m => m.role === 'user').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Réponses reçues:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {messages.filter(m => m.role === 'assistant').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Statut:</span>
                      <span className={`text-sm font-medium ${isLoading ? 'text-blue-600' : 'text-green-600'}`}>
                        {isLoading ? '🔄 En cours...' : '✅ Prêt'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Composant de chat intégré */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        💬 Chat Assistant
                      </h2>
                      <div className="flex space-x-2">
                        {isLoading && (
                          <button
                            onClick={handleStop}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            ⏹️ Arrêter
                          </button>
                        )}
                        <button
                          onClick={handleClear}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          🗑️ Effacer
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <DemoChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    onStop={handleStop}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                🚀 Démo d'intégration du chat dans votre application React
              </p>
              <p className="mt-1">
                Prêt pour la production • Streaming temps réel • AWS Bedrock / OpenAI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      serverSideApiKeyIsSet: !!process.env.OPENAI_API_KEY,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
      ])),
    },
  };
};

export default DemoPage;