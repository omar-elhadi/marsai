import { formatDateTime } from "../../utils/format";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Send,
  ChevronRight,
  Users,
  Globe,
  Cpu,
  Calendar,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

// Sentiment dérivé automatiquement — ≥6 = LIKE, ≤5 = DISLIKE
const deriveSentiment = (rating: number) => (rating >= 6 ? "LIKE" : "DISLIKE");

const getYoutubeId = (url: string) => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
};

const STATUS_LABELS: Record<string, any> = {
  SUBMITTED: "Soumis",
  IN_REVIEW: "En évaluation",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  TO_MODIFY: "À modifier",
  SELECTION: "Sélection",
  FINALIST: "Finaliste",
  AWARD: "Primé",
};

const STATUS_COLORS: Record<string, any> = {
  SUBMITTED: {
    color: "var(--color-text-muted)",
    border: "var(--color-border)",
  },
  IN_REVIEW: { color: "#818cf8", border: "rgba(99,102,241,0.3)" },
  APPROVED: { color: "#10b981", border: "rgba(16,185,129,0.3)" },
  REJECTED: { color: "#f87171", border: "rgba(239,68,68,0.3)" },
  TO_MODIFY: { color: "#fb923c", border: "rgba(249,115,22,0.3)" },
  SELECTION: { color: "#60a5fa", border: "rgba(96,165,250,0.3)" },
  FINALIST: { color: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  AWARD: { color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
};

export default function JuryFilmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Évaluation
  const [rating, setRating] = useState(5);
  const [suggestMod, setSuggestMod] = useState({ checked: false, text: "" });
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState("");

  // Notes cumulatives
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Confirmation de soumission
  const [voteSuccess, setVoteSuccess] = useState("");

  // Navigation inter-films
  const [allFilms, setAllFilms] = useState<any[]>([]);

  // ── Fetch ────────────────────────────────────────────────
  const fetchFilm = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/jury/films/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors du chargement.");
        return;
      }
      setFilm(data);
      const existing = data.votes?.[0];
      if (existing) {
        setRating(existing.rating ?? 5);
        const suggComment = existing.comments?.find((c: any) => !c.isInternal);
        setSuggestMod(
          existing.suggestModification && suggComment
            ? { checked: true, text: suggComment.content }
            : { checked: false, text: "" },
        );
      } else {
        setRating(5);
        setSuggestMod({ checked: false, text: "" });
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAllFilms = useCallback(async () => {
    try {
      const res = await fetch(`${API}/jury/films`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAllFilms(Array.isArray(data) ? data : []);
      }
    } catch {
      /* silently fail */
    }
  }, []);

  useEffect(() => {
    fetchFilm();
  }, [fetchFilm]);
  useEffect(() => {
    fetchAllFilms();
  }, [fetchAllFilms]);

  const nextFilm = useMemo(() => {
    const others = allFilms.filter((f) => f.id !== parseInt(id || "0"));
    return others.find((f) => !f.votes?.length) ?? others[0] ?? null;
  }, [allFilms, id]);

  // ── Handlers ─────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (suggestMod.checked && !suggestMod.text.trim()) {
      setVoteError("Un message est requis pour suggérer une modification.");
      return;
    }
    setVoteError("");
    setVoting(true);
    // Capturé avant l'await pour connaître l'intention après rafraîchissement
    const wasSuggestion = suggestMod.checked;
    try {
      const res = await fetch(`${API}/jury/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          filmId: parseInt(id || "0"),
          sentiment: deriveSentiment(rating),
          rating,
          suggestModification: suggestMod.checked,
          comment: suggestMod.checked ? suggestMod.text.trim() : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setVoteError(data.error || "Erreur lors de la soumission.");
        return;
      }
      await fetchFilm();
      await fetchAllFilms();
      // fetchFilm repopule suggestMod depuis l'API → on ferme le textarea après une demande
      if (wasSuggestion) setSuggestMod({ checked: false, text: "" });
      setVoteSuccess(
        wasSuggestion
          ? "Demande transmise à l'admin ✓"
          : "Évaluation enregistrée ✓",
      );
      setTimeout(() => setVoteSuccess(""), 5000);
    } finally {
      setVoting(false);
    }
  }, [rating, suggestMod, id, fetchFilm, fetchAllFilms]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleRemoveVote = async () => {
    setVoting(true);
    try {
      await fetch(`${API}/jury/votes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setRating(5);
      setSuggestMod({ checked: false, text: "" });
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
      const res = await fetch(`${API}/jury/votes/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCommentError(data.error || "Erreur lors de l'envoi.");
        return;
      }
      setNewComment("");
      await fetchFilm();
    } finally {
      setCommenting(false);
    }
  };

  // ── Raccourcis clavier (↑↓ note · ↵ soumettre · → suivant · Esc retour) ─
  const stateRef = useRef({});
  stateRef.current = { rating, voting, nextFilm };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      const type = (document.activeElement as any)?.type;
      if (tag === "TEXTAREA") return;
      if (tag === "INPUT" && type === "range") return;
      if (tag === "INPUT" && e.key !== "Escape") return;
      if ((e.metaKey || e.ctrlKey) && e.key !== "Escape") return;
      const st = stateRef.current as any;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setRating((r) => Math.min(10, r + 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setRating((r) => Math.max(1, r - 1));
          break;
        case "Enter":
          if (!st.voting) {
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
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-faint)",
        }}
      >
        <Loader2
          size={24}
          className="animate-spin"
          style={{ marginRight: "0.75rem" }}
        />{" "}
        Chargement...
      </div>
    );
  }

  if (error || !film) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          fontFamily: "var(--font-sans)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          color: "var(--color-text-muted)",
        }}
      >
        <p style={{ fontSize: "0.875rem" }}>{error || "Film introuvable."}</p>
        <button
          onClick={() => navigate("/jury/dashboard")}
          style={{
            fontSize: "0.75rem",
            color: "#10b981",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  const currentVote = film.votes?.[0];
  const sentiment = deriveSentiment(rating);
  const accentColor = sentiment === "LIKE" ? "#10b981" : "#ef4444";
  const youtubeId = getYoutubeId(film.youtubeUrl);
  const internalComments =
    currentVote?.comments
      ?.filter((c: any) => c.isInternal)
      .slice()
      .reverse() ?? [];
  // Commentaire de suggestion (isInternal: false) — transmis à l'admin
  const suggestionComment =
    currentVote?.comments?.find((c: any) => !c.isInternal) ?? null;
  const statusStyle = STATUS_COLORS[film.status] ?? STATUS_COLORS.SUBMITTED;
  // Évaluations verrouillées pour les films en phase finale
  const isLocked = ["FINALIST", "AWARD"].includes(film.status);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)",
        }}
      >
        {/* ── HEADER éditorial ── */}
        <header
          style={{
            marginBottom: "2.5rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <button
              onClick={() => navigate("/jury/dashboard")}
              style={{
                color: "var(--color-text-faint)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-faint)")
              }
            >
              <ArrowLeft size={16} />
            </button>
            <span
              style={{
                width: "clamp(2rem, 3vw, 3rem)",
                height: "1px",
                background: "#10b981",
                flexShrink: 0,
              }}
            />
            <span className="label-overline">Évaluation</span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    color: "var(--color-text)",
                    lineHeight: 1,
                  }}
                >
                  {film.title}
                </h1>
                {/* Badge statut */}
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "0.375rem 0.625rem",
                    flexShrink: 0,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  {STATUS_LABELS[film.status] ?? film.status}
                </span>
                {/* Badge note jury */}
                {currentVote ? (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "0.375rem 0.625rem",
                      flexShrink: 0,
                      background:
                        currentVote.sentiment === "LIKE"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                      color:
                        currentVote.sentiment === "LIKE"
                          ? "#34d399"
                          : "#f87171",
                      border: `1px solid ${currentVote.sentiment === "LIKE" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    {currentVote.rating}/10
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                      padding: "0.375rem 0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      flexShrink: 0,
                    }}
                  >
                    À évaluer
                  </span>
                )}
              </div>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                }}
              >
                {film.country}
                {film.language ? ` · ${film.language}` : ""}
                {film.submittedAt
                  ? ` · soumis le ${new Date(film.submittedAt).toLocaleDateString("fr-FR")}`
                  : ""}
              </p>
            </div>

            {nextFilm && (
              <button
                onClick={() => navigate(`/jury/film/${nextFilm.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                  padding: "0.5rem 0.75rem",
                  background: "none",
                  cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                  e.currentTarget.style.borderColor =
                    "var(--color-border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <span
                  style={{
                    maxWidth: "8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nextFilm.title}
                </span>
                <ChevronRight size={10} />
              </button>
            )}
          </div>
        </header>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── COLONNE PRINCIPALE ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vidéo */}
            {youtubeId ? (
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                }}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={film.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  aspectRatio: "16/9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-faint)",
                  fontSize: "0.875rem",
                }}
              >
                Vidéo non disponible
              </div>
            )}

            {/* Description */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
              }}
            >
              <p className="label-overline" style={{ marginBottom: "0.75rem" }}>
                Description
              </p>
              <p
                style={{
                  color: "var(--color-text)",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                }}
              >
                {film.description}
              </p>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                {film.country && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    <Globe size={12} />
                    {film.country}
                  </span>
                )}
                {film.aiToolsUsed && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    <Cpu size={12} />
                    {film.aiToolsUsed}
                  </span>
                )}
                {film.submittedAt && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    <Calendar size={12} />
                    {new Date(film.submittedAt).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>

            {/* Notes jury */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
              }}
            >
              <p
                className="label-overline"
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <MessageSquare size={11} />
                Notes jury
                {internalComments.length > 0 && (
                  <span
                    style={{
                      color: "var(--color-text-faint)",
                      fontStyle: "normal",
                    }}
                  >
                    ({internalComments.length})
                  </span>
                )}
              </p>

              {currentVote && !isLocked ? (
                <div className="space-y-3">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <textarea
                      rows={2}
                      placeholder="Ajouter une observation, un contexte, une analyse…"
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                        setCommentError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                          handleAddComment();
                      }}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        padding: "0.625rem 0.75rem",
                        fontSize: "0.875rem",
                        color: "var(--color-text)",
                        outline: "none",
                        resize: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                      className="placeholder:text-text-faint"
                      onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--color-border)")
                      }
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commenting}
                      style={{
                        padding: "0 1rem",
                        background: "var(--color-surface-high)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      className="disabled:opacity-30"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--color-border)";
                        e.currentTarget.style.color = "var(--color-text)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "var(--color-surface-high)";
                        e.currentTarget.style.color = "var(--color-text-muted)";
                      }}
                      title="Envoyer (Ctrl+Entrée)"
                    >
                      {commenting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                  {commentError && (
                    <p style={{ fontSize: "0.75rem", color: "#f87171" }}>
                      {commentError}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--color-text-faint)",
                    }}
                  >
                    Ctrl + Entrée pour envoyer
                  </p>
                </div>
              ) : isLocked ? (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-faint)",
                    fontStyle: "italic",
                  }}
                >
                  Les notes sont verrouillées — film{" "}
                  {STATUS_LABELS[film.status]?.toLowerCase()}.
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  Soumettez votre évaluation pour ajouter des notes.
                </p>
              )}

              {internalComments.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "0.75rem",
                    marginTop: "1rem",
                  }}
                  className="space-y-3"
                >
                  {internalComments.map((c: any) => (
                    <div key={c.id} className="space-y-1.5">
                      <p
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--color-text-faint)",
                          fontFamily: "monospace",
                        }}
                      >
                        {formatDateTime(c.createdAt)}
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-text)",
                          background: "var(--color-surface-high)",
                          border: "1px solid var(--color-border)",
                          padding: "0.75rem 1rem",
                          lineHeight: 1.75,
                        }}
                      >
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {currentVote && internalComments.length === 0 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-faint)",
                    fontStyle: "italic",
                    marginTop: "0.75rem",
                  }}
                >
                  Aucune note pour l&apos;instant.
                </p>
              )}
            </div>
          </div>

          {/* ── COLONNE LATÉRALE ── */}
          <div className="space-y-6">
            {/* Réalisateur */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "clamp(1.25rem, 2.5vw, 1.5rem)",
              }}
            >
              <p className="label-overline" style={{ marginBottom: "1rem" }}>
                Réalisateur
              </p>
              <p style={{ fontWeight: 700, color: "var(--color-text)" }}>
                {film.submitter?.firstName} {film.submitter?.lastName}
              </p>
              {film.submitter?.email && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.25rem",
                  }}
                >
                  {film.submitter.email}
                </p>
              )}
              {film.submitter?.instagram && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-faint)",
                    marginTop: "0.5rem",
                  }}
                >
                  @{film.submitter.instagram}
                </p>
              )}
              {film.submitter?.bio && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.75rem",
                    lineHeight: 1.75,
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "0.75rem",
                  }}
                >
                  {film.submitter.bio}
                </p>
              )}
            </div>

            {/* Jurys assignés */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "clamp(1.25rem, 2.5vw, 1.5rem)",
              }}
            >
              <p
                className="label-overline"
                style={{
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <Users size={11} /> Jurys assignés
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {film.assignedUsers?.length ?? 0} évaluateur
                {(film.assignedUsers?.length ?? 0) > 1 ? "s" : ""}
              </p>
            </div>

            {/* ── Votre évaluation ── */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "clamp(1.25rem, 2.5vw, 1.5rem)",
              }}
              className="space-y-4"
            >
              <p className="label-overline">Votre évaluation</p>

              {isLocked ? (
                /* ── Mode lecture seule ── */
                <div className="space-y-3">
                  {currentVote && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        background: "var(--color-surface-high)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span className="label-overline">Votre note</span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 900,
                          fontSize: "1.5rem",
                          color: accentColor,
                        }}
                      >
                        {currentVote.rating}
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 400,
                            color: "var(--color-text-faint)",
                          }}
                        >
                          /10
                        </span>
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      padding: "0.625rem 0.875rem",
                      background: "rgba(251,191,36,0.05)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.625rem",
                        color: "#fbbf24",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Évaluation clôturée
                    </p>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--color-text-faint)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Film {STATUS_LABELS[film.status]?.toLowerCase()} —
                      modifications non autorisées.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Mode édition ── */
                <>
                  {/* Slider note */}
                  <div className="space-y-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="label-overline">Note</p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.375rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            fontSize: "1.5rem",
                            lineHeight: 1,
                            color: accentColor,
                            transition: "color 0.2s",
                          }}
                        >
                          {rating}
                          <span
                            style={{
                              color: "var(--color-text-faint)",
                              fontSize: "0.875rem",
                              fontWeight: 400,
                            }}
                          >
                            /10
                          </span>
                        </span>
                        <span
                          style={{
                            fontSize: "0.625rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: accentColor,
                            transition: "color 0.2s",
                          }}
                        >
                          {sentiment === "LIKE" ? "✓" : "✕"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      style={{ width: "100%", cursor: "pointer", accentColor }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                      }}
                    >
                      <span style={{ color: "#ef4444" }}>1</span>
                      <span style={{ color: "var(--color-text-faint)" }}>
                        5 | 6
                      </span>
                      <span style={{ color: "#10b981" }}>10</span>
                    </div>
                  </div>

                  {/* Soumettre */}
                  <button
                    onClick={handleSubmit}
                    disabled={voting}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      background: "#10b981",
                      color: "#000",
                      border: "1px solid #34d399",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                    className="disabled:opacity-30"
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled)
                        e.currentTarget.style.background = "#34d399";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#10b981")
                    }
                  >
                    {voting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : currentVote ? (
                      "Enregistrer"
                    ) : (
                      "Soumettre l'évaluation"
                    )}
                  </button>
                </>
              )}

              {voteError && (
                <p style={{ fontSize: "0.75rem", color: "#f87171" }}>
                  {voteError}
                </p>
              )}
              {voteSuccess && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#10b981",
                    fontWeight: 700,
                    textAlign: "center",
                    letterSpacing: "0.05em",
                  }}
                >
                  {voteSuccess}
                </p>
              )}

              {currentVote && !voting && !isLocked && (
                <button
                  onClick={handleRemoveVote}
                  style={{
                    width: "100%",
                    fontSize: "0.6875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--color-text-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    transition: "color 0.2s",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#f87171")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-faint)")
                  }
                >
                  Annuler mon vote
                </button>
              )}
            </div>

            {/* ── Demande de modification (orange sémantique) — masqué si verrouillé ── */}
            {!isLocked && (
              <div
                style={{
                  border: "1px solid rgba(249,115,22,0.2)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "rgba(249,115,22,0.05)",
                    padding: "1rem 1.25rem",
                  }}
                  className="space-y-3"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      className="label-overline"
                      style={{
                        color: "#fb923c",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      <MessageSquare size={11} /> Demande de modification
                    </p>
                    {currentVote?.suggestModification && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "#fb923c",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        ● Active
                      </span>
                    )}
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={suggestMod.checked}
                      onChange={(e) => {
                        setSuggestMod({ checked: e.target.checked, text: "" });
                        setVoteError("");
                      }}
                      className="accent-orange-500"
                    />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: suggestMod.checked
                          ? "#fb923c"
                          : "var(--color-text)",
                        transition: "color 0.2s",
                      }}
                    >
                      Signaler à l&apos;admin pour modification
                    </span>
                  </label>

                  {suggestMod.checked && (
                    <>
                      <textarea
                        rows={3}
                        placeholder="Décrivez les modifications souhaitées…"
                        value={suggestMod.text}
                        onChange={(e) => {
                          setSuggestMod((prev) => ({
                            ...prev,
                            text: e.target.value,
                          }));
                          setVoteError("");
                        }}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "1px solid rgba(249,115,22,0.3)",
                          padding: "0.625rem 0.75rem",
                          fontSize: "0.875rem",
                          color: "var(--color-text)",
                          outline: "none",
                          resize: "none",
                          transition: "border-color 0.2s",
                          boxSizing: "border-box",
                        }}
                        className="placeholder:text-text-faint"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "rgba(249,115,22,0.6)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(249,115,22,0.3)")
                        }
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={voting || !suggestMod.text.trim()}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                          background: "rgba(249,115,22,0.15)",
                          color: "#fb923c",
                          border: "1px solid rgba(249,115,22,0.4)",
                          cursor: "pointer",
                          transition: "background 0.2s, color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                        className="disabled:opacity-30"
                        onMouseEnter={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background =
                              "rgba(249,115,22,0.25)";
                            e.currentTarget.style.color = "#fdba74";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(249,115,22,0.15)";
                          e.currentTarget.style.color = "#fb923c";
                        }}
                      >
                        {voting ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          "Envoyer la demande"
                        )}
                      </button>
                    </>
                  )}
                </div>
                <div
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderTop: "1px solid rgba(249,115,22,0.15)",
                    background: "rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "rgba(251,146,60,0.6)",
                    }}
                  >
                    Transmis à l&apos;admin avec votre évaluation
                  </p>
                </div>
              </div>
            )}

            {/* ── Historique (timeline) ── */}
            {currentVote && (
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  padding: "1rem 1.25rem",
                }}
              >
                <p
                  className="label-overline"
                  style={{ marginBottom: "1.25rem" }}
                >
                  Historique
                </p>

                {/* Timeline — ligne verticale + événements */}
                <div style={{ position: "relative", paddingLeft: "2rem" }}>
                  {/* Ligne verticale */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0.5rem",
                      top: "0.625rem",
                      bottom: "0.25rem",
                      width: "1px",
                      background: "var(--color-border)",
                    }}
                  />

                  {/* Événement 1 — Évaluation soumise */}
                  <div
                    style={{ position: "relative", marginBottom: "1.25rem" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "-1.75rem",
                        top: "0.375rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        borderRadius: "50%",
                        background: accentColor,
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--color-text-faint)",
                        fontFamily: "monospace",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {formatDateTime(currentVote.updatedAt)}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Évaluation ·{" "}
                      <span style={{ color: accentColor, fontWeight: 700 }}>
                        {currentVote.rating}/10
                      </span>
                      <span
                        style={{
                          color: "var(--color-text-faint)",
                          fontSize: "0.625rem",
                          marginLeft: "0.375rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {currentVote.sentiment}
                      </span>
                    </p>
                  </div>

                  {/* Événement 2 — Demande de modification (si présente) */}
                  {suggestionComment && (
                    <div
                      style={{ position: "relative", marginBottom: "1.25rem" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.75rem",
                          top: "0.375rem",
                          width: "0.5rem",
                          height: "0.5rem",
                          borderRadius: "2px",
                          background: "#fb923c",
                          transform: "rotate(45deg)",
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--color-text-faint)",
                          fontFamily: "monospace",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {formatDateTime(suggestionComment.createdAt)}
                      </p>
                      <p
                        style={{
                          fontSize: "0.625rem",
                          color: "#fb923c",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginTop: "0.25rem",
                        }}
                      >
                        Demande de modification
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--color-text)",
                          lineHeight: 1.7,
                          background: "rgba(249,115,22,0.06)",
                          border: "1px solid rgba(249,115,22,0.2)",
                          padding: "0.5rem 0.75rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {suggestionComment.content}
                      </p>
                    </div>
                  )}

                  {/* Événements 3+ — Notes internes (ordre chronologique) */}
                  {[...internalComments].reverse().map((c: any) => (
                    <div
                      key={c.id}
                      style={{ position: "relative", marginBottom: "1.25rem" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.75rem",
                          top: "0.375rem",
                          width: "0.5rem",
                          height: "0.5rem",
                          borderRadius: "1px",
                          background: "var(--color-text-faint)",
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--color-text-faint)",
                          fontFamily: "monospace",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {formatDateTime(c.createdAt)}
                      </p>
                      <p
                        style={{
                          fontSize: "0.625rem",
                          color: "var(--color-text-faint)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginTop: "0.25rem",
                        }}
                      >
                        Note interne
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--color-text)",
                          lineHeight: 1.7,
                          background: "var(--color-surface-high)",
                          border: "1px solid var(--color-border)",
                          padding: "0.5rem 0.75rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
