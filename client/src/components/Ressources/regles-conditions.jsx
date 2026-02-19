import React, { useState, useEffect } from 'react';

// Effet d'écriture rétro (vitesse modérée pour le côté pellicule)
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
    <h1 className="text-4xl md:text-6xl font-serif font-black mb-8 text-center tracking-tight uppercase italic min-h-[70px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {displayText}
      </span>
      <span className="animate-ping ml-2 inline-block w-3 h-3 bg-pink-500 rounded-full"></span>
    </h1>
  );
};

const ReglesConditions = () => {
  return (
    <div className="regles-conditions flex items-center justify-center min-h-screen bg-[#0d0214] p-6 font-serif relative overflow-hidden">
      {/* Overlay Grain de film et texture poussière */}
      <div className="absolute inset-0 pointer-events-none opacity-10 retro-cinema bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-4xl w-full p-10 bg-[#160421] border-[6px] border-purple-900 rounded-sm breathe-neon-70s relative shadow-2xl z-10">
        
        {/* Badge Vintage Mars Ai - Rose */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-600 text-white px-5 py-1 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border-2 border-[#0d0214] shadow-lg">
          Mars Ai • Digital Edition 2026
        </div>

        <TypewriterHeader text="RÈGLES & CONDITIONS" />

        <div className="space-y-8 text-center">
          <p className="text-xl italic text-pink-100/80 leading-relaxed font-serif drop-shadow">
            "Bienvenue sur la station Mars Ai. Pour garantir la sécurité de votre voyage, veuillez prendre connaissance des protocoles de bord."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-lg text-purple-200 py-6 border-y-2 border-purple-900/40">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></div>
              <span className="hover:text-pink-400 transition-colors cursor-default">ACCÈS_TERMINAL_01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></div>
              <span className="hover:text-pink-400 transition-colors cursor-default">PROTOCOLE_SERVICES</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></div>
              <span className="hover:text-pink-400 transition-colors cursor-default">DROITS_ÉQUIPAGE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></div>
              <span className="hover:text-pink-400 transition-colors cursor-default">UNITÉ_DE_DONNÉES</span>
            </div>
          </div>

          <p className="text-sm uppercase tracking-widest text-purple-400/60 font-bold italic">
            MARS AI se réserve le droit de modifier les paramètres de vol à tout moment.
          </p>
          
          {/* L'EFFET DEMANDÉ : CONFIRMÉ EN ROSE & VIOLET */}
          <div className="mt-8 pt-8 border-t-4 border-double border-purple-900/50">
             <div className="inline-block px-8 py-3 border-2 border-pink-500 bg-pink-500/5 mb-4 animate-pulse rounded-lg">
                <p className="text-lg font-serif font-black uppercase tracking-[0.2em] text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                  Système Mars Ai : Accès Sécurisé Confirmé
                </p>
             </div>
             <p className="text-[10px] text-purple-700 font-mono tracking-widest uppercase">
               SIGNAL_STABLE // SYSTÈME_ACTIF_NEON_70s
             </p>
          </div>
        </div>
      </div>

      {/* Vignettage final pour l'effet tube cathodique */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default ReglesConditions;