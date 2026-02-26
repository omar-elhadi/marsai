import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../Button'; // Vérifie que le chemin vers Button.jsx est correct

gsap.registerPlugin(ScrollTrigger);

const ReglesConditions = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animation de l'image (Entrée immersive + Parallaxe)
      gsap.fromTo(imageRef.current, 
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 0.5, duration: 2.5, ease: "power3.out" }
      );

      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Animation du Titre "Rideau" (Comme sur la page d'accueil)
      gsap.fromTo(".reveal-title", 
        { clipPath: "inset(100% 0% 0% 0%)", y: 100 },
        { 
          clipPath: "inset(0% 0% 0% 0%)", 
          y: 0, 
          duration: 1.2, 
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.5 
        }
      );

      // 3. Filet horizontal (Scale 0 -> 1)
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.5, ease: "expo.inOut", delay: 1 }
      );

      // 4. Apparition des items de règles
      gsap.fromTo(".rule-item",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          duration: 1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".rules-grid",
            start: "top 85%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0f0f0f] text-white overflow-hidden font-sans">
      
      {/* --- BACKGROUND : IMAGE DU BUREAU FUTURISTE --- */}
      <div className="absolute inset-0 z-0 h-screen overflow-hidden">
        <img 
          ref={imageRef}
          alt="Bureau Futuriste MARSAI" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          src="https://plus.unsplash.com/premium_photo-1705091308945-19adc45aeb07?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        />
        {/* Overlay sombre progressif pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/90 via-[#0f0f0f]/50 to-[#0f0f0f]" />
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-10 p-8 md:p-24 pt-[30vh]">
        
        <header className="mb-24">
          <div className="overflow-hidden mb-2">
            <span className="reveal-title inline-block text-[10px] tracking-[0.4em] text-orange-400 font-black uppercase">
              Terminal de Sécurité // MARSAI 2026
            </span>
          </div>
          
          <div className="overflow-hidden">
            <h1 className="reveal-title text-6xl md:text-[110px] font-black leading-[0.85] tracking-[-0.05em] lowercase">
              règles & <br />
              <span className="text-orange-400">conditions.</span>
            </h1>
          </div>
          
          <div ref={lineRef} className="mt-12 h-[1px] w-full bg-white/20" />
        </header>

        {/* Grille des règles */}
        <div className="rules-grid grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 max-w-6xl">
          {[
            { id: "01", title: "Intelligence Artificielle", text: "Le film doit être généré à l'aide d'outils de synthèse algorithmique documentés." },
            { id: "02", title: "Durée & Format", text: "60 secondes exactement. Format vertical 9:16 ou large 21:9 en résolution 4K." },
            { id: "03", title: "Droits d'Auteur", text: "L'artiste conserve ses droits. Le festival obtient un droit de diffusion mondial." },
            { id: "04", title: "Éthique", text: "Interdiction d'utiliser des modèles entraînés sans consentement explicite." }
          ].map((rule) => (
            <div key={rule.id} className="rule-item border-l border-white/10 pl-8 space-y-4">
              <h3 className="font-black uppercase tracking-[0.2em] text-[12px] text-orange-400">{rule.id}. {rule.title}</h3>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {rule.text}
              </p>
            </div>
          ))}
        </div>

        {/* Pied de page avec ton bouton */}
        <footer className="mt-32 pb-20 flex justify-center">
          <Button onClick={() => window.history.back()}>
            Revenir à l'accueil
          </Button>
        </footer>
      </div>

      <style jsx>{`
        .reveal-title {
          will-change: transform, clip-path;
        }
      `}</style>
    </div>
  );
};

export default ReglesConditions;