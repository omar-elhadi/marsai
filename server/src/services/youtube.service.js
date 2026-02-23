/**
 * SERVICE YOUTUBE - MARSAI FESTIVAL
 *
 * Ce service gère toutes les interactions avec YouTube Data API v3 :
 * - Upload de vidéos vers YouTube
 * - Vérification du statut de modération
 * - Récupération des métadonnées vidéo
 * - Gestion des erreurs et retry automatique
 *
 * @see https://developers.google.com/youtube/v3/docs
 */

import { Readable } from "stream";
import {
  getYouTubeAuthClient,
  getAuthenticatedYouTubeClient,
  DEFAULT_VIDEO_CONFIG,
} from "../config/youtube.js";

/**
 * Uploads une vidéo vers YouTube
 *
 * @param {Buffer} videoBuffer - Buffer de la vidéo
 * @param {Object} metadata - Métadonnées de la vidéo
 * @param {string} metadata.title - Titre de la vidéo
 * @param {string} metadata.description - Description
 * @param {string[]} metadata.tags - Tags (optionnel)
 * @param {string} metadata.categoryId - ID de catégorie YouTube (optionnel)
 * @param {string} metadata.privacyStatus - unlisted, private, public (optionnel)
 * @returns {Promise<Object>} Résultat avec videoId, url, status
 */
export const uploadVideoToYouTube = async (videoBuffer, metadata) => {
  try {
    // 1. Authentification OAuth
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    // 2. Convertir le Buffer en Stream lisible
    const videoStream = Readable.from(videoBuffer);

    // 3. Préparation des métadonnées pour YouTube
    const videoMetadata = {
      snippet: {
        title: metadata.title || "Film soumis au MarsAI Festival",
        description: metadata.description || "Court-métrage créé avec l'IA",
        tags: metadata.tags || ["MarsAI", "Festival", "IA", "Court-métrage"],
        defaultLanguage: "fr",
        defaultAudioLanguage: "fr",
      },
      status: {
        privacyStatus:
          metadata.privacyStatus || DEFAULT_VIDEO_CONFIG.privacyStatus,
        embeddable: true,
        publicStatsViewable: true,
        selfDeclaredMadeForKids: false,
      },
    };

    // 4. Upload de la vidéo
    const response = await youtube.videos.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: videoMetadata,
      media: {
        body: videoStream,
      },
    });

    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 5. Retour des informations
    return {
      success: true,
      videoId,
      videoUrl,
      uploadStatus: response.data.status.uploadStatus,
      privacyStatus: response.data.status.privacyStatus,
      publishedAt: response.data.snippet.publishedAt,
      channelId: response.data.snippet.channelId,
      thumbnails: response.data.snippet.thumbnails,
      duration: response.data.contentDetails?.duration,
    };
  } catch (error) {
    console.error("YouTube upload error:", error);

    // Gestion des erreurs spécifiques YouTube
    if (error.code === 401) {
      throw new Error(
        "Authentification YouTube échouée. Vérifiez vos credentials OAuth.",
      );
    }

    if (error.code === 403) {
      const errorMessage = error.message || "";
      if (errorMessage.includes("quota")) {
        throw new Error(
          "Quota YouTube dépassé. Réessayez demain ou augmentez votre quota.",
        );
      }
      throw new Error(`Accès refusé par YouTube : ${errorMessage}`);
    }

    if (error.code === 400) {
      throw new Error(`Données invalides : ${error.message}`);
    }

    throw new Error(`Erreur lors de l'upload : ${error.message}`);
  }
};

/**
 * Upload un fichier de sous-titres vers YouTube
 *
 * @param {string} videoId - ID de la vidéo YouTube
 * @param {Buffer} subtitleBuffer - Buffer du fichier de sous-titres
 * @param {string} language - Code de langue (ex: 'fr', 'en')
 * @param {string} name - Nom des sous-titres (ex: 'French')
 * @returns {Promise<Object>} Résultat de l'upload
 */
