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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(15,15,15,0.95)', borderBottom: '1px solid var(--color-border)', padding: 'clamp(0.875rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)' }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', letterSpacing: '-0.02em', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
              Espace <span style={{ color: '#10b981' }}>Jury</span>
            </h1>
            <p className="label-overline" style={{ marginTop: '0.25rem' }}>MARSAI Festival · Session 2026</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{user.firstName} {user.lastName}</p>
              <p className="label-overline" style={{ marginTop: '0.125rem' }}>Jury</p>
            </div>
            <button
              onClick={handleLogout}
              style={{ fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', background: 'none', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)' }}>

        {/* ── Header éditorial section ── */}
        <header style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: '#10b981', flexShrink: 0 }} />
            <span className="label-overline">Évaluation</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1, marginBottom: '0.75rem' }}>
            Films en <span style={{ color: '#10b981' }}>évaluation</span>
          </h2>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {voted} évalué{voted > 1 ? "s" : ""} · {remaining} restant{remaining > 1 ? "s" : ""}
          </p>

          {/* Barre de progression 2 segments */}
          {films.length > 0 && (
            <div style={{ display: 'flex', height: '2px' }}>
              <div
                style={{ background: '#10b981', flex: voted, transition: 'flex 0.5s' }}
              />
              <div
                style={{ background: 'var(--color-border)', flex: remaining || 0.001 }}
              />
            </div>
          )}
        </header>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'var(--color-text-faint)' }}>
            <Loader2 size={20} className="animate-spin" style={{ marginRight: '0.75rem' }} />
            <span style={{ fontSize: '0.875rem' }}>Chargement des films...</span>
          </div>
        ) : films.length === 0 ? (
          <div style={{ border: '1px solid var(--color-border)', padding: '5rem 2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>Aucun film à évaluer pour le moment.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-text-faint)' }}>
              Revenez lorsque des films vous auront été assignés.
            </p>
          </div>
        ) : (
          <>
            {/* En-tête colonnes */}
            <div className="hidden sm:grid grid-cols-[2rem_1fr_7rem_5rem_7rem] gap-6 items-center px-4 pb-3">
              {['#', 'Film', 'Pays', 'Statut', 'Vote'].map(h => (
                <span key={h} className="label-overline">{h}</span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              {sortedFilms.map((film, i) => {
                const currentVote = film.votes?.[0];

                return (
                  <div
                    key={film.id}
                    onClick={() => navigate(`/jury/film/${film.id}`)}
                    className="grid grid-cols-[2rem_1fr_7rem_5rem_7rem] gap-6 items-center px-4 py-5 cursor-pointer group"
                    style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Numéro */}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Titre + réalisateur */}
                    <div className="min-w-0">
                      <p className="font-black text-sm uppercase tracking-tight leading-tight truncate group-hover:text-emerald-400 transition-colors">
                        {film.title}
                      </p>
                      {film.submitter && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {film.submitter.firstName} {film.submitter.lastName}
                        </p>
                      )}
                    </div>

                    {/* Pays */}
                    <span className="hidden sm:block" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.country}</span>

                    {/* Statut film */}
                    <span className="hidden sm:block" style={{ fontSize: '0.6875rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      {film.status}
                    </span>

                    {/* Badge vote */}
                    {currentVote ? (
                      <span className={`inline-flex items-center text-[11px] font-black uppercase tracking-widest px-3 py-1 w-fit
                        ${currentVote.sentiment === "LIKE"
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                        {currentVote.sentiment === "LIKE" ? "✓ Like" : "✕ Dislike"}
                      </span>
                    ) : (
                      <span
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.25rem 0.75rem', whiteSpace: 'nowrap' }}
                      >
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
