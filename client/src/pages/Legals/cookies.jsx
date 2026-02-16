import React from 'react';

const Cookies = () => {
  return (
    <div className="cookies-policy p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Politique de Cookies</h1>
      <p className="mb-6">
        Ce site utilise des cookies pour améliorer votre expérience utilisateur et analyser le trafic.
        Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Utilisation des Cookies</h2>
      <p className="mb-4">
        Nous utilisons des cookies pour :
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Assurer le bon fonctionnement du site.</li>
        <li>Analyser les performances et l'utilisation du site.</li>
        <li>Personnaliser votre expérience utilisateur.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Gestion des Cookies</h2>
      <p className="mb-6">
        Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur. Vous pouvez également
        supprimer les cookies existants ou bloquer leur utilisation. Notez que certaines fonctionnalités du site
        peuvent être affectées si vous désactivez les cookies.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Contact</h2>
      <p>
        Si vous avez des questions concernant notre politique de cookies, vous pouvez nous contacter à l'adresse suivante :
        <a href="mailto:contact@monsite.com" className="text-blue-400 hover:underline">contact@monsite.com</a>
      </p>
    </div>
  );
};

export default Cookies;