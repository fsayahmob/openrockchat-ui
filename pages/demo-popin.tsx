import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { ChatPopup } from '@/components/ChatPopup';

interface Props {
  serverSideApiKeyIsSet: boolean;
}

const DemoPopinPage = ({ serverSideApiKeyIsSet }: Props) => {
  const { t } = useTranslation('common');
  const [showChat, setShowChat] = useState(false);
  const [chatPosition, setChatPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');

  return (
    <>
      <Head>
        <title>Démo ChatBot Popup - Intégration Facile</title>
        <meta name="description" content="Démonstration du chatbot popup pour intégration dans vos sites existants" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Site factice pour la démonstration */}
      <div className="min-h-screen bg-gray-50">
        
        {/* Header du site factice */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🏢</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">MonEntreprise</h1>
                    <p className="text-sm text-gray-500">Solutions innovantes</p>
                  </div>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-500 hover:text-gray-900">Accueil</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Services</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">À propos</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Bienvenue sur notre</span>{' '}
                    <span className="block text-blue-600 xl:inline">site exemple</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Cette page démontre l'intégration du chatbot popup dans un site existant. 
                    Le chatbot apparaît comme une bulle flottante que vos visiteurs peuvent utiliser pour obtenir de l'aide.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        {showChat ? 'Masquer le chatbot' : 'Activer le chatbot'}
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Équipe de travail"
            />
          </div>
        </section>

        {/* Configuration du chatbot */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Configuration</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Personnalisez votre chatbot
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Modifiez les paramètres ci-dessous pour voir les changements en temps réel.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Position */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Position</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={chatPosition === 'bottom-right'}
                        onChange={() => setChatPosition('bottom-right')}
                        className="mr-2"
                      />
                      En bas à droite
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={chatPosition === 'bottom-left'}
                        onChange={() => setChatPosition('bottom-left')}
                        className="mr-2"
                      />
                      En bas à gauche
                    </label>
                  </div>
                </div>

                {/* Couleur */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Couleur principale</h3>
                  <div className="space-y-2">
                    {[
                      { color: '#2563eb', name: 'Bleu' },
                      { color: '#dc2626', name: 'Rouge' },
                      { color: '#059669', name: 'Vert' },
                      { color: '#7c3aed', name: 'Violet' },
                      { color: '#ea580c', name: 'Orange' },
                    ].map(({ color, name }) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="radio"
                          checked={primaryColor === color}
                          onChange={() => setPrimaryColor(color)}
                          className="mr-2"
                        />
                        <div 
                          className="w-4 h-4 rounded mr-2" 
                          style={{ backgroundColor: color }}
                        ></div>
                        {name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Intégration</h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Installation simple :</p>
                      <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                        npm install @votre-package/chatbot
                      </code>
                    </div>
                    <div>
                      <p className="font-medium">Utilisation :</p>
                      <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                        {`<ChatPopup apiEndpoint="/api/chat" />`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu additionnel du site factice */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Nos Services
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🚀', title: 'Innovation', description: 'Des solutions à la pointe de la technologie' },
                  { icon: '⚡', title: 'Performance', description: 'Optimisation et rapidité garanties' },
                  { icon: '🛡️', title: 'Sécurité', description: 'Protection de vos données sensibles' },
                ].map((service, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                    <p className="mt-2 text-gray-500">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">
                © 2024 MonEntreprise. Tous droits réservés. Cette page est une démonstration.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                🤖 Chatbot alimenté par IA - Essayez la bulle de chat en bas de page !
              </p>
            </div>
          </div>
        </footer>

        {/* Chatbot Popup */}
        {showChat && (
          <ChatPopup
            position={chatPosition}
            primaryColor={primaryColor}
            title="Assistant IA"
            subtitle="Comment puis-je vous aider ?"
            welcomeMessage="Bonjour ! Je suis l'assistant virtuel de MonEntreprise. Comment puis-je vous aider aujourd'hui ?"
            onOpen={() => console.log('Chat ouvert')}
            onClose={() => console.log('Chat fermé')}
            onMessageSent={(msg) => console.log('Message envoyé:', msg)}
            onResponseReceived={(resp) => console.log('Réponse reçue:', resp)}
            onError={(err) => console.log('Erreur:', err)}
          />
        )}
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

export default DemoPopinPage;