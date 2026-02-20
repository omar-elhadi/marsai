import express from "express";
import * as authController from "../controllers/auth.controller.js";
// On garde les imports car on va les utiliser sur les vraies routes bientôt
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route publique pour se connecter
router.post("/login", authController.login);
router.get("/verify-token", authController.verifyToken);

// Les futures routes protégées viendront ici...

export default router;
