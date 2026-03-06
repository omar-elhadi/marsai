/**
 * Gallery Service
 * Gère les appels API pour la galerie des films
 */

// VITE_API_URL inclut déjà /api (ex: http://localhost:5001/api)
const API_URL = import.meta.env.VITE_API_URL;

export const galleryService = {
  /**
   * Récupère tous les films APPROVED pour la galerie publique
   * Transforme les données backend pour correspondre au format attendu par le frontend
   *
   * Backend → Frontend mapping:
   * - posterUrl → img
   * - directorName → director
   * - youtubeUrl → videoUrl
   *
   * @returns {Promise<Array>} Liste des films avec format frontend
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/gallery`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la récupération de la galerie",
        );
      }

      const films = await response.json();

      // Transformation des données pour correspondre au format frontend
      return films.map((film) => ({
        id: film.id,
        title: film.title,
        director: film.directorName,
        directorBio: film.directorBio,
        directorWebsite: film.directorWebsite,
        directorInstagram: film.directorInstagram,
        // Utiliser posterUrl pour l'image de la carte
        img: film.posterUrl,
        // Garder aussi les autres champs utiles
        description: film.description,
        country: film.country,
        language: film.language,
        videoUrl: film.youtubeUrl,
        videoSource: film.youtubeUrl ? "youtube" : "s3",
        youtubeVideoId: film.youtubeVideoId,
        videoDuration: film.videoDuration,
        subtitleUrl: film.subtitleUrl,
        avgRating: film.avgRating,
        totalVotes: film.totalVotes,
        totalLikes: film.totalLikes,
        totalDislikes: film.totalDislikes,
        submittedAt: film.submittedAt,
        updatedAt: film.updatedAt,
        // Note: category n'existe pas dans le schéma actuel
        // Il faudra l'ajouter plus tard si nécessaire
        category: null,
      }));
    } catch (error) {
      console.error("❌ Erreur galleryService.getAll:", error);
      throw error;
    }
  },
};
