import express from "express";
import { get, update } from "../controllers/settings.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", get);
router.put("/", verifyToken, isAdmin, update);

export default router;
