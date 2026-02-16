import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const loginAdmin = async (email, password) => {
  // 1. Chercher l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. Vérification existence (on enlève la barrière ADMIN ici)
  if (!user) {
    throw new Error("Identifiants incorrects.");
  }

  // 3. Vérification mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Identifiants incorrects.");
  }

  // 4. Génération du Token
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  // 5. Retour des infos (sans le mot de passe)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};
