import { useState, useEffect } from "react";

// Sous-composant pour l'effet d'écriture (Typewriter)
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
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500">
        {displayText}
      </span>
      <span className="animate-pulse ml-1 inline-block w-2 h-8 md:h-10 bg-blue-500 shadow-[0_0_15px_#3b82f6]">|</span>
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
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      {/* STYLE CSS POUR L'EFFET DE RESPIRATION */}
      <style>{`
        @keyframes breathe {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
            border-color: rgba(59, 130, 246, 0.2);
          }
          50% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            border-color: rgba(59, 130, 246, 0.6);
          }
        }
        .breathe-effect {
          animation: breathe 4s infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <TypewriterHeader text="POLITIQUE DE CONFIDENTIALITÉ" />

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`border transition-all duration-500 rounded-sm overflow-hidden ${
                openIndex === index 
                ? "breathe-effect bg-zinc-900 border-blue-500" 
                : "border-gray-800 bg-black hover:border-gray-600"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <div>
                  <span className={`text-[10px] font-bold tracking-[0.3em] mb-1 block ${openIndex === index ? "text-blue-400" : "text-gray-600"}`}>
                    DATA_MODULE_0{index + 1}
                  </span>
                  <h2 className={`text-lg font-bold uppercase tracking-widest ${openIndex === index ? "text-white" : "text-gray-400"}`}>
                    {section.title}
                  </h2>
                </div>
                <div className={`text-xl font-bold transition-transform ${openIndex === index ? "rotate-90 text-blue-500" : "text-gray-700"}`}>
                  {openIndex === index ? "×" : "＋"}
                </div>
              </button>

              <div 
                className={`transition-all duration-700 ease-in-out ${
                  openIndex === index ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-gray-400 border-t border-gray-800/50 mt-2 font-sans italic leading-relaxed">
                  {section.content}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-900 to-transparent"></div>
                    <span className="text-[9px] text-blue-500 font-black tracking-widest uppercase">
                      {section.law}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center opacity-20 text-[10px] tracking-[1em] uppercase">
          MarsAi System // Protocol Secured
        </footer>
      </div>
    </div>
  );
}

export default PolitiqueDeConfidentialite;