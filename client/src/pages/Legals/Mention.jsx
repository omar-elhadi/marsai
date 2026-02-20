import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Mention = () => {
  const particleContainerRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Mentions Légales";

  // 1. Effet machine à écrire pour le titre
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

  // 2. Animation des particules dorées (Style "Golden Sparks")
  useEffect(() => {
    const container = particleContainerRef.current;
    const particleCount = 150; // Haute densité pour visibilité maximale

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
    return () => { container.innerHTML = ""; };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-serif p-4 md:p-8 flex items-center justify-center overflow-hidden">
      
      {/* Fond de particules dorées */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />

      {/* Overlay Grain de film Cinéma */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_0.1s_infinite]" />

      {/* Cadre Principal Néon Transparent */}
      <div className="relative z-20 w-full max-w-5xl border-[3px] border-purple-600 rounded-3xl p-6 md:p-12 shadow-[0_0_40px_rgba(147,51,234,0.6),inset_0_0_20px_rgba(147,51,234,0.4)] bg-transparent backdrop-blur-[3px]">
        
        {/* Badge Mars Ai */}
        <div className="absolute -top-4 left-8 bg-black border border-purple-500 rounded-full px-4 py-1 flex items-center gap-2 shadow-[0_0_15px_#a855f7]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white italic">Mars Ai • Protocol</span>
        </div>

        {/* Titre Principal Animé */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black italic text-yellow-50 tracking-tighter drop-shadow-[0_0_20px_rgba(254,252,232,0.6)]">
            {headerText}<span className="animate-pulse">_</span>
          </h1>
          <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        {/* Grille des Mentions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-sm relative z-30">
          
          {[
            { title: "Propriétaire", content: "Jean Dupont" },
            { title: "Statut", content: "Festival" },
            { title: "Adresse", content: "123 Rue des Festivals, 75000 Paris" },
            { title: "SIRET", content: "123 456 789 00012" },
            { title: "Email", content: "contact@festival.com", isLink: true },
            { title: "Publication", content: "Jean Dupont" },
            { title: "Hébergeur", content: "Hébergeur Web, 456 Avenue de l'Hébergement" },
            { title: "Propriété", content: "Contenu protégé par les lois PI" },
            { title: "RGPD", content: "Respect de la réglementation générale" },
            { title: "Cookies", content: "Utilisation pour l'expérience utilisateur" }
          ].map((item, index) => (
            <section key={index} className="text-center group">
              <h2 className="text-xs font-black text-purple-400 mb-1 uppercase tracking-[0.2em] group-hover:text-purple-300 transition-colors">
                {item.title}
              </h2>
              {item.isLink ? (
                <p className="text-yellow-50 font-bold italic group-hover:underline cursor-pointer transition-all">
                  {item.content}
                </p>
              ) : (
                <p className="text-gray-300 italic group-hover:text-white transition-colors">
                  {item.content}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Section Responsabilité en bas */}
        <section className="mt-10 pt-8 border-t border-purple-500/30 text-center w-full">
          <h2 className="text-xs font-black text-purple-400 mb-1 uppercase tracking-[0.2em]">Responsabilité</h2>
          <p className="text-gray-400 text-xs italic">
            Le propriétaire décline toute responsabilité en cas d'erreurs dans le contenu.
          </p>
        </section>

        {/* Effet de lueur en bas du cadre */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_#a855f7]" />
      </div>

      {/* Vignettage Cinéma */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-40" />
    </div>
  );
};

export default Mention;