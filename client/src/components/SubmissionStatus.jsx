/**
 * COMPOSANT SUBMISSIONSTATUS - MARSAI FESTIVAL
 * 
 * Affiche la progression de la soumission d'un film.
 * Suit les conventions React du projet : /docs/CONVENTIONS_REACT.md
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Statuts possibles de la soumission
 */
const SUBMISSION_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  VALIDATING: 'validating',
  PROCESSING_S3: 'processing_s3',
  PROCESSING_YOUTUBE: 'processing_youtube',
  CHECKING_MODERATION: 'checking_moderation',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Étapes du workflow de soumission
 */
const STEPS = [
  {
    id: 'validating',
    label: 'Validation de la vidéo',
    description: 'Vérification durée, format, qualité',
  },
  {
    id: 'processing_s3',
    label: 'Upload de la vidéo',
    description: 'Stockage sécurisé sur nos serveurs',
  },
  {
    id: 'processing_youtube',
    label: 'Publication sur YouTube',
    description: 'Mise en ligne de votre film',
  },
  {
    id: 'checking_moderation',
    label: 'Vérification du contenu',
    description: 'Analyse automatique par YouTube',
  },
];

const SubmissionStatus = ({ 
  status, 
  uploadProgress, 
  errorMessage 
}) => {
  /**
   * Détermine si une étape est complétée, en cours ou en attente
   */
  const getStepStatus = (stepId) => {
    const stepIndex = STEPS.findIndex(step => step.id === stepId);
    const currentIndex = STEPS.findIndex(step => step.id === status);

    if (status === SUBMISSION_STATES.SUCCESS) {
      return 'completed';
    }

    if (status === SUBMISSION_STATES.ERROR) {
      return currentIndex === stepIndex ? 'error' : 'pending';
    }

    if (currentIndex > stepIndex) {
      return 'completed';
    } else if (currentIndex === stepIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  /**
   * Icône selon le statut de l'étape
   */
  const getStepIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return (
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return (
          <div className="w-6 h-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
        );
    }
  };

  // Ne rien afficher si status est idle
  if (status === SUBMISSION_STATES.IDLE) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-black/60 border border-white/10 backdrop-blur-sm">
      
      {/* En-tête */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          {status === SUBMISSION_STATES.SUCCESS && '✅ Soumission réussie !'}
          {status === SUBMISSION_STATES.ERROR && '❌ Erreur lors de la soumission'}
          {![SUBMISSION_STATES.SUCCESS, SUBMISSION_STATES.ERROR].includes(status) && 
            '⏳ Soumission en cours...'}
        </h3>
      </div>

      {/* Barre de progression pour l'upload */}
      {status === SUBMISSION_STATES.UPLOADING && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Upload en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Liste des étapes */}
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          
          return (
            <div 
              key={step.id}
              className={`flex items-start gap-4 ${
                stepStatus === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Icône */}
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(stepStatus)}
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <p className={`font-bold text-sm uppercase tracking-wide ${
                  stepStatus === 'completed' ? 'text-green-400' :
                  stepStatus === 'current' ? 'text-indigo-400' :
                  stepStatus === 'error' ? 'text-red-400' :
                  'text-white/50'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {step.description}
                </p>
              </div>

              {/* Ligne de connexion (sauf pour la dernière étape) */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-[11px] top-8 w-0.5 h-12 bg-white/20" 
                     style={{ marginTop: `${index * 72}px` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Message d'erreur */}
      {status === SUBMISSION_STATES.ERROR && errorMessage && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Message de succès */}
      {status === SUBMISSION_STATES.SUCCESS && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <p className="text-green-400 text-sm font-bold">
            🎉 Votre film a été soumis avec succès !
          </p>
          <p className="text-white/70 text-xs mt-2">
            Vous recevrez un email de confirmation avec un lien pour suivre le statut de votre soumission.
          </p>
        </div>
      )}
    </div>
  );
};

SubmissionStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(SUBMISSION_STATES)).isRequired,
  uploadProgress: PropTypes.number,
  errorMessage: PropTypes.string,
};

SubmissionStatus.defaultProps = {
  uploadProgress: 0,
  errorMessage: null,
};

export default SubmissionStatus;
export { SUBMISSION_STATES };
