import prisma from "../utils/prisma.js";

export const getJuryMembers = async () => {
  return prisma.juryMember.findMany({
    orderBy: { displayOrder: "asc" },
  });
};

export const getJuryMemberById = async (id: number) => {
  const member = await prisma.juryMember.findUnique({ where: { id } });
  if (!member) {
    throw Object.assign(new Error("Membre du jury introuvable"), {
      statusCode: 404,
    });
  }
  return member;
};

export const createJuryMember = async (data: {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  photoUrl?: string;
  displayOrder?: number;
  website?: string;
  instagram?: string;
  twitter?: string;
}) => {
  return prisma.juryMember.create({
    data: {
      ...data,
      displayOrder: data.displayOrder ?? 0,
    },
  });
};

export const updateJuryMember = async (
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    title?: string;
    bio?: string;
    photoUrl?: string;
    displayOrder?: number;
    website?: string;
    instagram?: string;
    twitter?: string;
  },
) => {
  const existing = await prisma.juryMember.findUnique({ where: { id } });
  if (!existing) {
    throw Object.assign(new Error("Membre du jury introuvable"), {
      statusCode: 404,
    });
  }
  return prisma.juryMember.update({ where: { id }, data });
};

export const deleteJuryMember = async (id: number) => {
  const existing = await prisma.juryMember.findUnique({ where: { id } });
  if (!existing) {
    throw Object.assign(new Error("Membre du jury introuvable"), {
      statusCode: 404,
    });
  }
  await prisma.juryMember.delete({ where: { id } });
  return { success: true };
};
