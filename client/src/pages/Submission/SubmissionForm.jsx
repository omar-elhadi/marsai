import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import SubmissionStatus, {
  SUBMISSION_STATES,
} from "../../components/SubmissionStatus";
import { submitFilm } from "../../services/submissionService";
import { Upload, X, Image } from "lucide-react";

function SubmissionForm() {
  // State du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    subtitle: "",
    description: "",
    country: "",
    aiToolsUsed: "",
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

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-slate-300 focus:text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all placeholder-white/20 font-sans text-base";
  const labelClass =
    "block text-xs font-bold text-white mb-2 font-sans uppercase tracking-[0.15em]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto backdrop-blur-sm bg-black/40 p-8 md:p-12 border border-white/10 shadow-2xl relative"
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-indigo-500/50"></div>

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

      <div className="flex items-center gap-4 my-10 opacity-40">
        <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-grow"></div>
        <span className="text-white text-xs tracking-widest uppercase">
          Le Film
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-grow"></div>
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
        <p className="text-[10px] text-white/30 mt-1 tracking-wider">
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
        <p className="text-[10px] text-white/30 text-right mt-1 tracking-wider">
          MAX 500 CARACTÈRES
        </p>
      </div>

      <div>
        <label htmlFor="aiToolsUsed" className={labelClass}>
          Outils IA utilisés (Détails)
        </label>
        <textarea
          id="aiToolsUsed"
          name="aiToolsUsed"
          rows="3"
          required
          placeholder="Listez les outils utilisés..."
          className={inputClass}
          value={formData.aiToolsUsed}
          onChange={handleChange}
        />
      </div>

      {/* --- BLOC VIDÉO --- */}
      <div className="flex items-center gap-4 my-10 opacity-40">
        <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-grow"></div>
        <span className="text-white text-xs tracking-widest uppercase">
          La Vidéo
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-grow"></div>
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
            className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-sm px-4 py-8 text-slate-400 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-white/40" />
              <span className="font-sans text-sm tracking-wide uppercase">
                Cliquez pour sélectionner une vidéo
              </span>
              <span className="text-xs text-white/40">
                MP4, MOV, AVI, WEBM • Max 500 MB • Max 60 secondes
              </span>
            </div>
          </button>
        ) : (
          <div className="bg-white/5 border border-white/20 rounded-sm p-4">
            <div className="flex items-start gap-4">
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="w-48 h-32 object-cover rounded"
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
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Supprimer la vidéo"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-white/30 mt-2 tracking-wider">
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
            className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-sm px-4 py-6 text-slate-400 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer"
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
          <div className="bg-white/5 border border-white/20 rounded-sm p-4">
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
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Supprimer le fichier de sous-titres"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-white/30 mt-2 tracking-wider">
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
            className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-sm px-4 py-6 text-slate-400 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer"
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
          <div className="bg-white/5 border border-white/20 rounded-sm p-4">
            <div className="flex items-start gap-4">
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="w-32 h-48 object-cover rounded"
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
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Supprimer le poster"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-white/30 mt-2 tracking-wider">
          ⚠️ OBLIGATOIRE : Le poster sera utilisé comme miniature sur YouTube
        </p>
      </div>

      {/* --- VALIDATION --- */}
      <div className="pt-6 border-t border-white/5 mt-8 space-y-4">
        <label className="flex items-center gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="w-5 h-5 rounded-none border border-white/30 bg-transparent text-indigo-500 focus:ring-0 checked:bg-indigo-500 checked:border-transparent"
          />
          <span className="text-slate-400 group-hover:text-white transition-colors font-sans text-xs tracking-wide uppercase">
            Je certifie être l'auteur et j'accepte les{" "}
            <Link
              to="/conditions-utilisations"
              className="text-indigo-400 hover:text-indigo-300 underline"
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
            className="w-5 h-5 rounded-none border border-white/30 bg-transparent text-indigo-500 focus:ring-0 checked:bg-indigo-500 checked:border-transparent"
          />
          <span className="text-slate-400 group-hover:text-white transition-colors font-sans text-xs tracking-wide uppercase">
            J'accepte la{" "}
            <Link
              to="/politiquedeconfidentialite"
              className="text-indigo-400 hover:text-indigo-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique de confidentialité
            </Link>
          </span>
        </label>
      </div>

      <div className="flex justify-center pt-8">
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
        <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded backdrop-blur-sm">
          <h4 className="text-green-400 font-bold text-lg mb-3">
            🎉 Film soumis avec succès !
          </h4>
          <div className="space-y-2 text-sm text-white/80">
            <p>
              <strong>Token de soumission :</strong>{" "}
              <code className="bg-black/40 px-2 py-1 rounded">
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
                  className="text-indigo-400 hover:text-indigo-300 underline"
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
