/**
 * SERVICE DE SOUMISSION DE FILMS - MARSAI FESTIVAL
 *
 * Orchestrer le workflow complet de soumission :
 * 1. Validation des données du formulaire
 * 2. Validation du fichier vidéo (durée, format, taille)
 * 3. Upload vers S3 (Scaleway)
 * 4. Upload vers YouTube
 * 5. Vérification du statut de modération YouTube
 * 6. Enregistrement en base de données
 *
 * Ce service centralise toute la logique métier de soumission.
 */

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";
import prisma from "../utils/prisma.js";
import { validateVideoFile } from "../validators/video.validator.js";
import {
  uploadVideoToYouTube,
  waitForVideoProcessing,
  formatFilmMetadataForYouTube,
} from "./youtube.service.js";

/**
 * Upload une vidéo vers S3 (Scaleway)
 *
 * @param {Buffer} videoBuffer - Buffer de la vidéo
 * @param {string} originalName - Nom original du fichier
 * @returns {Promise<Object>} Résultat avec key, url
 */
export const uploadVideoToS3 = async (videoBuffer, originalName) => {
  try {
    const folder = process.env.SCALEWAY_FOLDER || "submissions";
    const timestamp = Date.now();
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");
    const fileName = `${timestamp}-${sanitizedName}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: process.env.SCALEWAY_BUCKET_NAME,
      Key: key,
      Body: videoBuffer,
      ContentType: "video/mp4",
      Metadata: {
        uploadedAt: new Date().toISOString(),
        source: "marsai-festival-submission",
      },
    });

    await s3.send(command);

    const fileUrl = `${process.env.SCALEWAY_ENDPOINT}/${process.env.SCALEWAY_BUCKET_NAME}/${key}`;

    return {
      success: true,
      key,
      url: fileUrl,
      fileName,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(`Échec de l'upload S3: ${error.message}`);
  }
};

/**
 * Supprime une vidéo de S3
 *
 * @param {string} key - Clé S3 du fichier
 * @returns {Promise<boolean>}
 */
export const deleteVideoFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.SCALEWAY_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    return true;
  } catch (error) {
    console.error("S3 deletion error:", error);
    return false;
  }
};

/**
 * Crée ou récupère un submitter par email
 *
 * @param {Object} submitterData - Données du submitter
 * @returns {Promise<Object>} Submitter
 */
export const getOrCreateSubmitter = async (submitterData) => {
  const { email, firstName, lastName } = submitterData;

  // Chercher si le submitter existe déjà
  let submitter = await prisma.submitter.findUnique({
    where: { email },
  });

  // Si non, le créer
  if (!submitter) {
    submitter = await prisma.submitter.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });
  }

  return submitter;
};

/**
 * Workflow complet de soumission d'un film
 *
 * @param {Object} formData - Données du formulaire
 * @param {Object} videoFile - Fichier vidéo (from multer)
 * @param {Object|null} subtitleFile - Fichier de sous-titres (obligatoire, from multer)
 * @param {Object|null} posterFile - Fichier poster (obligatoire, from multer)
 * @returns {Promise<Object>} Film créé avec toutes les métadonnées
 */
