import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userService = {
  create: async (userData) => {
    const { email, password, firstName, lastName, role } = userData;
    const data = {
      email,
      firstName,
      lastName,
      role: role || "JURY",
    };

    // LOGIQUE CRUCIALE : On ne hache le mot de passe que s'il est fourni
    if (password && password !== "") {
      data.password = await bcrypt.hash(password, 10);
    }

    return await prisma.user.create({
      data,
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

  update: async (id, userData) => {
    const dataToUpdate = { ...userData };
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    } else {
      delete dataToUpdate.password;
    }
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  },

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

  delete: async (id) => {
    return await prisma.user.delete({ where: { id: parseInt(id) } });
  },
};
