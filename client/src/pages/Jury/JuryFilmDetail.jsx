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
  const token    = localStorage.getItem("marsai_token");

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
      const res  = await fetch(`${API}/jury/films/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  }, [id, token]);

  // Fetch liste complète pour navigation "film suivant"
  const fetchAllFilms = useCallback(async () => {
    try {
      const res = await fetch(`${API}/jury/films`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllFilms(Array.isArray(data) ? data : []);
      }
    } catch { /* silently fail — navigation désactivée */ }
  }, [token]);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ filmId: parseInt(id), sentiment, rating }),
      });
      await fetchFilm();
      await fetchAllFilms(); // Rafraîchit la liste pour recalculer nextFilm
    } finally {
      setVoting(false);
    }
  }, [sentiment, rating, token, id, fetchFilm, fetchAllFilms]);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ content: newComment.trim() }),
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
  // Ref partagé — mise à jour à chaque render pour lire les valeurs actuelles
  const stateRef = useRef({});
  stateRef.current = { sentiment, rating, voting, nextFilm };

  useEffect(() => {
    const onKey = (e) => {
      const tag  = document.activeElement?.tagName;
      const type = document.activeElement?.type;

      // Laisser les champs texte gérer leurs propres touches
      if (tag === "TEXTAREA") return;
      // Laisser le slider gérer ses propres flèches
      if (tag === "INPUT" && type === "range") return;
      // Sur les autres inputs, intercepter seulement Escape
      if (tag === "INPUT" && e.key !== "Escape") return;
      // Ignorer les combinaisons Ctrl/Cmd (sauf Escape)
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
  }, [navigate]); // navigate est stable — effet monté une seule fois

  // ── États de chargement / erreur ─────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-white/25 mr-3" />
        <span className="text-white/25 text-sm">Chargement...</span>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-sm">{error || "Film introuvable."}</p>
        <button
          onClick={() => navigate("/jury/dashboard")}
          className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Retour au dashboard
        </button>
      </div>
    );
  }

  const currentVote      = film.votes?.[0];
  const youtubeId        = getYoutubeId(film.youtubeUrl);
  // Commentaires internes (isInternal: true), du plus récent au plus ancien
  const internalComments = currentVote?.comments
    ?.filter(c => c.isInternal)
    .slice()
    .reverse() ?? [];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-[#0D0D0D]/95 backdrop-blur border-b border-white/5 px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Retour */}
          <button
            onClick={() => navigate("/jury/dashboard")}
            className="text-white/30 hover:text-white transition-colors p-1 shrink-0"
            title="Retour (Esc)"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Titre film */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black uppercase tracking-tight italic truncate">
              {film.title}
            </h1>
            <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">
              {film.country}
              {film.submitter && (
                <span className="text-white/15 ml-2">
                  · {film.submitter.firstName} {film.submitter.lastName}
                </span>
              )}
            </p>
          </div>

          {/* Badge vote courant */}
          {currentVote ? (
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 shrink-0
              ${currentVote.sentiment === "LIKE"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
              {currentVote.sentiment === "LIKE" ? "✓ Like" : "✕ Dislike"} · {currentVote.rating}/10
            </span>
          ) : (
            <span className="text-[9px] text-white/20 border border-white/8 px-3 py-1.5 uppercase tracking-widest shrink-0">
              À évaluer
            </span>
          )}

          {/* Bouton Film suivant */}
          {nextFilm && (
            <button
              onClick={() => navigate(`/jury/film/${nextFilm.id}`)}
              className="hidden sm:flex items-center gap-1.5 shrink-0
                         text-[9px] uppercase tracking-widest
                         text-white/25 hover:text-white/60
                         border border-white/8 hover:border-white/20
                         px-3 py-1.5 transition-all"
              title="Film suivant (→)"
            >
              <span className="max-w-28 truncate">{nextFilm.title}</span>
              <ChevronRight size={10} />
            </button>
          )}

        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* ── COLONNE GAUCHE — Player + métadonnées + commentaires + suggestion ── */}
          <div className="space-y-6">

            {/* Player YouTube */}
            <div className="aspect-video bg-black border border-white/5 overflow-hidden">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={film.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/15 text-sm">
                  Vidéo non disponible
                </div>
              )}
            </div>

            {/* Métadonnées */}
            <div className="border border-white/5 p-5 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">À propos</p>
              {film.description && (
                <p className="text-sm text-white/60 leading-relaxed">{film.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {film.country && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Pays</p>
                    <p className="text-xs text-white/60">{film.country}</p>
                  </div>
                )}
                {film.aiToolsUsed && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Outils IA</p>
                    <p className="text-xs text-white/60">{film.aiToolsUsed}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── COMMENTAIRES INTERNES ─────────────────────── */}
            <div className="border border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <MessageSquare size={11} />
                  Commentaires
                  {internalComments.length > 0 && (
                    <span className="text-white/15">({internalComments.length})</span>
                  )}
                </p>
                <span className="text-[9px] text-white/15 uppercase tracking-wider">
                  Admin uniquement
                </span>
              </div>

              {currentVote ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      placeholder="Ajouter une observation, un contexte, une analyse…"
                      value={newComment}
                      onChange={e => { setNewComment(e.target.value); setCommentError(""); }}
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddComment();
                      }}
                      className="flex-1 bg-black/30 border border-white/8
                                 focus:border-white/20 focus:outline-none
                                 px-3 py-2 text-[11px] text-white/70
                                 placeholder:text-white/20 resize-none transition-colors"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commenting}
                      className="px-3 bg-white/5 border border-white/8
                                 hover:bg-white/10 hover:border-white/20
                                 text-white/40 hover:text-white/70
                                 transition-all disabled:opacity-30"
                      title="Envoyer (Ctrl+Entrée)"
                    >
                      {commenting
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Send size={14} />
                      }
                    </button>
                  </div>
                  {commentError && (
                    <p className="text-[10px] text-red-400">{commentError}</p>
                  )}
                  <p className="text-[9px] text-white/15">Ctrl + Entrée pour envoyer</p>
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">
                  Votez d&apos;abord pour pouvoir laisser un commentaire.
                </p>
              )}

              {internalComments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {internalComments.map(c => (
                    <div key={c.id} className="space-y-1">
                      <p className="text-[9px] text-white/20 font-mono">
                        {formatDateTime(c.createdAt)}
                      </p>
                      <p className="text-xs text-white/60 bg-white/3 border border-white/5
                                    px-3 py-2 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {currentVote && internalComments.length === 0 && (
                <p className="text-[10px] text-white/15 italic">
                  Aucun commentaire pour l&apos;instant.
                </p>
              )}
            </div>

            {/* ── SUGGESTION DE MODIFICATION ────────────────── */}
            <div className="border border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <MessageSquare size={11} />
                  Suggestion de modification
                </p>
                <span className="text-[9px] text-white/15 uppercase tracking-wider">
                  Transmis à l&apos;admin
                </span>
              </div>

              {currentVote ? (
                <div className="space-y-3">
                  {currentVote.suggestModification && (
                    <div className="flex items-center gap-2 text-[10px] text-orange-400/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400/70 inline-block" />
                      Suggestion active — l&apos;admin a été notifié
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer group">
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
                    <span className="text-[10px] uppercase tracking-wider text-white/35
                                     group-hover:text-white/55 transition-colors">
                      {suggestion.checked ? "Retirer la suggestion" : "Suggérer des modifications"}
                    </span>
                  </label>

                  {suggestion.checked && (
                    <div className="flex gap-2">
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
                        className="flex-1 bg-black/30 border border-orange-500/20
                                   focus:border-orange-500/40 focus:outline-none
                                   px-3 py-2 text-[11px] text-white/70
                                   placeholder:text-white/20 resize-none transition-colors"
                      />
                      <button
                        onClick={handleSendSuggestion}
                        disabled={sendingSuggestion}
                        className="px-3 bg-orange-500/10 border border-orange-500/20
                                   hover:bg-orange-500/20 hover:border-orange-500/40
                                   text-orange-400/70 hover:text-orange-400
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
                      className="text-[10px] text-white/20 hover:text-red-400/70
                                 uppercase tracking-wider transition-colors"
                    >
                      {sendingSuggestion
                        ? <Loader2 size={12} className="animate-spin inline" />
                        : "Retirer la suggestion"}
                    </button>
                  )}

                  {suggestion.error && (
                    <p className="text-[10px] text-red-400">{suggestion.error}</p>
                  )}
                  <p className="text-[9px] text-white/15">Ctrl + Entrée pour envoyer</p>
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">
                  Votez d&apos;abord pour pouvoir suggérer une modification.
                </p>
              )}
            </div>

          </div> {/* fin colonne gauche */}

          {/* ── COLONNE DROITE — Panel évaluation ────────────── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

            <div className="border border-white/10 bg-white/2 p-5 space-y-6">

              {/* En-tête avec hint raccourcis */}
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/25">
                  Votre évaluation
                </p>
                <p className="text-[9px] text-white/15 font-mono tracking-widest">
                  L · D · ↑↓ · ↵
                </p>
              </div>

              {/* LIKE / DISLIKE */}
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-wider text-white/25">Sentiment</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSentiment(s => s === "LIKE" ? null : "LIKE")}
                    title="Like (L)"
                    className={`flex items-center justify-center gap-2 py-3
                                text-[10px] font-black uppercase tracking-widest
                                border transition-all
                                ${sentiment === "LIKE"
                                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                                  : "bg-white/5 border-white/10 text-white/35 hover:border-white/20 hover:text-white/60"}`}
                  >
                    <ThumbsUp size={13} />
                    Like
                  </button>
                  <button
                    onClick={() => setSentiment(s => s === "DISLIKE" ? null : "DISLIKE")}
                    title="Dislike (D)"
                    className={`flex items-center justify-center gap-2 py-3
                                text-[10px] font-black uppercase tracking-widest
                                border transition-all
                                ${sentiment === "DISLIKE"
                                  ? "bg-red-500/15 border-red-500/40 text-red-400"
                                  : "bg-white/5 border-white/10 text-white/35 hover:border-white/20 hover:text-white/60"}`}
                  >
                    <ThumbsDown size={13} />
                    Dislike
                  </button>
                </div>
              </div>

              {/* Slider Note 1-10 */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <p className="text-[9px] uppercase tracking-wider text-white/25">Note</p>
                  <span className="text-indigo-400 font-mono font-bold text-lg leading-none">
                    {rating}
                    <span className="text-white/20 text-xs">/10</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={rating}
                  onChange={e => setRating(parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-indigo-500"
                  title="Note (↑ ↓ quand le slider n'est pas actif)"
                />
                <div className="flex justify-between text-[9px] text-white/15 font-mono">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Bouton soumettre */}
              <button
                onClick={handleSubmit}
                disabled={!sentiment || voting}
                title="Soumettre (Entrée)"
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest
                           bg-indigo-600 hover:bg-indigo-500 text-white
                           transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {voting
                  ? <Loader2 size={14} className="animate-spin" />
                  : currentVote
                    ? "Modifier l'évaluation"
                    : "Soumettre l'évaluation"
                }
              </button>

              {/* Annuler vote */}
              {currentVote && !voting && (
                <button
                  onClick={handleRemoveVote}
                  className="w-full text-[10px] uppercase tracking-widest text-white/20
                             hover:text-red-400 transition-colors py-1"
                >
                  Annuler mon vote
                </button>
              )}
            </div>

            {/* Récapitulatif vote */}
            {currentVote && (
              <div className="border border-white/5 px-4 py-3 space-y-1">
                <p className="text-[9px] text-white/20 uppercase tracking-wider">
                  Vote enregistré · {formatDateTime(currentVote.updatedAt)}
                </p>
                {currentVote.suggestModification && (
                  <p className="text-[9px] text-orange-400/60 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare size={8} /> Suggestion envoyée à l&apos;admin
                  </p>
                )}
                {internalComments.length > 0 && (
                  <p className="text-[9px] text-white/15 uppercase tracking-wider">
                    {internalComments.length} commentaire{internalComments.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Aide raccourcis clavier */}
            <div className="border border-white/5 px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/15 mb-3">
                Raccourcis
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  ["L", "Like"],
                  ["D", "Dislike"],
                  ["↑ ↓", "Note ±1"],
                  ["↵", "Soumettre"],
                  ["→", "Film suivant"],
                  ["Esc", "Retour"],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="text-[8px] font-mono bg-white/5 border border-white/10
                                    px-1.5 py-0.5 text-white/30 shrink-0">
                      {key}
                    </kbd>
                    <span className="text-[9px] text-white/20">{label}</span>
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
