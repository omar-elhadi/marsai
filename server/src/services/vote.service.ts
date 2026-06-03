import prisma from "../utils/prisma.js";

/**
 * Rating auto-dérivé du sentiment pour simplifier l'UX jury.
 * Le jury conseille (LIKE/DISLIKE), l'admin décide (workflow statut).
 */
const RATING_BY_SENTIMENT: Record<string, number> = { LIKE: 7, DISLIKE: 3 };

/**
 * Films disponibles pour le vote jury.
 * Jury voit uniquement ses films assignés en IN_REVIEW (règle R-JURY-001).
 * Inclut le vote courant du jury authentifié pour affichage frontend.
 *
 * @param {number} userId - ID du jury authentifié
 */
export const getFilmsForJury = async (userId: number) => {
  return prisma.film.findMany({
    where: { assignedUsers: { some: { id: userId } } },
    include: {
      submitter: { select: { firstName: true, lastName: true } },
      votes: {
        where: { userId },
        select: { id: true, sentiment: true, rating: true },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { title: "asc" },
  });
};

/**
 * Voter sur un film (upsert — un jury peut modifier son vote).
 * Met à jour les compteurs dénormalisés sur le film après chaque vote.
 * Les commentaires internes sont gérés séparément via addCommentToVote.
 *
 * @param {number} filmId
 * @param {number} userId
 * @param {"LIKE"|"DISLIKE"} sentiment
 */
export const castVote = async (
  filmId: number,
  userId: number,
  sentiment: "LIKE" | "DISLIKE",
  options: {
    suggestModification?: boolean;
    comment?: string | null;
    ratingOverride?: number | null;
  } = {},
) => {
  const {
    suggestModification = false,
    comment = null,
    ratingOverride = null,
  } = options;

  // Vérification : votes gelés si film APPROVED ou REJECTED (règle business R-VOTE-003)
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    select: { status: true },
  });
  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }
  if (
    ["APPROVED", "REJECTED", "SELECTION", "FINALIST", "AWARD"].includes(
      film.status,
    )
  ) {
    throw Object.assign(
      new Error(`Vote impossible : le film est en statut ${film.status}.`),
      { statusCode: 409 },
    );
  }

  // Utilise la note saisie par le jury (1-10) si fournie, sinon valeur auto-dérivée
  const sentimentRating = RATING_BY_SENTIMENT[sentiment];
  const rating =
    ratingOverride !== null && ratingOverride >= 1 && ratingOverride <= 10
      ? ratingOverride
      : sentimentRating !== undefined
        ? sentimentRating
        : 5;

  // upsert : crée si absent, met à jour si existant
  const vote = await prisma.vote.upsert({
    where: { filmId_userId: { filmId, userId } },
    create: { filmId, userId, sentiment, rating, suggestModification },
    update: { sentiment, rating, suggestModification, updatedAt: new Date() },
  });

  // Commentaire suggestion (isInternal: false) — destiné à être relayé au réalisateur
  if (suggestModification && comment) {
    await prisma.reviewComment.deleteMany({
      where: { voteId: vote.id, isInternal: false },
    });
    await prisma.reviewComment.create({
      data: { voteId: vote.id, content: comment, isInternal: false },
    });
  } else if (!suggestModification) {
    // Le jury a retiré sa suggestion → supprime uniquement le commentaire suggestion
    await prisma.reviewComment.deleteMany({
      where: { voteId: vote.id, isInternal: false },
    });
  }

  // Transition automatique : demande de modification jury → film passe en TO_MODIFY
  // Uniquement si le film est en IN_REVIEW (évite d'écraser un statut admin ultérieur)
  if (suggestModification && film.status === "IN_REVIEW") {
    await prisma.film.update({
      where: { id: filmId },
      data: { status: "TO_MODIFY" },
    });
  }

  await recalcFilmStats(filmId);
  return vote;
};

/**
 * Ajouter un commentaire interne à un vote existant.
 * Les commentaires s'accumulent (historique) — jamais supprimés ici.
 *
 * @param {number} filmId
 * @param {number} userId
 * @param {string} content
 */
export const addCommentToVote = async (
  filmId: number,
  userId: number,
  content: string,
) => {
  // Retrouver le vote existant
  const vote = await prisma.vote.findUnique({
    where: { filmId_userId: { filmId, userId } },
  });
  if (!vote) {
    throw Object.assign(
      new Error("Vous devez voter avant de pouvoir commenter."),
      { statusCode: 400 },
    );
  }

  return prisma.reviewComment.create({
    data: { voteId: vote.id, content: content.trim(), isInternal: true },
    select: { id: true, content: true, isInternal: true, createdAt: true },
  });
};

/**
 * Film détail pour un jury — vérifie que le film lui est bien assigné.
 * Retourne le vote courant avec l'historique complet des commentaires.
 *
 * @param {number} filmId
 * @param {number} userId
 */
export const getFilmForJury = async (filmId: number, userId: number) => {
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: {
      submitter: { select: { firstName: true, lastName: true } },
      assignedUsers: { select: { id: true } },
      votes: {
        where: { userId },
        select: {
          id: true,
          sentiment: true,
          rating: true,
          suggestModification: true,
          votedAt: true,
          updatedAt: true,
          comments: {
            select: {
              id: true,
              content: true,
              isInternal: true,
              createdAt: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
  if (!film)
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  const isAssigned = film.assignedUsers.some(
    (u: { id: number }) => u.id === userId,
  );
  if (!isAssigned)
    throw Object.assign(new Error("Film non assigné à ce jury"), {
      statusCode: 403,
    });
  return film;
};

/**
 * Supprimer son vote (annuler).
 *
 * @param {number} filmId
 * @param {number} userId
 */
export const removeVote = async (filmId: number, userId: number) => {
  await prisma.vote.delete({
    where: { filmId_userId: { filmId, userId } },
  });
  await recalcFilmStats(filmId);
};

/**
 * Recalcul des stats dénormalisées sur le film après chaque vote/suppression.
 * Garde la cohérence avec totalVotes, totalLikes, totalDislikes, avgRating.
 */
const recalcFilmStats = async (filmId: number) => {
  const [likes, dislikes] = await Promise.all([
    prisma.vote.count({ where: { filmId, sentiment: "LIKE" } }),
    prisma.vote.count({ where: { filmId, sentiment: "DISLIKE" } }),
  ]);

  const totalVotes = likes + dislikes;
  const avgRating =
    totalVotes > 0
      ? (likes * RATING_BY_SENTIMENT.LIKE +
          dislikes * RATING_BY_SENTIMENT.DISLIKE) /
        totalVotes
      : null;

  await prisma.film.update({
    where: { id: filmId },
    data: { totalVotes, totalLikes: likes, totalDislikes: dislikes, avgRating },
  });
};
