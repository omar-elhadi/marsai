/**
 * CONTROLLER DE SOUMISSION - MARSAI FESTIVAL
 *
 * Gère les requêtes HTTP pour la soumission de films.
 * - Validation des données d'entrée
 * - Orchestration du service de soumission
 * - Gestion des erreurs et réponses HTTP
 *
 * Convention suivie : /docs/CONVENTIONS_EXPRESS.md
 */

import { z } from "zod";
import {
  submitFilm,
  getSubmissionStatus,
  getSubmitterFilms,
} from "../services/submission.service.js";

/**
 * Schéma de validation Zod pour les données de soumission
 */
const submissionSchema = z.object({
  // Informations du submitter
  firstName: z.string().min(2, "Prénom trop court").max(100),
  lastName: z.string().min(2, "Nom trop court").max(100),
  email: z.string().email("Email invalide"),
  bio: z
    .string()
    .max(300, "La bio doit être concise (300 car. max)")
    .optional()
    .nullable(),
  instagram: z.string().max(50).optional().nullable(),

  // Informations du film
  title: z.string().min(3, "Titre trop court").max(200),
  description: z
    .string()
    .min(10, "Description trop courte")
    .max(500, "Le synopsis doit faire 500 caractères maximum"),
  country: z.string().min(2, "Pays invalide").max(100),
  language: z.string().min(2, "Langue invalide").max(30).optional().nullable(),
  aiStack: z
    .string()
    .min(5, "Détaillez votre stack IA")
    .max(500, "La liste des outils doit être concise"),
});

/**
 * POST /api/submissions
 * Soumet un nouveau film avec fichier vidéo
 *
 * @param {Request} req - Requête Express (doit contenir req.file et req.body)
 * @param {Response} res - Réponse Express
 */
export const createSubmission = async (req, res) => {
  try {
    // ============================================================
    // 1. VALIDATION DU FICHIER VIDÉO
    // ============================================================
    if (!req.files || !req.files.video || !req.files.video[0]) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier vidéo fourni",
        message: "Veuillez sélectionner une vidéo à soumettre.",
      });
    }

    const videoFile = req.files.video[0];
    const subtitleFile = req.files.subtitle ? req.files.subtitle[0] : null;
    const posterFile = req.files.poster ? req.files.poster[0] : null;

    // Validation du fichier de sous-titres (OBLIGATOIRE)
    if (!subtitleFile) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier de sous-titres fourni",
        message:
          "Un fichier de sous-titres (.srt, .vtt ou .sbv) est requis pour permettre la traduction internationale.",
      });
    }

    // Validation du format de sous-titres
    const allowedSubtitleExtensions = [".srt", ".vtt", ".sbv"];
    const subtitleExtension = subtitleFile.originalname
      .substring(subtitleFile.originalname.lastIndexOf("."))
      .toLowerCase();

    if (!allowedSubtitleExtensions.includes(subtitleExtension)) {
      return res.status(400).json({
        success: false,
        error: "Format de sous-titres invalide",
        message: "Formats acceptés : .srt, .vtt, .sbv",
      });
    }

    // Validation du fichier poster (OBLIGATOIRE)
    if (!posterFile) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier poster fourni",
        message:
          "Un poster (.jpg, .jpeg ou .png) est requis pour la miniature YouTube.",
      });
    }

    // Validation du format poster
    const allowedPosterTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedPosterTypes.includes(posterFile.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Format de poster invalide",
        message: "Formats acceptés : .jpg, .jpeg, .png",
      });
    }

    // ============================================================
    // 2. VALIDATION DES DONNÉES DU FORMULAIRE
    // ============================================================
    let formData;
    try {
      formData = submissionSchema.parse(req.body);
    } catch (zodError) {
      console.error("Form validation error:", zodError.errors);

      return res.status(400).json({
        success: false,
        error: "Données du formulaire invalides",
        details: zodError.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // ============================================================
    // 3. EXÉCUTION DU WORKFLOW DE SOUMISSION
    // ============================================================
    const result = await submitFilm(
      formData,
      videoFile,
      subtitleFile,
      posterFile,
    );

    // ============================================================
    // 4. RÉPONSE DE SUCCÈS
    // ============================================================
    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        submissionToken: result.film.submissionToken,
        filmId: result.film.id,
        youtubeUrl: result.film.youtubeUrl,
        youtubeStatus: result.film.youtubeStatus,
        status: result.film.status,
        submittedAt: result.film.submittedAt,
      },
    });
  } catch (error) {
    console.error("Submission controller error:", error.message);
    console.error(error.stack);

    // Gestion des erreurs spécifiques
    if (error.message.includes("Vidéo invalide")) {
      return res.status(400).json({
        success: false,
        error: "Vidéo non conforme aux critères du festival",
        message: error.message,
      });
    }

    if (error.message.includes("Quota YouTube dépassé")) {
      return res.status(503).json({
        success: false,
        error: "Service temporairement indisponible",
        message: "Le quota YouTube a été atteint. Veuillez réessayer demain.",
      });
    }

    if (error.message.includes("Authentification YouTube")) {
      console.error("YouTube configuration error - contact admin");
      return res.status(500).json({
        success: false,
        error: "Erreur de configuration",
        message: "Une erreur technique est survenue. L'équipe a été notifiée.",
      });
    }

    // Erreur générique
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la soumission",
      message:
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/submissions/:token
 * Récupère le statut d'une soumission par son token
 *
 * @param {Request} req - Requête Express (doit contenir req.params.token)
 * @param {Response} res - Réponse Express
 */
export const getSubmission = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token de soumission manquant",
      });
    }

    const result = await getSubmissionStatus(token);

    return res.status(200).json({
      success: true,
      data: {
        film: {
          id: result.film.id,
          title: result.film.title,
          description: result.film.description,
          country: result.film.country,
          youtubeUrl: result.film.youtubeUrl,
          youtubeStatus: result.film.youtubeStatus,
          status: result.film.status,
          submittedAt: result.film.submittedAt,
          videoDuration: result.film.videoDuration,
          videoFormat: result.film.videoFormat,
        },
        submitter: result.film.submitter,
        youtubeStatus: result.youtubeStatus,
        filmStatus: result.filmStatus,
        canEdit: result.canEdit,
      },
    });
  } catch (error) {
    console.error("Get submission error:", error.message);

    if (error.message === "Soumission non trouvée") {
      return res.status(404).json({
        success: false,
        error: "Soumission non trouvée",
        message: "Aucune soumission ne correspond à ce token.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération",
      message: "Une erreur est survenue.",
    });
  }
};

