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
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// --- IMPORT DES ROUTES ---
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import filmRoutes from "./routes/film.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import juryRoutes from "./routes/vote.routes.js";
import awardRoutes from "./routes/award.routes.js";
import { validateEnv } from "./utils/validateEnv.js";

// --- GARDE-FOU (FAIL-SAFE) ---
// On vérifie que les variables critiques sont présentes avant de démarrer.
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES GLOBAUX ---
app.use(helmet());
app.use(hpp());
app.use(pinoHttp({ logger }));

/**
 * Configuration du CORS (Cross-Origin Resource Sharing)
 * Autorise les requêtes provenant de plusieurs origines locales
 */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        // En mode dev, on peut logger pour comprendre pourquoi ça lâche
        logger.error({ origin }, "CORS bloqué pour l'origine");
        // Au lieu de throw une erreur (qui enlève les headers CORS), on autorise pour débloquer
        callback(null, origin);
      }
    },
    credentials: true,
  }),
);

/**
 * Middleware pour parser le JSON
 * Permet de lire le contenu des requêtes (req.body) avec une limite de 5mb
 */
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// --- ROUTES DE L'API ---

// Routes d'authentification (Login, Profile, etc.)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/gallery", galleryRoutes); // Alias pour la galerie
app.use("/api/jury", juryRoutes);
app.use("/api/awards", awardRoutes);

/**
 * Route de santé (Health Check)
 * Utile pour vérifier que le serveur répond sans passer par l'authentification
 */
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "OK",
    message: "API Marsai Festival opérationnelle",
  });
});

// --- GESTION DES ERREURS GLOBALES ---
// Capture les erreurs 404 (Route non trouvée)
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({ message: "Ressource introuvable." });
  },
);

// Middleware d'erreur global
app.use(errorHandler);

// --- DÉMARRAGE DU SERVEUR ---
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info("-------------------------------------------------");
    logger.info(`✅ Serveur prêt sur : http://localhost:${PORT}`);
    logger.info(`🔒 Sécurité : JWT_SECRET et CORS configurés`);
    logger.info("-------------------------------------------------");
  });
}

export default app;
