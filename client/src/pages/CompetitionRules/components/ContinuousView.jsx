import React from "react";
import { cx, REGLEMENT } from "./reglementData";

/**
 * Composant ContinuousView - Vue de lecture continue
 */
export default function ContinuousView({ mode, setView, goTo }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className={cx("text-xl font-semibold", mode === "cine" ? "font-mono" : "")}>Lecture continue</h2>
          <p className="mt-1 text-xs text-white/60">
            Tous les articles sont affichés dans l'ordre pour une lecture linéaire.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("chapters")}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Revenir aux chapitres
        </button>
      </div>

      <div className="mt-6 space-y-8">
        {REGLEMENT.map((a) => (
          <section key={a.id} id={a.id} className="scroll-mt-24">
            <h3 className={cx("text-base font-semibold", mode === "cine" ? "font-mono" : "")}>{a.title}</h3>
            <div className={cx("mt-3 space-y-3 text-sm leading-relaxed text-white/80", mode === "cine" ? "font-mono" : "")}>
              {a.content}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => goTo(a.id)}
                className="text-sm underline underline-offset-4 text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
              >
                Ouvrir ce chapitre
              </button>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
