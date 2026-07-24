"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const ROLES = ["ADMIN", "MODERATOR", "JURY"];
exports.createUserSchema = zod_1.z.object({
  email: zod_1.z.string().email("Email invalide"),
  firstName: zod_1.z.string().min(1, "Prénom requis"),
  lastName: zod_1.z.string().min(1, "Nom requis"),
  role: zod_1.z.enum(ROLES, { message: "Rôle invalide" }).default("JURY"),
  password: zod_1.z.string().min(8, "Mot de passe trop court").optional(),
});
exports.updateUserSchema = zod_1.z.object({
  email: zod_1.z.string().email("Email invalide").optional(),
  firstName: zod_1.z.string().min(1).optional(),
  lastName: zod_1.z.string().min(1).optional(),
  role: zod_1.z.enum(ROLES, { message: "Rôle invalide" }).optional(),
  password: zod_1.z.string().min(8, "Mot de passe trop court").optional(),
});
