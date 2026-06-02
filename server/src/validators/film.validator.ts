import { z } from "zod";

const STATUSES = [
  "SUBMITTED",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "TO_MODIFY",
  "SELECTION",
  "FINALIST",
  "AWARD",
] as const;

export const submitFilmSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  bio: z.string().optional(),
  instagram: z.string().optional(),
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(10, "Description trop courte"),
  country: z.string().min(1, "Pays requis"),
  language: z.string().optional(),
  aiToolsUsed: z.string().min(1, "Outils IA requis"),
  youtubeUrl: z
    .string()
    .url("URL YouTube invalide")
    .optional()
    .or(z.literal("")),
});

export const updateStatusSchema = z.object({
  status: z.enum(STATUSES, { message: "Statut invalide" }),
});

export const assignSchema = z.object({
  userIds: z.array(z.number().int().positive()),
});

export const requestModificationSchema = z.object({
  message: z.string().min(10, "Message trop court"),
});

export const applyEditSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  aiToolsUsed: z.string().optional(),
});
