import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import SubmissionStatus, {
  SUBMISSION_STATES,
} from "../../components/SubmissionStatus";
import { submitFilm } from "../../services/submissionService";
import { Upload, X, Image } from "lucide-react";


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
  .marsai-upload-zone {
    width: 100%;
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-sm);
    padding: 1.5rem 1rem;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: border-color 280ms var(--ease-out), background 280ms var(--ease-out);
    box-sizing: border-box;
  }
  .marsai-upload-zone--lg { padding: 2rem 1rem; }
  .marsai-upload-zone:hover {
    border-color: rgba(226,209,195,0.40);
    background: var(--color-surface-high);
  }
  .marsai-upload-icon { width: 3rem; height: 3rem; color: var(--color-text-faint); }
  .marsai-file-preview {
    background: var(--color-surface-high);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 1rem;
  }
  .marsai-thumb-video { width: 12rem; height: 8rem; object-fit: cover; border-radius: var(--radius-sm); }
  .marsai-thumb-poster { width: 8rem; height: 12rem; object-fit: cover; border-radius: var(--radius-sm); }
  .marsai-delete-btn {
    color: var(--color-text-muted);
    transition: color 200ms;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .marsai-delete-btn:hover { color: var(--color-text); }
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
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const s = document.createElement('style');
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
    subtitle: "",
    description: "",
    country: "",
    language: "",
    aiStack: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  // State de la vidéo
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const videoInputRef = useRef(null);

  // State du fichier de sous-titres
  const [subtitleFile, setSubtitleFile] = useState(null);
  const subtitleInputRef = useRef(null);

  // State du poster
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const posterInputRef = useRef(null);

  // State de la soumission
  const [submissionStatus, setSubmissionStatus] = useState(
    SUBMISSION_STATES.IDLE,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  /**
   * Gestion des changements de champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Gestion de la sélection de fichier vidéo
   */
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validation côté client
    const maxSize = 500 * 1024 * 1024; // 500 MB
    if (file.size > maxSize) {
      alert("Fichier trop volumineux. Taille maximale : 500 MB");
      e.target.value = null;
      return;
    }

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Format non supporté. Utilisez MP4, MOV, AVI ou WEBM.");
      e.target.value = null;
      return;
    }

    setVideoFile(file);

    // Créer une preview
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
  };

  /**
   * Suppression de la vidéo sélectionnée
   */
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = null;
    }
  };

  /**
   * Gestion de la sélection de fichier de sous-titres
   */
  const handleSubtitleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validation côté client
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert("Fichier trop volumineux. Taille maximale : 5 MB");
      e.target.value = null;
      return;
    }

    const allowedExtensions = [".srt", ".vtt", ".sbv"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Format non supporté. Utilisez uniquement .srt, .vtt ou .sbv");
      e.target.value = null;
      return;
    }

    setSubtitleFile(file);
  };

  /**
   * Suppression du fichier de sous-titres
   */
  const handleRemoveSubtitle = () => {
    setSubtitleFile(null);
    if (subtitleInputRef.current) {
      subtitleInputRef.current.value = null;
    }
  };

  /**
   * Gestion de la sélection du poster
   */
  const handlePosterChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validation côté client
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert("Fichier trop volumineux. Taille maximale : 5 MB");
      e.target.value = null;
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Format non supporté. Utilisez uniquement .jpg, .jpeg ou .png");
      e.target.value = null;
      return;
    }

    setPosterFile(file);

    // Créer une preview
    const posterURL = URL.createObjectURL(file);
    setPosterPreview(posterURL);
  };

  /**
   * Suppression du poster
   */
  const handleRemovePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    if (posterInputRef.current) {
      posterInputRef.current.value = null;
    }
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e) => {
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

    if (!videoFile) {
      alert("Veuillez sélectionner une vidéo");
      return;
    }

    if (!subtitleFile) {
      alert("Veuillez ajouter un fichier de sous-titres");
      return;
    }

    if (!posterFile) {
      alert("Veuillez ajouter un poster pour votre film");
      return;
    }

    try {
      setSubmissionStatus(SUBMISSION_STATES.UPLOADING);
      setErrorMessage(null);

      // Appel du service de soumission
      const result = await submitFilm(
        formData,
        videoFile,
        subtitleFile,
        posterFile,
        (progress) => {
          setUploadProgress(progress);

          // Changer le statut selon la progression
          if (progress < 30) {
            setSubmissionStatus(SUBMISSION_STATES.UPLOADING);
          } else if (progress < 60) {
            setSubmissionStatus(SUBMISSION_STATES.VALIDATING);
          } else if (progress < 80) {
            setSubmissionStatus(SUBMISSION_STATES.PROCESSING_S3);
          } else if (progress < 95) {
            setSubmissionStatus(SUBMISSION_STATES.PROCESSING_YOUTUBE);
          } else {
            setSubmissionStatus(SUBMISSION_STATES.CHECKING_MODERATION);
          }
        },
      );

      // Succès
      setSubmissionStatus(SUBMISSION_STATES.SUCCESS);
      setSubmissionResult(result.data);

      console.log("✅ Soumission réussie:", result);
    } catch (error) {
      console.error("❌ Erreur soumission:", error);
      setSubmissionStatus(SUBMISSION_STATES.ERROR);
      setErrorMessage(
        error.message || "Une erreur est survenue lors de la soumission",
      );
    }
  };

  const inputClass = "marsai-input";
  const labelClass = "marsai-label";

  return (
    <form
      onSubmit={handleSubmit}
      className="marsai-form-wrapper"
    >
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
          rows="3"
          maxLength="300"
          placeholder="Présentez-vous brièvement..."
          className={inputClass}
          value={formData.bio}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">
          MAX 300 CARACTÈRES
        </p>
      </div>

      <div className="marsai-section-divider">
        <span className="marsai-section-divider-line"></span>
        <span className="marsai-section-divider-text">
          Le Film
        </span>
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
        <p className="marsai-finePrint">
          Langue principale du film
        </p>
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
        <label htmlFor="subtitle" className={labelClass}>
          Sous-titre
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          placeholder="SOUS-TITRE DU FILM"
          className={inputClass}
          value={formData.subtitle}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">
          Ajoutez un sous-titre si votre film en possède un
        </p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Synopsis
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          maxLength="500"
          required
          placeholder="Pitch du film en quelques lignes..."
          className={inputClass}
          value={formData.description}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">
          MAX 500 CARACTÈRES
        </p>
      </div>

      <div>
        <label htmlFor="aiStack" className={labelClass}>
          Outils IA utilisés (Stack)
        </label>
        <textarea
          id="aiStack"
          name="aiStack"
          rows="3"
          maxLength="500"
          required
          placeholder="Listez les outils IA utilisés (ex: Midjourney, RunwayML, 11Labs...)..."
          className={inputClass}
          value={formData.aiStack}
          onChange={handleChange}
        />
        <p className="marsai-finePrint">
          MAX 500 CARACTÈRES
        </p>
      </div>

      {/* --- BLOC VIDÉO --- */}
      <div className="marsai-section-divider">
        <span className="marsai-section-divider-line"></span>
        <span className="marsai-section-divider-text">
          La Vidéo
        </span>
        <span className="marsai-section-divider-line"></span>
      </div>

      <div>
        <label htmlFor="video" className={labelClass}>
          Fichier Vidéo (Max 60 secondes)
        </label>
        <input
          type="file"
          id="video"
          name="video"
          ref={videoInputRef}
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
          required
          onChange={handleVideoChange}
          className="hidden"
        />

        {!videoFile ? (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="marsai-upload-zone marsai-upload-zone--lg"
          >
            <div className="flex flex-col items-center gap-3">
              <Upload className="marsai-upload-icon" />
              <span className="font-sans text-sm tracking-wide uppercase">
                Cliquez pour sélectionner une vidéo
              </span>
              <span className="text-xs text-white/40">
                MP4, MOV, AVI, WEBM • Max 500 MB • Max 60 secondes
              </span>
            </div>
          </button>
        ) : (
          <div className="marsai-file-preview">
            <div className="flex items-start gap-4">
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="marsai-thumb-video"
                />
              )}
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{videoFile.name}</p>
                <p className="text-white/60 text-xs mt-1">
                  {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="marsai-delete-btn"
                aria-label="Supprimer la vidéo"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="marsai-finePrint">
          ⚠️ IMPORTANT : Votre vidéo doit durer maximum 60 secondes
        </p>
      </div>

      {/* --- FICHIER SOUS-TITRES (OBLIGATOIRE) --- */}
      <div>
        <label htmlFor="subtitle" className={labelClass}>
          Fichier de Sous-titres *
        </label>
        <input
          type="file"
          id="subtitle"
          name="subtitle"
          ref={subtitleInputRef}
          accept=".srt,.vtt,.sbv"
          required
          onChange={handleSubtitleChange}
          className="hidden"
        />

        {!subtitleFile ? (
          <button
            type="button"
            onClick={() => subtitleInputRef.current?.click()}
            className="marsai-upload-zone"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-white/40" />
              <span className="font-sans text-sm tracking-wide uppercase">
                Ajouter un fichier de sous-titres
              </span>
              <span className="text-xs text-white/40">
                .SRT, .VTT, .SBV • Max 5 MB
              </span>
            </div>
          </button>
        ) : (
          <div className="marsai-file-preview">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white font-bold text-sm">
                  {subtitleFile.name}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {(subtitleFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveSubtitle}
                className="marsai-delete-btn"
                aria-label="Supprimer le fichier de sous-titres"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="marsai-finePrint">
          ⚠️ OBLIGATOIRE : Les sous-titres permettent la traduction
          internationale de votre film
        </p>
      </div>

      {/* --- POSTER DU FILM (OBLIGATOIRE) --- */}
      <div>
        <label htmlFor="poster" className={labelClass}>
          Poster du Film *
        </label>
        <input
          type="file"
          id="poster"
          name="poster"
          ref={posterInputRef}
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          required
          onChange={handlePosterChange}
          className="hidden"
        />

        {!posterFile ? (
          <button
            type="button"
            onClick={() => posterInputRef.current?.click()}
            className="marsai-upload-zone"
          >
            <div className="flex flex-col items-center gap-2">
              <Image className="w-8 h-8 text-white/40" />
              <span className="font-sans text-sm tracking-wide uppercase">
                Ajouter un poster
              </span>
              <span className="text-xs text-white/40">
                .JPG, .JPEG, .PNG • Max 5 MB • Recommandé: 1920x1080
              </span>
            </div>
          </button>
        ) : (
          <div className="marsai-file-preview">
            <div className="flex items-start gap-4">
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="marsai-thumb-poster"
                />
              )}
              <div className="flex-1">
                <p className="text-white font-bold text-sm">
                  {posterFile.name}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {(posterFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemovePoster}
                className="marsai-delete-btn"
                aria-label="Supprimer le poster"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="marsai-finePrint">
          ⚠️ OBLIGATOIRE : Le poster sera utilisé comme miniature sur YouTube
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
            !formData.acceptTerms ||
            !formData.acceptPrivacy ||
            !videoFile ||
            !subtitleFile ||
            !posterFile ||
            submissionStatus !== SUBMISSION_STATES.IDLE
          }
        >
          {submissionStatus !== SUBMISSION_STATES.IDLE &&
          submissionStatus !== SUBMISSION_STATES.ERROR
            ? "Soumission en cours..."
            : "Soumettre le film"}
        </Button>
      </div>

      {/* Composant de statut de soumission */}
      <SubmissionStatus
        status={submissionStatus}
        uploadProgress={uploadProgress}
        errorMessage={errorMessage}
      />

      {/* Affichage du résultat de soumission */}
      {submissionResult && submissionStatus === SUBMISSION_STATES.SUCCESS && (
        <div className="marsai-success-block">
          <h4 className="marsai-success-title">
            🎉 Film soumis avec succès !
          </h4>
          <div className="marsai-success-body">
            <p>
              <strong>Token de soumission :</strong>{" "}
              <code className="marsai-token-code">
                {submissionResult.submissionToken}
              </code>
            </p>
            <p>
              <strong>Statut YouTube :</strong> {submissionResult.youtubeStatus}
            </p>
            {submissionResult.youtubeUrl && (
              <p>
                <strong>Lien YouTube :</strong>{" "}
                <a
                  href={submissionResult.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="marsai-link"
                >
                  Voir sur YouTube
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default SubmissionForm;