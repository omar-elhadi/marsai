import React from "react";

const PolitiqueDeConfidentialite = () => {
  return (
    <div className="privacy-policy bg-gray-100 text-gray-900 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 bg-black text-black p-4 rounded">Politique de Confidentialité</h1>
      <p className="text-gray-700 mb-4">
        Les données collectées peuvent inclure des informations telles que votre nom, votre adresse email ou vos données de navigation. Ces informations sont utilisées uniquement dans le but d’améliorer nos services et ne sont jamais vendues à des tiers.
      </p>
      <p className="text-gray-700 mb-4">
        Nous mettons en place des mesures de sécurité adaptées pour protéger vos données contre tout accès non autorisé, modification ou divulgation.
      </p>
      <p className="text-gray-700">
        En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.
      </p>
    </div>
  );
};

export default PolitiqueDeConfidentialite;