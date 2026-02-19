import React, { useState, useEffect } from 'react';

// Composant pour l'effet d'écriture rétro avec Violet Intense
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
    <h1 className="text-4xl md:text-6xl font-serif font-black mb-10 text-center tracking-tight uppercase italic min-h-[70px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-purple-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.9)]">
        {displayText}
      </span>
      <span className="animate-ping ml-2 inline-block w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_#a78bfa]"></span>
    </h1>
  );
};

const Cookies = () => {
  return (
    <div className="cookies-policy flex items-center justify-center min-h-screen bg-black p-6 font-serif relative overflow-hidden">
      
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

        /* CONTOUR NÉON VIOLET ULTRA PRÉSENT */
        .neon-gradient-border {
          position: relative;
          background: #3a2a07; /* DORÉ FONCÉ */
          border: 5px solid transparent;
          background-clip: padding-box;
          border-image: linear-gradient(to right, #4c1d95, #c4b5fd, #4c1d95) 1;
          animation: neonPulseStrong 3s infinite ease-in-out;
        }

        @keyframes neonPulseStrong {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(167, 139, 250, 0.5), inset 0 0 30px rgba(0,0,0,0.7);
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 45px rgba(139, 92, 246, 0.9), inset 0 0 30px rgba(0,0,0,0.7);
            filter: brightness(1.2);
          }
        }

        .glow-text-purple {
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.8), 0 0 20px rgba(167, 139, 250, 0.4);
        }
      `}</style>

      {/* Grain de film vintage */}
      <div className="absolute inset-0 pointer-events-none opacity-10 retro-cinema bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-4xl w-full p-10 neon-gradient-border relative z-10 shadow-2xl">
        
        {/* Badge Mars AI Flashy */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-1 text-[11px] font-black uppercase tracking-[0.5em] border-2 border-purple-300 shadow-[0_0_20px_#a78bfa]">
          Mars Ai • Secure Data
        </div>

        <TypewriterHeader text="Politique de Cookies" />

        <div className="space-y-8 text-center text-yellow-50 leading-relaxed">
          <p className="text-xl italic bg-black/40 p-6 rounded-sm border border-purple-500/30 shadow-inner">
            "Ce terminal utilise des traceurs de données (cookies) pour optimiser votre expérience utilisateur et analyser les flux de navigation inter-système."
          </p>

          <div className="text-left space-y-4">
            <h2 className="text-3xl font-black text-purple-300 uppercase tracking-widest glow-text-purple">
              Utilisation des Cookies
            </h2>
            <p className="text-lg italic text-yellow-100/90 border-l-4 border-purple-500 pl-4">
              Les cookies sont de petits paquets de données stockés pour assurer une transmission stable.
            </p>
            <ul className="space-y-3 text-lg text-purple-200/90 font-bold">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-400 shadow-[0_0_10px_#a78bfa] rounded-full"></span>
                Fluidité des opérations système
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-400 shadow-[0_0_10px_#a78bfa] rounded-full"></span>
                Analyse des performances réseau
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-400 shadow-[0_0_10px_#a78bfa] rounded-full"></span>
                Personnalisation de l'interface
              </li>
            </ul>
          </div>

          <div className="text-left pt-8 border-t border-purple-500/30">
            <h2 className="text-3xl font-black text-purple-300 uppercase glow-text-purple">
              Gestion & Contact
            </h2>
            <p className="text-lg italic text-yellow-100/80 mb-4">
              Configurez votre terminal via les paramètres. Support technique :
            </p>
            <a href="mailto:support@marsai.com" className="inline-block text-2xl font-black text-purple-300 hover:text-white transition-all glow-text-purple underline decoration-purple-500 decoration-2 underline-offset-8">
              support@marsai.com
            </a>
          </div>
          
          {/* Footer ultra flashy */}
          <div className="mt-10 pt-8 border-t-4 border-double border-purple-500/50">
             <p className="text-md font-black uppercase tracking-[0.4em] text-purple-300 animate-pulse glow-text-purple">
               SYSTEM_ACTIVE // VIOLET_STREAM_76
             </p>
             <div className="mt-4 h-[3px] w-64 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_#a78bfa]"></div>
          </div>
        </div>
      </div>

      {/* Vignettage final */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default Cookies;