import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Play, Loader2, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function JuryDashboard() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [films, setFilms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting]   = useState(null); // id du film en cours de vote

  // --- Auth : lecture du profil en localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem("marsai_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const token = localStorage.getItem("token");

  // --- Chargement des films FINALIST/SELECTION avec vote courant ---
  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/jury/films`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (user) fetchFilms(); }, [user, fetchFilms]);

  // --- Vote (LIKE ou DISLIKE) — upsert côté API ---
  const handleVote = async (filmId, sentiment) => {
    setVoting(filmId);
    try {
      await fetch(`${API}/jury/votes`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ filmId, sentiment }),
      });
      await fetchFilms();
    } finally {
      setVoting(null);
    }
  };

  // --- Annuler son vote ---
  const handleRemoveVote = async (filmId) => {
    setVoting(filmId);
    try {
      await fetch(`${API}/jury/votes/${filmId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFilms();
    } finally {
      setVoting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("marsai_user");
    navigate("/");
  };

  if (!user) return null;

  // Statistiques rapides
  const voted    = films.filter(f => f.votes?.length > 0).length;
  const remaining = films.length - voted;

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-black/95 backdrop-blur border-b border-white/5 px-6 md:px-10 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter italic">
              Espace <span className="text-indigo-500">Jury</span>
            </h1>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
              MARSAI Festival · Session 2026
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Compteur votes */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 font-mono">
              <span>
                <span className="text-indigo-400 font-bold">{voted}</span> votés
              </span>
              <span className="text-white/10">·</span>
              <span>
                <span className="text-white/60 font-bold">{remaining}</span> restants
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Jury</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 transition-colors"
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">

        {/* Titre section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">
            Films en <span className="text-indigo-500">sélection</span>
          </h2>
          <p className="text-white/30 text-sm mt-1">
            Évaluez chaque film. Votre avis guide les décisions finales.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-white/30">
            <Loader2 size={24} className="animate-spin mr-3" />
            Chargement des films...
          </div>
        ) : films.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded p-20 text-center text-white/30">
            <p className="text-lg font-light">Aucun film en sélection pour le moment.</p>
            <p className="text-sm mt-2 text-white/20">Revenez lorsque la liste sera publiée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((film) => {
              const currentVote = film.votes?.[0]; // undefined si pas voté
              const isVoting    = voting === film.id;

              return (
                <div
                  key={film.id}
                  className={`bg-[#0D0D0D] border rounded-sm transition-all duration-200 overflow-hidden
                    ${currentVote ? "border-white/15" : "border-white/5 hover:border-white/10"}`}
                >
                  {/* Badge statut vote */}
                  <div className="flex justify-between items-center px-4 pt-3 pb-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm
                      ${film.status === "FINALIST"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-indigo-500/10 text-indigo-400"}`}>
                      {film.status}
                    </span>
                    {currentVote && (
                      <span className={`text-[9px] font-black uppercase tracking-widest
                        ${currentVote.sentiment === "LIKE" ? "text-green-400" : "text-red-400"}`}>
                        {currentVote.sentiment === "LIKE" ? "✓ LIKE" : "✕ DISLIKE"}
                      </span>
                    )}
                  </div>

                  {/* Infos film */}
                  <div className="px-4 py-3">
                    <h3 className="font-black text-white text-base uppercase tracking-tight leading-tight">
                      {film.title}
                    </h3>
                    <p className="text-white/40 text-xs mt-1">
                      {film.country}
                      {film.submitter && (
                        <span className="ml-2 text-white/20">
                          · {film.submitter.firstName} {film.submitter.lastName}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Lien YouTube */}
                  {film.youtubeUrl && (
                    <div className="px-4 pb-3">
                      <a
                        href={film.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors"
                      >
                        <Play size={12} />
                        Voir le film
                      </a>
                    </div>
                  )}

                  {/* Séparateur */}
                  <div className="border-t border-white/5 mx-4" />

                  {/* Boutons vote */}
                  <div className="px-4 py-3">
                    {isVoting ? (
                      <div className="flex justify-center py-2">
                        <Loader2 size={18} className="animate-spin text-white/30" />
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {/* LIKE */}
                        <button
                          onClick={() =>
                            currentVote?.sentiment === "LIKE"
                              ? handleRemoveVote(film.id)
                              : handleVote(film.id, "LIKE")
                          }
                          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all
                            ${currentVote?.sentiment === "LIKE"
                              ? "bg-green-500/20 text-green-400 border border-green-500/40"
                              : "bg-white/5 text-white/40 hover:bg-green-500/10 hover:text-green-400 border border-transparent hover:border-green-500/20"}`}
                        >
                          <ThumbsUp size={13} />
                          Like
                        </button>

                        {/* DISLIKE */}
                        <button
                          onClick={() =>
                            currentVote?.sentiment === "DISLIKE"
                              ? handleRemoveVote(film.id)
                              : handleVote(film.id, "DISLIKE")
                          }
                          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all
                            ${currentVote?.sentiment === "DISLIKE"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"}`}
                        >
                          <ThumbsDown size={13} />
                          Dislike
                        </button>

                        {/* Annuler vote si voté */}
                        {currentVote && (
                          <button
                            onClick={() => handleRemoveVote(film.id)}
                            title="Annuler le vote"
                            className="p-2 text-white/20 hover:text-white/50 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
