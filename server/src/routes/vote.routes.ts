import express from "express";
import { getJuryFilms, getJuryFilmDetail, cast, addComment, remove } from "../controllers/vote.controller.js";
import { verifyToken, isJury } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { castVoteSchema, addCommentSchema } from "@marsai/validators";

const router = express.Router();

// Films disponibles pour le vote (IN_REVIEW assignés)
router.get("/films", verifyToken, isJury, getJuryFilms);

// Détail d'un film pour évaluation
router.get("/films/:id", verifyToken, isJury, getJuryFilmDetail);

// Voter ou modifier son vote
router.post("/votes", verifyToken, isJury, validate(castVoteSchema), cast);

// Ajouter un commentaire interne (historique cumulatif) — nécessite un vote existant
router.post("/votes/:filmId/comments", verifyToken, isJury, validate(addCommentSchema), addComment);

// Supprimer son vote
router.delete("/votes/:filmId", verifyToken, isJury, remove);

export default router;
