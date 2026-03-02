import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Mention = () => {
  const mainContentRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const fullText = "Mentions Légales";

  // Effet machine à écrire pour le titre
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

  // Animation d'entrée du contenu
  useEffect(() => {
    gsap.fromTo(mainContentRef.current, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power4.out",
        delay: 0.3 
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
    <div className="relative min-h-screen bg-bg-pure text-white overflow-hidden font-sans">
      
      <style>{`
        .heavy-title {
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
        }
      `}</style>

      {/* IMAGE DE FOND CINÉMA */}
      <img 
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop" 
        alt="Arrière-plan salle de cinéma" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
      />

      {/* Overlay gradient radial */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(20,20,25,0.1)_0%,rgba(5,5,8,0.8)_100%)] z-1" />

      <main className="relative z-10 max-w-6xl mx-auto px-8 pb-32">
        
        <div ref={mainContentRef}>
          {/* HEADER : Aligné à gauche avec items-start */}
          <header className="pt-[28vh] mb-28 flex flex-col items-start text-left">
            <div className="overflow-hidden mb-5">
              <span className="inline-block text-[9px] font-black tracking-[0.5em] text-orange-400 uppercase opacity-70">
                Mars AI • Protocol Juridique
              </span>
            </div>
            
            <h1 className="heavy-title text-4xl md:text-[70px] lowercase italic">
              {headerText}<span className="text-orange-400">.</span>
            </h1>
            
            <div className="h-[1px] w-16 bg-orange-400/20 mt-12" />
          </header>

          {/* GRILLE DE CONTENU */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16">
            {sections.map((item, index) => (
              <section key={index} className="flex flex-col gap-4 group border-l border-white/5 pl-7 hover:border-orange-400/30 transition-all duration-500 rounded">
                <h2 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] group-hover:text-orange-400/60 transition-colors">
                  {item.title}
                </h2>
                
                {item.isLink ? (
                  <a href={`mailto:${item.content}`} className="text-lg font-bold tracking-tight hover:text-orange-400 transition-all italic decoration-white/5 underline-offset-4">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-lg font-medium tracking-tight text-white/80 group-hover:text-white transition-colors italic leading-relaxed">
                    {item.content}
                  </p>
                )}
              </section>
            ))}
          </div>

          {/* FOOTER */}
          <footer className="mt-52 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 opacity-50">
            <div className="max-w-md">
              <p className="text-[9px] uppercase tracking-widest font-black mb-3 text-orange-400">Responsabilité & Juridiction</p>
              <p className="text-xs leading-relaxed italic text-slate-400">
                Cette plateforme est opérée par les protocoles Mars AI. 
                Toute réclamation doit être adressée au Terminal Marseille 01.
              </p>
            </div>
            <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">
              Marseille // Terminal 01
            </div>
          </footer>
        </div>
      </main>

      {/* Effet de vignettage cinéma */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_20vw_rgba(0,0,0,1)] z-30" />
    </div>
  );
};

export default Mention;