import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

/* ── MARSAI FORM STYLES ─────────────────────────────────────────
   Injection locale — surcharge des classes marsai-*
   dans le contexte SubmissionForm.
   Zéro dépendance Tailwind. 100% design system.
   ──────────────────────────────────────────────────────────────── */
const FORM_STYLES = `
  .marsai-input {
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0.8rem 1rem;
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: clamp(0.875rem, 1.1vw, 0.95rem);
    transition: border-color 280ms var(--ease-out), background 280ms var(--ease-out);
    outline: none;
    box-sizing: border-box;
  }
  .marsai-input::placeholder { color: var(--color-text-faint); opacity: 1; }
  .marsai-input:focus {
    border-color: rgba(226,209,195,0.50);
    background: var(--color-surface-high);
    color: var(--color-text);
  }
  .marsai-label {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: 0.55rem;
  }
  .marsai-form-wrapper {
    max-width: 56rem;
    margin: 0 auto;
    padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .marsai-form-top-line {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: clamp(3rem,5vw,5rem);
    height: 1px;
    background: var(--color-accent);
    opacity: 0.6;
  }
  .marsai-section-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 0;
    opacity: 0.55;
  }
  .marsai-section-divider-line {
    flex-grow: 1;
    height: 1px;
    background: var(--color-border);
  }
  .marsai-section-divider-text {
    font-family: var(--font-sans);
    font-size: 0.60rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  .marsai-finePrint {
    font-family: var(--font-sans);
    font-size: 0.62rem;
    letter-spacing: 0.10em;
    color: var(--color-text-faint);
    margin-top: 0.35rem;
  }
  .marsai-validation-section {
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .marsai-checkbox {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: transparent;
    cursor: pointer;
    accent-color: var(--color-accent);
    flex-shrink: 0;
  }
  .marsai-checkbox-label {
    font-family: var(--font-sans);
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    transition: color 200ms;
    cursor: pointer;
  }
  .marsai-checkbox-label:hover { color: var(--color-text); }
  .marsai-link {
    color: var(--color-accent);
    text-decoration: underline;
    transition: opacity 200ms;
  }
  .marsai-link:hover { opacity: 0.75; }
  .marsai-submit-row {
    display: flex;
    justify-content: center;
    padding-top: 2rem;
  }
  .marsai-success-block {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: var(--color-accent-dim);
    border: 1px solid rgba(226,209,195,0.25);
    border-left: 2px solid var(--color-accent);
    border-radius: var(--radius-sm);
  }
  .marsai-success-title {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-accent);
    margin-bottom: 0.75rem;
  }
  .marsai-success-body {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
  .marsai-token-code {
    font-family: monospace;
    font-size: 0.78rem;
    background: var(--color-bg);
    padding: 0.15em 0.5em;
    border-radius: var(--radius-sm);
    color: var(--color-text);
  }
`;

