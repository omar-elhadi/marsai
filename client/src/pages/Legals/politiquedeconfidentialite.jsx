import { useState } from "react";

function PolitiqueDeConfidentialite() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="privacy-policy bg-black text-white p-8 rounded-lg shadow-md font-serif">
      <h1 className="text-3xl font-bold mb-6 bg-black text-purple-500 p-4 rounded text-center italic">Politique de Confidentialité</h1>
      <div className="space-y-6 leading-relaxed">
        <div>
          <button
            onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
            className="w-full text-left text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 border-4 border-purple-500"
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
            onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
            className="w-full text-left text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 border-4 border-purple-500"
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
            onClick={() => setOpenIndex(openIndex === 2 ? null : 2)}
            className="w-full text-left text-gray-300 font-bold py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 border-4 border-purple-500"
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