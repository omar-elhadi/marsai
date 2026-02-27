import express from "express";
import { getJuryFilms, cast, remove } from "../controllers/vote.controller.js";
import { verifyToken, isJury } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Films disponibles pour le vote (FINALIST + SELECTION)
router.get("/films", verifyToken, isJury, getJuryFilms);

// Voter ou modifier son vote
router.post("/votes", verifyToken, isJury, cast);

// Supprimer son vote
router.delete("/votes/:filmId", verifyToken, isJury, remove);

export default router;
