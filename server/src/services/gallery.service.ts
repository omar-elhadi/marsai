import { logger } from "../utils/logger.js";
import prisma from "../utils/prisma.js";

export const fetchGallery = async ({ page = 1, limit = 50 }: any = {}) => {
  const take = parseInt(limit, 10) || 50;
  const skip = (parseInt(page, 10) - 1) * take;
  try {
    const [films, total] = await Promise.all([
    prisma.film.findMany({
      skip,
      take,
      where: { status: "AWARD" },
      select: {
        id: true,
        title: true,
        description: true,
        country: true,
        language: true,
        posterUrl: true,
        subtitleUrl: true,
        youtubeUrl: true,
        youtubeVideoId: true,
        videoDuration: true,
        avgRating: true,
        totalVotes: true,
        totalLikes: true,
        totalDislikes: true,
        submittedAt: true,
        updatedAt: true,
        submitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
            website: true,
            instagram: true,
          },
        },
      },      orderBy: { updatedAt: "desc" },
    }),
    prisma.film.count({ where: { status: "AWARD" } }),
  ]);

    const formattedFilms = films.map((film) => ({
      id: film.id,
      title: film.title,
      description: film.description,
      country: film.country,
      language: film.language,
      directorName: film.submitter.firstName + " " + film.submitter.lastName,
      directorBio: film.submitter.bio,
      directorWebsite: film.submitter.website,
      directorInstagram: film.submitter.instagram,
      posterUrl: film.posterUrl,
      subtitleUrl: film.subtitleUrl,
      youtubeUrl: film.youtubeUrl,
      youtubeVideoId: film.youtubeVideoId,
      videoDuration: film.videoDuration,
      avgRating: film.avgRating,
      totalVotes: film.totalVotes,
      totalLikes: film.totalLikes,
      totalDislikes: film.totalDislikes,
      submittedAt: film.submittedAt,
      updatedAt: film.updatedAt,
    }));

    return {
      data: formattedFilms,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  } catch (error) {
    logger.error(error, "❌ Erreur fetchGallery:");
    throw error;
  }
};

/**
 * Récupérer un film spécifique pour affichage public (page détail).
 * Retourne seulement les informations publiques d'un film AWARD.
 *
 * @param {number} filmId
 * @returns {Object} film avec informations publiques formatées
 */
export const fetchFilmById = async (filmId) => {
  try {
    const film = await prisma.film.findFirst({
      where: {
        id: filmId,
        status: "AWARD",
      },
      select: {
        id: true,
        title: true,
        description: true,
        country: true,
        language: true,
        posterUrl: true,
        subtitleUrl: true,
        youtubeUrl: true,
        youtubeVideoId: true,
        videoDuration: true,
        aiToolsUsed: true,
        aiMethodologyUrl: true,
        avgRating: true,
        totalVotes: true,
        totalLikes: true,
        totalDislikes: true,
        submittedAt: true,
        updatedAt: true,
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            bio: true,
            website: true,
            instagram: true,
          },
        },
      },
    });

    if (!film) {
      throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
    }

    // Format identique à fetchGallery pour cohérence
    return {
      id: film.id,
      title: film.title,
      description: film.description,
      country: film.country,
      language: film.language,
      directorName: film.submitter.firstName + " " + film.submitter.lastName,
      directorBio: film.submitter.bio,
      directorWebsite: film.submitter.website,
      directorInstagram: film.submitter.instagram,
      posterUrl: film.posterUrl,
      subtitleUrl: film.subtitleUrl,
      youtubeUrl: film.youtubeUrl,
      youtubeVideoId: film.youtubeVideoId,
      videoDuration: film.videoDuration,
      aiToolsUsed: film.aiToolsUsed,
      aiMethodologyUrl: film.aiMethodologyUrl,
      avgRating: film.avgRating,
      totalVotes: film.totalVotes,
      totalLikes: film.totalLikes,
      totalDislikes: film.totalDislikes,
      submittedAt: film.submittedAt,
      updatedAt: film.updatedAt,
    };
  } catch (error) {
    logger.error(error, "❌ Erreur fetchFilmById:");
    throw error;
  }
};
