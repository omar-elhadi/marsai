import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Créer un nouveau jury (Admin uniquement)
 */
router.post("/", verifyToken, isAdmin, userController.create);

/**
 * @route   GET /api/users
 * @desc    Lister tous les utilisateurs (Admin uniquement)
 */
router.get("/", verifyToken, isAdmin, userController.list);

/**
 * @route   PUT /api/users/:id
 * @desc    Modifier un utilisateur (Admin uniquement)
 */
router.put("/:id", verifyToken, isAdmin, userController.update); // <--- AJOUTE CETTE LIGNE

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur (Admin uniquement)
 */
router.delete("/:id", verifyToken, isAdmin, userController.remove);

export default router;
