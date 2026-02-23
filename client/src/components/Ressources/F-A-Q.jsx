import React, { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';

const FAQMarsAI = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const particleContainerRef = useRef(null);
  const mainCardRef = useRef(null);

  useEffect(() => {
    // --- Animation d'entrée cinématographique ---
    gsap.fromTo(mainCardRef.current, 
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "expo.out" }
    );

    // --- Particules en arrière-plan (Poussière d'étoiles) ---
    const container = particleContainerRef.current;
    for (let i = 0; i < 80; i++) {
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
        x: `+=${(Math.random() - 0.5) * 40}`,
        duration: Math.random() * 15 + 10,
        repeat: -1,
        ease: "none",
        opacity: 0,
      });
    }
  }, []);

  const faqData = [
    { q: "Qu'est-ce ?", a: "Une immersion de totale future, mélant IA et créativité humaine." },
    { q: "Quand et où ?", a: "Mars 2026, Marseille. Billetterie ouverte via le terminal Mars AI." },
    { q: "Protocole PMR ?", a: "Accessibilité universelle garantie sur tous les secteurs." },
    { q: "Accès Système", a: "Interface sécurisée optimisée pour les unités neuronales v2." },
    { q: "Partenariats", a: "Collaboration entre Arta Digital et la Station Marseille." },
    { q: "Règlement", a: "Protocoles de sécurité conformes aux normes interstellaires." }
  ];

  return (
    <div className="relative min-h-screen bg-[#08080c] text-white p-6 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Styles spécifique pour la typo et les effets */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
        
        .font-mars { font-family: 'Inter', sans-serif; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .text-glow {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        /* Barre grise derrière "FRÉQUENTES" */
        .title-overlay {
          position: relative;
          display: inline-block;
        }
        .title-overlay::after {
          content: "";
          position: absolute;
          left: -5%;
          bottom: 10%;
          width: 110%;
          height: 40%;
          background: rgba(255, 255, 255, 0.1);
          z-index: -1;
        }
      `}</style>

      {/* Particules */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Carte Principale */}
      <div 
        ref={mainCardRef}
        className="relative z-10 w-full max-w-4xl glass-panel rounded-[2rem] p-10 md:p-16 shadow-2xl font-mars"
      >
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-[0.3em] opacity-80 mb-4">
            Mars AI • Information Center
          </p>
          <h1 className="text-5xl md:text-7xl font-900 tracking-tighter leading-none">
            QUESTIONS <br />
            <span className="title-overlay opacity-50">FRÉQUENTES.</span>
          </h1>
        </div>

        <div className="h-[1px] w-full bg-white/10 mb-10" />

        {/* Section FAQ en grille */}
        <div className="mb-6 uppercase text-xs tracking-widest opacity-60 font-bold">FAQ</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className={`border border-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:bg-white/5 ${openIndex === index ? 'bg-white/10' : ''}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                  <p className={`text-sm text-slate-400 leading-relaxed transition-all duration-500 ${openIndex === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {item.a}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                   <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                      <span className="text-xl font-light">+</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-between items-center text-[10px] tracking-widest opacity-40 font-bold uppercase">
          <span>Protocole de bord v.26 // Marseille Station</span>
          <div className="flex gap-4">
            <span className="animate-pulse">● SYSTEM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Vignettage Cinématographique */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default FAQMarsAI;