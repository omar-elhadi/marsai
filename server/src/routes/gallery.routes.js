import express from "express";
import {
  getGallery,
  getFilmDetail,
} from "../controllers/gellery.controller.js";
const router = express.Router();

// Liste de tous les films APPROVED
router.get("/", getGallery);

// Détail d'un film spécifique (APPROVED seulement)
router.get("/:id", getFilmDetail);

export default router;
