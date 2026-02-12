import React from 'react';

const Mention = () => {
  return (
    <div className="p-4 bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-center text-white mb-6">Mentions Légales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl text-sm">
        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Nom et prénom du propriétaire</h2>
          <p className="text-gray-300">Jean Dupont</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Statut</h2>
          <p className="text-gray-300">Festival</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Adresse</h2>
          <p className="text-gray-300">123 Rue des Festivals,</p>
          <p className="text-gray-300">75000 Paris, France</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Numéro SIRET</h2>
          <p className="text-gray-300">123 456 789 00012</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Email de contact</h2>
          <p className="text-gray-300">contact@festival.com</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Directeur de la publication</h2>
          <p className="text-gray-300">Jean Dupont</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Hébergeur</h2>
          <p className="text-gray-300">Hébergeur Web,</p>
          <p className="text-gray-300">456 Avenue de l'Hébergement,</p>
          <p className="text-gray-300">75001 Paris, France</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Propriété intellectuelle</h2>
          <p className="text-gray-300">Tout le contenu de ce site est protégé</p>
          <p className="text-gray-300">par les lois sur la propriété intellectuelle.</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Données personnelles (RGPD)</h2>
          <p className="text-gray-300">Nous respectons la réglementation générale</p>
          <p className="text-gray-300">sur la protection des données (RGPD).</p>
        </section>

        <section className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">Cookies</h2>
          <p className="text-gray-300">Ce site utilise des cookies pour améliorer</p>
          <p className="text-gray-300">l'expérience utilisateur.</p>
        </section>
      </div>

      <section className="mt-6 text-center w-full max-w-3xl">
        <h2 className="text-base font-semibold text-white mb-1">Responsabilité</h2>
        <p className="text-gray-300">Le propriétaire du site décline toute responsabilité</p>
        <p className="text-gray-300">en cas d'erreurs ou d'omissions dans le contenu.</p>
      </section>
    </div>
  );
};

export default Mention;