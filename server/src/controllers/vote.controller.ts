import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import {
  getFilmsForJury,
  getFilmForJury,
  castVote,
  addCommentToVote,
  removeVote,
} from "../services/vote.service.js";

/**
 * GET /api/jury/films
 * Films IN_REVIEW assignés au jury, avec le vote courant.
 */
export const getJuryFilms = catchAsync(
  async (req: any, res: any, next: any) => {
    const films = await getFilmsForJury(req.user.id);
    return res.json(films);
  },
);

/**
 * GET /api/jury/films/:id
 * Détail d'un film pour le jury — vérifie l'assignation.
 */
export const getJuryFilmDetail = catchAsync(
  async (req: any, res: any, next: any) => {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
    if (isNaN(filmId))
      return res.status(400).json({ error: "ID film invalide" });
    const film = await getFilmForJury(filmId, req.user.id);
    return res.json(film);
  },
);

/**
 * POST /api/jury/votes
 * Body : { filmId, sentiment: "LIKE"|"DISLIKE", rating?: 1-10, suggestModification?, comment? }
 * Crée ou met à jour le vote du jury authentifié (upsert).
 */
export const cast = catchAsync(async (req: any, res: any, next: any) => {
  const { filmId, sentiment, suggestModification, comment, rating } = req.body;

  if (!filmId || !sentiment) {
    return res.status(400).json({ error: "filmId et sentiment sont requis" });
  }
  if (!["LIKE", "DISLIKE"].includes(sentiment)) {
    return res
      .status(400)
      .json({ error: "sentiment invalide — valeurs : LIKE | DISLIKE" });
  }
  if (suggestModification && (!comment || String(comment).trim() === "")) {
    return res.status(400).json({
      error: "Un commentaire est obligatoire pour suggérer une modification",
    });
  }

  const vote = await castVote(parseInt(filmId), req.user.id, sentiment, {
    suggestModification: Boolean(suggestModification),
    comment: comment?.trim() || null,
    ratingOverride: rating ? parseInt(rating) : null,
  });
  return res.json(vote);
});

/**
 * POST /api/jury/votes/:filmId/comments
 * Body : { content }
 * Ajoute un commentaire interne (historique cumulatif) au vote existant.
 */
export const addComment = catchAsync(async (req: any, res: any, next: any) => {
  const filmId = parseInt(req.params.filmId);
  const { content } = req.body;

  if (!content || String(content).trim() === "") {
    return res
      .status(400)
      .json({ error: "Le commentaire ne peut pas être vide" });
  }

  const comment = await addCommentToVote(filmId, req.user.id, content);
  return res.status(201).json(comment);
});

/**
 * DELETE /api/jury/votes/:filmId
 * Supprime le vote du jury authentifié sur ce film.
 */
export const remove = catchAsync(async (req: any, res: any, next: any) => {
  const filmId = parseInt(req.params.filmId);
  await removeVote(filmId, req.user.id);
  return res.json({ message: "Vote supprimé" });
});
