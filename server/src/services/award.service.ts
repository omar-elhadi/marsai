import prisma from "../utils/prisma.js";

// ─── SÉLECTION ───────────────────────────────────────────────────────────────

/**
 * Liste des films APPROVED triés par avgRating DESC pour aider l'admin
 * à constituer la sélection officielle.
 * Les films déjà en SELECTION/FINALIST/AWARD sont aussi inclus (vue complète).
 */
export const getSelectionCandidates = async () => {
  return prisma.film.findMany({
    where: {
      status: { in: ["APPROVED", "SELECTION", "FINALIST", "AWARD"] },
    },
    select: {
      id: true,
      title: true,
      country: true,
      status: true,
      avgRating: true,
      totalVotes: true,
      totalLikes: true,
      totalDislikes: true,
      youtubeUrl: true,
      submitter: { select: { firstName: true, lastName: true, email: true } },
      nominations: { select: { id: true, categoryId: true, isWinner: true } },
    },
    orderBy: [{ avgRating: "desc" }, { totalVotes: "desc" }],
  });
};

// ─── CATÉGORIES ───────────────────────────────────────────────────────────────

/**
 * Liste des catégories d'une édition, avec leurs nominations + films associés.
 *
 * @param {number} edition - Année (ex: 2026)
 */
export const getCategories = async (edition: number | string) => {
  return prisma.awardCategory.findMany({
    where: { edition: Number(edition) },
    include: {
      nominations: {
        include: {
          film: {
            select: {
              id: true,
              title: true,
              country: true,
              status: true,
              submitter: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { isWinner: "desc" }, // gagnant en premier
      },
    },
    orderBy: { displayOrder: "asc" },
  });
};

/**
 * Créer une nouvelle catégorie.
 *
 * @param {{ edition, name, description?, displayOrder? }} data
 */
export const createCategory = async ({
  edition,
  name,
  description,
  displayOrder,
}: {
  edition: number | string;
  name: string;
  description?: string;
  displayOrder?: number;
}) => {
  if (!edition || !name?.trim()) {
    throw Object.assign(new Error("edition et name sont obligatoires"), {
      statusCode: 400,
    });
  }

  return prisma.awardCategory.create({
    data: {
      edition: Number(edition),
      name: name.trim(),
      description: description?.trim() ?? null,
      displayOrder: displayOrder ?? 0,
    },
  });
};

/**
 * Modifier une catégorie existante.
 */
export const updateCategory = async (
  categoryId: number,
  {
    name,
    description,
    displayOrder,
  }: { name?: string; description?: string; displayOrder?: number },
) => {
  const category = await prisma.awardCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw Object.assign(new Error("Catégorie introuvable"), {
      statusCode: 404,
    });
  }

  return prisma.awardCategory.update({
    where: { id: categoryId },
    data: {
      name: name?.trim() ?? category.name,
      description: description?.trim() ?? category.description,
      displayOrder: displayOrder ?? category.displayOrder,
    },
  });
};

/**
 * Supprimer une catégorie (uniquement si aucune nomination active).
 */
export const deleteCategory = async (categoryId: number) => {
  const category = await prisma.awardCategory.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { nominations: true } } },
  });
  if (!category) {
    throw Object.assign(new Error("Catégorie introuvable"), {
      statusCode: 404,
    });
  }
  if (category._count.nominations > 0) {
    throw Object.assign(
      new Error("Impossible de supprimer une catégorie ayant des nominations."),
      { statusCode: 409 },
    );
  }

  return prisma.awardCategory.delete({ where: { id: categoryId } });
};

// ─── NOMINATIONS ──────────────────────────────────────────────────────────────

/**
 * Nominer un film dans une catégorie → film passe en FINALIST.
 *
 * @param {number} filmId
 * @param {number} categoryId
 */
export const nominateFilm = async (filmId: number, categoryId: number) => {
  const [film, category] = await Promise.all([
    prisma.film.findUnique({ where: { id: filmId } }),
    prisma.awardCategory.findUnique({ where: { id: categoryId } }),
  ]);

  if (!film)
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  if (!category)
    throw Object.assign(new Error("Catégorie introuvable"), {
      statusCode: 404,
    });

  if (!["SELECTION", "FINALIST", "AWARD"].includes(film.status)) {
    throw Object.assign(
      new Error("Seuls les films en SELECTION peuvent être nominés."),
      { statusCode: 400 },
    );
  }

  // Créer la nomination (erreur unique si déjà nominé dans cette catégorie)
  const nomination = await prisma.filmNomination.create({
    data: { filmId, categoryId },
  });

  // Passer le film en FINALIST si ce n'est pas déjà le cas
  if (film.status === "SELECTION") {
    await prisma.film.update({
      where: { id: filmId },
      data: { status: "FINALIST" },
    });
  }

  return nomination;
};

