import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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

  return (
    <div className="mb-16">
      <h1 className="heavy-title text-5xl md:text-[85px] leading-[0.85] tracking-[-0.06em] text-white lowercase">
        {displayText}<span className="text-slate-700 animate-pulse">.</span>
      </h1>
      <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
    </div>
  );
};

const ReglesConditions = () => {
  const particleContainerRef = useRef(null);
  const mainContentRef = useRef(null);

  // Animation des paillettes (CONSERVÉES)
  useEffect(() => {
    const container = particleContainerRef.current;
    if (container) {
      for (let i = 0; i < 100; i++) {
        const p = document.createElement('div');
        p.className = "absolute bg-white rounded-full pointer-events-none opacity-20";
        const size = Math.random() * 2 + 0.5;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        container.appendChild(p);

        gsap.set(p, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });

        gsap.to(p, {
          y: "-=100",
          duration: Math.random() * 15 + 10,
          repeat: -1,
          ease: "none",
        });
      }
    }

    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050508] text-white p-6 flex items-center justify-center overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        .font-mars { font-family: 'Inter', sans-serif; }
        .heavy-title { font-weight: 900; }
        .clean-panel {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Fond de paillettes (Inchangé) */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay Grain de film (Inchangé) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>

      {/* Conteneur Principal Épuré */}
      <div 
        ref={mainContentRef}
        className="relative z-20 w-full max-w-5xl clean-panel rounded-[2.5rem] p-10 md:p-20 font-mars"
      >
        
        {/* Badge Mars Ai Minimaliste */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">
            Mars Ai • Protocol 2026
          </span>
        </div>

        <TypewriterHeader text="Règles & Conditions" />

        <div className="space-y-12">
          <p className="text-xl font-bold tracking-tight text-slate-400 max-w-2xl leading-relaxed italic">
            "Bienvenue sur la station Mars Ai. Pour garantir la sécurité de votre voyage, veuillez prendre connaissance des protocoles de bord."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 py-10 border-y border-white/5">
            {['ACCÈS_TERMINAL_01', 'PROTOCOLE_SERVICES', 'DROITS_ÉQUIPAGE', 'UNITÉ_DE_DONNÉES'].map((txt) => (
               <div key={txt} className="flex items-center gap-4 group cursor-default">
                 <div className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-white transition-all duration-500"></div>
                 <span className="text-slate-500 group-hover:text-white transition-colors tracking-widest font-black text-sm uppercase">
                   {txt}
                 </span>
               </div>
            ))}
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_10px_green]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Système Mars Ai : Signal Stable
                </p>
             </div>
             <p className="text-[9px] text-slate-700 font-bold tracking-[0.4em] uppercase">
                v.2026 // Marseille Station
             </p>
          </div>
        </div>
      </div>

      {/* Vignettage Cinéma */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-30"></div>
    </div>
  );
};

export default ReglesConditions;