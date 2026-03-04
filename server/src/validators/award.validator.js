import { z } from "zod";

export const categorySchema = z.object({
  name:         z.string().min(1, "Nom de catégorie requis"),
  description:  z.string().optional(),
  edition:      z.string().min(4, "Édition requise (ex: 2026)"),
  displayOrder: z.number().int().min(0).optional().default(0),
});

export const nominationSchema = z.object({
  filmId:     z.number().int().positive("filmId requis"),
  categoryId: z.number().int().positive("categoryId requis"),
});
