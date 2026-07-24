"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEditSchema =
  exports.requestModificationSchema =
  exports.assignSchema =
  exports.updateStatusSchema =
  exports.submitFilmSchema =
    void 0;
const zod_1 = require("zod");
const STATUSES = [
  "SUBMITTED",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "TO_MODIFY",
  "SELECTION",
  "FINALIST",
  "AWARD",
];
exports.submitFilmSchema = zod_1.z.object({
  firstName: zod_1.z.string().min(1, "Prénom requis"),
  lastName: zod_1.z.string().min(1, "Nom requis"),
  email: zod_1.z.string().email("Email invalide"),
  bio: zod_1.z.string().optional(),
  instagram: zod_1.z.string().optional(),
  title: zod_1.z.string().min(1, "Titre requis"),
  description: zod_1.z.string().min(10, "Description trop courte"),
  country: zod_1.z.string().min(1, "Pays requis"),
  language: zod_1.z.string().optional(),
  aiToolsUsed: zod_1.z.string().min(1, "Outils IA requis"),
  youtubeUrl: zod_1.z
    .string()
    .url("URL YouTube invalide")
    .optional()
    .or(zod_1.z.literal("")),
});
exports.updateStatusSchema = zod_1.z.object({
  status: zod_1.z.enum(STATUSES, { message: "Statut invalide" }),
});
exports.assignSchema = zod_1.z.object({
  userIds: zod_1.z.array(zod_1.z.number().int().positive()),
});
exports.requestModificationSchema = zod_1.z.object({
  message: zod_1.z.string().min(10, "Message trop court"),
});
exports.applyEditSchema = zod_1.z.object({
  title: zod_1.z.string().min(1).optional(),
  description: zod_1.z.string().min(10).optional(),
  youtubeUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
  aiToolsUsed: zod_1.z.string().optional(),
});
