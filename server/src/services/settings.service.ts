import prisma from "../utils/prisma.js";

export const getSettings = async () => {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { id: "asc" },
  });
  return settings;
};

export const updateSettings = async (data: {
  currentYear?: number;
  festivalTheme?: string;
  festivalDates?: string;
  trailerUrl?: string;
  heroImageUrl?: string;
  aboutText?: string;
  rulesText?: string;
}) => {
  const existing = await prisma.siteSettings.findFirst({
    orderBy: { id: "asc" },
  });

  if (existing) {
    return prisma.siteSettings.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.siteSettings.create({ data: data as any });
};
