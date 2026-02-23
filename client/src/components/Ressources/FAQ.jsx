import React, { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';

const FAQMarsAI = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const particleContainerRef = useRef(null);
  const mainCardRef = useRef(null);

  useEffect(() => {
    // Animation d'entrée
    gsap.fromTo(mainCardRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    // Particules
    const container = particleContainerRef.current;
    if (container) {
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = "absolute bg-white rounded-full pointer-events-none opacity-10";
        const size = Math.random() * 1.5;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        container.appendChild(p);

        gsap.set(p, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });

        gsap.to(p, {
          y: "-=80",
          duration: Math.random() * 20 + 10,
          repeat: -1,
          ease: "none",
        });
      }
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
    <div className="relative min-h-screen bg-[#030305] text-white p-6 flex items-center justify-center overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
        
        .font-mars { font-family: 'Inter', sans-serif; }
        
        .solid-panel {
          background: #08080a;
          border: 1px solid #1a1a1f;
        }
      `}</style>

      {/* Fond poussière d'étoiles */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Carte FAQ */}
      <div 
        ref={mainCardRef}
        className="relative z-10 w-full max-w-4xl solid-panel rounded-[2rem] p-10 md:p-16 font-mars"
      >
        {/* Header sans trait gris */}
        <div className="mb-16">
          <p className="text-[10px] font-bold tracking-[0.6em] text-slate-500 mb-6 uppercase">
            Mars AI • Information Center
          </p>
          <h1 className="text-6xl md:text-8xl font-900 tracking-tighter leading-[0.85] uppercase">
            QUESTIONS <br />
            <span className="text-slate-300">FRÉQUENTES</span>
          </h1>
        </div>

        {/* Grille de questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className="border-b border-white/5 py-8 transition-all duration-300 cursor-pointer group"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`font-bold text-xl tracking-tight transition-colors ${openIndex === index ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.q}
                </h3>
                <span className={`text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-white' : 'text-slate-700'}`}>
                  +
                </span>
              </div>
              <div className={`text-sm text-slate-500 mt-4 leading-relaxed transition-all duration-500 overflow-hidden ${
                openIndex === index ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 flex justify-between items-center text-[9px] tracking-[0.5em] text-slate-600 font-bold uppercase">
          <span>Marseille Station // 2026</span>
          <span className="opacity-50 tracking-widest">v.26.4.0</span>
        </div>
      </div>
    </div>
  );
};

export default FAQMarsAI;