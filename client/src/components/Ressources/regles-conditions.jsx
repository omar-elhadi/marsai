import React, { useState, useEffect } from 'react';

const TypewriterHeader = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, [text]);

  // On découpe le texte pour appliquer les deux styles néon
  const words = displayText.split(' & ');

  return (
    <div className="flex flex-col items-center mb-10">
      <h1 className="text-5xl md:text-8xl flex flex-col gap-2 italic">
        {/* Premier mot : Bleu */}
        <span className="neon-base neon-blue">
          {words[0]}
        </span>
        
        {/* Séparateur et deuxième mot : Rose */}
        {words.length > 1 && (
          <span className="neon-base neon-pink">
            & {words[1]}
          </span>
        )}
      </h1>
      <span className="animate-pulse mt-4 block w-full h-1 bg-gradient-to-r from-blue-500 via-transparent to-pink-500 opacity-50"></span>
    </div>
  );
};

const ReglesConditions = () => {
  return (
    <div className="regles-conditions flex items-center justify-center min-h-screen brick-wall p-6 font-serif relative overflow-hidden">
      {/* Overlay Grain de film */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-4xl w-full p-10 bg-[#160421]/90 border-[4px] border-purple-900/50 rounded-lg relative shadow-[0_0_50px_rgba(0,0,0,1)] z-10 backdrop-blur-sm">
        
        {/* Badge Mars Ai */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-pink-600 text-white px-6 py-1 text-[11px] font-black uppercase tracking-[0.4em] rounded-full border-2 border-white shadow-lg">
          Mars Ai • Digital Edition 2026
        </div>

        <TypewriterHeader text="RÈGLES & CONDITIONS" />

        <div className="space-y-8 text-center">
          <p className="text-xl italic text-blue-100/70 leading-relaxed drop-shadow-md">
            "Bienvenue sur la station Mars Ai. Pour garantir la sécurité de votre voyage, veuillez prendre connaissance des protocoles de bord."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-lg text-blue-200/80 py-6 border-y-2 border-white/5">
            {['ACCÈS_TERMINAL_01', 'PROTOCOLE_SERVICES', 'DROITS_ÉQUIPAGE', 'UNITÉ_DE_DONNÉES'].map((txt) => (
               <div key={txt} className="flex items-center gap-3 group cursor-default">
                 <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#00d2ff] group-hover:bg-pink-500 group-hover:shadow-[0_0_10px_#ff00de] transition-all"></div>
                 <span className="hover:text-white transition-colors tracking-tighter font-black">{txt}</span>
               </div>
            ))}
          </div>

          <div className="mt-8 pt-8">
             <div className="inline-block px-8 py-3 border-2 border-blue-500 bg-blue-500/5 mb-4 animate-pulse rounded-lg shadow-[0_0_20px_rgba(0,162,255,0.2)]">
                <p className="text-lg font-black uppercase tracking-[0.2em] text-blue-400 drop-shadow-sm">
                  Système Mars Ai : Accès Sécurisé Confirmé
                </p>
             </div>
             <p className="text-[10px] text-purple-500 font-mono tracking-widest uppercase opacity-50">
                SIGNAL_STABLE // RÈGLES_NEON_V1
             </p>
          </div>
        </div>
      </div>

      {/* Effet tube cathodique (vignettage) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default ReglesConditions;