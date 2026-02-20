import React from "react";

/**
 * Composant SearchBar - Barre de recherche avec compteur de résultats
 */
export default function SearchBar({ query, setQuery, filteredCount }) {
  return (
    <div className="relative mx-auto max-w-6xl px-4">
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <label htmlFor="reglement-search" className="sr-only">
            Rechercher dans le règlement
          </label>
          <input
            id="reglement-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (ex : sous-titres, format, droits...)"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>
    </div>
  );
}
