import React from 'react';

const ReglesConditions = () => {
  return (
    <div className="regles-conditions flex items-center justify-center min-h-screen bg-black text-center">
      <div className="max-w-4xl p-6 bg-gray-900 shadow-md rounded-md flex flex-col items-center justify-center border-4 border-purple-500">
        <h1 className="text-3xl font-serif italic text-purple-500 mb-4">Règles & Conditions</h1>
        <p className="text-lg font-serif italic text-gray-300 mb-4">Bienvenue sur notre plateforme. Cette page a pour objectif de définir les règles d’utilisation de nos services ainsi que les conditions générales applicables à tous les utilisateurs.</p>
        <p className="text-lg font-serif italic text-gray-300 mb-4">En accédant à notre site et en utilisant nos services, vous acceptez pleinement et sans réserve les présentes règles et conditions. Celles-ci encadrent notamment :</p>
        <ul className="list-disc list-inside text-left text-lg font-serif italic text-purple-500 mb-4">
          <li>Les modalités d’accès au site</li>
          <li>Les conditions d’utilisation des services proposés</li>
          <li>Les droits et obligations des utilisateurs</li>
          <li>La protection des données personnelles</li>
          <li>Les responsabilités et limitations</li>
          <li>Les conditions de paiement et de remboursement (le cas échéant)</li>
        </ul>
        <p className="text-lg font-serif italic text-gray-300 mb-4">Nous nous réservons le droit de modifier ces règles à tout moment afin de garantir la conformité légale et l’amélioration continue de nos services. Il est donc recommandé de consulter cette page régulièrement.</p>
        <p className="text-lg font-serif italic text-gray-300">En cas de non-respect des présentes conditions, nous nous réservons le droit de suspendre ou de supprimer l’accès au service.</p>
      </div>
    </div>
  );
};

export default ReglesConditions;