/**
 * Retirer une nomination.
 * Si le film n'a plus aucune nomination, il repasse en SELECTION.
 *
 * @param {number} nominationId
 */
export const removeNomination = async (nominationId: number) => {
  const nomination = await prisma.filmNomination.findUnique({
    where: { id: nominationId },
  });
  if (!nomination) {
    throw Object.assign(new Error("Nomination introuvable"), {
      statusCode: 404,
    });
  }

  await prisma.filmNomination.delete({ where: { id: nominationId } });

  // Vérifier si le film a encore d'autres nominations
  const remaining = await prisma.filmNomination.count({
    where: { filmId: nomination.filmId },
  });

  // Si plus aucune nomination → repasser en SELECTION
  if (remaining === 0) {
    await prisma.film.update({
      where: { id: nomination.filmId },
      data: { status: "SELECTION" },
    });
  }

  return { success: true };
};

// ─── GAGNANT ──────────────────────────────────────────────────────────────────

/**
 * Désigner le gagnant d'une catégorie → film passe en AWARD.
 * Un seul gagnant par catégorie : les anciens gagnants sont réinitialisés.
 *
 * @param {number} nominationId
 */
export const setWinner = async (nominationId: number) => {
  const nomination = await prisma.filmNomination.findUnique({
    where: { id: nominationId },
    include: { film: true, category: true },
  });
  if (!nomination) {
    throw Object.assign(new Error("Nomination introuvable"), {
      statusCode: 404,
    });
  }

  // Retirer isWinner des autres nominations de la même catégorie
  await prisma.filmNomination.updateMany({
    where: { categoryId: nomination.categoryId, isWinner: true },
    data: { isWinner: false },
  });

  // Remettre l'ancien gagnant en FINALIST si nécessaire
  const previousWinners = await prisma.filmNomination.findMany({
    where: { categoryId: nomination.categoryId, id: { not: nominationId } },
    select: { filmId: true },
  });
  // (simple : on laisse l'admin gérer les statuts manuellement via FilmsList)

  // Désigner le nouveau gagnant
  await prisma.filmNomination.update({
    where: { id: nominationId },
    data: { isWinner: true },
  });

  // Film → AWARD
  await prisma.film.update({
    where: { id: nomination.filmId },
    data: { status: "AWARD" },
  });

  return prisma.filmNomination.findUnique({
    where: { id: nominationId },
    include: {
      film: { select: { id: true, title: true, status: true } },
      category: true,
    },
  });
};

/**
 * Retirer le statut gagnant d'une nomination → film repasse en FINALIST.
 *
 * @param {number} nominationId
 */
export const unsetWinner = async (nominationId: number) => {
  const nomination = await prisma.filmNomination.findUnique({
    where: { id: nominationId },
  });
  if (!nomination) {
    throw Object.assign(new Error("Nomination introuvable"), {
      statusCode: 404,
    });
  }

  await prisma.filmNomination.update({
    where: { id: nominationId },
    data: { isWinner: false },
  });

  await prisma.film.update({
    where: { id: nomination.filmId },
    data: { status: "FINALIST" },
  });

  return { success: true };
};

// ─── PAGE PUBLIQUE ────────────────────────────────────────────────────────────

/**
 * Palmarès public d'une édition — toutes les catégories avec finalistes + gagnant.
 * Filtre : uniquement les films FINALIST ou AWARD visibles.
 *
 * @param {number} edition
 */
export const getPalmares = async (edition: number | string) => {
  return prisma.awardCategory.findMany({
    where: { edition: Number(edition) },
    include: {
      nominations: {
        where: {
          film: { status: { in: ["FINALIST", "AWARD"] } },
        },
        include: {
          film: {
            select: {
              id: true,
              title: true,
              country: true,
              youtubeUrl: true,
              status: true,
              submitter: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { isWinner: "desc" }, // gagnant en tête
      },
    },
    orderBy: { displayOrder: "asc" },
  });
};

/**
 * Liste des éditions disponibles (années distinctes ayant des catégories).
 */
export const getEditions = async () => {
  const rows = await prisma.awardCategory.findMany({
    select: { edition: true },
    distinct: ["edition"],
    orderBy: { edition: "desc" },
  });
  return rows.map((r) => r.edition);
};
