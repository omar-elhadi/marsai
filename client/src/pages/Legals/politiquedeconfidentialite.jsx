import { useState, useEffect } from "react";

// Sous-composant pour l'effet d'écriture (Typewriter) avec dégradé Sable Doré
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
    <h1 className="text-3xl md:text-6xl font-black mb-16 text-left tracking-tighter uppercase italic min-h-[70px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FAF0E6] via-[#E6D5AC] to-[#D4AF37]">
        {displayText}
      </span>
      <span className="animate-pulse ml-2 inline-block w-2 h-10 md:h-12 bg-[#E6D5AC] shadow-[0_0_15px_#D4AF37]">|</span>
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
    /* flex items-center justify-center pour centrer tout le contenu au milieu de l'écran */
    <div className="relative min-h-screen bg-bg-pure text-white overflow-hidden font-mono p-8 flex items-center justify-center">
      
      {/* ── IMAGE DE FOND CINÉMA ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop" 
          alt="Cinema Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Overlay gradient radial profond */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_50%,rgba(20,20,25,0.2)_0%,rgba(5,5,8,1)_100%)] z-1" />

      <style>{`
        @keyframes breathe {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.1);
            border-color: rgba(212, 175, 55, 0.1);
          }
          50% { 
            box-shadow: 0 0 25px rgba(230, 213, 172, 0.3);
            border-color: rgba(230, 213, 172, 0.5);
          }
        }
        .breathe-effect {
          animation: breathe 5s infinite ease-in-out;
        }
      `}</style>

      {/* CONTENU CENTRÉ : Suppression du padding-top fixe pour utiliser le centrage Flexbox */}
      <div className="max-w-5xl w-full relative z-10 py-20">
        
        {/* HEADER */}
        <header className="mb-24">
          <div className="mb-8 text-left">
            <span className="inline-block text-[10px] font-bold tracking-[0.5em] text-[#E6D5AC] uppercase opacity-50">
              Mars AI • Sécurité des données • Protocol v.26
            </span>
          </div>
          
          <TypewriterHeader text="Politique de Confidentialité" />
          
          <div className="h-[1px] w-32 bg-gradient-to-r from-[#D4AF37] to-transparent mt-10 opacity-30" />
        </header>

        {/* ACCORDÉONS ESPACÉS */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`border transition-all duration-1000 rounded-sm overflow-hidden ${
                openIndex === index 
                ? "breathe-effect bg-zinc-900/95 border-[#D4AF37] backdrop-blur-xl" 
                : "border-white/5 bg-black/40 hover:border-white/20 backdrop-blur-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-8 md:p-10 text-left"
              >
                <div>
                  <span className={`text-[9px] font-bold tracking-[0.5em] mb-3 block ${openIndex === index ? "text-[#E6D5AC]" : "text-gray-600"}`}>
                    DATAS_PROTOCOL_0{index + 1}
                  </span>
                  <h2 className={`text-xl md:text-2xl font-bold uppercase tracking-[0.15em] ${openIndex === index ? "text-white" : "text-gray-400"}`}>
                    {section.title}
                  </h2>
                </div>
                <div className={`text-2xl font-extralight transition-transform duration-700 ${openIndex === index ? "rotate-90 text-[#D4AF37]" : "text-gray-500"}`}>
                  {openIndex === index ? "—" : "＋"}
                </div>
              </button>

              <div 
                className={`transition-all duration-1000 ease-in-out ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 md:px-10 pb-10 pt-6 text-gray-300 border-t border-white/5 mt-2 font-sans italic leading-relaxed text-lg md:text-xl">
                  {section.content}
                  <div className="mt-12 flex items-center gap-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent"></div>
                    <span className="text-[10px] text-[#E6D5AC]/40 font-black tracking-widest uppercase">
                      {section.law}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER BAS DE PAGE RELATIF AU CONTENU */}
        <footer className="mt-32 text-left opacity-20 text-[10px] tracking-[1.2em] uppercase text-[#FAF0E6]">
          MarsAi System // Data Protocol Secured // Marseille Station
        </footer>
      </div>

      {/* Vignettage Cinéma Premium */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_30vw_rgba(0,0,0,1)] z-30" />
    </div>
  );
}

export default PolitiqueDeConfidentialite;