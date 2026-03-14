import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { fetchGallery, fetchFilmById } from "../services/gallery.service.js";

export const getGallery = catchAsync(async (req: any, res: any, next: any) => {
  const galleryData = await fetchGallery();
    return res.json(galleryData);
});

/**
 * GET /api/gallery/:id
 * Détail public d'un film APPROVED pour la page de détail.
 */
export const getFilmDetail = catchAsync(async (req: any, res: any, next: any) => {
  const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) return res.status(400).json({ message: "ID invalide" });
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
});
