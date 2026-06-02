import { z } from "zod";

const ROLES = ["ADMIN", "MODERATOR", "JURY"] as const;

export const createUserSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  role: z.enum(ROLES, { message: "Rôle invalide" }).default("JURY"),
  password: z.string().min(8, "Mot de passe trop court").optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(ROLES, { message: "Rôle invalide" }).optional(),
  password: z.string().min(8, "Mot de passe trop court").optional(),
});