let _injected = false;
function injectFormStyles() {
  if (_injected || typeof document === "undefined") return;
  _injected = true;
  const s = document.createElement("style");
  s.textContent = FORM_STYLES;
  document.head.appendChild(s);
}
function SubmissionForm() {
  injectFormStyles();
  // State du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    instagram: "",
    title: "",
    description: "",
    country: "",
    language: "",
    aiToolsUsed: "", // renommé depuis aiStack (cohérence avec le schéma DB)
    youtubeUrl: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionToken, setSubmissionToken] = useState(null); // token reçu après succès

  /**
   * Gestion des changements de champs du formulaire
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validations
    if (!formData.acceptTerms) {
      alert("Veuillez accepter les conditions d'utilisation");
      return;
    }

    if (!formData.acceptPrivacy) {
      alert("Veuillez accepter la politique de confidentialité");
      return;
    }

    // Validation : lien YouTube/Vimeo requis
    if (!formData.youtubeUrl) {
      alert("Veuillez fournir un lien YouTube ou Vimeo");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/films/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            bio: formData.bio,
            instagram: formData.instagram,
            title: formData.title,
            description: formData.description,
            country: formData.country,
            language: formData.language,
            aiToolsUsed: formData.aiToolsUsed,
            youtubeUrl: formData.youtubeUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Une erreur est survenue lors de la soumission.",
        );
      }

      // Succès — affiche le token de suivi
      setSubmissionToken(data.submissionToken);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "marsai-input";
  const labelClass = "marsai-label";

  // Écran de succès après soumission
  if (submissionToken) {
    return (
      <div className="marsai-form-wrapper">
        <div aria-hidden="true" className="marsai-form-top-line"></div>
        <div className="marsai-success-block">
          <p className="marsai-success-title">Candidature reçue ✓</p>
          <div className="marsai-success-body">
            <p>
              Votre film a été soumis avec succès. Un email de confirmation vous
              a été envoyé.
            </p>
            <p style={{ marginTop: "0.75rem" }}>Référence de suivi :</p>
            <p>
              <span className="marsai-token-code">{submissionToken}</span>
            </p>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.75rem",
                opacity: 0.7,
              }}
            >
              Conservez cette référence. Vous serez contacté(e) pour toute
              décision ou demande de modification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="marsai-form-wrapper">
      <div aria-hidden="true" className="marsai-form-top-line"></div>

      {/* --- BLOC IDENTITÉ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            placeholder="JEAN"
            className={inputClass}
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            placeholder="DUPONT"
            className={inputClass}
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email de contact
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="jean.dupont@email.com"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="instagram" className={labelClass}>
            Instagram (Optionnel)
          </label>
          <input
            type="text"
            id="instagram"
            name="instagram"
            placeholder="@votre_compte"
            className={inputClass}
            value={formData.instagram}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className={labelClass}>
          Bio de l'artiste
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={300}
          placeholder="Présentez-vous brièvement..."
          className={inputClass}
          value={formData.bio}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">MAX 300 CARACTÈRES</p>
      </div>

      <div className="marsai-section-divider">
        <span className="marsai-section-divider-line"></span>
        <span className="marsai-section-divider-text">Le Film</span>
        <span className="marsai-section-divider-line"></span>
      </div>

      {/* --- BLOC FILM --- */}
      <div>
        <label htmlFor="country" className={labelClass}>
          Pays de production
        </label>
        <input
          type="text"
          id="country"
          name="country"
          required
          placeholder="FRANCE"
          className={inputClass}
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="language" className={labelClass}>
          Langue du film
        </label>
        <input
          type="text"
          id="language"
          name="language"
          placeholder="FRANÇAIS"
          className={inputClass}
          value={formData.language}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">Langue principale du film</p>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Titre du film
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="TITRE ORIGINAL"
          className={inputClass}
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>
          Synopsis
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          required
          placeholder="Pitch du film en quelques lignes..."
          className={inputClass}
          value={formData.description}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">MAX 500 CARACTÈRES</p>
      </div>

      <div>
        <label htmlFor="aiToolsUsed" className={labelClass}>
          Outils IA utilisés (Stack)
        </label>
        <textarea
          id="aiToolsUsed"
          name="aiToolsUsed"
          rows={3}
          maxLength={500}
          required
          placeholder="Listez les outils IA utilisés (ex: Midjourney, RunwayML, 11Labs...)..."
          className={inputClass}
          value={formData.aiToolsUsed}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">MAX 500 CARACTÈRES</p>
      </div>

      {/* --- BLOC VIDÉO --- */}
      <div className="marsai-section-divider">
        <span className="marsai-section-divider-line"></span>
        <span className="marsai-section-divider-text">La Vidéo</span>
        <span className="marsai-section-divider-line"></span>
      </div>

      <div>
        <label htmlFor="youtubeUrl" className={labelClass}>
          Lien du film (YouTube / Vimeo)
        </label>
        <input
          type="url"
          id="youtubeUrl"
          name="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
          value={formData.youtubeUrl}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">
          Liez votre film hébergé sur YouTube ou Vimeo
        </p>
      </div>

      {/* --- VALIDATION --- */}
      <div className="marsai-validation-section">
        <label className="flex items-center gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="marsai-checkbox"
          />
          <span className="marsai-checkbox-label">
            Je certifie être l'auteur et j'accepte les{" "}
            <Link
              to="/conditions-utilisations"
              className="marsai-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              conditions d'utilisation
            </Link>
          </span>
        </label>

        <label className="flex items-center gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            className="marsai-checkbox"
          />
          <span className="marsai-checkbox-label">
            J'accepte la{" "}
            <Link
              to="/politiquedeconfidentialite"
              className="marsai-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique de confidentialité
            </Link>
          </span>
        </label>
      </div>

      <div className="marsai-submit-row">
        <Button
          type="submit"
          disabled={
            !formData.acceptTerms || !formData.acceptPrivacy || isSubmitting
          }
        >
          {isSubmitting ? "Soumission en cours..." : "Soumettre le film"}
        </Button>
      </div>
    </form>
  );
}

export default SubmissionForm;
