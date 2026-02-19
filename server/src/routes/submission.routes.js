/**
 * ROUTES DE SOUMISSION - MARSAI FESTIVAL
 * 
 * Définit les routes HTTP pour la soumission de films.
 * 
 * Routes disponibles :
 * - POST   /api/submissions          - Soumettre un nouveau film avec vidéo
 * - GET    /api/submissions/:token   - Récupérer le statut d'une soumission
 * - GET    /api/submissions/submitter/:email - Récupérer toutes les soumissions d'un submitter
 * - GET    /api/submissions/stats    - Statistiques globales (admin)
 * 
 * Convention suivie : /docs/CONVENTIONS_EXPRESS.md
 */

import express from 'express';
import multer from 'multer';
import {
  createSubmission,
  getSubmission,
  getSubmitterSubmissions,
  getSubmissionStats,
} from '../controllers/submission.controller.js';
import { VIDEO_CONSTRAINTS } from '../validators/video.validator.js';

const router = express.Router();

/**
 * Configuration Multer pour l'upload de vidéos
 * - Stockage en mémoire (buffer) pour traitement direct
 * - Limite de taille : 100 MB
 * - Filtrage par type MIME
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES, // 100 MB
    files: 1, // Une seule vidéo par requête
  },
  fileFilter: (req, file, cb) => {
    // Vérification du type MIME
    if (VIDEO_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Format vidéo non supporté: ${file.mimetype}. ` +
          `Formats acceptés: ${VIDEO_CONSTRAINTS.ALLOWED_MIME_TYPES.join(', ')}`
        ),
        false
      );
    }
  },
});

/**
 * Middleware de gestion des erreurs Multer
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux',
        message: `La taille maximale autorisée est de ${VIDEO_CONSTRAINTS.MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Trop de fichiers',
        message: 'Vous ne pouvez soumettre qu\'une seule vidéo à la fois',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Champ de fichier invalide',
        message: 'Le champ de fichier doit être nommé "video"',
      });
    }
  }
  
  if (err.message && err.message.includes('Format vidéo non supporté')) {
    return res.status(400).json({
      success: false,
      error: 'Format non supporté',
      message: err.message,
    });
  }

  // Erreur inconnue
  return res.status(500).json({
    success: false,
    error: 'Erreur lors de l\'upload',
    message: err.message || 'Une erreur est survenue',
  });
};

/**
 * POST /api/submissions
 * Soumet un nouveau film avec fichier vidéo
 * 
 * Body (multipart/form-data) :
 * - video: File (vidéo)
 * - firstName: String
 * - lastName: String
 * - email: String
 * - title: String
 * - description: String
 * - country: String
 * - aiToolsUsed: String
 * 
 * @returns {201} Film créé avec succès
 * @returns {400} Données invalides ou vidéo non conforme
 * @returns {500} Erreur serveur
 */
router.post('/', upload.single('video'), handleMulterError, createSubmission);

/**
 * GET /api/submissions/:token
 * Récupère le statut et les détails d'une soumission
 * 
 * @param {string} token - Token unique de soumission (UUID)
 * @returns {200} Détails de la soumission
 * @returns {404} Soumission non trouvée
 */
router.get('/:token', getSubmission);

/**
 * GET /api/submissions/submitter/:email
 * Récupère toutes les soumissions d'un submitter
 * 
 * @param {string} email - Email du submitter
 * @returns {200} Liste des soumissions
 * @returns {400} Email invalide
 */
router.get('/submitter/:email', getSubmitterSubmissions);

/**
 * GET /api/submissions/stats
 * Récupère les statistiques globales de soumissions
 * TODO: Ajouter middleware d'authentification admin
 * 
 * @returns {200} Statistiques
 */
router.get('/stats', getSubmissionStats);

export default router;
