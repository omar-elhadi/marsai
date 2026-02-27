import {
  getFilmsForJury,
  castVote,
  removeVote,
} from "../services/vote.service.js";

/**
 * GET /api/jury/films
 * Films FINALIST/SELECTION disponibles pour le vote, avec le vote courant du jury.
 */
export const getJuryFilms = async (req, res) => {
  try {
    const films = await getFilmsForJury(req.user.id);
    return res.json(films);
  } catch (error) {
    console.error("❌ Erreur getJuryFilms:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération des films" });
  }
};

/**
 * POST /api/jury/votes
 * Body : { filmId, sentiment: "LIKE"|"DISLIKE" }
 * Crée ou met à jour le vote du jury authentifié (upsert).
 */
export const cast = async (req, res) => {
  try {
    const { filmId, sentiment } = req.body;

    if (!filmId || !sentiment) {
      return res.status(400).json({ error: "filmId et sentiment sont requis" });
    }
    if (!["LIKE", "DISLIKE"].includes(sentiment)) {
      return res.status(400).json({ error: "sentiment invalide — valeurs : LIKE | DISLIKE" });
    }

    const vote = await castVote(parseInt(filmId), req.user.id, sentiment);
    return res.json(vote);
  } catch (error) {
    console.error("❌ Erreur cast vote:", error);
    return res.status(500).json({ error: "Erreur lors du vote" });
  }
};

/**
 * DELETE /api/jury/votes/:filmId
 * Supprime le vote du jury authentifié sur ce film.
 */
export const remove = async (req, res) => {
  try {
    const filmId = parseInt(req.params.filmId);
    await removeVote(filmId, req.user.id);
    return res.json({ message: "Vote supprimé" });
  } catch (error) {
    // P2025 = enregistrement introuvable dans Prisma
    const code = error.code === "P2025" ? 404 : 500;
    console.error("❌ Erreur remove vote:", error.message);
    return res.status(code).json({ error: "Vote introuvable ou erreur serveur" });
  }
};
