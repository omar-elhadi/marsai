import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Mention = () => {
  const particleContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Mentions Légales";

  // 1. Effet machine à écrire (Conservé)
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
    
    // Entrée cinématographique du contenu
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }
    );

    return () => { if(container) container.innerHTML = ""; };
  }, []);

  const sections = [
    { title: "Propriétaire", content: "Jean Dupont" },
    { title: "Statut", content: "Festival" },
    { title: "Adresse", content: "123 Rue des Festivals, 75000 Paris" },
    { title: "SIRET", content: "123 456 789 00012" },
    { title: "Email", content: "contact@festival.com", isLink: true },
    { title: "Publication", content: "Jean Dupont" },
    { title: "Hébergeur", content: "Hébergeur Web, 456 Avenue" },
    { title: "Propriété", content: "Contenu protégé par les lois PI" },
    { title: "RGPD", content: "Réglementation générale" },
    { title: "Cookies", content: "Expérience utilisateur" }
  ];

  return (
    <div className="relative min-h-screen bg-[#050508] text-white p-6 flex items-center justify-center overflow-hidden">
      
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

      {/* 1. Fond de paillettes (Inchangé) */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* 2. Contenu Épuré & Typo Massive */}
      <div 
        ref={mainContentRef}
        className="relative z-20 w-full max-w-5xl clean-panel rounded-[2.5rem] p-10 md:p-20 font-mars"
      >
        
        {/* Header Typo Massive (Style "rêve maintenant") */}
        <div className="mb-20">
          <p className="text-[10px] font-bold tracking-[0.6em] text-slate-500 mb-6 uppercase">
            Mars AI • Legal Department
          </p>
          <h1 className="heavy-title text-6xl md:text-[100px] text-white">
            {headerText}<span className="text-slate-700">.</span>
          </h1>
        </div>

        {/* Grille de Mentions Minimaliste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {sections.map((item, index) => (
            <section key={index} className="border-l border-white/10 pl-6 group">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-slate-300 transition-colors">
                {item.title}
              </h2>
              {item.isLink ? (
                <p className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                  {item.content}
                </p>
              ) : (
                <p className="text-xl font-bold tracking-tight text-slate-300 group-hover:text-white transition-colors">
                  {item.content}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Section Responsabilité Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Responsabilité</h2>
            <p className="text-slate-500 text-xs italic max-w-md leading-relaxed">
              Le propriétaire décline toute responsabilité en cas d'erreurs dans le contenu.
            </p>
          </div>
          <div className="text-[9px] font-bold tracking-[0.4em] text-slate-700 uppercase">
            Marseille Station // 2026
          </div>
        </footer>
      </div>

      {/* Effet de profondeur cinématographique */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-30" />
    </div>
  );
};

export default Mention;