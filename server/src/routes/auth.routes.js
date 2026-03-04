import express from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

// Limiteur strict pour le login admin : 10 tentatives / 15 min / IP
// Protège contre le brute force sur le seul endpoint de connexion admin
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre glissante de 15 minutes
  max: 10,
  standardHeaders: true,    // renvoie les headers RateLimit-* standard (RFC 6585)
  legacyHeaders: false,
  message: {
    error: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

// Limiteur pour les magic links jury : 20 vérifications / heure / IP
// Un magic link est à usage unique — 20 est largement suffisant
const verifyTokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Trop de tentatives. Réessayez dans une heure.",
  },
});

// Route publique pour se connecter
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.get("/verify-token", verifyTokenLimiter, authController.verifyToken);

// Déconnexion — efface le cookie httpOnly côté serveur
router.post("/logout", (req, res) => {
  res.clearCookie("marsai_token", {
    httpOnly: true,
    sameSite: "strict",
    secure:   process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Déconnecté." });
});

export default router;
