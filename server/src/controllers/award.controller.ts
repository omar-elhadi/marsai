import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
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
export const getSelection = catchAsync(
  async (req: any, res: any, next: any) => {
    const films = await getSelectionCandidates();
    return res.json(films);
  },
);

// ─── CATÉGORIES ───────────────────────────────────────────────────────────────

/**
 * GET /api/awards/categories?edition=2026
 */
export const listCategories = catchAsync(
  async (req: any, res: any, next: any) => {
    const { edition } = req.query;
    if (!edition) {
      return res.status(400).json({ error: "Le paramètre edition est requis" });
    }
    const categories = await getCategories(edition);
    return res.json(categories);
  },
);

/**
 * POST /api/awards/categories
 * Body : { edition, name, description?, displayOrder? }
 */
export const addCategory = catchAsync(async (req: any, res: any, next: any) => {
  const { edition, name, description, displayOrder } = req.body;
  const category = await createCategory({
    edition,
    name,
    description,
    displayOrder,
  });
  return res.status(201).json(category);
});

/**
 * PUT /api/awards/categories/:id
 * Body : { name?, description?, displayOrder? }
 */
export const editCategory = catchAsync(
  async (req: any, res: any, next: any) => {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId))
      return res.status(400).json({ message: "ID invalide" });
    const { name, description, displayOrder } = req.body;
    const category = await updateCategory(categoryId, {
      name,
      description,
      displayOrder,
    });
    return res.json(category);
  },
);

/**
 * DELETE /api/awards/categories/:id
 */
export const removeCategory = catchAsync(
  async (req: any, res: any, next: any) => {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId))
      return res.status(400).json({ message: "ID invalide" });
    await deleteCategory(categoryId);
    return res.json({ success: true });
  },
);

// ─── NOMINATIONS ──────────────────────────────────────────────────────────────

/**
 * POST /api/awards/nominations
 * Body : { filmId, categoryId }
 * Nomine un film dans une catégorie → film FINALIST
 */
export const addNomination = catchAsync(
  async (req: any, res: any, next: any) => {
    const { filmId, categoryId } = req.body;
    if (!filmId || !categoryId) {
      return res
        .status(400)
        .json({ error: "filmId et categoryId sont requis" });
    }
    const nomination = await nominateFilm(Number(filmId), Number(categoryId));
    return res.status(201).json(nomination);
  },
);

/**
 * DELETE /api/awards/nominations/:id
 * Retire une nomination → film repasse en SELECTION si plus aucune nomination
 */
export const deleteNomination = catchAsync(
  async (req: any, res: any, next: any) => {
    const nominationId = parseInt(req.params.id);
    if (isNaN(nominationId))
      return res.status(400).json({ message: "ID invalide" });
    const result = await removeNomination(nominationId);
    return res.json(result);
  },
);

// ─── GAGNANT ──────────────────────────────────────────────────────────────────

/**
 * PUT /api/awards/nominations/:id/winner
 * Désigne le gagnant d'une catégorie → film AWARD
 */
export const markWinner = catchAsync(async (req: any, res: any, next: any) => {
  const nominationId = parseInt(req.params.id);
  if (isNaN(nominationId))
    return res.status(400).json({ message: "ID invalide" });
  const result = await setWinner(nominationId);
  return res.json(result);
});

/**
 * DELETE /api/awards/nominations/:id/winner
 * Retire le statut gagnant → film repasse en FINALIST
 */
export const clearWinner = catchAsync(async (req: any, res: any, next: any) => {
  const nominationId = parseInt(req.params.id);
  if (isNaN(nominationId))
    return res.status(400).json({ message: "ID invalide" });
  const result = await unsetWinner(nominationId);
  return res.json(result);
});

// ─── PAGE PUBLIQUE ────────────────────────────────────────────────────────────

/**
 * GET /api/awards/palmares?edition=2026
 * Palmarès public — pas d'authentification requise
 */
export const palmares = catchAsync(async (req: any, res: any, next: any) => {
  const { edition } = req.query;
  if (!edition) {
    return res.status(400).json({ error: "Le paramètre edition est requis" });
  }
  const data = await getPalmares(edition);
  return res.json(data);
});

/**
 * GET /api/awards/editions
 * Liste des années ayant des catégories — public
 */
export const editions = catchAsync(async (req: any, res: any, next: any) => {
  const data = await getEditions();
  return res.json(data);
});
