import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "all", label: "Tous" },
  { id: "todo", label: "À traiter" },
  { id: "modification", label: "En modification" },
  { id: "done", label: "Traités" },
  { id: "selection", label: "Sélection" },
];

const filterByTab = (films: any[], tab: string) => {
  switch (tab) {
    case "todo":
      return films.filter((f: any) => f.status === "IN_REVIEW");
    case "modification":
      return films.filter((f: any) => f.status === "TO_MODIFY");
    case "done":
      return films.filter((f: any) =>
        ["APPROVED", "REJECTED"].includes(f.status),
      );
    case "selection":
      return films.filter((f: any) =>
        ["SELECTION", "FINALIST", "AWARD"].includes(f.status),
      );
    default:
      return films;
  }
};

const STATUS_BADGE: Record<string, any> = {
  IN_REVIEW: {
    background: "rgba(16,185,129,0.1)",
    color: "#10b981",
    border: "1px solid rgba(16,185,129,0.3)",
  },
  TO_MODIFY: {
    background: "rgba(249,115,22,0.1)",
    color: "#fb923c",
    border: "1px solid rgba(249,115,22,0.3)",
  },
  APPROVED: {
    background: "rgba(99,102,241,0.1)",
    color: "#818cf8",
    border: "1px solid rgba(99,102,241,0.3)",
  },
  REJECTED: {
    background: "rgba(239,68,68,0.1)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  SELECTION: {
    background: "rgba(139,92,246,0.1)",
    color: "#a78bfa",
    border: "1px solid rgba(139,92,246,0.3)",
  },
  FINALIST: {
    background: "rgba(236,72,153,0.1)",
    color: "#ec4899",
    border: "1px solid rgba(236,72,153,0.3)",
  },
  AWARD: {
    background: "rgba(245,158,11,0.1)",
    color: "#fbbf24",
    border: "1px solid rgba(245,158,11,0.3)",
  },
};

const STATUS_LABELS_JURY: Record<string, any> = {
  IN_REVIEW: "En évaluation",
  TO_MODIFY: "À modifier",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  SELECTION: "Sélection",
  FINALIST: "Finaliste",
  AWARD: "Primé",
};

