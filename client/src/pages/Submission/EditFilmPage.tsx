/**
 * EditFilmPage.jsx — MARSAI Festival
 * Page publique pour le réalisateur : éditer son film suite à une demande de TO_MODIFY.
 *
 * Flux :
 *  1. Récupère le film via GET /api/films/edit/:token (token dans l'URL)
 *  2. Token invalide/expiré → message d'erreur clair
 *  3. Token valide → bannière orange avec le message admin + formulaire pré-rempli
 *  4. Submit → PUT /api/films/edit/:token
 *  5. Succès → message de confirmation
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

interface FilmData {
  title: string;
  submitter?: { firstName?: string; lastName?: string };
  modificationRequest?: string;
  description?: string;
  youtubeUrl?: string;
  aiToolsUsed?: string;
}

// Champs éditables par le réalisateur (country non modifiable selon business rules)
const FIELDS = [
  { key: "title", label: "Titre du film", type: "text", required: true },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  { key: "youtubeUrl", label: "Lien YouTube", type: "url", required: false },
  {
    key: "aiToolsUsed",
    label: "Outils IA utilisés",
    type: "text",
    required: true,
  },
];

export default function EditFilmPage() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading"); // loading | error | ready | success
  const [errorMsg, setErrorMsg] = useState("");
  const [film, setFilm] = useState<FilmData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Charger le film au montage
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/films/edit/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Lien invalide.");
        setFilm(data);
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          youtubeUrl: data.youtubeUrl ?? "",
          aiToolsUsed: data.aiToolsUsed ?? "",
        });
        setStatus("ready");
      } catch (err) {
        setErrorMsg((err as Error).message);
        setStatus("error");
      }
    };
    load();
  }, [token]);

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`${API}/films/edit/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de la sauvegarde.");
      setStatus("success");
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ── États ──────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg-pure)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          <Loader2 size={20} className="animate-spin" />
          <span
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}
          >
            Vérification du lien…
          </span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg-pure)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <AlertTriangle
            size={40}
            style={{ color: "var(--color-accent)", margin: "0 auto 1.5rem" }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem,4vw,2.2rem)",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Lien invalide
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {errorMsg || "Ce lien est expiré ou n'existe pas."} Les liens de
            modification sont valables 7 jours.
          </p>
          <Link
            to="/soumettre"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-bg-pure)",
              background: "var(--color-text)",
              padding: "0.75rem 2rem",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Soumettre un nouveau film
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg-pure)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <CheckCircle
            size={40}
            style={{ color: "#22c55e", margin: "0 auto 1.5rem" }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem,4vw,2.2rem)",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Modifications envoyées
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
            }}
          >
            L'équipe MARSAI a reçu vos modifications et vous recontactera
            prochainement.
          </p>
        </div>
      </div>
    );
  }

  // ── Formulaire (status === 'ready') ────────────────────────

  if (!film) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-pure)",
        paddingTop: "clamp(6rem,10vw,8rem)",
      }}
    >
      {/* Hero */}
      <section
        style={{
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)",
          borderBottom: "1px solid var(--color-border)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              display: "block",
              width: "clamp(2rem,3vw,3rem)",
              height: "1px",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          />
          <span className="label-overline">Demande de modification</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(2rem,5vw,4rem)",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--color-text)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {film.title}
        </h1>
        <p className="body-meta">
          Soumis par {film.submitter?.firstName} {film.submitter?.lastName}
        </p>
      </section>

      <section
        style={{
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Bannière message admin */}
        {film.modificationRequest && (
          <div
            style={{
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: "4px",
              padding: "clamp(1.2rem,2.5vw,1.8rem)",
              marginBottom: "clamp(2rem,4vw,3rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.75rem",
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "#f97316", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#f97316",
                }}
              >
                Message de l'équipe MARSAI
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "rgba(249,115,22,0.85)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {film.modificationRequest}
            </p>
          </div>
        )}

        {/* Formulaire d'édition */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.5rem,3vw,2.5rem)",
          }}
        >
          {FIELDS.map(({ key, label, type, required }) => (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                {label}
                {required && (
                  <span
                    style={{
                      color: "var(--color-accent)",
                      marginLeft: "0.2rem",
                    }}
                  >
                    *
                  </span>
                )}
              </label>

              {type === "textarea" ? (
                <textarea
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  required={required}
                  rows={5}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    padding: "0.875rem 1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    color: "var(--color-text)",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <input
                  type={type}
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  required={required}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    padding: "0.875rem 1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    color: "var(--color-text)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          ))}

          {saveError && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "#f87171",
              }}
            >
              {saveError}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-bg-pure)",
                background: saving
                  ? "var(--color-text-muted)"
                  : "var(--color-text)",
                border: "none",
                padding: "1rem 2.5rem",
                borderRadius: "2px",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Envoi en cours…" : "Envoyer mes modifications"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
