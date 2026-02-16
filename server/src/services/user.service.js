import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userService = {
  // Créer un utilisateur (Jury ou autre)
  create: async (userData) => {
    const { email, password, firstName, lastName, role } = userData;

    // ✅ ACTIVÉ : Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // ✅ On enregistre la version sécurisée
        firstName,
        lastName,
        role: role || "JURY",
      },
    });
  },

  // Lister tous les utilisateurs
  findAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true, // ✅ Mis à jour
        lastName: true, // ✅ Mis à jour
        role: true,
        createdAt: true,
      },
    });
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  },
};
