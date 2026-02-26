import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../Button'; 

gsap.registerPlugin(ScrollTrigger);

const ReglesConditions = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const lineRef = useRef(null);
  const [isReading, setIsReading] = useState(null); // Stocke l'ID de la règle lue

  // Fonction de lecture vocale
  const speak = (text, id) => {
    window.speechSynthesis.cancel(); // Arrête toute lecture en cours
    
    if (isReading === id) {
      setIsReading(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 0.8; // Voix un peu plus grave/robotique
    utterance.rate = 0.9;  // Débit légèrement ralenti
    
    utterance.onstart = () => setIsReading(id);
    utterance.onend = () => setIsReading(null);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animations de base (conservées et aérées)
      gsap.fromTo(imageRef.current, 
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 0.2, duration: 2.5, ease: "power3.out" }
      );

      gsap.fromTo(".reveal-title", 
        { clipPath: "inset(100% 0% 0% 0%)", y: 100 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.5, ease: "expo.out", stagger: 0.15, delay: 0.5 }
      );
    }, containerRef);

    return () => {
        ctx.revert();
        window.speechSynthesis.cancel(); // Coupe le son si on quitte la page
    };
  }, []);

  const rules = [
    { id: "01", title: "Intelligence Artificielle", text: "Le film doit être généré à l'aide d'outils de synthèse algorithmique documentés. Chaque frame doit porter l'empreinte du futur." },
    { id: "02", title: "Durée & Format", text: "60 secondes exactement. Ni plus, ni moins. Format vertical 9:16 ou CinemaScope 21:9 en résolution native 4K." },
    { id: "03", title: "Droits d'Auteur", text: "L'artiste conserve la propriété intellectuelle. MARSAI obtient un droit de diffusion exclusif pour la durée du festival." },
    { id: "04", title: "Éthique Algorithmique", text: "Interdiction formelle d'utiliser des modèles entraînés sans consentement. Le respect de la création humaine est la base de notre IA." }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 h-screen overflow-hidden">
        <img ref={imageRef} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" src="https://plus.unsplash.com/premium_photo-1705091308945-19adc45aeb07?q=80&w=1074" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="relative z-10 px-8 flex flex-col items-center">
        
        {/* Header Hero */}
        <header className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          <span className="reveal-title inline-block text-[10px] tracking-[0.8em] text-orange-400 mb-8 uppercase font-black">
            Audio Guide Available
          </span>
          <h1 className="reveal-title text-7xl md:text-[130px] font-black leading-[0.8] tracking-[-0.06em] lowercase italic">
            règles & <br /> <span className="text-orange-400">conditions.</span>
          </h1>
          <div className="mt-16 animate-bounce opacity-20 text-[10px] tracking-widest uppercase">Scroll to read</div>
        </header>

        {/* Liste des règles */}
        <div className="rules-grid grid grid-cols-1 gap-y-52 pb-60 max-w-2xl w-full">
          {rules.map((rule) => (
            <div key={rule.id} className="rule-item flex flex-col items-center text-center group">
              
              {/* Bouton Voice Control */}
              <button 
                onClick={() => speak(`${rule.title}. ${rule.text}`, rule.id)}
                className={`mb-10 w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 ${isReading === rule.id ? 'bg-orange-400 border-orange-400 scale-110' : 'border-white/10 hover:border-orange-400/50'}`}
              >
                {isReading === rule.id ? (
                  <div className="flex gap-1">
                    <span className="w-1 h-4 bg-black animate-[bounce_0.6s_infinite]"></span>
                    <span className="w-1 h-4 bg-black animate-[bounce_0.6s_infinite_0.2s]"></span>
                    <span className="w-1 h-4 bg-black animate-[bounce_0.6s_infinite_0.4s]"></span>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                )}
              </button>

              <div className="space-y-6">
                <span className="text-[10px] font-black text-orange-400/40 tracking-[0.4em] uppercase">Section {rule.id}</span>
                <h3 className="font-black uppercase tracking-[0.2em] text-2xl italic group-hover:text-orange-400 transition-colors">
                  {rule.title}
                  
                </h3>
                <p className={`text-xl md:text-2xl leading-relaxed font-light italic transition-colors duration-700 ${isReading === rule.id ? 'text-white' : 'text-slate-500'}`}>
                  "{rule.text}"
                </p>
              </div>
            </div>
          ))}

          <footer className="pt-20 flex justify-center">
            <Button onClick={() => window.history.back()}>Fermer le terminal</Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReglesConditions;