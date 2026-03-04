import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";

const router = express.Router();

/**
 * ROUTES : Gestion des Utilisateurs
 * Toutes ces routes sont protégées : il faut être connecté ET être Admin.
 */

// Récupérer la liste des membres
router.get("/", verifyToken, isAdmin, userController.getAll);

// Créer un nouveau membre (Jury ou Admin)
router.post("/", verifyToken, isAdmin, validate(createUserSchema), userController.register);

// Déclencher l'envoi du Magic Link
router.post("/:id/invite", verifyToken, isAdmin, userController.sendInvite);

// Modifier un membre
router.put("/:id", verifyToken, isAdmin, validate(updateUserSchema), userController.update);

// Supprimer un membre
router.delete("/:id", verifyToken, isAdmin, userController.delete);

export default router;
