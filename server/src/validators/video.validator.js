/**
 * VALIDATEUR DE FICHIERS VIDÉO - MARSAI FESTIVAL
 * 
 * Ce module valide les fichiers vidéo soumis selon les critères du festival :
 * - Durée maximale : 60 secondes
 * - Formats acceptés : MP4, MOV, AVI, WEBM, MKV
 * - Taille maximale : 100 MB (configurable)
 * - Résolution minimale : 720p (HD)
 * 
 * Utilise FFmpeg pour analyser les métadonnées vidéo.
 */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { z } from 'zod';

// Configuration du chemin vers FFmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Configuration des contraintes vidéo
 */
export const VIDEO_CONSTRAINTS = {
  MAX_DURATION_SECONDS: 60,
  MAX_FILE_SIZE_BYTES: 100 * 1024 * 1024, // 100 MB
  MIN_WIDTH: 1280, // 720p minimum
  MIN_HEIGHT: 720,
  ALLOWED_FORMATS: ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv'],
  ALLOWED_MIME_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'video/x-matroska',
    'video/x-flv',
  ],
  ALLOWED_CODECS: ['h264', 'h265', 'hevc', 'vp8', 'vp9', 'av1'],
};

/**
 * Schéma Zod pour la validation des métadonnées vidéo
 */
export const videoMetadataSchema = z.object({
  duration: z.number().max(VIDEO_CONSTRAINTS.MAX_DURATION_SECONDS, {
    message: `La vidéo ne doit pas dépasser ${VIDEO_CONSTRAINTS.MAX_DURATION_SECONDS} secondes`,
  }),
  format: z.string(),
  size: z.number().max(VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES, {
    message: `La taille du fichier ne doit pas dépasser ${VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`,
  }),
  width: z.number().min(VIDEO_CONSTRAINTS.MIN_WIDTH, {
    message: `La largeur minimale doit être de ${VIDEO_CONSTRAINTS.MIN_WIDTH}px`,
  }),
  height: z.number().min(VIDEO_CONSTRAINTS.MIN_HEIGHT, {
    message: `La hauteur minimale doit être de ${VIDEO_CONSTRAINTS.MIN_HEIGHT}px`,
  }),
  codec: z.string().optional(),
  bitrate: z.number().optional(),
  fps: z.number().optional(),
});

/**
 * Extrait les métadonnées d'une vidéo avec FFprobe
 * @param {string|Buffer} input - Chemin du fichier ou Buffer
 * @returns {Promise<Object>} Métadonnées de la vidéo
 */
export const extractVideoMetadata = (input) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, metadata) => {
      if (err) {
        return reject(new Error(`Impossible d'analyser la vidéo : ${err.message}`));
      }

      try {
        // Recherche du stream vidéo
        const videoStream = metadata.streams.find(
          (stream) => stream.codec_type === 'video'
        );

        if (!videoStream) {
          return reject(new Error('Aucun stream vidéo trouvé dans le fichier'));
        }

        // Extraction des informations importantes
        const videoMetadata = {
          duration: parseFloat(metadata.format.duration || 0),
          format: metadata.format.format_name,
          size: parseInt(metadata.format.size || 0),
          bitrate: parseInt(metadata.format.bit_rate || 0),
          width: videoStream.width,
          height: videoStream.height,
          codec: videoStream.codec_name,
          fps: eval(videoStream.r_frame_rate || '0'), // Évalue fraction (ex: 30/1)
          pixelFormat: videoStream.pix_fmt,
          profile: videoStream.profile,
        };

        resolve(videoMetadata);
      } catch (parseError) {
        reject(new Error(`Erreur lors du parsing des métadonnées : ${parseError.message}`));
      }
    });
  });
};

/**
 * Valide un fichier vidéo selon les contraintes du festival
 * @param {Object} file - Objet file de Multer (req.file)
 * @returns {Promise<Object>} Résultat de validation { isValid, metadata, errors }
 */
