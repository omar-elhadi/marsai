import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Sécurité : verifyToken vérifie le JWT, isAdmin vérifie que le role est 'ADMIN'
router.post("/", verifyToken, isAdmin, userController.create);
router.get("/", verifyToken, isAdmin, userController.list);
router.put("/:id", verifyToken, isAdmin, userController.update);
router.delete("/:id", verifyToken, isAdmin, userController.remove);

export default router;
