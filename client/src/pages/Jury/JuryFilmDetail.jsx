import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Loader2, MessageSquare, Send, ChevronRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

// Extrait l'ID YouTube depuis une URL standard ou raccourcie
const getYoutubeId = (url) => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
};

// Formate une date en "12 jan. 2026 · 14h37"
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d    = new Date(dateStr);
  const date = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
};

export default function JuryFilmDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [film, setFilm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Évaluation
  const [sentiment, setSentiment]   = useState(null);   // "LIKE" | "DISLIKE" | null
  const [rating, setRating]         = useState(5);      // 1-10
  const [suggestion, setSuggestion] = useState({ checked: false, comment: "", error: "" });
  const [voting, setVoting]         = useState(false);

  // Commentaires
  const [newComment, setNewComment]     = useState("");
  const [commenting, setCommenting]     = useState(false);
  const [commentError, setCommentError] = useState("");

  // Suggestion de modification
  const [sendingSuggestion, setSendingSuggestion] = useState(false);

  // Navigation inter-films
  const [allFilms, setAllFilms] = useState([]);

  // ── Fetch film détail ────────────────────────────────────
  const fetchFilm = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API}/jury/films/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors du chargement."); return; }
      setFilm(data);

      // Pré-remplir si vote existant
      const existing = data.votes?.[0];
      if (existing) {
        setSentiment(existing.sentiment);
        setRating(existing.rating ?? 5);
        const suggComment = existing.comments?.find(c => !c.isInternal);
        if (existing.suggestModification && suggComment) {
          setSuggestion({ checked: true, comment: suggComment.content, error: "" });
        }
      } else {
        // Réinitialiser si pas de vote (changement de film)
        setSentiment(null);
        setRating(5);
        setSuggestion({ checked: false, comment: "", error: "" });
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch liste complète pour navigation "film suivant"
  const fetchAllFilms = useCallback(async () => {
    try {
      const res = await fetch(`${API}/jury/films`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAllFilms(Array.isArray(data) ? data : []);
      }
    } catch { /* silently fail — navigation désactivée */ }
  }, []);

  useEffect(() => { fetchFilm(); }, [fetchFilm]);
  useEffect(() => { fetchAllFilms(); }, [fetchAllFilms]);

  // Prochain film : priorité aux non-votés, sinon le suivant dans la liste
  const nextFilm = useMemo(() => {
    const others = allFilms.filter(f => f.id !== parseInt(id));
    return others.find(f => !f.votes?.length) ?? others[0] ?? null;
  }, [allFilms, id]);

  // ── Handlers ─────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!sentiment) return;
    setVoting(true);
    try {
      await fetch(`${API}/jury/votes`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body:    JSON.stringify({ filmId: parseInt(id), sentiment, rating }),
      });
      await fetchFilm();
      await fetchAllFilms(); // Rafraîchit la liste pour recalculer nextFilm
    } finally {
      setVoting(false);
    }
  }, [sentiment, rating, id, fetchFilm, fetchAllFilms]);

  // Ref toujours à jour — évite les closures périmées dans le listener clavier
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  const handleSendSuggestion = async () => {
    if (suggestion.checked && !suggestion.comment.trim()) {
      setSuggestion(prev => ({ ...prev, error: "Un message est obligatoire." }));
      return;
    }
    const vote = film?.votes?.[0];
    if (!vote) return;
    setSendingSuggestion(true);
    try {
      await fetch(`${API}/jury/votes`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body:    JSON.stringify({
          filmId:              parseInt(id),
          sentiment:           vote.sentiment,
          rating:              vote.rating,
          suggestModification: suggestion.checked,
          comment:             suggestion.comment.trim() || null,
        }),
      });
      await fetchFilm();
    } finally {
      setSendingSuggestion(false);
    }
  };

  const handleRemoveVote = async () => {
    setVoting(true);
    try {
      await fetch(`${API}/jury/votes/${id}`, {
        method:  "DELETE",
        credentials: 'include',
      });
      setSentiment(null);
      setRating(5);
      setSuggestion({ checked: false, comment: "", error: "" });
      await fetchFilm();
      await fetchAllFilms();
    } finally {
      setVoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentError("");
    setCommenting(true);
    try {
      const res  = await fetch(`${API}/jury/votes/${id}/comments`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body:    JSON.stringify({ comment: newComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setCommentError(data.error || "Erreur lors de l'envoi."); return; }
      setNewComment("");
      await fetchFilm();
    } finally {
      setCommenting(false);
    }
  };

  // ── Raccourcis clavier ───────────────────────────────────
  const stateRef = useRef({});
  stateRef.current = { sentiment, rating, voting, nextFilm };

  useEffect(() => {
    const onKey = (e) => {
      const tag  = document.activeElement?.tagName;
      const type = document.activeElement?.type;
      if (tag === "TEXTAREA") return;
      if (tag === "INPUT" && type === "range") return;
      if (tag === "INPUT" && e.key !== "Escape") return;
      if ((e.metaKey || e.ctrlKey) && e.key !== "Escape") return;

      const st = stateRef.current;

      switch (e.key) {
        case "l": case "L":
          e.preventDefault();
          setSentiment(s => s === "LIKE" ? null : "LIKE");
          break;
        case "d": case "D":
          e.preventDefault();
          setSentiment(s => s === "DISLIKE" ? null : "DISLIKE");
          break;
        case "ArrowUp":
          e.preventDefault();
          setRating(r => Math.min(10, r + 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setRating(r => Math.max(1, r - 1));
          break;
        case "Enter":
          if (!st.voting && st.sentiment) {
            e.preventDefault();
            handleSubmitRef.current();
          }
          break;
        case "Escape":
          navigate("/jury/dashboard");
          break;
        case "ArrowRight":
          if (st.nextFilm) {
            e.preventDefault();
            navigate(`/jury/film/${st.nextFilm.id}`);
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // ── États de chargement / erreur ─────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-text-faint)', marginRight: '0.75rem' }} />
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Chargement...</span>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'var(--font-sans)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{error || "Film introuvable."}</p>
        <button
          onClick={() => navigate("/jury/dashboard")}
          style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
          onMouseLeave={e => e.currentTarget.style.color = '#10b981'}
        >
          ← Retour au dashboard
        </button>
      </div>
    );
  }

  const currentVote      = film.votes?.[0];
  const youtubeId        = getYoutubeId(film.youtubeUrl);
  const internalComments = currentVote?.comments
    ?.filter(c => c.isInternal)
    .slice()
    .reverse() ?? [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(15,15,15,0.95)', borderBottom: '1px solid var(--color-border)', padding: 'clamp(0.875rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)' }}
      >
        <div style={{ maxWidth: '88rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Retour */}
          <button
            onClick={() => navigate("/jury/dashboard")}
            style={{ color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
            title="Retour (Esc)"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Titre film */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', letterSpacing: '-0.02em', textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {film.title}
            </h1>
            <p className="label-overline" style={{ marginTop: '0.25rem' }}>
              {film.country}
              {film.submitter && (
                <span style={{ color: 'var(--color-text-faint)', marginLeft: '0.5rem' }}>
                  · {film.submitter.firstName} {film.submitter.lastName}
                </span>
              )}
            </p>
          </div>

          {/* Badge vote courant */}
          {currentVote ? (
            <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-2 shrink-0
              ${currentVote.sentiment === "LIKE"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
              {currentVote.sentiment === "LIKE" ? "✓ Like" : "✕ Dislike"} · {currentVote.rating}/10
            </span>
          ) : (
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', flexShrink: 0 }}>
              À évaluer
            </span>
          )}

          {/* Bouton Film suivant */}
          {nextFilm && (
            <button
              onClick={() => navigate(`/jury/film/${nextFilm.id}`)}
              className="hidden sm:flex items-center gap-1.5 shrink-0"
              style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', background: 'none', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              title="Film suivant (→)"
            >
              <span style={{ maxWidth: '7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextFilm.title}</span>
              <ChevronRight size={10} />
            </button>
          )}
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main style={{ maxWidth: '88rem', margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ── COLONNE GAUCHE ─────────────────────────────── */}
          <div className="space-y-6">

            {/* Player YouTube */}
            <div style={{ aspectRatio: '16/9', background: 'var(--color-bg-pure)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={film.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-faint)', fontSize: '0.875rem' }}>
                  Vidéo non disponible
                </div>
              )}
            </div>

            {/* Métadonnées */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }} className="space-y-4">
              <p className="label-overline">À propos</p>
              {film.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{film.description}</p>
              )}
              <div className="grid grid-cols-2 gap-6 pt-1">
                {film.country && (
                  <div>
                    <p className="label-overline" style={{ marginBottom: '0.25rem' }}>Pays</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{film.country}</p>
                  </div>
                )}
                {film.aiToolsUsed && (
                  <div>
                    <p className="label-overline" style={{ marginBottom: '0.25rem' }}>Outils IA</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{film.aiToolsUsed}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── COMMENTAIRES INTERNES ─────────────────────── */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }} className="space-y-5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="label-overline" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MessageSquare size={12} />
                  Commentaires
                  {internalComments.length > 0 && (
                    <span style={{ color: 'var(--color-text-faint)', fontStyle: 'normal' }}>({internalComments.length})</span>
                  )}
                </p>
                <span className="label-overline">Admin uniquement</span>
              </div>

              {currentVote ? (
                <div className="space-y-3">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <textarea
                      rows={2}
                      placeholder="Ajouter une observation, un contexte, une analyse…"
                      value={newComment}
                      onChange={e => { setNewComment(e.target.value); setCommentError(""); }}
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddComment();
                      }}
                      style={{ flex: 1, background: 'transparent', border: '1px solid var(--color-border)', padding: '0.625rem 0.75rem', fontSize: '0.875rem', color: 'var(--color-text)', outline: 'none', resize: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                      className="placeholder:text-text-faint"
                      onFocus={e => e.target.style.borderColor = '#10b981'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commenting}
                      style={{ padding: '0 1rem', background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                      className="disabled:opacity-30"
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-high)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                      title="Envoyer (Ctrl+Entrée)"
                    >
                      {commenting
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Send size={14} />
                      }
                    </button>
                  </div>
                  {commentError && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171' }}>{commentError}</p>
                  )}
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>Ctrl + Entrée pour envoyer</p>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Votez d&apos;abord pour pouvoir laisser un commentaire.
                </p>
              )}

              {internalComments.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }} className="space-y-3">
                  {internalComments.map(c => (
                    <div key={c.id} className="space-y-1.5">
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', fontFamily: 'monospace' }}>
                        {formatDateTime(c.createdAt)}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', padding: '0.75rem 1rem', lineHeight: 1.75 }}>
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {currentVote && internalComments.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
                  Aucun commentaire pour l&apos;instant.
                </p>
              )}
            </div>

            {/* ── SUGGESTION DE MODIFICATION ────────────────── */}
            {/* Orange conservé — sémantique */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }} className="space-y-5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="label-overline" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MessageSquare size={12} />
                  Suggestion de modification
                </p>
                <span className="label-overline">Transmis à l&apos;admin</span>
              </div>

              {currentVote ? (
                <div className="space-y-4">
                  {currentVote.suggestModification && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#fb923c' }}>
                      <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />
                      Suggestion active — l&apos;admin a été notifié
                    </div>
                  )}

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={suggestion.checked}
                      onChange={e => setSuggestion(prev => ({
                        ...prev,
                        checked: e.target.checked,
                        error:   "",
                      }))}
                      className="accent-orange-500"
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>
                      {suggestion.checked ? "Retirer la suggestion" : "Suggérer des modifications"}
                    </span>
                  </label>

                  {suggestion.checked && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea
                        rows={3}
                        placeholder="Décrivez précisément les modifications souhaitées…"
                        value={suggestion.comment}
                        onChange={e => setSuggestion(prev => ({
                          ...prev,
                          comment: e.target.value,
                          error:   "",
                        }))}
                        onKeyDown={e => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendSuggestion();
                        }}
                        className="flex-1 bg-black/30 border border-orange-500/30
                                   focus:border-orange-500/50 focus:outline-none
                                   px-3 py-2.5 text-sm text-text
                                   placeholder:text-text-faint resize-none transition-colors"
                      />
                      <button
                        onClick={handleSendSuggestion}
                        disabled={sendingSuggestion}
                        className="px-4 bg-orange-500/10 border border-orange-500/30
                                   hover:bg-orange-500/20 hover:border-orange-500/50
                                   text-orange-400 hover:text-orange-300
                                   transition-all disabled:opacity-30"
                        title="Envoyer (Ctrl+Entrée)"
                      >
                        {sendingSuggestion
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Send size={14} />
                        }
                      </button>
                    </div>
                  )}

                  {!suggestion.checked && currentVote.suggestModification && (
                    <button
                      onClick={handleSendSuggestion}
                      disabled={sendingSuggestion}
                      style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                    >
                      {sendingSuggestion
                        ? <Loader2 size={12} className="animate-spin inline" />
                        : "Retirer la suggestion"}
                    </button>
                  )}

                  {suggestion.error && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171' }}>{suggestion.error}</p>
                  )}
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>Ctrl + Entrée pour envoyer</p>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Votez d&apos;abord pour pouvoir suggérer une modification.
                </p>
              )}
            </div>

          </div> {/* fin colonne gauche */}

          {/* ── COLONNE DROITE — Panel évaluation ────────────── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }} className="space-y-6">

              {/* En-tête */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="label-overline">Votre évaluation</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                  L · D · ↑↓ · ↵
                </p>
              </div>

              {/* LIKE / DISLIKE */}
              <div className="space-y-3">
                <p className="label-overline">Sentiment</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSentiment(s => s === "LIKE" ? null : "LIKE")}
                    title="Like (L)"
                    className={`flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest border transition-all
                      ${sentiment === "LIKE" ? "bg-green-500/15 border-green-500/40 text-green-400" : ""}`}
                    style={sentiment !== "LIKE" ? { background: 'var(--color-surface-high)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' } : {}}
                    onMouseEnter={e => { if (sentiment !== "LIKE") { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.color = 'var(--color-text)'; }}}
                    onMouseLeave={e => { if (sentiment !== "LIKE") { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}}
                  >
                    <ThumbsUp size={14} />
                    Like
                  </button>
                  <button
                    onClick={() => setSentiment(s => s === "DISLIKE" ? null : "DISLIKE")}
                    title="Dislike (D)"
                    className={`flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest border transition-all
                      ${sentiment === "DISLIKE" ? "bg-red-500/15 border-red-500/40 text-red-400" : ""}`}
                    style={sentiment !== "DISLIKE" ? { background: 'var(--color-surface-high)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' } : {}}
                    onMouseEnter={e => { if (sentiment !== "DISLIKE") { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.color = 'var(--color-text)'; }}}
                    onMouseLeave={e => { if (sentiment !== "DISLIKE") { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}}
                  >
                    <ThumbsDown size={14} />
                    Dislike
                  </button>
                </div>
              </div>

              {/* Slider Note 1-10 */}
              <div className="space-y-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p className="label-overline">Note</p>
                  <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1 }}>
                    {rating}
                    <span style={{ color: 'var(--color-text-faint)', fontSize: '0.875rem' }}>/10</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={rating}
                  onChange={e => setRating(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }}
                  title="Note (↑ ↓ quand le slider n'est pas actif)"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-text-faint)', fontFamily: 'monospace' }}>
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Bouton soumettre — accent emerald */}
              <button
                onClick={handleSubmit}
                disabled={!sentiment || voting}
                title="Soumettre (Entrée)"
                style={{ width: '100%', padding: '1rem', fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#059669', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                className="disabled:opacity-30"
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#10b981'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
              >
                {voting
                  ? <Loader2 size={15} className="animate-spin" />
                  : currentVote
                    ? "Modifier l'évaluation"
                    : "Soumettre l'évaluation"
                }
              </button>

              {/* Annuler vote */}
              {currentVote && !voting && (
                <button
                  onClick={handleRemoveVote}
                  style={{ width: '100%', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                >
                  Annuler mon vote
                </button>
              )}
            </div>

            {/* Récapitulatif vote */}
            {currentVote && (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem 1.25rem' }} className="space-y-2">
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Vote enregistré · {formatDateTime(currentVote.updatedAt)}
                </p>
                {currentVote.suggestModification && (
                  <p className="text-[11px] text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={9} /> Suggestion envoyée à l&apos;admin
                  </p>
                )}
                {internalComments.length > 0 && (
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {internalComments.length} commentaire{internalComments.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Aide raccourcis clavier */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem 1.25rem' }}>
              <p className="label-overline" style={{ marginBottom: '1rem' }}>Raccourcis</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  ["L", "Like"],
                  ["D", "Dislike"],
                  ["↑ ↓", "Note ±1"],
                  ["↵", "Soumettre"],
                  ["→", "Film suivant"],
                  ["Esc", "Retour"],
                ].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <kbd style={{ fontSize: '0.625rem', fontFamily: 'monospace', background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', padding: '0.125rem 0.375rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                      {key}
                    </kbd>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div> {/* fin colonne droite */}

        </div>
      </main>
    </div>
  );
}
