import React from "react";

/**
 * Composant AccessibilityInfo - Informations sur l'accessibilité
 */
export default function AccessibilityInfo() {
  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70 backdrop-blur">
      <p className="font-medium text-white/80">Accessibilité</p>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        <li>Tab pour naviguer, Entrée/Espace pour ouvrir un chapitre</li>
        <li>Le focus se place automatiquement sur le titre de l'article</li>
        <li>Utilisez "Lecture continue" pour lire tout le règlement</li>
      </ul>
    </div>
  );
}
