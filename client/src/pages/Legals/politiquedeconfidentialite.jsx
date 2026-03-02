import { useState, useEffect } from "react";
import "./politiquedeconfidentialite.css";
// Sous-composant pour l'effet d'écriture (Typewriter) identique à Mentions Légales
const TypewriterHeader = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <h1 className="text-3xl md:text-5xl font-black mb-12 text-left tracking-tighter uppercase italic min-h-[60px]">
      {/* ── EFFET TITRE BLANC SABLE DORÉ ── */}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FAF0E6] via-[#E6D5AC] to-[#D4AF37]">
        {displayText}
      </span>
      <span className="animate-pulse ml-1 inline-block w-2 h-8 md:h-10 bg-[#E6D5AC] shadow-[0_0_15px_#D4AF37]">|</span>
    </h1>
  );
};

function PolitiqueDeConfidentialite() {
  const [openIndex, setOpenIndex] = useState(null);

  const sections = [
    {
      title: "Données collectées",
      content: "Les données collectées incluent des informations telles que votre nom, votre adresse email ou vos données de navigation. Ces informations sont utilisées uniquement dans le but d’améliorer nos services.",
      law: "PROTOCOLE_RGPD_ACTIF"
    },
    {
      title: "Mesures de sécurité",
      content: "Nous utilisons un cryptage de pointe pour protéger vos données contre tout accès non autorisé ou divulgation.",
      law: "CRYPTAGE_AES_256"
    },
    {
      title: "Acceptation des pratiques",
      content: "En naviguant sur MarsAi, vous acceptez les protocoles de confidentialité en vigueur pour l'édition 2026.",
      law: "ACCORD_UTILISATEUR_OK"
    }
  ];

  return (
    /* bg-bg-pure pour la cohérence avec Home.jsx */
    <div className="relative min-h-screen bg-bg-pure text-white overflow-hidden font-mono p-8">
      
      {/* ── IMAGE DE FOND CINÉMA ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop" 
          alt="Cinema Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Overlay gradient radial aligné à gauche pour le titre */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_40%,rgba(20,20,25,0.3)_0%,rgba(5,5,8,1)_100%)] z-1" />


      <div className="max-w-4xl mx-auto relative z-10 pt-[15vh]">
        
        {/* HEADER : Titre à gauche avec typographie Mars AI */}
        <header className="mb-16">
          <div className="mb-4">
            <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-[#E6D5AC] uppercase opacity-70">
              Mars AI • Sécurité des données
            </span>
          </div>
          
          <TypewriterHeader text="Politique de Confidentialité" />
          
          <div className="h-[1px] w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-4" />
        </header>

        {/* ACCORDÉONS */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`border transition-all duration-1000 rounded-sm overflow-hidden ${
                openIndex === index 
                ? "breathe-effect bg-zinc-900/80 border-[#D4AF37] backdrop-blur-sm" 
                : "border-white/5 bg-black/40 hover:border-white/20 backdrop-blur-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-8 md:p-10 text-left"
              >
                <div>
                  <span className={`text-[10px] font-bold tracking-[0.3em] mb-1 block ${openIndex === index ? "text-[#E6D5AC]" : "text-gray-600"}`}>
                    MODULE_CONFIDENTIALITE_0{index + 1}
                  </span>
                  <h2 className={`text-xl md:text-2xl font-bold uppercase tracking-[0.15em] ${openIndex === index ? "text-white" : "text-gray-400"}`}>
                    {section.title}
                  </h2>
                </div>
                <div className={`text-xl font-bold transition-transform ${openIndex === index ? "rotate-90 text-[#D4AF37]" : "text-gray-700"}`}>
                  {openIndex === index ? "×" : "＋"}
                </div>
              </button>

              <div 
                className={`transition-all duration-1000 ease-in-out ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-gray-300 border-t border-white/5 mt-2 font-sans italic leading-relaxed">
                  {section.content}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                    <span className="text-[9px] text-[#E6D5AC] font-black tracking-widest uppercase">
                      {section.law}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER INTERNE */}
        <footer className="mt-20 text-left opacity-30 text-[10px] tracking-[0.8em] uppercase text-[#FAF0E6]">
          MarsAi System // Data Protocol Secured
        </footer>
      </div>

      {/* Effet de vignettage cinéma */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_20vw_rgba(0,0,0,1)] z-30" />
    </div>
  );
}

export default PolitiqueDeConfidentialite;