import { fetchGallery, fetchFilmById } from "../services/gallery.service.js";

export const getGallery = async (req, res) => {
  try {
    const galleryData = await fetchGallery();
    return res.json(galleryData);
  } catch (error) {
    console.error("❌ Erreur getGallery:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération de la galerie." });
  }
};

/**
 * GET /api/gallery/:id
 * Détail public d'un film APPROVED pour la page de détail.
 */
export const getFilmDetail = async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    const film = await fetchFilmById(filmId);

    // Transforme pour correspondre au format frontend attendu
    const formattedFilm = {
      id: film.id,
      title: film.title,
      description: film.description,
      country: film.country,
      language: film.language,
      director: film.directorName,
      directorBio: film.directorBio,
      directorWebsite: film.directorWebsite,
      directorInstagram: film.directorInstagram,
      img: film.posterUrl,
      videoUrl: film.youtubeUrl,
      videoSource: film.youtubeUrl ? "youtube" : "s3",
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
      category: null, // Category field not in schema yet
    };

    return res.json(formattedFilm);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("❌ Erreur getFilmDetail:", error.message);
    return res.status(code).json({ error: error.message });
  }
};
