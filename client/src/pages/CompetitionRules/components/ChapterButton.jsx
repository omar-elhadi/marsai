import React from "react";
import { cx } from "./reglementData";

/**
 * Composant ChapterButton - Bouton pour un chapitre individuel
 */
export default function ChapterButton({ article, isActive, mode, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(article.id)}
      aria-current={isActive ? "true" : undefined}
      className={cx(
        "w-full rounded-xl px-3 py-2 text-left text-sm transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        "motion-reduce:transition-none",
        isActive ? "bg-white/15 ring-1 ring-white/20" : "hover:bg-white/10 text-white/85"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={mode === "cine" ? "font-mono" : ""}>{article.title}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {article.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-white/70"
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}