export const validateVideoFile = async (file) => {
  const errors = [];

  try {
    // 1. Vérification basique du fichier
    if (!file) {
      return {
        isValid: false,
        errors: ['Aucun fichier vidéo fourni'],
      };
    }

    // 2. Vérification du MIME type
    if (!VIDEO_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      errors.push(
        `Format non supporté : ${file.mimetype}. Formats acceptés : ${VIDEO_CONSTRAINTS.ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    // 3. Vérification de la taille du fichier
    if (file.size > VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      errors.push(
        `Fichier trop volumineux : ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum : ${VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`
      );
    }

    // 4. Extraction et validation des métadonnées avec FFmpeg
    let metadata;
    try {
      metadata = await extractVideoMetadata(file.buffer);
    } catch (metadataError) {
      return {
        isValid: false,
        errors: [metadataError.message],
      };
    }

    // 5. Validation de la durée
    if (metadata.duration > VIDEO_CONSTRAINTS.MAX_DURATION_SECONDS) {
      errors.push(
        `Durée trop longue : ${metadata.duration.toFixed(2)}s. Maximum : ${VIDEO_CONSTRAINTS.MAX_DURATION_SECONDS}s`
      );
    }

    if (metadata.duration === 0) {
      errors.push('La vidéo semble être vide ou corrompue (durée: 0s)');
    }

    // 6. Validation de la résolution
    if (metadata.width < VIDEO_CONSTRAINTS.MIN_WIDTH || metadata.height < VIDEO_CONSTRAINTS.MIN_HEIGHT) {
      errors.push(
        `Résolution insuffisante : ${metadata.width}x${metadata.height}. ` +
        `Minimum requis : ${VIDEO_CONSTRAINTS.MIN_WIDTH}x${VIDEO_CONSTRAINTS.MIN_HEIGHT} (720p)`
      );
    }

    // 7. Vérification du codec (optionnel mais recommandé)
    if (metadata.codec && !VIDEO_CONSTRAINTS.ALLOWED_CODECS.includes(metadata.codec.toLowerCase())) {
      errors.push(
        `Codec vidéo non optimal : ${metadata.codec}. ` +
        `Codecs recommandés : ${VIDEO_CONSTRAINTS.ALLOWED_CODECS.join(', ')}`
      );
    }

    // 8. Validation finale avec Zod
    try {
      videoMetadataSchema.parse(metadata);
    } catch (zodError) {
      errors.push(...zodError.errors.map((e) => e.message));
    }

    // Retour du résultat
    return {
      isValid: errors.length === 0,
      metadata,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Erreur inattendue lors de la validation : ${error.message}`],
    };
  }
};

/**
 * Génère un thumbnail (miniature) à partir d'une vidéo
 * @param {Buffer} videoBuffer - Buffer de la vidéo
 * @param {string} outputPath - Chemin de sortie pour le thumbnail
 * @param {number} timestamp - Timestamp en secondes (par défaut: 1s)
 * @returns {Promise<string>} Chemin du thumbnail généré
 */
export const generateThumbnail = (videoBuffer, outputPath, timestamp = 1) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoBuffer)
      .screenshots({
        timestamps: [timestamp],
        filename: 'thumbnail.jpg',
        folder: outputPath,
        size: '1280x720',
      })
      .on('end', () => {
        resolve(`${outputPath}/thumbnail.jpg`);
      })
      .on('error', (err) => {
        reject(new Error(`Erreur génération thumbnail : ${err.message}`));
      });
  });
};

/**
 * Valide et nettoie le nom de fichier
 * @param {string} filename - Nom du fichier original
 * @returns {string} Nom de fichier nettoyé et sécurisé
 */
export const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .replace(/[^a-z0-9.-]/g, '') // Garde seulement alphanum, points et tirets
    .substring(0, 100); // Limite la longueur
};

/**
 * Convertit une durée en secondes vers format HH:MM:SS
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
