import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// Route POST /login
router.post("/login", login);

export default router;