export default function JuryDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("marsai_user");
    if (saved) setUser(JSON.parse(saved));
    else navigate("/login");
  }, [navigate]);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/jury/films`, { credentials: "include" });
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchFilms();
  }, [user, fetchFilms]);

  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("marsai_user");
    navigate("/");
  };

  if (!user) return null;

  // Tri : non votés en premier, puis alphabétique
  const sortedFilms = [...films].sort((a, b) => {
    const aVoted = (a.votes?.length ?? 0) > 0;
    const bVoted = (b.votes?.length ?? 0) > 0;
    if (aVoted !== bVoted) return aVoted ? 1 : -1;
    return a.title.localeCompare(b.title, "fr");
  });

  const displayedFilms = filterByTab(sortedFilms, activeTab);
  const voted = films.filter((f: any) => f.votes?.length > 0).length;
  const remaining = films.filter(
    (f: any) => f.status === "IN_REVIEW" && (f.votes?.length ?? 0) === 0,
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{
          background: "rgba(15,15,15,0.95)",
          borderBottom: "1px solid var(--color-border)",
          padding: "clamp(0.875rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              Espace <span style={{ color: "#10b981" }}>Jury</span>
            </h1>
            <p className="label-overline" style={{ marginTop: "0.25rem" }}>
              MARSAI Festival · Session 2026
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {user.firstName} {user.lastName}
              </p>
              <p className="label-overline" style={{ marginTop: "0.125rem" }}>
                Jury
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
                padding: "0.5rem 1rem",
                background: "none",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)",
        }}
      >
        {/* ── Header éditorial ── */}
        <header
          style={{
            marginBottom: "2rem",
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
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              fontStyle: "italic",
              color: "var(--color-text)",
              lineHeight: 1,
              marginBottom: "0.75rem",
            }}
          >
            Films en <span style={{ color: "#10b981" }}>évaluation</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
            }}
          >
            {voted} noté{voted > 1 ? "s" : ""} · {remaining} à traiter
          </p>

          {/* Barre de progression */}
          {films.length > 0 && (
            <div style={{ display: "flex", height: "2px" }}>
              <div
                style={{
                  background: "#10b981",
                  flex: voted,
                  transition: "flex 0.5s",
                }}
              />
              <div
                style={{
                  background: "var(--color-border)",
                  flex: remaining || 0.001,
                }}
              />
            </div>
          )}
        </header>

        {/* ── ONGLETS ── */}
        <div
          style={{
            display: "flex",
            gap: "0",
            marginBottom: "0",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {TABS.map((tab) => {
            const count = filterByTab(sortedFilms, tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.75rem 1.25rem",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #10b981"
                    : "2px solid transparent",
                  color: isActive ? "#10b981" : "var(--color-text-muted)",
                  cursor: "pointer",
                  transition: "color 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                {tab.label}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.625rem",
                    color: isActive ? "#10b981" : "var(--color-text-faint)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── LISTE ── */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderTop: "none",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem",
                color: "var(--color-text-muted)",
              }}
            >
              <Loader2
                size={24}
                className="animate-spin"
                style={{ marginRight: "0.75rem" }}
              />
              Chargement...
            </div>
          ) : displayedFilms.length === 0 ? (
            <div
              style={{
                padding: "4rem",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              {activeTab === "all"
                ? "Aucun film assigné pour le moment."
                : "Aucun film dans cette catégorie."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-left border-collapse"
                style={{ minWidth: "580px" }}
              >
                <thead>
                  <tr
                    style={{
                      background: "var(--color-surface-high)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {[
                      "#",
                      "Statut",
                      "Film / Pays",
                      "Réalisateur",
                      "Note",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="label-overline"
                        style={{
                          padding: "1rem",
                          textAlign: i === 5 ? "right" : "left",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedFilms.map((film, i) => {
                    const currentVote = film.votes?.[0];
                    const badge = STATUS_BADGE[film.status] ?? {};
                    const label =
                      STATUS_LABELS_JURY[film.status] ?? film.status;

                    return (
                      <tr
                        key={film.id}
                        onClick={() => navigate(`/jury/film/${film.id}`)}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-surface-high)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {/* # */}
                        <td
                          style={{
                            padding: "1rem",
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            color: "var(--color-text-faint)",
                            width: "3rem",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </td>

                        {/* Statut */}
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              padding: "0.25rem 0.5rem",
                              ...badge,
                            }}
                          >
                            {label}
                          </span>
                        </td>

                        {/* Film / Pays */}
                        <td style={{ padding: "1rem" }}>
                          <div
                            style={{
                              fontWeight: 700,
                              color: "var(--color-text)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {film.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-muted)",
                              marginTop: "0.125rem",
                            }}
                          >
                            {film.country}
                          </div>
                        </td>

                        {/* Réalisateur */}
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {film.submitter
                            ? `${film.submitter.firstName} ${film.submitter.lastName}`
                            : "—"}
                        </td>

                        {/* Note */}
                        <td style={{ padding: "1rem" }}>
                          {currentVote ? (
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: "1rem",
                                fontWeight: 900,
                                color:
                                  currentVote.sentiment === "LIKE"
                                    ? "#10b981"
                                    : "#ef4444",
                              }}
                            >
                              {currentVote.rating}
                              <span
                                style={{
                                  fontSize: "0.6875rem",
                                  color: "var(--color-text-faint)",
                                  fontWeight: 400,
                                }}
                              >
                                /10
                              </span>
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.6875rem",
                                color: "var(--color-text-muted)",
                                border: "1px solid var(--color-border)",
                                padding: "0.25rem 0.5rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              À noter
                            </span>
                          )}
                        </td>

                        {/* Flèche */}
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <ChevronRight
                            size={14}
                            style={{ color: "var(--color-text-faint)" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
