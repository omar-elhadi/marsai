import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function JuryDashboard() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [films, setFilms]     = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth
  useEffect(() => {
    const saved = localStorage.getItem("marsai_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const token = localStorage.getItem("marsai_token");

  // Chargement des films assignés
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("marsai_token");
    localStorage.removeItem("marsai_user");
    navigate("/");
  };

  if (!user) return null;

  const voted     = films.filter(f => f.votes?.length > 0).length;
  const remaining = films.length - voted;

  // Tri : films non votés en premier, puis alphabétique dans chaque groupe
  const sortedFilms = [...films].sort((a, b) => {
    const aVoted = (a.votes?.length ?? 0) > 0;
    const bVoted = (b.votes?.length ?? 0) > 0;
    if (aVoted !== bVoted) return aVoted ? 1 : -1;
    return a.title.localeCompare(b.title, "fr");
  });

  return (
    <div className="min-h-screen bg-[#111827] text-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-[#111827]/95 backdrop-blur border-b border-white/10 px-6 md:px-8 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter italic">
              Espace <span className="text-indigo-400">Jury</span>
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
              MARSAI Festival · Session 2026
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Jury</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest text-white/40 hover:text-white
                         border border-white/15 hover:border-white/30 px-4 py-2 transition-colors"
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 md:px-8 py-10">

        {/* Titre + progression */}
        <div className="mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-2">
            Films en <span className="text-indigo-400">évaluation</span>
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {voted} évalué{voted > 1 ? "s" : ""} · {remaining} restant{remaining > 1 ? "s" : ""}
          </p>

          {/* Barre de progression 2 segments */}
          {films.length > 0 && (
            <div className="flex h-0.5">
              <div
                className="bg-indigo-500 transition-all duration-500"
                style={{ flex: voted }}
              />
              <div
                className="bg-white/15"
                style={{ flex: remaining || 0.001 }}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-white/40">
            <Loader2 size={20} className="animate-spin mr-3" />
            <span className="text-sm">Chargement des films...</span>
          </div>
        ) : films.length === 0 ? (
          <div className="border border-white/15 p-20 text-center">
            <p className="text-base text-white/60 font-light">Aucun film à évaluer pour le moment.</p>
            <p className="text-sm mt-2 text-white/40">
              Revenez lorsque des films vous auront été assignés.
            </p>
          </div>
        ) : (
          <>
            {/* En-tête colonnes */}
            <div className="grid grid-cols-[2rem_1fr_7rem_5rem_7rem] gap-6 items-center px-4 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">#</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Film</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Pays</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Statut</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Vote</span>
            </div>

            <div className="border-t border-white/10">
              {sortedFilms.map((film, i) => {
                const currentVote = film.votes?.[0];

                return (
                  <div
                    key={film.id}
                    onClick={() => navigate(`/jury/film/${film.id}`)}
                    className="grid grid-cols-[2rem_1fr_7rem_5rem_7rem] gap-6 items-center
                               px-4 py-5 border-b border-white/10
                               hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    {/* Numéro */}
                    <span className="font-mono text-xs text-white/40 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Titre + réalisateur */}
                    <div className="min-w-0">
                      <p className="font-black text-sm uppercase tracking-tight leading-tight truncate
                                    group-hover:text-indigo-300 transition-colors">
                        {film.title}
                      </p>
                      {film.submitter && (
                        <p className="text-xs text-white/45 mt-0.5 truncate">
                          {film.submitter.firstName} {film.submitter.lastName}
                        </p>
                      )}
                    </div>

                    {/* Pays */}
                    <span className="text-xs text-white/50 truncate">{film.country}</span>

                    {/* Statut film */}
                    <span className="text-[11px] text-indigo-400 uppercase tracking-wider font-bold">
                      {film.status}
                    </span>

                    {/* Badge vote */}
                    {currentVote ? (
                      <span className={`inline-flex items-center text-[11px] font-black uppercase tracking-widest
                                       px-3 py-1 w-fit
                                       ${currentVote.sentiment === "LIKE"
                                         ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                         : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                        {currentVote.sentiment === "LIKE" ? "✓ Like" : "✕ Dislike"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-white/40
                                       border border-white/15 px-3 py-1 w-fit
                                       group-hover:border-white/30 group-hover:text-white/60 transition-colors">
                        À évaluer
                        <ChevronRight size={9} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
