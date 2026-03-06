import prisma from "../utils/prisma.js";

export const fetchGallery = async () => {
  try {
    const films = await prisma.film.findMany({
      where: { status: "APPROVED" },
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
      },
      orderBy: { updatedAt: "desc" },
    });

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

    return formattedFilms;
  } catch (error) {
    console.error("❌ Erreur fetchGallery:", error);
    throw error;
  }
};
