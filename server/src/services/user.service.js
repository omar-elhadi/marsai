import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userService = {
  // Créer un utilisateur
  create: async (userData) => {
    const { email, password, firstName, lastName, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "JURY",
      },
    });
  },

  // --- NOUVELLE MÉTHODE : Mettre à jour un utilisateur ---
  update: async (id, userData) => {
    const dataToUpdate = { ...userData };

    // Si l'admin a saisi un nouveau mot de passe, on le hache
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    } else {
      // Si le mot de passe est vide ou absent, on le supprime de l'objet
      // pour que Prisma ne tente pas de l'écraser par du vide
      delete dataToUpdate.password;
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      select: {
        // On définit ce qu'on renvoie au front (pas le password !)
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  },

  // Lister tous les utilisateurs
  findAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
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
