import { useState, useEffect } from "react";
import "./politiquedeconfidentialite.css";

// Sous-composant pour l'effet d'écriture (Typewriter) centré
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
    <h1 className="text-3xl md:text-5xl font-black mb-12 text-center tracking-tighter uppercase italic min-h-[60px]">
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
    <div className="relative min-h-screen bg-bg-pure text-white overflow-x-hidden font-mono p-8">
      
      {/* ── IMAGE DE FOND CINÉMA ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop" 
          alt="Cinema Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Overlay gradient radial centré */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,25,0.2)_0%,rgba(5,5,8,1)_100%)] z-1" />

      <div className="max-w-4xl mx-auto relative z-10 pt-[30vh] pb-[20vh] flex flex-col items-center">
        
        {/* HEADER : Centré et descendu */}
        <header className="mb-24 flex flex-col items-center text-center">
          <div className="mb-6">
            <span className="inline-block text-[11px] font-bold tracking-[0.5em] text-[#E6D5AC] uppercase opacity-60">
              Mars AI • Sécurité des données
            </span>
          </div>
          
          <TypewriterHeader text="Politique de Confidentialité" />
          
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-6" />
        </header>

        {/* ACCORDÉONS : Espacement augmenté pour l'aération */}
        <div className="space-y-12 w-full max-w-3xl">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`border transition-all duration-1000 rounded-sm overflow-hidden ${
                openIndex === index 
                ? "bg-zinc-900/90 border-[#D4AF37] backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.1)]" 
                : "border-white/5 bg-black/20 hover:border-white/20 backdrop-blur-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex flex-col items-center p-10 md:p-14 text-center"
              >
                <span className={`text-[10px] font-bold tracking-[0.4em] mb-4 block ${openIndex === index ? "text-[#E6D5AC]" : "text-gray-600"}`}>
                  MODULE_0{index + 1}
                </span>
                <h2 className={`text-xl md:text-2xl font-bold uppercase tracking-[0.2em] ${openIndex === index ? "text-white" : "text-gray-400"}`}>
                  {section.title}
                </h2>
                <div className={`mt-6 text-xl transition-transform duration-500 ${openIndex === index ? "rotate-45 text-[#D4AF37]" : "text-gray-700"}`}>
                  ＋
                </div>
              </button>

              <div 
                className={`transition-all duration-1000 ease-in-out ${
                  openIndex === index ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-10 pb-12 pt-4 text-center text-gray-300 border-t border-white/5 mt-2 font-sans italic leading-relaxed text-lg">
                  <p className="max-w-xl mx-auto">{section.content}</p>
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                    <span className="text-[10px] text-[#E6D5AC] font-black tracking-widest uppercase">
                      {section.law}
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER : Centré */}
        <footer className="mt-40 text-center opacity-30 text-[10px] tracking-[1em] uppercase text-[#FAF0E6] w-full">
          MarsAi System // Data Protocol Secured
        </footer>
      </div>

      {/* Vignettage accentué pour le focus central */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_40vw_rgba(0,0,0,1)] z-30" />
    </div>
  );
}

export default PolitiqueDeConfidentialite;