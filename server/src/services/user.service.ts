import { PrismaClient, Role } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

interface CreateUserInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export const userService = {
  create: async (userData: CreateUserInput) => {
    const { email, password, firstName, lastName, role } = userData;
    const data: Record<string, unknown> = {
      email,
      firstName,
      lastName,
      role: role ?? "JURY",
    };

    if (password && password !== "") {
      data.password = await argon2.hash(password);
    }

    return await prisma.user.create({
      data: data as any,
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

  update: async (id: string, userData: UpdateUserInput) => {
    const dataToUpdate = { ...userData };
    if (dataToUpdate.password) {
      dataToUpdate.password = await argon2.hash(dataToUpdate.password);
    } else {
      delete dataToUpdate.password;
    }
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate as any,
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

  delete: async (id: string) => {
    return await prisma.user.delete({ where: { id: parseInt(id) } });
  },
};
