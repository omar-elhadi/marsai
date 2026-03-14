import { apiClient } from './apiClient';
import { Film } from '../../types';

export const galleryService = {
  getAll: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/gallery');
      return data.map((film) => ({
        id: film.id,
        title: film.title,
        director: film.directorName,
        directorBio: film.directorBio,
        directorWebsite: film.directorWebsite,
        directorInstagram: film.directorInstagram,
        img: film.posterUrl,
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
        category: null,
      }));
    } catch (error) {
      console.error("❌ Erreur galleryService.getAll:", error);
      throw error;
    }
  },

  getById: async (id: number | string) => {
    try {
      const { data } = await apiClient.get<any>(`/gallery/${id}`);
      return data;
    } catch (error) {
      console.error("❌ Erreur galleryService.getById:", error);
      throw error;
    }
  },
};
