"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nominationSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
  name: zod_1.z.string().min(1, "Nom de catégorie requis"),
  description: zod_1.z.string().optional(),
  edition: zod_1.z.string().min(4, "Édition requise (ex: 2026)"),
  displayOrder: zod_1.z.number().int().min(0).optional().default(0),
});
exports.nominationSchema = zod_1.z.object({
  filmId: zod_1.z.number().int().positive("filmId requis"),
  categoryId: zod_1.z.number().int().positive("categoryId requis"),
});
