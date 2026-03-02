import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CookiesProtocol = () => {
  const particleContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Protocole de Cookies";

  // 1. Animation de machine à écrire (Conservée)
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setHeaderText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 2. Animation des particules dorées (STRICTEMENT CONSERVÉES)
  useEffect(() => {
    const container = particleContainerRef.current;
    const particleCount = 150; 

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 5 + 2; 
      
      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = 'radial-gradient(circle at center, #fcd34d 0%, #d97706 100%)';
      particle.style.boxShadow = `0 0 ${size * 4}px #fbbf24, 0 0 ${size * 8}px #f59e0b`;
      
      container.appendChild(particle);

      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.8 + 0.5
      });

      gsap.to(particle, {
        duration: Math.random() * 6 + 4,
        y: "-=250",
        x: `+=${Math.random() * 80 - 40}`,
        opacity: Math.random() * 0.4 + 0.2,
        repeat: -1,
        ease: "power1.inOut",
        delay: Math.random() * 6,
        onRepeat: () => {
          gsap.set(particle, { 
            y: window.innerHeight + 50, 
            x: Math.random() * window.innerWidth, 
            opacity: Math.random() * 0.8 + 0.5 
          });
        }
      });
    }

    // Apparition fluide du panneau
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }
    );

    return () => { if(container) container.innerHTML = ""; };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050508] text-white p-4 md:p-8 flex items-center justify-center overflow-hidden">
      
      {/* Import de la typographie Inter 900 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        .font-mars { font-family: 'Inter', sans-serif; }
        .heavy-title {
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          text-transform: lowercase;
        }
        .clean-panel {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Fond de particules dorées (Inchangé) */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay Grain de film Cinéma */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Cadre Principal Épuré */}
      <div 
        ref={mainContentRef}
        className="relative z-20 w-full max-w-4xl clean-panel rounded-[2.5rem] p-8 md:p-16 font-mars shadow-2xl"
      >
        
        {/* Badge Minimaliste */}
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">
            Mars Ai • Privacy Protocol
          </p>
        </div>

        {/* Titre Typo Massive */}
        <div className="mb-16">
          <h1 className="heavy-title text-5xl md:text-[85px] text-white">
            {headerText}<span className="text-slate-800 animate-pulse">.</span>
          </h1>
          <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
        </div>

        {/* Sections de contenu Simplifiées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Utilisation I</h2>
            <p className="text-lg font-bold tracking-tight text-slate-300 leading-snug">
              "Ce cookies utilise des traceurs de données pour optimiser votre expérience et le flux de navigation inter-système."
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Utilisation II</h2>
            <p className="text-lg font-bold tracking-tight text-slate-300 leading-snug">
              "Les cookies servent de balises de données pour assurer un maintien stable du flux système."
            </p>
          </section>

          <section className="md:col-span-2 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/5 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
               <span className="text-sm font-bold tracking-tight text-white uppercase italic">Status: Sync Stream Active</span>
            </div>
            
            <div className="text-[9px] font-bold tracking-[0.3em] text-slate-600 uppercase">
              Mars Ai Terminal v.2.50
            </div>
          </section>
        </div>

        {/* Footer simple */}
        <div className="mt-16 text-center">
             <p className="text-[10px] font-bold text-slate-700 tracking-widest uppercase italic">
                Toutes les données sont traitées selon le protocole de sécurité Marseille-2026
             </p>
        </div>
      </div>

      {/* Vignettage final Cinéma */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_180px_rgba(0,0,0,1)] z-40" />
    </div>
  );
};

export default CookiesProtocol;