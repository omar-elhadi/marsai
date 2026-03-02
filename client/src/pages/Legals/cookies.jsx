import React, { useState, useEffect } from 'react';

// Composant pour l'effet d'écriture rétro avec dégradé BLANC SABLE DORÉ
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
    }, 100);
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <h1 className="text-4xl md:text-5xl font-serif font-black mb-12 text-center tracking-tight uppercase italic min-h-[60px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FAF0E6] via-[#E6D5AC] to-[#D4AF37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        {displayText}
      </span>
      <span className="animate-ping ml-2 inline-block w-3 h-3 bg-[#E6D5AC] rounded-full shadow-[0_0_10px_#D4AF37]"></span>
    </h1>
  );
};

const Cookies = () => {
  return (
    /* Fond modifié en Noir Profond pour plus de contraste avec le Doré */
    <div className="cookies-policy flex items-center justify-center min-h-screen bg-[#050505] p-6 font-serif relative overflow-hidden">
      
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
        /* Animation de respiration Dorée */
        .breathe-gold {
          animation: breatheGold 5s infinite ease-in-out;
        }
        @keyframes breatheGold {
          0%, 100% { border-color: #D4AF37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
          50% { border-color: #FAF0E6; box-shadow: 0 0 40px rgba(212, 175, 55, 0.4); }
        }
      `}</style>

      {/* Overlay Grain de film subtil */}
      <div className="absolute inset-0 pointer-events-none opacity-5 retro-cinema bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Conteneur principal Noir avec bordure Dorée */}
      <div className="max-w-4xl w-full p-10 bg-[#0a0a0a] border-[6px] rounded-sm breathe-gold relative shadow-2xl z-10 backdrop-blur-md">
        
        {/* En-tête de terminal Doré */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-[#050505] px-6 py-1 text-[10px] font-black uppercase tracking-[0.5em] rounded-full border-2 border-[#050505] shadow-xl">
          Mars Ai • Cookies Protocol
        </div>

        <TypewriterHeader text="Politique de Cookies" />

        <div className="space-y-10 text-center text-[#FAF0E6]/80 leading-relaxed font-serif">
          <p className="text-lg italic opacity-90">
            "Ce terminal utilise des traceurs de données (cookies) pour optimiser votre expérience utilisateur et analyser les flux de navigation."
          </p>

          <div className="text-left">
            <h2 className="text-2xl font-black mb-4 text-[#E6D5AC] uppercase tracking-wide">
              Utilisation des Cookies
            </h2>
            <p className="mb-4 text-lg italic text-[#FAF0E6]/60">
              Les cookies sont utilisés pour assurer la stabilité du système et la personnalisation de votre interface.
            </p>
            <ul className="list-none space-y-3 text-md text-[#E6D5AC]/80 pl-2">
              <li><span className="text-[#D4AF37] font-bold mr-3">»</span> Fluidité des opérations système</li>
              <li><span className="text-[#D4AF37] font-bold mr-3">»</span> Analyse des performances réseau</li>
              <li><span className="text-[#D4AF37] font-bold mr-3">»</span> Personnalisation de l'expérience</li>
            </ul>
          </div>

          <div className="text-left pt-8 border-t border-[#D4AF37]/20">
            <h2 className="text-2xl font-black mb-4 text-[#E6D5AC] uppercase tracking-wide">
              Gestion des Cookies
            </h2>
            <p className="mb-4 text-lg italic text-[#FAF0E6]/60">
              La gestion de ces données s'effectue directement via les paramètres de votre navigateur local.
            </p>
            <p className="text-lg italic text-[#E6D5AC] font-medium">
              <span className="text-[#D4AF37] font-bold">»</span> Modifiez vos préférences dans les options de sécurité.
            </p>
          </div>

          <div className="text-left pt-8 border-t border-[#D4AF37]/20">
            <h2 className="text-2xl font-black mb-4 text-[#E6D5AC] uppercase tracking-wide">
              Contact Support
            </h2>
            <p className="text-lg italic text-[#FAF0E6]/60">
              Pour toute assistance relative aux protocoles :
              <a href="mailto:support@marsai.com" className="text-[#D4AF37] hover:text-[#FAF0E6] underline transition-colors block mt-2 not-italic font-bold tracking-wider">support@marsai.com</a>
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t-4 border-double border-[#D4AF37]/30">
             <p className="text-sm font-black uppercase tracking-[0.4em] bg-clip-text text-transparent bg-gradient-to-r from-[#E6D5AC] via-[#FAF0E6] to-[#D4AF37] animate-pulse">
               SYSTEM_ACTIVE // DATA_STABILITY_OK
             </p>
             <div className="mt-3 h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_15px_#D4AF37]"></div>
          </div>
        </div>
      </div>

      {/* Vignettage final profond */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default Cookies;