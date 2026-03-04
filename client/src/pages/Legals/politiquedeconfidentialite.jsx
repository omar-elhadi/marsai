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

  return (
    <div className="privacy-policy bg-black text-white p-8 rounded-lg shadow-md font-serif flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 bg-black text-white p-4 rounded text-center italic">Politique de Confidentialité</h1>
      <div className="space-y-6 leading-relaxed w-full max-w-2xl">
        <div>
          <button
            onClick={() => toggleAccordion(0)}
            className="w-full text-center text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            Données collectées
          </button>
          {openIndex === 0 && (
            <div className="p-4 bg-gray-900 text-gray-300 rounded">
              <p>
                Les données collectées peuvent inclure des informations telles que votre nom, votre adresse email ou vos données de navigation. Ces informations sont utilisées uniquement dans le but d’améliorer nos services et ne sont jamais vendues à des tiers.
              </p>
              <p className="mt-2">Loi applicable : RGPD (Règlement Général sur la Protection des Données).</p>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleAccordion(1)}
            className="w-full text-center text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            Mesures de sécurité
          </button>
          {openIndex === 1 && (
            <div className="p-4 bg-gray-900 text-gray-300 rounded">
              <p>
                Nous mettons en place des mesures de sécurité adaptées pour protéger vos données contre tout accès non autorisé, modification ou divulgation.
              </p>
              <p className="mt-2">Loi applicable : Loi Informatique et Libertés (France).</p>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleAccordion(2)}
            className="w-full text-center text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            Acceptation des pratiques
          </button>
          {openIndex === 2 && (
            <div className="p-4 bg-gray-900 text-gray-300 rounded">
              <p>
                En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.
              </p>
              <p className="mt-2">Loi applicable : Code civil (France).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolitiqueDeConfidentialite;
