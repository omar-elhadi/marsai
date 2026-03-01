import express from "express";
import { submit, getFilms, getStats, getOne, updateStatus, assign, requestModification, getByEditToken, applyEdit, trackFilm } from "../controllers/film.controller.js";
import { verifyToken, isAdminOrModerator } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --- ROUTES PUBLIQUES ---
// Soumission d'un film par un réalisateur (pas d'auth requise)
router.post("/submit", submit);

// Récupérer le film à modifier via le token submitter — AVANT /:id pour éviter la capture
router.get("/edit/:token", getByEditToken);
// Appliquer les corrections du réalisateur
router.put("/edit/:token", applyEdit);

// Suivi public d'un film via le submissionToken reçu par email — sans auth
router.get("/track/:token", trackFilm);

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

// Demander des modifications au réalisateur (envoie email + génère token 7j)
router.post("/:id/request-modification", verifyToken, isAdminOrModerator, requestModification);

export default router;
