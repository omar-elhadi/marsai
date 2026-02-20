import React from "react";
import { REGLEMENT_TITLE } from "./reglementData";

/**
 * Composant Header - En-tête de la page avec titre et boutons de contrôle
 */
export default function Header({ mode, setMode, view, setView, onCopyLink }) {
  return (
    <header className="relative mx-auto max-w-6xl px-4 pt-10 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.35em] text-white/60">FESTIVAL • RÈGLEMENT OFFICIEL</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{REGLEMENT_TITLE}</h1>
        
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "cine" ? "classic" : "cine"))}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Mode : <span className="font-medium">{mode === "cine" ? "Cinéma" : "Classique"}</span>
          </button>

          <button
            type="button"
            onClick={() => setView((v) => (v === "chapters" ? "continuous" : "chapters"))}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-pressed={view === "continuous"}
          >
            {view === "continuous" ? "Voir par chapitres" : "Lecture continue"}
          </button>

          <button
            type="button"
            onClick={onCopyLink}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Copier le lien
          </button>
        </div>
      </div>
    </header>
  );
}
