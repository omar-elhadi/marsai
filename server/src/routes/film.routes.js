import express from "express";
import { submit } from "../controllers/film.controller.js";

const router = express.Router();

/**
 * ROUTES FILMS — publiques (pas d'auth requise pour la soumission)
 */

// Soumission d'un film par un réalisateur
router.post("/submit", submit);

export default router;