/**
 * GET /api/submissions/submitter/:email
 * Récupère toutes les soumissions d'un submitter par email
 *
 * @param {Request} req - Requête Express (doit contenir req.params.email)
 * @param {Response} res - Réponse Express
 */
export const getSubmitterSubmissions = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email manquant",
      });
    }

    // Validation de l'email
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Email invalide",
      });
    }

    const films = await getSubmitterFilms(email);

    return res.status(200).json({
      success: true,
      count: films.length,
      data: films.map((film) => ({
        id: film.id,
        submissionToken: film.submissionToken,
        title: film.title,
        youtubeUrl: film.youtubeUrl,
        youtubeStatus: film.youtubeStatus,
        status: film.status,
        submittedAt: film.submittedAt,
        videoDuration: film.videoDuration,
      })),
    });
  } catch (error) {
    console.error("Get submitter submissions error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération",
      message: "Une erreur est survenue.",
    });
  }
};

/**
 * GET /api/submissions/stats
 * Récupère les statistiques globales de soumissions (admin)
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
export const getSubmissionStats = async (req, res) => {
  try {
    // Import dynamique de prisma pour éviter les dépendances circulaires
    const prisma = (await import("../utils/prisma.js")).default;

    const [
      totalFilms,
      pendingFilms,
      approvedFilms,
      rejectedFilms,
      youtubeApproved,
      youtubeRejected,
      youtubePending,
    ] = await Promise.all([
      prisma.film.count(),
      prisma.film.count({ where: { status: "PENDING" } }),
      prisma.film.count({ where: { status: "APPROVED" } }),
      prisma.film.count({ where: { status: "REJECTED" } }),
      prisma.film.count({ where: { youtubeStatus: "APPROVED" } }),
      prisma.film.count({ where: { youtubeStatus: "REJECTED" } }),
      prisma.film.count({ where: { youtubeStatus: "PENDING" } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total: totalFilms,
        byStatus: {
          pending: pendingFilms,
          approved: approvedFilms,
          rejected: rejectedFilms,
        },
        byYoutubeStatus: {
          approved: youtubeApproved,
          rejected: youtubeRejected,
          pending: youtubePending,
        },
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
    });
  }
};
