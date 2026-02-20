import React, { useEffect, useMemo, useRef, useState } from "react";
import { REGLEMENT } from "./components/reglementData";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ChaptersList from "./components/ChaptersList";
import AccessibilityInfo from "./components/AccessibilityInfo";
import ChapterView from "./components/ChapterView";
import ContinuousView from "./components/ContinuousView";


export default function ReglementDVDPage() {
  const [mode, setMode] = useState("cine"); // "cine" | "classic"
  const [view, setView] = useState("chapters"); // "chapters" | "continuous"
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(REGLEMENT[0].id);

  const contentTopRef = useRef(null);
  const activeHeadingRef = useRef(null);
  const liveRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGLEMENT;
    return REGLEMENT.filter((a) => {
      const text = `${a.title} ${a.tags.join(" ")} ${a.id}`.toLowerCase();
      return text.includes(q);
    });
  }, [query]);

  const active = useMemo(() => {
    return REGLEMENT.find((a) => a.id === activeId) ?? REGLEMENT[0];
  }, [activeId]);

  // Hash -> article
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (hash && REGLEMENT.some((a) => a.id === hash)) {
      setActiveId(hash);
    }
  }, []);

  // Update URL hash on activeId
  useEffect(() => {
    window.history.replaceState(null, "", `#${activeId}`);
  }, [activeId]);

  // Focus management (lecteurs d'écran + clavier)
  useEffect(() => {
    if (view !== "chapters") return;
    activeHeadingRef.current?.focus();
    if (liveRef.current) {
      liveRef.current.textContent = `${active.title} affiché`;
    }
  }, [activeId, view, active.title]);

  const goTo = (id) => {
    setView("chapters");
    setActiveId(id);
    requestAnimationFrame(() => {
      contentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Skip link (clavier) */}
      <a
        href="#reglement-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Aller au contenu principal
      </a>

      {/* Ambiance projecteur (visuel uniquement) */}
      <div className="pointer-events-none fixed inset-0 opacity-40 motion-reduce:opacity-25">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      {/* Live region (lecteurs d'écran) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRef} />

      <Header mode={mode} setMode={setMode} view={view} setView={setView} />

      <SearchBar query={query} setQuery={setQuery} filteredCount={filtered.length} />

      <main
        id="reglement-main"
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-16 md:grid-cols-12"
      >
        {/* NAV / Sommaire */}
        <aside className="md:col-span-4">
          <ChaptersList 
            filtered={filtered} 
            activeId={activeId} 
            view={view} 
            mode={mode} 
            onGoTo={goTo} 
          />
          <AccessibilityInfo />
        </aside>

        {/* CONTENU */}
        <section ref={contentTopRef} className="md:col-span-8">
          {view === "chapters" ? (
            <ChapterView 
              active={active} 
              mode={mode} 
              activeHeadingRef={activeHeadingRef} 
              setView={setView} 
            />
          ) : (
            <ContinuousView mode={mode} setView={setView} goTo={goTo} />
          )}
        </section>

        {/* Keyframes (fade) */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    </div>
  );
}
