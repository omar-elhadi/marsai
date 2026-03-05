/**
 * ReservationModal.jsx — MARSAI Festival · Phase 9
 * Formulaire de réservation pour les événements
 * Design system 100% : tokens CSS, Typography.css
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ReservationModal({ isOpen, onClose, event, categoryTitle }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      // Ouverture
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.fromTo(
        modalRef.current,
        { scale: 0.92, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      // Fermeture
      gsap.to(modalRef.current, {
        scale: 0.92,
        y: 30,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  // Fermeture au clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Fermeture à la touche Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi (à remplacer par l'appel API)
    await new Promise(resolve => setTimeout(resolve, 1200));

    console.log('Réservation:', {
      event: event.title,
      category: categoryTitle,
      ...formData,
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Réinitialisation après succès
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({ nom: '', prenom: '', email: '' });
      onClose();
    }, 2000);
  };

  if (!event) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 12, 10, 0.88)',
        backdropFilter: 'blur(8px)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(1rem, 3vw, 2rem)',
        opacity: 0,
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'relative',
          maxWidth: '540px',
          width: '100%',
          backgroundColor: 'var(--color-bg-pure)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'clamp(2rem, 4vw, 3rem)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(226, 209, 195, 0.08)',
        }}
      >
        {/* Bouton fermeture */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            transition: 'all 0.24s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            e.currentTarget.style.borderColor = 'var(--color-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>

        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'block',
                width: '2rem',
                height: '1px',
                background: 'var(--color-accent)',
              }}
            />
            <span className="label-overline">Réservation</span>
          </div>

          <h2
            id="modal-title"
            className="title-section"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '0.5rem',
            }}
          >
            {event.title}
          </h2>

          <div className="body-editorial" style={{ color: 'var(--color-text-faint)' }}>
            <p style={{ margin: 0 }}>
              {categoryTitle} · {event.time}
              {event.place && ` · ${event.place}`}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        {submitSuccess ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-accent)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="title-event" style={{ color: 'var(--color-accent)' }}>
              Réservation confirmée !
            </p>
            <p className="body-editorial" style={{ marginTop: '0.5rem', color: 'var(--color-text-faint)' }}>
              Vous recevrez un email de confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Prénom */}
            <div>
              <label
                htmlFor="prenom"
                className="label-overline"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-main)',
                }}
              >
                Prénom *
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  transition: 'all 0.24s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-accent)';
                  e.target.style.backgroundColor = 'var(--color-surface-high)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.backgroundColor = 'var(--color-surface)';
                }}
              />
            </div>

            {/* Nom */}
            <div>
              <label
                htmlFor="nom"
                className="label-overline"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-main)',
                }}
              >
                Nom *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  transition: 'all 0.24s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-accent)';
                  e.target.style.backgroundColor = 'var(--color-surface-high)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.backgroundColor = 'var(--color-surface)';
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="label-overline"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-main)',
                }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  transition: 'all 0.24s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-accent)';
                  e.target.style.backgroundColor = 'var(--color-surface-high)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.backgroundColor = 'var(--color-surface)';
                }}
              />
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.95rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.24s ease',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    e.currentTarget.style.borderColor = 'var(--color-text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.95rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-bg-pure)',
                  backgroundColor: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.24s ease',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(226, 209, 195, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
              </button>
            </div>

            <p
              className="label-overline"
              style={{
                marginTop: '0.5rem',
                textAlign: 'center',
                color: 'var(--color-text-faint)',
                fontSize: '0.75rem',
              }}
            >
              * Champs obligatoires
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