export const submitFilm = async (
  formData,
  videoFile,
  subtitleFile = null,
  posterFile = null,
) => {
  let s3Key = null;
  let youtubeVideoId = null;

  try {
    // ============================================================
    // ÉTAPE 1 : VALIDATION DU FICHIER VIDÉO
    // ============================================================
    const validationResult = await validateVideoFile(videoFile);

    if (!validationResult.isValid) {
      throw new Error(`Vidéo invalide:\n${validationResult.errors.join("\n")}`);
    }

    // ============================================================
    // ÉTAPE 2 : UPLOAD VERS S3
    // ============================================================

    const s3Result = await uploadVideoToS3(
      videoFile.buffer,
      videoFile.originalname,
    );
    s3Key = s3Result.key;

    // ============================================================
    // ÉTAPE 3 : UPLOAD VERS YOUTUBE
    // ============================================================

    const youtubeMetadata = formatFilmMetadataForYouTube({
      title: formData.title,
      description: formData.description,
      country: formData.country,
      aiToolsUsed: formData.aiToolsUsed,
    });

    const youtubeResult = await uploadVideoToYouTube(
      videoFile.buffer,
      youtubeMetadata,
    );
    youtubeVideoId = youtubeResult.videoId;

    // ============================================================
    // ÉTAPE 3.5 : UPLOAD DES SOUS-TITRES (SI FOURNIS)
    // ============================================================
    if (subtitleFile) {
      try {

        const { uploadCaptionToYouTube } = await import("./youtube.service.js");
        await uploadCaptionToYouTube(
          youtubeVideoId,
          subtitleFile.buffer,
          "fr", // Langue française par défaut
          "French",
        );
      } catch (error) {
        // Ne pas bloquer la soumission si les sous-titres échouent
        console.error("Caption upload failed (non-blocking):", error.message);
      }
    }

    // ============================================================
    // ÉTAPE 3.6 : UPLOAD DU POSTER/MINIATURE (SI FOURNI)
    // ============================================================
    if (posterFile) {
      try {
        const { uploadThumbnailToYouTube } =
          await import("./youtube.service.js");
        await uploadThumbnailToYouTube(youtubeVideoId, posterFile.buffer);
      } catch (error) {
        // Ne pas bloquer la soumission si la miniature échoue
        console.error("Thumbnail upload failed (non-blocking):", error.message);
      }
    }

    // ============================================================
    // ÉTAPE 4 : ATTENTE DE LA MODÉRATION YOUTUBE
    // ============================================================
    const moderationStatus = await waitForVideoProcessing(
      youtubeVideoId,
      10, // Max 10 tentatives
      15000, // 15 secondes entre chaque tentative
    );

    // Déterminer le statut YouTube basé sur la modération
    let youtubeStatus = "PENDING";
    if (moderationStatus.approved) {
      youtubeStatus = "APPROVED";
    } else if (moderationStatus.rejected) {
      youtubeStatus = "REJECTED";
    } else if (moderationStatus.failed) {
      youtubeStatus = "FAILED";
    } else if (moderationStatus.pending) {
      youtubeStatus = "PROCESSING";
    }

    // ============================================================
    // ÉTAPE 5 : CRÉATION/RÉCUPÉRATION DU SUBMITTER
    // ============================================================
    const submitter = await getOrCreateSubmitter({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    // ============================================================
    // ÉTAPE 6 : ENREGISTREMENT EN BASE DE DONNÉES
    // ============================================================

    const film = await prisma.film.create({
      data: {
        // Relations
        submitterId: submitter.id,

        // Informations du film
        title: formData.title,
        description: formData.description,
        country: formData.country,
        aiToolsUsed: formData.aiToolsUsed,

        // YouTube
        youtubeVideoId: youtubeResult.videoId,
        youtubeUrl: youtubeResult.videoUrl,
        youtubeStatus,
        youtubeUploadedAt: new Date(),
        youtubeModerationData: moderationStatus,

        // S3
        s3VideoKey: s3Result.key,
        s3VideoUrl: s3Result.url,

        // Métadonnées vidéo
        videoDuration: validationResult.metadata.duration,
        videoFormat: validationResult.metadata.format,
        videoSize: videoFile.size,
        videoWidth: validationResult.metadata.width,
        videoHeight: validationResult.metadata.height,
        videoCodec: validationResult.metadata.codec,

        // Statut du film
        status: youtubeStatus === "APPROVED" ? "PENDING" : "REJECTED",
      },
      include: {
        submitter: true,
      },
    });

    return {
      success: true,
      film,
      message: moderationStatus.approved
        ? "Votre film a été soumis avec succès et approuvé par YouTube!"
        : "Votre film a été soumis. Il est en attente de traitement par YouTube.",
    };
  } catch (error) {
    console.error("Submission error:", error.message);

    // Nettoyage en cas d'erreur
    // TODO: Implémenter rollback complet
    // - Supprimer de S3 si uploadé
    // - Supprimer de YouTube si uploadé (optionnel)

    if (s3Key) {
      await deleteVideoFromS3(s3Key).catch(console.error);
    }

    throw error;
  }
};

/**
 * Récupère le statut d'une soumission par son token
 *
 * @param {string} submissionToken - Token unique de soumission
 * @returns {Promise<Object>} Film avec métadonnées
 */
export const getSubmissionStatus = async (submissionToken) => {
  const film = await prisma.film.findUnique({
    where: { submissionToken },
    include: {
      submitter: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!film) {
    throw new Error("Soumission non trouvée");
  }

  return {
    film,
    youtubeStatus: film.youtubeStatus,
    filmStatus: film.status,
    canEdit: film.status === "TO_MODIFY",
  };
};

/**
 * Récupère toutes les soumissions d'un submitter par email
 *
 * @param {string} email - Email du submitter
 * @returns {Promise<Array>} Liste des films
 */
export const getSubmitterFilms = async (email) => {
  const submitter = await prisma.submitter.findUnique({
    where: { email },
    include: {
      films: {
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!submitter) {
    return [];
  }

  return submitter.films;
};
