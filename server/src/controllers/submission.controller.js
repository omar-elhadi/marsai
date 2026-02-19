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

  // Informations du film
  title: z.string().min(3, "Titre trop court").max(200),
  description: z.string().min(10, "Description trop courte").max(2000),
  country: z.string().min(2, "Pays invalide").max(100),
  aiToolsUsed: z
    .string()
    .min(5, "Veuillez détailler les outils IA utilisés")
    .max(1000),
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
    console.log("\n📥 NOUVELLE REQUÊTE DE SOUMISSION");
    console.log("===================================\n");

    // ============================================================
    // 1. VALIDATION DU FICHIER VIDÉO
    // ============================================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Aucun fichier vidéo fourni",
        message: "Veuillez sélectionner une vidéo à soumettre.",
      });
    }

    console.log("📦 Fichier reçu:");
    console.log(`   Nom: ${req.file.originalname}`);
    console.log(`   Taille: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Type MIME: ${req.file.mimetype}\n`);

    // ============================================================
    // 2. VALIDATION DES DONNÉES DU FORMULAIRE
    // ============================================================
    console.log("📋 Validation des données du formulaire...\n");
    console.log("📦 Données reçues du formulaire:");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("\n");

    let formData;
    try {
      formData = submissionSchema.parse(req.body);
      console.log("✅ Données du formulaire validées\n");
    } catch (zodError) {
      console.error("❌ Données du formulaire invalides:", zodError.errors);

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
    const result = await submitFilm(formData, req.file);

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
    console.error("\n❌ ERREUR CONTROLLER SOUMISSION:", error.message);
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
      console.error("🚨 PROBLÈME DE CONFIGURATION YOUTUBE - CONTACTER L'ADMIN");
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
    console.error("❌ Erreur récupération soumission:", error.message);

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
    console.error(
      "❌ Erreur récupération soumissions submitter:",
      error.message,
    );

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
    console.error("❌ Erreur récupération statistiques:", error.message);

    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
    });
  }
};
