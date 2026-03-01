import express from "express";
import { getJuryFilms, getJuryFilmDetail, cast, addComment, remove } from "../controllers/vote.controller.js";
import { verifyToken, isJury } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Films disponibles pour le vote (IN_REVIEW assignés)
router.get("/films", verifyToken, isJury, getJuryFilms);

// Détail d'un film pour évaluation
router.get("/films/:id", verifyToken, isJury, getJuryFilmDetail);

// Voter ou modifier son vote
router.post("/votes", verifyToken, isJury, cast);

// Ajouter un commentaire interne (historique cumulatif) — nécessite un vote existant
router.post("/votes/:filmId/comments", verifyToken, isJury, addComment);

// Supprimer son vote
router.delete("/votes/:filmId", verifyToken, isJury, remove);

export default router;
