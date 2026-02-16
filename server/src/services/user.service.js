import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userService = {
  // Créer un utilisateur (Jury ou autre)
  create: async (userData) => {
    const { email, password, name, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        name,
        role: role || "JURY",
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, role: true },
    });
  },

  // Lister tous les utilisateurs
  findAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
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
