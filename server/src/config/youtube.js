/**
 * CONFIGURATION YOUTUBE DATA API V3 - MARSAI FESTIVAL
 *
 * Ce fichier configure l'authentification et les clients pour YouTube Data API v3.
 * Il gère à la fois l'authentification par clé API (pour les opérations de lecture)
 * et OAuth 2.0 (pour les uploads de vidéos).
 *
 * @see https://developers.google.com/youtube/v3/docs
 */

import { google } from "googleapis";

/**
 * Client YouTube avec authentification OAuth 2.0
 * Utilisé pour les opérations nécessitant des permissions (upload de vidéos)
 */
export const getYouTubeAuthClient = () => {
  // Vérification des variables d'environnement requises
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
    throw new Error(
      "Variables YouTube OAuth manquantes. Vérifiez YOUTUBE_CLIENT_ID et YOUTUBE_CLIENT_SECRET dans .env",
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI ||
      `http://localhost:${process.env.PORT}/api/youtube/callback`,
  );

  // Si un refresh token existe, le configurer
  if (process.env.YOUTUBE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
};

/**
 * Client YouTube avec authentification par clé API
 * Utilisé pour les opérations publiques (lecture de métadonnées)
 */
export const getYouTubeClient = () => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY est manquant dans le fichier .env");
  }

  return google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });
};

/**
 * Client YouTube avec authentification OAuth pour uploads
 */
export const getAuthenticatedYouTubeClient = (oauth2Client) => {
  return google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
};

/**
 * Fonction pour générer l'URL d'autorisation OAuth
 * À utiliser lors de la première configuration
 */
export const getAuthUrl = () => {
  const oauth2Client = getYouTubeAuthClient();

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // Pour obtenir un refresh token
    scope: scopes,
    prompt: "consent", // Force à redemander le consentement pour obtenir refresh token
  });
};

/**
 * Fonction pour échanger le code d'autorisation contre des tokens
 * @param {string} code - Code d'autorisation reçu après authentification
 * @returns {Promise<Object>} Tokens (access_token, refresh_token)
 */
export const getTokensFromCode = async (code) => {
  const oauth2Client = getYouTubeAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

/**
 * Quotas YouTube API v3 (pour référence)
 *
 * Quota quotidien : 10,000 unités
 *
 * Coûts par opération :
 * - videos.insert (upload) : ~1,600 unités
 * - videos.list : 1 unité
 * - search.list : 100 unités
 *
 * Limite d'uploads par jour avec quota gratuit : ~6 vidéos
 */
export const YOUTUBE_QUOTA = {
  DAILY_LIMIT: 10000,
  VIDEO_UPLOAD_COST: 1600,
  VIDEO_LIST_COST: 1,
  SEARCH_COST: 100,
};

/**
 * Catégories YouTube disponibles
 * @see https://developers.google.com/youtube/v3/docs/videoCategories/list
 */
export const YOUTUBE_CATEGORIES = {
  FILM_ANIMATION: "1",
  AUTOS_VEHICLES: "2",
  MUSIC: "10",
  PETS_ANIMALS: "15",
  SPORTS: "17",
  SHORT_MOVIES: "18",
  TRAVEL_EVENTS: "19",
  GAMING: "20",
  PEOPLE_BLOGS: "22",
  COMEDY: "23",
  ENTERTAINMENT: "24",
  NEWS_POLITICS: "25",
  HOWTO_STYLE: "26",
  EDUCATION: "27",
  SCIENCE_TECHNOLOGY: "28",
};

/**
 * Configuration par défaut pour les uploads de vidéos du festival
 */
export const DEFAULT_VIDEO_CONFIG = {
  categoryId: YOUTUBE_CATEGORIES.SHORT_MOVIES, // Court-métrage
  defaultLanguage: "fr",
  defaultAudioLanguage: "fr",
  privacyStatus: "unlisted", // Non-listé par défaut (sécurité)
  embeddable: true,
  license: "creativeCommon", // Creative Commons
  publicStatsViewable: true,
};
