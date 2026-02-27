import {
  submitFilm,
  getFilms          as fetchFilms,
  getFilmsStats     as fetchFilmsStats,
  changeFilmStatus,
  assignUsersToFilm,
} from "../services/film.service.js";

/**
 * POST /api/films/submit
 * Reçoit le formulaire de soumission, crée le Submitter + Film, envoie l'email.
 */
export const submit = async (req, res) => {
  try {
    const {
      firstName, lastName, email,
      bio, instagram,
      title, description, country, language,
      aiToolsUsed, youtubeUrl,
    } = req.body;

    // Validation des champs obligatoires
    const required = { firstName, lastName, email, title, description, country, aiToolsUsed };
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
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      bio, instagram,
      title:       title.trim(),
      description: description.trim(),
      country:     country.trim(),
      language,
      aiToolsUsed: aiToolsUsed.trim(),
      youtubeUrl,
    });

    return res.status(201).json({
      message:         "Film soumis avec succès",
      submissionToken: result.submissionToken,
      filmId:          result.film.id,
    });

  } catch (error) {
    console.error("❌ Erreur submit film:", error);
    return res.status(500).json({ error: "Erreur lors de la soumission du film" });
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
    return res.status(500).json({ error: "Erreur lors de la récupération des films" });
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
    return res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
  }
};

/**
 * PUT /api/films/:id/status
 * Changer le statut d'un film (transitions validées côté service).
 * Body : { status: "APPROVED" }
 */
export const updateStatus = async (req, res) => {
  try {
    const filmId   = parseInt(req.params.id);
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
 * PUT /api/films/:id/assign
 * Assigner une liste de jurys à un film (remplace la liste existante).
 * Body : { userIds: [1, 2, 3] }
 */
export const assign = async (req, res) => {
  try {
    const filmId  = parseInt(req.params.id);
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "userIds doit être un tableau d'IDs" });
    }

    const film = await assignUsersToFilm(filmId, userIds.map(Number));
    return res.json(film);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur assign:", error.message);
    return res.status(code).json({ error: error.message });
  }
};
