import express from "express";
import rateLimit from "express-rate-limit";
import { submit, getFilms, getStats, getOne, updateStatus, assign, requestModification, getByEditToken, applyEdit, trackFilm } from "../controllers/film.controller.js";
import { verifyToken, isAdminOrModerator } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { submitFilmSchema, updateStatusSchema, assignSchema, requestModificationSchema, applyEditSchema } from "../validators/film.validator.js";

const router = express.Router();

// Limiteur pour la soumission publique : 5 soumissions / heure / IP
// Évite le spam du formulaire public (bot, abus)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Vous avez atteint la limite de soumissions. Réessayez dans une heure.",
  },
});

// --- ROUTES PUBLIQUES ---
// Soumission d'un film par un réalisateur (pas d'auth requise)
router.post("/submit", submitLimiter, validate(submitFilmSchema), submit);

// Récupérer le film à modifier via le token submitter — AVANT /:id pour éviter la capture
router.get("/edit/:token", getByEditToken);
// Appliquer les corrections du réalisateur
router.put("/edit/:token", validate(applyEditSchema), applyEdit);

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
router.put("/:id/status", verifyToken, isAdminOrModerator, validate(updateStatusSchema), updateStatus);

// Assignation des jurys à un film
router.put("/:id/assign", verifyToken, isAdminOrModerator, validate(assignSchema), assign);

// Demander des modifications au réalisateur (envoie email + génère token 7j)
router.post("/:id/request-modification", verifyToken, isAdminOrModerator, validate(requestModificationSchema), requestModification);

export default router;
