import React from "react";
import ChapterButton from "./ChapterButton";

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

      <style>{`
        .chapters-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .chapters-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .chapters-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.6));
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
        }

        .chapters-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(251, 191, 36, 1), rgba(245, 158, 11, 0.8));
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
        }

        /* Firefox */
        .chapters-scroll {
          scrollbar-color: rgba(251, 191, 36, 0.8) rgba(255, 255, 255, 0.05);
          scrollbar-width: thin;
        }
      `}</style>
    </nav>
  );
}
