import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Mention = () => {
  const mainContentRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Mentions Légales";

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

  useEffect(() => {
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power3.out",
        delay: 0.4 
      }
    );
  }, []);

  const sections = [
    { title: "Propriétaire", content: "Jean Dupont" },
    { title: "Statut", content: "Festival International" },
    { title: "Adresse", content: "123 Rue des Festivals, 75000 Paris" },
    { title: "SIRET", content: "123 456 789 00012" },
    { title: "Email de contact", content: "contact@festival.com", isLink: true },
    { title: "Directeur de Publication", content: "Jean Dupont" },
    { title: "Hébergement", content: "Hébergeur Web, 456 Avenue, Paris" },
    { title: "Propriété Intellectuelle", content: "Contenu protégé par les lois internationales de PI" },
    { title: "Protection des données", content: "Conformité RGPD européenne" },
    { title: "Gestion des Cookies", content: "Optimisation de l'expérience utilisateur" }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans">
      
      <style>{`
        .heavy-title {
          font-weight: 800;
          letter-spacing: 0.05em;
          line-height: 1.4;
        }
      `}</style>

      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col items-center">
        
        <div ref={mainContentRef} className="w-full flex flex-col items-center">
          
          {/* HEADER : Poussé très bas pour éviter la navbar fixe */}
          <header className="mt-[60vh] mb-64 flex flex-col items-center text-center">
            <div className="overflow-hidden mb-6">
              <span className="inline-block text-[10px] font-black tracking-[0.7em] text-orange-500/60 uppercase">
                Protocol Juridique // Mars AI
              </span>
            </div>
            
            <h1 className="heavy-title text-4xl md:text-5xl lowercase italic text-white/90">
              {headerText}<span className="text-orange-500">.</span>
            </h1>
            
            <div className="h-[1px] w-16 bg-orange-500/20 mt-12" />
          </header>

          {/* GRILLE : Très aérée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-40 w-full mb-80">
            {sections.map((item, index) => (
              <section key={index} className="flex flex-col items-center text-center gap-5 group">
                <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] group-hover:text-orange-500/50 transition-colors">
                  {item.title}
                </h2>
                
                {item.isLink ? (
                  <a href={`mailto:${item.content}`} className="text-lg font-light tracking-wide text-white/70 hover:text-orange-500 transition-all italic underline decoration-white/5 underline-offset-8">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-lg font-light tracking-wide text-white/50 group-hover:text-white/90 transition-colors italic leading-relaxed max-w-sm">
                    {item.content}
                  </p>
                )}
              </section>
            ))}
          </div>

          {/* FOOTER */}
          <footer className="pb-32 pt-16 border-t border-white/5 opacity-20 w-full text-center">
            <p className="text-[9px] uppercase tracking-[0.5em]">Marseille // Terminal 01</p>
          </footer>
        </div>
      </main>

      {/* Vignettage pour focus central */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_60vw_rgba(0,0,0,1)] z-30" />
    </div>
  );
};

export default Mention;