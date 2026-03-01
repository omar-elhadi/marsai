import {
  getSelectionCandidates,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  nominateFilm,
  removeNomination,
  setWinner,
  unsetWinner,
  getPalmares,
  getEditions,
} from "../services/award.service.js";

// ─── SÉLECTION ───────────────────────────────────────────────────────────────

/**
 * GET /api/awards/selection
 * Films APPROVED (+ SELECTION/FINALIST/AWARD) triés par note pour aider
 * l'admin à constituer la sélection officielle.
 */
export const getSelection = async (req, res) => {
  try {
    const films = await getSelectionCandidates();
    return res.json(films);
  } catch (error) {
    console.error("❌ Erreur getSelection:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ─── CATÉGORIES ───────────────────────────────────────────────────────────────

/**
 * GET /api/awards/categories?edition=2026
 */
export const listCategories = async (req, res) => {
  try {
    const { edition } = req.query;
    if (!edition) {
      return res.status(400).json({ error: "Le paramètre edition est requis" });
    }
    const categories = await getCategories(edition);
    return res.json(categories);
  } catch (error) {
    console.error("❌ Erreur listCategories:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/awards/categories
 * Body : { edition, name, description?, displayOrder? }
 */
export const addCategory = async (req, res) => {
  try {
    const { edition, name, description, displayOrder } = req.body;
    const category = await createCategory({ edition, name, description, displayOrder });
    return res.status(201).json(category);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur addCategory:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * PUT /api/awards/categories/:id
 * Body : { name?, description?, displayOrder? }
 */
export const editCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description, displayOrder } = req.body;
    const category = await updateCategory(categoryId, { name, description, displayOrder });
    return res.json(category);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur editCategory:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * DELETE /api/awards/categories/:id
 */
export const removeCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    await deleteCategory(categoryId);
    return res.json({ success: true });
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur removeCategory:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

// ─── NOMINATIONS ──────────────────────────────────────────────────────────────

/**
 * POST /api/awards/nominations
 * Body : { filmId, categoryId }
 * Nomine un film dans une catégorie → film FINALIST
 */
export const addNomination = async (req, res) => {
  try {
    const { filmId, categoryId } = req.body;
    if (!filmId || !categoryId) {
      return res.status(400).json({ error: "filmId et categoryId sont requis" });
    }
    const nomination = await nominateFilm(Number(filmId), Number(categoryId));
    return res.status(201).json(nomination);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur addNomination:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * DELETE /api/awards/nominations/:id
 * Retire une nomination → film repasse en SELECTION si plus aucune nomination
 */
export const deleteNomination = async (req, res) => {
  try {
    const nominationId = parseInt(req.params.id);
    const result = await removeNomination(nominationId);
    return res.json(result);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur deleteNomination:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

// ─── GAGNANT ──────────────────────────────────────────────────────────────────

/**
 * PUT /api/awards/nominations/:id/winner
 * Désigne le gagnant d'une catégorie → film AWARD
 */
export const markWinner = async (req, res) => {
  try {
    const nominationId = parseInt(req.params.id);
    const result = await setWinner(nominationId);
    return res.json(result);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur markWinner:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

/**
 * DELETE /api/awards/nominations/:id/winner
 * Retire le statut gagnant → film repasse en FINALIST
 */
export const clearWinner = async (req, res) => {
  try {
    const nominationId = parseInt(req.params.id);
    const result = await unsetWinner(nominationId);
    return res.json(result);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur clearWinner:", error.message);
    return res.status(code).json({ error: error.message });
  }
};

// ─── PAGE PUBLIQUE ────────────────────────────────────────────────────────────

/**
 * GET /api/awards/palmares?edition=2026
 * Palmarès public — pas d'authentification requise
 */
export const palmares = async (req, res) => {
  try {
    const { edition } = req.query;
    if (!edition) {
      return res.status(400).json({ error: "Le paramètre edition est requis" });
    }
    const data = await getPalmares(edition);
    return res.json(data);
  } catch (error) {
    console.error("❌ Erreur palmares:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/awards/editions
 * Liste des années ayant des catégories — public
 */
export const editions = async (req, res) => {
  try {
    const data = await getEditions();
    return res.json(data);
  } catch (error) {
    console.error("❌ Erreur editions:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
