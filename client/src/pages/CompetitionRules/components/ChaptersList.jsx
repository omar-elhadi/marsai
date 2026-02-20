import React from "react";
import ChapterButton from "./ChapterButton";
import "@/styles/scrollbar.css";

/**
 * Composant ChaptersList - Liste de navigation des chapitres
 */
export default function ChaptersList({ filtered, activeId, view, mode, onGoTo }) {
  return (
    <nav
      aria-label="Sommaire du règlement"
      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <p className="text-xs tracking-[0.25em] text-white/60">MENU DVD • CHAPITRES</p>
        <span className="text-[11px] text-white/60">{view === "continuous" ? "CONTINU" : "CHAPITRES"}</span>
      </div>

      <ul className="chapters-scroll max-h-[60vh] overflow-auto pr-1 space-y-1">
        {filtered.map((a) => {
          const isActive = a.id === activeId && view === "chapters";
          return (
            <li key={a.id}>
              <ChapterButton article={a} isActive={isActive} mode={mode} onClick={onGoTo} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
