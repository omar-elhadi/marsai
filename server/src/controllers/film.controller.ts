import {
  submitFilm,
  getFilms as fetchFilms,
  getFilmsStats as fetchFilmsStats,
  getFilmById as fetchFilmById,
  changeFilmStatus,
  assignUsersToFilm,
  requestModification as requestModificationService,
  getFilmByEditToken as fetchFilmByEditToken,
  applyFilmEdit as applyFilmEditService,
  trackFilmByToken as fetchFilmBySubmissionToken,
} from "../services/film.service.js";
import { uploadFileToS3 } from "../services/s3.service.js";

/**
 * POST /api/films/submit
 * Reçoit le formulaire de soumission, crée le Submitter + Film, envoie l'email.
 */
export const submit = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      bio,
      instagram,
      title,
      description,
      country,
      language,
      aiToolsUsed,
      youtubeUrl,
      s3VideoKey,
    } = req.body;

    // Validation des champs obligatoires
    const required = {
      firstName,
      lastName,
      email,
      title,
      description,
      country,
      aiToolsUsed,
    };
    const missing = Object.entries(required)
      .filter(([, v]) => !v || String(v).trim() === "")
      .map(([k]) => k);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Champs obligatoires manquants",
        fields: missing,
      });
    }

    const result = await submitFilm({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      bio,
      instagram,
      title: title.trim(),
      description: description.trim(),
      country: country.trim(),
      language,
      aiToolsUsed: aiToolsUsed.trim(),
      youtubeUrl,
      s3VideoKey,
    });

    return res.status(201).json({
      message: "Film soumis avec succès",
      submissionToken: result.submissionToken,
      filmId: result.film.id,
    });
  } catch (error) {
    console.error("❌ Erreur submit film:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la soumission du film" });
  }
};

/**
 * GET /api/films
 * Liste des films pour le dashboard admin, avec filtres optionnels.
 * Query params : ?status=SUBMITTED&search=titre
 */
export const getFilms = async (req, res) => {
  try {
    const { status, search, hasSuggestions } = req.query;
    const films = await fetchFilms({ status, search, hasSuggestions });
    return res.json(films);
  } catch (error) {
    console.error("❌ Erreur getFilms:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des films" });
  }
};

/**
 * GET /api/films/stats
 * KPIs pour le DashboardHome.
 */
export const getStats = async (req, res) => {
  try {
    const stats = await fetchFilmsStats();
    return res.json(stats);
  } catch (error) {
    console.error("❌ Erreur getStats:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors du calcul des statistiques" });
  }
};

/**
 * GET /api/films/:id
 * Détail complet d'un film (admin) : réalisateur, jurys, votes + commentaires.
 */
export const getOne = async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
    const film = await fetchFilmById(filmId);
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur getOne:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * PUT /api/films/:id/status
 * Changer le statut d'un film (transitions validées côté service).
 * Body : { status: "APPROVED" }
 */
export const updateStatus = async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Le champ status est requis" });
    }

    const film = await changeFilmStatus(filmId, status, req.user.role);
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur updateStatus:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * POST /api/films/:id/request-modification
 * Demander des modifications au réalisateur.
 * Body : { message: "..." }
 */
export const requestModification = async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
    const { message } = req.body;

    if (!message || String(message).trim() === "") {
      return res
        .status(400)
        .json({ error: "Le message de modification est obligatoire" });
    }

    const film = await requestModificationService(
      filmId,
      message.trim(),
      req.user.id,
    );
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur requestModification:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * GET /api/films/edit/:token
 * Récupérer le film à modifier via le token du réalisateur (public).
 */
export const getByEditToken = async (req, res) => {
  try {
    const film = await fetchFilmByEditToken(req.params.token);
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur getByEditToken:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * PUT /api/films/edit/:token
 * Appliquer les corrections du réalisateur (public).
 * Body : { title, description, youtubeUrl, aiToolsUsed }
 */
export const applyEdit = async (req, res) => {
  try {
    const { title, description, youtubeUrl, aiToolsUsed } = req.body;
    const film = await applyFilmEditService(req.params.token, {
      title,
      description,
      youtubeUrl,
      aiToolsUsed,
    });
    return res.json({ message: "Modifications enregistrées", film });
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur applyEdit:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * GET /api/films/track/:token
 * Suivi public d'un film via le submissionToken reçu par email (sans auth).
 * Retourne uniquement les champs non-sensibles : titre, statut, pays, dates.
 */
export const trackFilm = async (req, res) => {
  try {
    const film = await fetchFilmBySubmissionToken(req.params.token);
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur trackFilm:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * PUT /api/films/:id/assign
 * Assigner une liste de jurys à un film (remplace la liste existante).
 * Body : { userIds: [1, 2, 3] }
 */
export const assign = async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res
        .status(400)
        .json({ error: "userIds doit être un tableau d'IDs" });
    }

    const film = await assignUsersToFilm(filmId, userIds.map(Number));
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur assign:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * POST /api/films/upload-video
 * Upload d'une vidéo vers Scaleway S3
 * Multipart form-data avec le fichier vidéo
 */
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const { buffer, originalname, mimetype } = req.file;

    // Upload vers S3
    const { url, key } = await uploadFileToS3(buffer, originalname, mimetype);

    return res.status(200).json({
      message: "Vidéo uploadée avec succès",
      url,
      key,
    });
  } catch (error) {
    console.error("❌ Erreur uploadVideo:", error);
    return res.status(500).json({ error: error.message });
  }
};
