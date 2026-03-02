import React from "react";

const ConditionsUtilisations = () => {
  return (
    <div className="terms-of-use bg-black text-white p-8 rounded-lg shadow-md font-serif italic flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Conditions d'Utilisation</h1>
      <div className="space-y-6 leading-relaxed text-center max-w-3xl">
        <p>
          Les présentes Conditions d’Utilisation ont pour objectif de définir les règles d’accès et d’utilisation du site. En naviguant sur ce site, l’utilisateur accepte pleinement et sans réserve les conditions décrites ci-dessous.
        </p>
        <p>
          L’utilisateur s’engage à utiliser le site de manière responsable, légale et respectueuse des autres. Toute utilisation frauduleuse, abusive ou contraire aux lois en vigueur est strictement interdite.
        </p>
        <p>
          Le site se réserve le droit de modifier, suspendre ou supprimer tout ou partie de ses services à tout moment, sans préavis. Les utilisateurs sont invités à consulter régulièrement cette page afin de prendre connaissance des éventuelles mises à jour.
        </p>
        <p>
          En cas de non-respect des présentes conditions, l’accès au site pourra être restreint ou supprimé.
        </p>
      </div>
    </div>
  );
};

export default ConditionsUtilisations;