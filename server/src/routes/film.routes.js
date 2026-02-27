import express from "express";
import { submit, getFilms, getStats, getOne, updateStatus, assign } from "../controllers/film.controller.js";
import { verifyToken, isAdminOrModerator } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --- ROUTE PUBLIQUE ---
// Soumission d'un film par un réalisateur (pas d'auth requise)
router.post("/submit", submit);

// --- ROUTES PROTÉGÉES (ADMIN + MODERATOR) ---
// Liste des films avec filtres optionnels (?status=SUBMITTED&search=titre)
router.get("/", verifyToken, isAdminOrModerator, getFilms);

// KPIs du dashboard — IMPORTANT : doit être avant /:id pour ne pas être capturé
router.get("/stats", verifyToken, isAdminOrModerator, getStats);

// Détail complet d'un film (réalisateur, jurys, votes)
router.get("/:id", verifyToken, isAdminOrModerator, getOne);

// Changement de statut d'un film (transitions validées)
router.put("/:id/status", verifyToken, isAdminOrModerator, updateStatus);

// Assignation des jurys à un film
router.put("/:id/assign", verifyToken, isAdminOrModerator, assign);

export default router;
