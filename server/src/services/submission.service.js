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

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.js';
import prisma from '../utils/prisma.js';
import { validateVideoFile } from '../validators/video.validator.js';
import {
  uploadVideoToYouTube,
  waitForVideoProcessing,
  formatFilmMetadataForYouTube,
} from './youtube.service.js';

/**
 * Upload une vidéo vers S3 (Scaleway)
 * 
 * @param {Buffer} videoBuffer - Buffer de la vidéo
 * @param {string} originalName - Nom original du fichier
 * @returns {Promise<Object>} Résultat avec key, url
 */
export const uploadVideoToS3 = async (videoBuffer, originalName) => {
  try {
    const folder = process.env.SCALEWAY_FOLDER || 'submissions';
    const timestamp = Date.now();
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.-]/g, '');
    const fileName = `${timestamp}-${sanitizedName}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    console.log(`📤 Upload vers S3: ${key}`);

    const command = new PutObjectCommand({
      Bucket: process.env.SCALEWAY_BUCKET_NAME,
      Key: key,
      Body: videoBuffer,
      ContentType: 'video/mp4',
      Metadata: {
        uploadedAt: new Date().toISOString(),
        source: 'marsai-festival-submission',
      },
    });

    await s3.send(command);

    const fileUrl = `${process.env.SCALEWAY_ENDPOINT}/${process.env.SCALEWAY_BUCKET_NAME}/${key}`;

    console.log(`✅ Vidéo uploadée sur S3: ${fileUrl}`);

    return {
      success: true,
      key,
      url: fileUrl,
      fileName,
    };
  } catch (error) {
    console.error('❌ Erreur upload S3:', error);
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
    console.log(`🗑️  Vidéo supprimée de S3: ${key}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression S3:', error);
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
    console.log(`✅ Nouveau submitter créé: ${email}`);
  } else {
    console.log(`✅ Submitter existant trouvé: ${email}`);
  }

  return submitter;
};

/**
 * Workflow complet de soumission d'un film
 * 
 * @param {Object} formData - Données du formulaire
 * @param {Object} videoFile - Fichier vidéo (from multer)
 * @returns {Promise<Object>} Film créé avec toutes les métadonnées
 */
export const submitFilm = async (formData, videoFile) => {
  let s3Key = null;
  let youtubeVideoId = null;

  try {
    console.log('\n🎬 DÉBUT DU WORKFLOW DE SOUMISSION\n');
    console.log('=====================================\n');

    // ============================================================
    // ÉTAPE 1 : VALIDATION DU FICHIER VIDÉO
    // ============================================================
    console.log('📋 ÉTAPE 1/6 : Validation de la vidéo...');
    
    const validationResult = await validateVideoFile(videoFile);
    
    if (!validationResult.isValid) {
      throw new Error(
        `Vidéo invalide:\n${validationResult.errors.join('\n')}`
      );
    }

    console.log('✅ Vidéo validée avec succès');
    console.log(`   Durée: ${validationResult.metadata.duration.toFixed(2)}s`);
    console.log(`   Résolution: ${validationResult.metadata.width}x${validationResult.metadata.height}`);
    console.log(`   Format: ${validationResult.metadata.format}`);
    console.log(`   Codec: ${validationResult.metadata.codec}\n`);

    // ============================================================
    // ÉTAPE 2 : UPLOAD VERS S3
    // ============================================================
    console.log('📋 ÉTAPE 2/6 : Upload vers S3...');
    
    const s3Result = await uploadVideoToS3(
      videoFile.buffer,
      videoFile.originalname
    );
    s3Key = s3Result.key;

    console.log(`✅ Vidéo uploadée sur S3: ${s3Result.url}\n`);

    // ============================================================
    // ÉTAPE 3 : UPLOAD VERS YOUTUBE
    // ============================================================
    console.log('📋 ÉTAPE 3/6 : Upload vers YouTube...');
    
    const youtubeMetadata = formatFilmMetadataForYouTube({
      title: formData.title,
      description: formData.description,
      country: formData.country,
      aiToolsUsed: formData.aiToolsUsed,
    });

    const youtubeResult = await uploadVideoToYouTube(
      videoFile.buffer,
      youtubeMetadata
    );
    youtubeVideoId = youtubeResult.videoId;

    console.log(`✅ Vidéo uploadée sur YouTube: ${youtubeResult.videoUrl}\n`);

    // ============================================================
    // ÉTAPE 4 : ATTENTE DE LA MODÉRATION YOUTUBE
    // ============================================================
    console.log('📋 ÉTAPE 4/6 : Vérification de la modération YouTube...');
    console.log('⏳ Cela peut prendre quelques minutes...\n');
    
    const moderationStatus = await waitForVideoProcessing(
      youtubeVideoId,
      10, // Max 10 tentatives
      15000 // 15 secondes entre chaque tentative
    );

    console.log(`   Statut final: ${moderationStatus.uploadStatus}`);
    console.log(`   Message: ${moderationStatus.message}\n`);

    // Déterminer le statut YouTube basé sur la modération
    let youtubeStatus = 'PENDING';
    if (moderationStatus.approved) {
      youtubeStatus = 'APPROVED';
    } else if (moderationStatus.rejected) {
      youtubeStatus = 'REJECTED';
    } else if (moderationStatus.failed) {
      youtubeStatus = 'FAILED';
    } else if (moderationStatus.pending) {
      youtubeStatus = 'PROCESSING';
    }

    // ============================================================
    // ÉTAPE 5 : CRÉATION/RÉCUPÉRATION DU SUBMITTER
    // ============================================================
    console.log('📋 ÉTAPE 5/6 : Gestion du submitter...');
    
    const submitter = await getOrCreateSubmitter({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    console.log(`✅ Submitter ID: ${submitter.id}\n`);

    // ============================================================
    // ÉTAPE 6 : ENREGISTREMENT EN BASE DE DONNÉES
    // ============================================================
    console.log('📋 ÉTAPE 6/6 : Enregistrement en base de données...');
    
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
        status: youtubeStatus === 'APPROVED' ? 'PENDING' : 'REJECTED',
      },
      include: {
        submitter: true,
      },
    });

    console.log(`✅ Film enregistré avec ID: ${film.id}`);
    console.log(`   Token de soumission: ${film.submissionToken}\n`);

    console.log('=====================================');
    console.log('🎉 SOUMISSION TERMINÉE AVEC SUCCÈS!\n');

    return {
      success: true,
      film,
      message: moderationStatus.approved
        ? 'Votre film a été soumis avec succès et approuvé par YouTube!'
        : 'Votre film a été soumis. Il est en attente de traitement par YouTube.',
    };
  } catch (error) {
    console.error('\n❌ ERREUR DURANT LA SOUMISSION:', error.message);
    console.log('🔄 Nettoyage des ressources...\n');

    // Nettoyage en cas d'erreur
    // TODO: Implémenter rollback complet
    // - Supprimer de S3 si uploadé
    // - Supprimer de YouTube si uploadé (optionnel)
    
    if (s3Key) {
      console.log('🗑️  Tentative de suppression de S3...');
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
    throw new Error('Soumission non trouvée');
  }

  return {
    film,
    youtubeStatus: film.youtubeStatus,
    filmStatus: film.status,
    canEdit: film.status === 'TO_MODIFY',
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
        orderBy: { submittedAt: 'desc' },
      },
    },
  });

  if (!submitter) {
    return [];
  }

  return submitter.films;
};
