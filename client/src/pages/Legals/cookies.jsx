import React, { useState, useEffect } from 'react';

// Composant pour l'effet d'écriture rétro (pour le titre principal)
const TypewriterHeader = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Vitesse modérée pour un effet vintage
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <h1 className="text-4xl md:text-5xl font-serif font-black mb-8 text-center tracking-tight uppercase italic min-h-[60px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {displayText}
      </span>
      <span className="animate-ping ml-2 inline-block w-3 h-3 bg-pink-500 rounded-full"></span>
    </h1>
  );
};

const Cookies = () => {
  return (
    <div className="cookies-policy flex items-center justify-center min-h-screen bg-[#0d0214] p-6 font-serif relative overflow-hidden">
      
      {/* Styles et animations (grain de film, respiration néon) */}
      <style>{`
        @keyframes filmFlicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        .retro-cinema {
          background: radial-gradient(circle, transparent 20%, #000 150%);
          animation: filmFlicker 0.15s infinite;
        }
        .breathe-neon-70s {
          animation: breatheNeon 5s infinite ease-in-out;
        }
        @keyframes breatheNeon {
          0%, 100% { border-color: #701a75; box-shadow: 0 0 15px rgba(112, 26, 117, 0.3); }
          50% { border-color: #d946ef; box-shadow: 0 0 30px rgba(217, 70, 239, 0.5); }
        }
      `}</style>

      {/* Overlay Grain de film et texture poussière */}
      <div className="absolute inset-0 pointer-events-none opacity-10 retro-cinema bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-4xl w-full p-10 bg-[#160421] border-[6px] border-purple-900 rounded-sm breathe-neon-70s relative shadow-2xl z-10">
        
        {/* En-tête de terminal/onglet */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white px-5 py-1 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border-2 border-[#0d0214] shadow-lg">
          Mars Ai • Cookies Protocol
        </div>

        {/* Titre principal animé */}
        <TypewriterHeader text="Politique de Cookies" />

        <div className="space-y-8 text-center text-pink-100/80 leading-relaxed font-serif">
          <p className="text-lg italic drop-shadow">
            "Ce terminal utilise des traceurs de données (cookies) pour optimiser votre expérience utilisateur et analyser les flux de navigation inter-système."
          </p>

          <div className="text-left">
            <h2 className="text-2xl font-black mb-3 text-pink-400 uppercase tracking-wide drop-shadow">
              Utilisation des Cookies
            </h2>
            <p className="mb-4 text-lg italic text-purple-200">
              Les cookies sont de petits paquets de données stockés dans votre unité de stockage local pour assurer une transmission stable. Nous les utilisons pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-md text-pink-300 pl-4">
              <li><span className="text-pink-500 font-bold">»</span> Assurer la fluidité des opérations système.</li>
              <li><span className="text-pink-500 font-bold">»</span> Analyser les performances du réseau et l'utilisation des fonctions.</li>
              <li><span className="text-pink-500 font-bold">»</span> Personnaliser l'interface utilisateur selon vos préférences.</li>
            </ul>
          </div>

          <div className="text-left pt-6 border-t-2 border-purple-900/40">
            <h2 className="text-2xl font-black mb-3 text-pink-400 uppercase tracking-wide drop-shadow">
              Gestion des Cookies
            </h2>
            <p className="mb-4 text-lg italic text-purple-200">
              Vous pouvez configurer votre terminal pour gérer ces données via les paramètres de votre navigateur. Vous avez la possibilité de purger les cookies ou de bloquer de nouvelles transmissions. Notez qu'une désactivation peut affecter certaines fonctionnalités critiques du système.
            </p>
            <p className="text-lg italic text-pink-300">
              <span className="text-pink-500 font-bold">»</span> Accédez à vos paramètres navigateur pour modifier vos préférences.
            </p>
          </div>

          <div className="text-left pt-6 border-t-2 border-purple-900/40">
            <h2 className="text-2xl font-black mb-3 text-pink-400 uppercase tracking-wide drop-shadow">
              Contact Support
            </h2>
            <p className="text-lg italic text-purple-200">
              Pour toute question relative aux protocoles de données, veuillez contacter notre centre de support technique :
              <a href="mailto:support@marsai.com" className="text-pink-400 hover:text-pink-300 underline transition-colors block mt-2">support@marsai.com</a>
            </p>
          </div>
          
          {/* Footer de statut style Terminal */}
          <div className="mt-8 pt-8 border-t-4 border-double border-purple-900/50">
             <p className="text-sm font-black uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-600 animate-pulse drop-shadow">
               DATA_STREAM_ACTIVE // COOKIES_COMPLIANCE_76
             </p>
             <div className="mt-2 h-[2px] w-48 mx-auto bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
          </div>
        </div>
      </div>

      {/* Vignettage final pour l'effet tube cathodique */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default Cookies;