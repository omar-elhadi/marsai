import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.js"; // Import du nouveau middleware

const router = express.Router();

// Route publique pour se connecter
router.post("/login", authController.login);

/**
 * ROUTE DE TEST : GET /api/auth/profile
 * On place 'verifyToken' juste avant la fonction finale.
 * Express exécutera verifyToken, et si tout va bien (next()), il exécutera la suite.
 */
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: req.user, // On affiche ce que le middleware a décodé
  });
});

export default router;
