import React from "react";
import { cx } from "./reglementData";

/**
 * Composant ChapterView - Vue d'un seul chapitre
 */
export default function ChapterView({ active, mode, activeHeadingRef, setView }) {
  return (
    <article
      role="region"
      aria-labelledby={`${active.id}-title`}
      className={cx(
        "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur",
        "motion-reduce:transition-none motion-reduce:animate-none",
        "animate-[fadeIn_240ms_ease-out]"
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2
            id={`${active.id}-title`}
            ref={activeHeadingRef}
            tabIndex={-1}
            className={cx(
              "text-xl font-semibold rounded focus:outline-none focus:ring-2 focus:ring-white/30",
              mode === "cine" ? "font-mono" : ""
            )}
          >
            {active.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {active.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className={cx("mt-5 space-y-4 text-sm leading-relaxed text-white/85", mode === "cine" ? "font-mono" : "")}
      >
        {active.content}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView("continuous")}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Lecture continue
        </button>
      </div>
    </article>
  );
}
