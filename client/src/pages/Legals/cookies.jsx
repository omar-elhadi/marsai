import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CookiesProtocol = () => {
  const particleContainerRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Protocole de Cookies";

  // 1. Animation de machine à écrire pour le titre
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

  // 2. Animation des particules dorées avec GSAP (Très visibles)
  useEffect(() => {
    const container = particleContainerRef.current;
    const particleCount = 150; // Nombre de particules augmenté pour plus de densité

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 5 + 2; // Taille augmentée (2 à 7px)
      
      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Fond et lueur dorée plus intenses
      particle.style.background = 'radial-gradient(circle at center, #fcd34d 0%, #d97706 100%)'; // Dégradé doré
      particle.style.boxShadow = `0 0 ${size * 4}px #fbbf24, 0 0 ${size * 8}px #f59e0b`; // Lueur plus large et intense
      
      container.appendChild(particle);

      // Position aléatoire initiale
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.8 + 0.5 // Opacité de base plus élevée
      });

      // Animation de flottement "Sync Stream" plus lente et visible
      gsap.to(particle, {
        duration: Math.random() * 6 + 4, // Durée plus longue pour un mouvement plus lent et majestueux
        y: "-=250", // Elles montent plus haut
        x: `+=${Math.random() * 80 - 40}`, // Mouvement latéral plus prononcé
        opacity: Math.random() * 0.4 + 0.2, // Opacité fluctuante pour le scintillement
        repeat: -1,
        ease: "power1.inOut",
        delay: Math.random() * 6,
        onRepeat: () => {
          // Repositionne en bas pour un flux continu
          gsap.set(particle, { y: window.innerHeight + 50, x: Math.random() * window.innerWidth, opacity: Math.random() * 0.8 + 0.5 });
        }
      });
    }

    return () => { container.innerHTML = ""; };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-serif p-4 md:p-8 flex items-center justify-center overflow-hidden">
      
      {/* Fond de particules dorées (très visibles, derrière le cadre) */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay Grain de film Cinéma */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_0.1s_infinite]" />

      {/* Cadre Principal Néon (transparent avec flou) */}
      <div className="relative z-20 w-full max-w-4xl border-[3px] border-purple-600 rounded-3xl p-6 md:p-12 shadow-[0_0_40px_rgba(147,51,234,0.6),inset_0_0_20px_rgba(147,51,234,0.4)] bg-transparent backdrop-blur-[3px]">
        
        {/* Badge Mars Ai */}
        <div className="absolute -top-4 left-8 bg-black border border-purple-500 rounded-full px-4 py-1 flex items-center gap-2 shadow-[0_0_15px_#a855f7]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Mars Ai • Golden Sparks</span>
        </div>

        {/* Titre Principal */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-black italic text-yellow-50 tracking-tighter drop-shadow-[0_0_20px_rgba(254,252,232,0.6)]">
            {headerText}
            <span className="animate-pulse">_</span>
          </h1>
          <div className="mt-4 inline-block bg-purple-900/40 border border-purple-500/50 rounded-full px-6 py-1">
             <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-200">CBETIEINIER GSAP Sync Stream</span>
          </div>
        </div>

        {/* Sections de contenu */}
        <div className="space-y-6">
          
          {/* Utilisation 1 */}
          <section>
            <h2 className="text-xl font-bold italic text-yellow-100 mb-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">Utilisation</h2>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl italic text-sm text-gray-300 leading-relaxed">
              "Ce cookies utilise des traceurs de datees (cookies) pour optimique vour expérience du utililtue e fluxs navigation inter-système."
            </div>
          </section>

          {/* Utilisation 2 */}
          <section>
            <h2 className="text-xl font-bold italic text-yellow-100 mb-2">Utilisation</h2>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl italic text-sm text-gray-300">
              'Les cookies sers de paclues de dataes) pour ass pavaled ouiscntier stabl stable du flux se système.
            </div>
          </section>

          {/* Bouton Mars Ai */}
          <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
            <span className="text-sm font-bold italic text-purple-100 italic">Mars Ai GBETEIINIER @I#Ton 2.50</span>
          </div>

          <hr className="border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold italic text-yellow-100 mb-2">Contact</h2>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm italic text-gray-400">
              "Les cookies fout text <span className="text-purple-400 font-bold tracking-widest">EET 50pp@DOT EGPENi</span>-Stream
            </div>
          </section>

          {/* Points de détails */}
          <div className="space-y-3 pl-4">
            <div className="flex items-center gap-3 text-sm italic text-gray-300">
              <div className="w-4 h-4 rounded-full bg-purple-600/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
              </div>
              Fluidi' des operations p 500 p perforations système.
            </div>
            <div className="flex items-center gap-3 text-sm italic text-gray-300">
              <div className="w-4 h-4 rounded-full bg-purple-600/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
              </div>
              Fnalysies onfours 10 soperfert ete partnc600-1810
            </div>
          </div>
        </div>

        {/* Effet de lueur en bas */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_#a855f7]" />
      </div>

      {/* Vignettage final */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-40" />
    </div>
  );
};

export default CookiesProtocol;