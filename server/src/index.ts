/**
 * POINT D'ENTRÉE DU SERVEUR - MARSAI FESTIVAL
 * Ce fichier configure le serveur Express, les middlewares de sécurité
 * et connecte les différentes routes de l'API.
 */

import "dotenv/config"; // Charge les variables d'environnement (.env)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";

// --- IMPORT DES ROUTES ---
import authRoutes  from "./routes/auth.routes.js";
import userRoutes  from "./routes/user.routes.js";
import filmRoutes  from "./routes/film.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import juryRoutes  from "./routes/vote.routes.js";
import awardRoutes from "./routes/award.routes.js";
import { validateEnv } from "./utils/validateEnv.js";

// --- GARDE-FOU (FAIL-SAFE) ---
// On vérifie que les variables critiques sont présentes avant de démarrer.
validateEnv();

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARES GLOBAUX ---
app.use(helmet());
app.use(hpp());

/**
 * Configuration du CORS (Cross-Origin Resource Sharing)
 * Autorise les requêtes provenant uniquement de l'URL définie dans le .env
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Autorise l'envoi de cookies/headers d'auth
  }),
);

/**
 * Middleware pour parser le JSON
 * Permet de lire le contenu des requêtes (req.body) avec une limite de 5mb
 */
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// --- ROUTES DE L'API ---

// Routes d'authentification (Login, Profile, etc.)
app.use("/api/auth",   authRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/films",  filmRoutes);
app.use("/api/gallery", galleryRoutes); // Alias pour la galerie
app.use("/api/jury",   juryRoutes);
app.use("/api/awards", awardRoutes);

/**
 * Route de santé (Health Check)
 * Utile pour vérifier que le serveur répond sans passer par l'authentification
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 API Marsai Festival opérationnelle",
  });
});

// --- GESTION DES ERREURS GLOBALES ---
// Capture les erreurs 404 (Route non trouvée)
app.use((req, res) => {
  res.status(404).json({ message: "Ressource introuvable." });
});

// --- DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
  console.log("-------------------------------------------------");
  console.log(`✅ Serveur prêt sur : http://localhost:${PORT}`);
  console.log(`🔒 Sécurité : JWT_SECRET et CORS configurés`);
  console.log("-------------------------------------------------");
});
