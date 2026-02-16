import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Créer un nouveau jury (Admin uniquement)
 * @access  Private/Admin
 */
router.post("/", verifyToken, isAdmin, userController.create);

/**
 * @route   GET /api/users
 * @desc    Lister tous les utilisateurs (Admin uniquement)
 * @access  Private/Admin
 */
router.get("/", verifyToken, isAdmin, userController.list);

export default router;
