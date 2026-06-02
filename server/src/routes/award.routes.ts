import express from "express";
import {
  getSelection,
  listCategories,
  addCategory,
  editCategory,
  removeCategory,
  addNomination,
  deleteNomination,
  markWinner,
  clearWinner,
  palmares,
  editions,
} from "../controllers/award.controller.js";
import {
  verifyToken,
  isAdmin,
  isAdminOrModerator,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categorySchema, nominationSchema } from "../validators/index.js";

const router = express.Router();

// ─── ROUTES PUBLIQUES (sans auth) ────────────────────────────────────────────

// Palmarès public par édition
router.get("/palmares", palmares);
// Éditions disponibles (années)
router.get("/editions", editions);

// ─── ROUTES ADMIN + MODERATOR ────────────────────────────────────────────────

// Candidats à la sélection (films APPROVED triés par note)
router.get("/selection", verifyToken, isAdminOrModerator, getSelection);

// Catégories
router.get("/categories", verifyToken, isAdminOrModerator, listCategories);
router.post(
  "/categories",
  verifyToken,
  isAdmin,
  validate(categorySchema),
  addCategory,
);
router.put(
  "/categories/:id",
  verifyToken,
  isAdmin,
  validate(categorySchema),
  editCategory,
);
router.delete("/categories/:id", verifyToken, isAdmin, removeCategory);

// Nominations — ADMIN uniquement (impact sur le statut des films)
router.post(
  "/nominations",
  verifyToken,
  isAdmin,
  validate(nominationSchema),
  addNomination,
);
router.delete("/nominations/:id", verifyToken, isAdmin, deleteNomination);
router.put("/nominations/:id/winner", verifyToken, isAdmin, markWinner);
router.delete("/nominations/:id/winner", verifyToken, isAdmin, clearWinner);

export default router;
