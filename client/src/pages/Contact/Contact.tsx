/**
 * Contact.jsx — MARSAI Festival · Phase 9
 * "L'accès direct — sobre, précis, humain"
 *
 * ═══════════════════════════════════════════════════════════════
 * Zéro bg-midnight, zéro bg-midnight-light, zéro focus:ring-indigo.
 * 100% design system MARSAI.
 *
 * Layout : 2 colonnes (infos | formulaire)
 * Focus  : border-color sable, background surface-high
 * Bouton : LuminousButton signature
 * Animations GSAP : overline + titre + colonnes décalées
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState } from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import LuminousButton    from '@/components/common/LuminousButton/LuminousButton';

// ─────────────────────────────────────────────────────────────
// STYLES PARTAGÉS CHAMPS
// ─────────────────────────────────────────────────────────────
const FIELD = {
  width:          '100%',
  padding:        'clamp(0.75rem,1.1vw,0.95rem) clamp(0.85rem,1.3vw,1.1rem)',
  fontFamily:     'var(--font-sans)',
  fontWeight:     400,
  fontSize:       'clamp(0.85rem,1.1vw,0.95rem)',
  color:          'var(--color-text)',
  background:     'var(--color-surface)',
  border:         '1px solid var(--color-border)',
  borderRadius:   'var(--radius-sm)',
  outline:        'none',
  transition:     'border-color 260ms var(--ease-out), background 260ms var(--ease-out)',
  boxSizing:      'border-box',
};

const LABEL = {
  display:       'block',
  fontFamily:    'var(--font-sans)',
  fontWeight:    600,
  fontSize:      '0.60rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color:         'var(--color-text-muted)',
  marginBottom:  '0.5rem',
};

const CONTACTS = [
  { label: 'Candidatures',  value: 'films@marsai.fr' },
  { label: 'Presse',        value: 'presse@marsai.fr' },
  { label: 'Partenariats',  value: 'partenaires@marsai.fr' },
];

function onFocus(e) {
  e.target.style.borderColor = 'rgba(226,209,195,0.50)';
  e.target.style.background  = 'var(--color-surface-high)';
}
function onBlur(e) {
  e.target.style.borderColor = 'var(--color-border)';
  e.target.style.background  = 'var(--color-surface)';
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function Contact() {
  const pageRef     = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const leftRef     = useRef(null);
  const rightRef    = useRef(null);
  const [sent, setSent] = useState(false);

  useGSAP(() => {
    gsap.set(overlineRef.current, { opacity: 0, y: 12 });
    gsap.set(titleRef.current,    { opacity: 0, y: 26 });
    gsap.set(leftRef.current,     { opacity: 0, x: -22 });
    gsap.set(rightRef.current,    { opacity: 0, x:  22 });

    const tl = gsap.timeline({ delay: 0.10 });
    tl.to(overlineRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
    tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.12);
    tl.to(leftRef.current,     { opacity: 1, x: 0, duration: 0.80, ease: 'power3.out' }, 0.28);
    tl.to(rightRef.current,    { opacity: 1, x: 0, duration: 0.80, ease: 'power3.out' }, 0.36);
  }, { scope: pageRef });

  const handleSubmit = e => { e.preventDefault(); setSent(true); };

  return (
    <div
      ref={pageRef}
      style={{
        background: 'var(--color-bg-pure)',
        minHeight:  '100vh',
        paddingTop: 'clamp(6rem,10vw,8rem)',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin:   '0 auto',
        padding:  'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,6rem)',
      }}>

        {/* ── En-tête ──────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(3.5rem,7vw,6rem)' }}>
          <div
            ref={overlineRef}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}
          >
            <span style={{
              display:    'block',
              width:      'clamp(2rem,3vw,3rem)',
              height:     '1px',
              background: 'var(--color-accent)',
              flexShrink: 0,
            }} />
            <span className="label-overline">Nous contacter</span>
          </div>

          <h1 ref={titleRef} className="title-section">
            Contact
          </h1>
        </div>

        {/* ── Grille 2 colonnes ─────────────────────── */}
        <div
          className="contact-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1.65fr',
            gap:                 'clamp(3rem,6vw,7rem)',
            alignItems:          'start',
          }}
        >

          {/* COLONNE GAUCHE — infos ─────────────────── */}
          <div ref={leftRef}>
            <p
              className="body-editorial"
              style={{ marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}
            >
              Une question, une candidature, une opportunité de partenariat.
              Chaque message est lu et traité par notre équipe.
            </p>

            {/* Adresses email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {CONTACTS.map(({ label, value }) => (
                <div key={label}>
                  <span
                    className="label-overline"
                    style={{ display: 'block', marginBottom: '0.3rem' }}
                  >
                    {label}
                  </span>
                  <a
                    href={`mailto:${value}`}
                    style={{
                      fontFamily:     'var(--font-sans)',
                      fontWeight:     600,
                      fontSize:       'clamp(0.85rem,1.2vw,0.95rem)',
                      color:          'var(--color-text)',
                      textDecoration: 'none',
                      letterSpacing:  '-0.01em',
                      transition:     'color 260ms var(--ease-out)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}
                  >
                    {value}
                  </a>
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <hr style={{
              border:    'none',
              borderTop: '1px solid var(--color-border)',
              margin:    'clamp(2rem,3.5vw,3rem) 0',
            }} />

            <p className="body-meta" style={{ lineHeight: 1.9 }}>
              Festival MARSAI<br />
              Marseille, France<br />
              20 — 22 Juin 2026
            </p>
          </div>

          {/* COLONNE DROITE — formulaire ─────────────── */}
          <div ref={rightRef}>
            {!sent ? (
              <form
                onSubmit={handleSubmit}
                style={{
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           'clamp(1.1rem,1.8vw,1.5rem)',
                }}
              >
                {/* Ligne Prénom / Nom */}
                <div
                  className="contact-name-row"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                >
                  <div>
                    <label htmlFor="c-prenom" style={LABEL}>Prénom</label>
                    <input
                      id="c-prenom" name="prenom" type="text"
                      placeholder="Marie" required
                      style={FIELD} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-nom" style={LABEL}>Nom</label>
                    <input
                      id="c-nom" name="nom" type="text"
                      placeholder="Dupont" required
                      style={FIELD} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="c-email" style={LABEL}>Email</label>
                  <input
                    id="c-email" name="email" type="email"
                    placeholder="votre.email@exemple.com" required
                    style={FIELD} onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="c-sujet" style={LABEL}>Sujet</label>
                  <select
                    id="c-sujet" name="sujet" required
                    style={{ ...FIELD, cursor: 'pointer' }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value=""            style={{ background: '#1a1a1a' }}>Sélectionner un sujet</option>
                    <option value="candidature" style={{ background: '#1a1a1a' }}>Candidature</option>
                    <option value="presse"      style={{ background: '#1a1a1a' }}>Demande presse</option>
                    <option value="partenariat" style={{ background: '#1a1a1a' }}>Partenariat</option>
                    <option value="autre"       style={{ background: '#1a1a1a' }}>Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="c-message" style={LABEL}>Message</label>
                  <textarea
                    id="c-message" name="message"
                    rows={6} placeholder="Votre message..." required
                    style={{
                      ...FIELD,
                      resize:     'vertical',
                      lineHeight: 1.65,
                      minHeight:  '9rem',
                    }}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {/* Bouton signature */}
                <div style={{ paddingTop: '0.3rem' }}>
                  <LuminousButton
                    label   = "Envoyer le message"
                    to      = "#"
                    variant = "dark"
                    size    = "lg"
                  />
                </div>
              </form>
            ) : (
              /* ── Confirmation ── */
              <div style={{
                padding:      'clamp(2.5rem,4.5vw,4rem)',
                border:       '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                borderLeft:   '2px solid var(--color-accent)',
              }}>
                <span
                  className="label-overline"
                  style={{ display: 'block', marginBottom: '1.2rem' }}
                >
                  Message envoyé
                </span>
                <p style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(2rem,4vw,3rem)',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text)',
                  lineHeight:    1.05,
                  marginBottom:  '1rem',
                }}>
                  Merci.
                </p>
                <p className="body-editorial">
                  Notre équipe reviendra vers vous dans les plus brefs délais.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .contact-name-row { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder {
          color: var(--color-text-faint);
          opacity: 1;
        }
        select option {
          background: var(--color-surface);
          color: var(--color-text);
        }
      `}</style>
    </div>
  );
}