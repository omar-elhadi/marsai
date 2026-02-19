/**
 * SERVICE API DE SOUMISSION - FRONTEND
 *
 * Gère les appels API pour la soumission de films.
 * Suit les conventions React du projet : /docs/CONVENTIONS_REACT.md
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Soumet un nouveau film avec vidéo
 *
 * @param {Object} formData - Données du formulaire
 * @param {File} videoFile - Fichier vidéo
 * @param {File|null} subtitleFile - Fichier de sous-titres (optionnel)
 * @param {Function} onProgress - Callback pour la progression (optionnel)
 * @returns {Promise<Object>} Résultat de la soumission
 */
export const submitFilm = async (
  formData,
  videoFile,
  subtitleFile,
  onProgress,
) => {
  try {
    // Créer un FormData pour envoyer fichier + données
    const formDataToSend = new FormData();

    // Ajouter le fichier vidéo
    formDataToSend.append("video", videoFile);

    // Ajouter le fichier de sous-titres si présent
    if (subtitleFile) {
      formDataToSend.append("subtitle", subtitleFile);
    }

    // Ajouter les données du formulaire
    Object.keys(formData).forEach((key) => {
      if (key !== "video" && key !== "acceptTerms") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Envoyer la requête avec progression
    const response = await axios.post(
      `${API_URL}/api/submissions`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );

    return response.data;
  } catch (error) {
    // Gérer les erreurs de l'API
    if (error.response) {
      // Si le serveur retourne des détails d'erreur de validation
      if (
        error.response.data.details &&
        error.response.data.details.length > 0
      ) {
        const errorMessages = error.response.data.details
          .map((err) => `${err.field}: ${err.message}`)
          .join("\n");
        throw new Error(`Erreur de validation:\n${errorMessages}`);
      }
      throw new Error(
        error.response.data.message ||
          error.response.data.error ||
          "Erreur lors de la soumission",
      );
    } else if (error.request) {
      throw new Error(
        "Impossible de contacter le serveur. Vérifiez votre connexion.",
      );
    } else {
      throw new Error(error.message || "Une erreur inattendue est survenue");
    }
  }
};

/**
 * Récupère le statut d'une soumission par son token
 *
 * @param {string} token - Token unique de soumission
 * @returns {Promise<Object>} Détails de la soumission
 */
export const getSubmissionStatus = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/submissions/${token}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Soumission non trouvée");
    }
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération du statut",
    );
  }
};

/**
 * Récupère toutes les soumissions d'un submitter par email
 *
 * @param {string} email - Email du submitter
 * @returns {Promise<Array>} Liste des soumissions
 */
export const getSubmitterFilms = async (email) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/submissions/submitter/${encodeURIComponent(email)}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des soumissions",
    );
  }
};

/**
 * Récupère les statistiques globales de soumissions
 *
 * @returns {Promise<Object>} Statistiques
 */
export const getSubmissionStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/submissions/stats`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des statistiques",
    );
  }
};