export const uploadCaptionToYouTube = async (
  videoId,
  subtitleBuffer,
  language = "fr",
  name = "French",
) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    // Convertir le Buffer en Stream lisible
    const subtitleStream = Readable.from(subtitleBuffer);

    // Upload des captions
    const response = await youtube.captions.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId: videoId,
          language: language,
          name: name,
          isDraft: false,
        },
      },
      media: {
        mimeType: "application/octet-stream",
        body: subtitleStream,
      },
    });

    return {
      success: true,
      captionId: response.data.id,
      language: response.data.snippet.language,
      name: response.data.snippet.name,
    };
  } catch (error) {
    console.error("YouTube caption upload error:", error);

    if (error.code === 403) {
      throw new Error(
        "Permissions insuffisantes pour uploader des sous-titres sur YouTube",
      );
    }

    throw new Error(
      `Erreur lors de l'upload des sous-titres : ${error.message}`,
    );
  }
};

/**
 * Upload une miniature (thumbnail) vers YouTube
 *
 * @param {string} videoId - ID de la vidéo YouTube
 * @param {Buffer} thumbnailBuffer - Buffer de l'image
 * @returns {Promise<Object>} Résultat de l'upload
 */
export const uploadThumbnailToYouTube = async (videoId, thumbnailBuffer) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    // Convertir le Buffer en Stream lisible
    const thumbnailStream = Readable.from(thumbnailBuffer);

    // Upload de la miniature
    const response = await youtube.thumbnails.set({
      videoId: videoId,
      media: {
        mimeType: "image/jpeg",
        body: thumbnailStream,
      },
    });

    return {
      success: true,
      thumbnails: response.data.items[0].default,
    };
  } catch (error) {
    console.error("YouTube thumbnail upload error:", error);

    if (error.code === 403) {
      throw new Error(
        "Permissions insuffisantes pour uploader des miniatures sur YouTube",
      );
    }

    throw new Error(
      `Erreur lors de l'upload de la miniature : ${error.message}`,
    );
  }
};

/**
 * Récupère le statut de modération d'une vidéo YouTube
 *
 * @param {string} videoId - ID de la vidéo YouTube
 * @returns {Promise<Object>} Statut de modération et détails
 */
export const checkVideoModerationStatus = async (videoId) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    // Récupération des informations de la vidéo
    const response = await youtube.videos.list({
      part: ["status", "contentDetails", "snippet", "processingDetails"],
      id: [videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error(`Vidéo non trouvée : ${videoId}`);
    }

    const video = response.data.items[0];
    const status = video.status;
    const contentDetails = video.contentDetails;
    const processingDetails = video.processingDetails;

    // Analyse du statut de modération
    const moderationStatus = {
      videoId,
      uploadStatus: status.uploadStatus,
      privacyStatus: status.privacyStatus,
      license: status.license,
      embeddable: status.embeddable,
      publicStatsViewable: status.publicStatsViewable,

      // Statut de traitement
      processingStatus: processingDetails?.processingStatus,
      processingProgress: processingDetails?.processingProgress,

      // Content rating (restrictions d'âge, etc.)
      contentRating: contentDetails?.contentRating || {},

      // Détection de contenu
      hasContentIssues:
        status.uploadStatus === "rejected" || status.uploadStatus === "failed",
      rejectionReason: status.rejectionReason || null,
      failureReason: status.failureReason || null,

      // Métadonnées
      duration: contentDetails?.duration,
      definition: contentDetails?.definition,
      caption: contentDetails?.caption,

      // URL et titre
      title: video.snippet.title,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };

    // Détermination du statut global
    if (status.uploadStatus === "processed") {
      moderationStatus.approved = true;
      moderationStatus.message = "Vidéo approuvée et disponible";
    } else if (
      status.uploadStatus === "uploaded" ||
      status.uploadStatus === "processing"
    ) {
      moderationStatus.approved = false;
      moderationStatus.pending = true;
      moderationStatus.message = "Vidéo en cours de traitement par YouTube";
    } else if (status.uploadStatus === "rejected") {
      moderationStatus.approved = false;
      moderationStatus.rejected = true;
      moderationStatus.message = `Vidéo rejetée : ${status.rejectionReason || "raison inconnue"}`;
    } else if (status.uploadStatus === "failed") {
      moderationStatus.approved = false;
      moderationStatus.failed = true;
      moderationStatus.message = `Échec de l'upload : ${status.failureReason || "raison inconnue"}`;
    }

    return moderationStatus;
  } catch (error) {
    console.error("YouTube status check error:", error);
    throw new Error(`Impossible de vérifier le statut : ${error.message}`);
  }
};

