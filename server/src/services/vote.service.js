import prisma from "../utils/prisma.js";

/**
 * Rating auto-dérivé du sentiment pour simplifier l'UX jury.
 * Le jury conseille (LIKE/DISLIKE), l'admin décide (workflow statut).
 */
const RATING_BY_SENTIMENT = { LIKE: 7, DISLIKE: 3 };

/**
 * Films disponibles pour le vote jury.
 * Statuts visibles : FINALIST (et SELECTION pour les votes préliminaires).
 * Inclut le vote courant du jury authentifié pour affichage frontend.
 *
 * @param {number} userId - ID du jury authentifié
 */
export const getFilmsForJury = async (userId) => {
  return prisma.film.findMany({
    // Jury voit uniquement ses films assignés en IN_REVIEW (règle R-JURY-001)
    where: { status: "IN_REVIEW", assignedUsers: { some: { id: userId } } },
    include: {
      submitter: { select: { firstName: true, lastName: true } },
      // On filtre les votes par l'utilisateur courant — tableau de 0 ou 1 élément
      votes: {
        where:  { userId },
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
 *
 * @param {number} filmId
 * @param {number} userId
 * @param {"LIKE"|"DISLIKE"} sentiment
 */
export const castVote = async (filmId, userId, sentiment) => {
  // Vérification : votes gelés si film APPROVED ou REJECTED (règle business R-VOTE-003)
  const film = await prisma.film.findUnique({ where: { id: filmId }, select: { status: true } });
  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }
  if (["APPROVED", "REJECTED", "SELECTION", "FINALIST", "AWARD"].includes(film.status)) {
    throw Object.assign(
      new Error(`Vote impossible : le film est en statut ${film.status}.`),
      { statusCode: 409 }
    );
  }

  const rating = RATING_BY_SENTIMENT[sentiment];

  // upsert : crée si absent, met à jour si existant
  const vote = await prisma.vote.upsert({
    where:  { filmId_userId: { filmId, userId } },
    create: { filmId, userId, sentiment, rating },
    update: { sentiment, rating, updatedAt: new Date() },
  });

  await recalcFilmStats(filmId);
  return vote;
};

/**
 * Supprimer son vote (annuler).
 *
 * @param {number} filmId
 * @param {number} userId
 */
export const removeVote = async (filmId, userId) => {
  await prisma.vote.delete({
    where: { filmId_userId: { filmId, userId } },
  });
  await recalcFilmStats(filmId);
};

/**
 * Recalcul des stats dénormalisées sur le film après chaque vote/suppression.
 * Garde la cohérence avec totalVotes, totalLikes, totalDislikes, avgRating.
 */
const recalcFilmStats = async (filmId) => {
  const [likes, dislikes] = await Promise.all([
    prisma.vote.count({ where: { filmId, sentiment: "LIKE" } }),
    prisma.vote.count({ where: { filmId, sentiment: "DISLIKE" } }),
  ]);

  const totalVotes = likes + dislikes;
  const avgRating  = totalVotes > 0
    ? (likes * RATING_BY_SENTIMENT.LIKE + dislikes * RATING_BY_SENTIMENT.DISLIKE) / totalVotes
    : null;

  await prisma.film.update({
    where: { id: filmId },
    data:  { totalVotes, totalLikes: likes, totalDislikes: dislikes, avgRating },
  });
};
