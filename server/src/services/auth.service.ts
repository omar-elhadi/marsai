import argon2 from "argon2";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { AppError } from "../utils/AppError.js";

export const loginAdmin = async (email: string, password: string) => {
  // 1. Chercher l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. Vérification existence (on enlève la barrière ADMIN ici)
  if (!user) {
    throw new AppError("Identifiants incorrects.", 401);
  }

  // 3. Vérification mot de passe
  if (!user.password) {
    throw new AppError("Identifiants incorrects.", 401);
  }
  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new AppError("Identifiants incorrects.", 401);
  }

  // 4. Génération du Token
  // Payload harmonisé : id (pas sub) pour cohérence avec les middlewares et le frontend
  const jwtSecret = process.env.JWT_SECRET || "";
  if (!jwtSecret) {
    throw new AppError("JWT_SECRET non configuré.", 500);
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "24h" },
  );

  // 5. Retour des infos (sans le mot de passe)
  // firstName + lastName (le modèle User n'a pas de champ name)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};