/**
 * Attend que YouTube finisse de traiter la vidéo (polling)
 *
 * @param {string} videoId - ID de la vidéo
 * @param {number} maxAttempts - Nombre maximum de tentatives (défaut: 20)
 * @param {number} intervalMs - Intervalle entre tentatives en ms (défaut: 10000)
 * @returns {Promise<Object>} Statut final de modération
 */
export const waitForVideoProcessing = async (
  videoId,
  maxAttempts = 20,
  intervalMs = 10000,
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await checkVideoModerationStatus(videoId);

      // Si traité ou rejeté, on retourne le statut
      if (
        status.uploadStatus === "processed" ||
        status.uploadStatus === "rejected" ||
        status.uploadStatus === "failed"
      ) {
        return status;
      }

      // Sinon, on attend avant de réessayer
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error.message);

      // Si c'est la dernière tentative, on lance l'erreur
      if (attempt === maxAttempts) {
        throw error;
      }

      // Sinon on continue
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  // Timeout : vidéo toujours en traitement
  return {
    videoId,
    approved: false,
    pending: true,
    timeout: true,
    message: `La vidéo est toujours en traitement après ${maxAttempts} tentatives`,
  };
};

/**
 * Met à jour les métadonnées d'une vidéo YouTube existante
 *
 * @param {string} videoId - ID de la vidéo
 * @param {Object} updates - Nouvelles métadonnées
 * @returns {Promise<Object>} Vidéo mise à jour
 */
export const updateVideoMetadata = async (videoId, updates) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    const response = await youtube.videos.update({
      part: ["snippet", "status"],
      requestBody: {
        id: videoId,
        snippet: updates.snippet || {},
        status: updates.status || {},
      },
    });

    return response.data;
  } catch (error) {
    console.error("YouTube video update error:", error);
    throw new Error(`Impossible de mettre à jour la vidéo : ${error.message}`);
  }
};

/**
 * Supprime une vidéo de YouTube
 *
 * @param {string} videoId - ID de la vidéo à supprimer
 * @returns {Promise<boolean>} True si suppression réussie
 */
export const deleteVideo = async (videoId) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    await youtube.videos.delete({
      id: videoId,
    });

    return true;
  } catch (error) {
    console.error("YouTube video deletion error:", error);
    throw new Error(`Impossible de supprimer la vidéo : ${error.message}`);
  }
};

/**
 * Récupère les statistiques d'une vidéo
 *
 * @param {string} videoId - ID de la vidéo
 * @returns {Promise<Object>} Statistiques (vues, likes, comments)
 */
export const getVideoStatistics = async (videoId) => {
  try {
    const oauth2Client = getYouTubeAuthClient();
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    const response = await youtube.videos.list({
      part: ["statistics", "snippet"],
      id: [videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error(`Vidéo non trouvée : ${videoId}`);
    }

    const video = response.data.items[0];

    return {
      videoId,
      title: video.snippet.title,
      viewCount: parseInt(video.statistics.viewCount || 0),
      likeCount: parseInt(video.statistics.likeCount || 0),
      dislikeCount: parseInt(video.statistics.dislikeCount || 0),
      commentCount: parseInt(video.statistics.commentCount || 0),
      favoriteCount: parseInt(video.statistics.favoriteCount || 0),
    };
  } catch (error) {
    console.error("YouTube statistics retrieval error:", error);
    throw new Error(
      `Impossible de récupérer les statistiques : ${error.message}`,
    );
  }
};

/**
 * Transforme un objet de métadonnées de film en format YouTube
 *
 * @param {Object} film - Objet film de la base de données
 * @returns {Object} Métadonnées formatées pour YouTube
 */
export const formatFilmMetadataForYouTube = (film) => {
  const aiTools = film.aiStack || film.aiToolsUsed || "";
  const tags = [
    "MarsAI Festival",
    "Intelligence Artificielle",
    "Court-métrage",
    "IA",
    film.country,
    ...aiTools.split(",").map((tool) => tool.trim()),
  ].filter(Boolean);

  return {
    title: `${film.title} - MarsAI Festival ${new Date().getFullYear()}`,
    description: `
${film.description}

🎬 Court-métrage créé avec l'Intelligence Artificielle
🌍 Pays : ${film.country}
🤖 Outils IA utilisés : ${aiTools}

Soumis au MarsAI Festival - Premier festival international de films créés avec l'IA
    `.trim(),
    tags,
    privacyStatus: "unlisted", // Non-listé par défaut pour modération interne
  };
};
