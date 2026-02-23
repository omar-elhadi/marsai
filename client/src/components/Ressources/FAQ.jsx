import React, { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const particleContainerRef = useRef(null);
  const titleRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    // --- 1. ANIMATION DU TITRE (GLITCH CINÉMA 70s) ---
    const titleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    
    titleTimeline
      .to(titleRef.current, { skewX: 20, duration: 0.1, ease: "power4.inOut" })
      .to(titleRef.current, { skewX: 0, duration: 0.1 })
      .to(titleRef.current, { opacity: 0.5, x: -5, duration: 0.05 })
      .to(titleRef.current, { opacity: 1, x: 0, duration: 0.05 })
      .to(titleRef.current, { 
        textShadow: "0 0 30px rgba(168,85,247,1), 5px 0px 0px rgba(236,72,153,0.5)", 
        duration: 0.1 
      })
      .to(titleRef.current, { textShadow: "0 0 10px rgba(168,85,247,0.5)", duration: 0.5 });

    // --- 2. PARTICULES 3D PROFONDEUR (GSAP) ---
    const container = particleContainerRef.current;
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const depth = Math.random(); // 0 = fond, 1 = premier plan
      const size = depth * 8 + 1; // De 1px à 9px
      const blur = (1 - depth) * 2; // Les plus lointaines sont un peu floues

      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.filter = `blur(${blur}px)`;
      particle.style.background = depth > 0.8 ? '#fff' : '#fbbf24'; // Éclats blancs au 1er plan
      particle.style.boxShadow = `0 0 ${size * 2}px ${depth > 0.8 ? '#fff' : '#f59e0b'}`;
      
      container.appendChild(particle);

      // Positionnement initial 3D
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: depth * 100,
        opacity: Math.random() * 0.5 + 0.2
      });

      // Animation de "Voyage dans l'espace"
      gsap.to(particle, {
        duration: (1 - depth) * 10 + 5, // Les proches bougent plus vite
        y: "-=300",
        x: `+=${(Math.random() - 0.5) * 200}`,
        repeat: -1,
        ease: "none",
        opacity: 0,
        delay: Math.random() * 10
      });
    }

    // --- 3. PULSATION DU CADRE NÉON ---
    gsap.to(frameRef.current, {
      boxShadow: "0 0 60px rgba(168,85,247,0.8), inset 0 0 30px rgba(168,85,247,0.4)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => { if(container) container.innerHTML = ""; };
  }, []);

  const faqs = [
    { question: "Qu’est-ce que le Festival Mars AI ?", answer: "Une immersion totale dans le futur, mêlant IA et créativité humaine." },
    { question: "Quand et où ?", answer: "Mars 2026, Marseille. Le point de convergence technologique." },
    { question: "Accès au système ?", answer: "Billetterie ouverte. Pass prioritaires disponibles via le terminal Mars AI." },
    { question: "Protocole PMR ?", answer: "Accessibilité universelle garantie sur tous les secteurs de l'exposition." },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-serif p-4 flex items-center justify-center overflow-hidden">
      
      {/* 1. FOND DE PARTICULES 3D PROFONDEUR */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0 overflow-hidden" />

      {/* 2. OVERLAY VINTAGE CRT */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-40" />
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_0.1s_infinite]" />

      {/* 3. CADRE NÉON ULTRA-LUMINEUX */}
      <div 
        ref={frameRef}
        className="relative z-20 w-full max-w-5xl border-[5px] border-purple-500 rounded-[3rem] p-8 md:p-16 shadow-[0_0_40px_rgba(168,85,247,0.5)] bg-black/20 backdrop-blur-[6px]"
      >
        
        {/* Titre Glitch Futuriste */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
             <div className="h-[1px] w-12 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.8em] text-purple-400">MARS AI ARCHIVE</span>
             <div className="h-[1px] w-12 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
          </div>

          <h1 
            ref={titleRef}
            className="text-5xl md:text-8xl font-black italic tracking-tighter text-yellow-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          >
            F.A.Q SYSTEM
          </h1>
          
          <div className="mt-6 inline-block bg-purple-500 text-black font-black text-[10px] px-3 py-1 skew-x-[-20deg] uppercase tracking-widest">
            Protocol v.77.26
          </div>
        </div>

        {/* Grille FAQ interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-2xl transition-all duration-500 ${openIndex === index ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-purple-500/30 bg-black/40 hover:border-purple-500'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`font-black italic text-lg ${openIndex === index ? 'text-yellow-400' : 'text-purple-100'}`}>
                   {faq.question}
                </span>
                <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-full transition-transform duration-500 ${openIndex === index ? 'rotate-180 border-yellow-400' : 'border-purple-500'}`}>
                   <svg className={`w-3 h-3 ${openIndex === index ? 'text-yellow-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-gray-300 italic border-l-2 border-yellow-400 pl-4 py-2 bg-yellow-400/5">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Mars Protocol */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 border border-purple-500/50 rounded-full px-6 py-2 bg-black/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Transmission stable // Ready for Mars</span>
            </div>
        </div>
      </div>

      {/* Effet Vignette Master */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_300px_rgba(0,0,0,1)] z-50" />
    </div>
  );
};

export default FAQ;