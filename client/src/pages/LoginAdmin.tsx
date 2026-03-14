// @ts-nocheck
/**
 * LoginAdmin.jsx — MARSAI Festival
 * Harmonisé avec Contact.jsx — design system MARSAI
 * Layout centré, champs identiques, animations GSAP
 */

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@marsai/validators';
import { useNavigate }  from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api/apiClient';
import gsap             from 'gsap';
import { useGSAP }      from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// STYLES PARTAGÉS — copie exacte de Contact.jsx
// ─────────────────────────────────────────────────────────────
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
export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const pageRef     = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const cardRef     = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useGSAP(() => {
    gsap.set(overlineRef.current, { opacity: 0, y: 12  });
    gsap.set(titleRef.current,    { opacity: 0, y: 26  });
    gsap.set(cardRef.current,     { opacity: 0, y: 22  });

    const tl = gsap.timeline({ delay: 0.10 });
    tl.to(overlineRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
    tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.12);
    tl.to(cardRef.current,     { opacity: 1, y: 0, duration: 0.80, ease: 'power3.out' }, 0.28);
  }, { scope: pageRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.user || response.data);
      setSuccess('Connexion réussie.');
      setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err) {
      setError(err.message || 'Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      style={{
        background:     'var(--color-bg-pure)',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,6rem)',
      }}
    >
      {/* ── En-tête ── */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
        <div
          ref={overlineRef}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.2rem' }}
        >
          <span style={{
            display:    'block',
            width:      'clamp(2rem,3vw,3rem)',
            height:     '1px',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }} />
          <span className="label-overline">Espace administration</span>
          <span style={{
            display:    'block',
            width:      'clamp(2rem,3vw,3rem)',
            height:     '1px',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }} />
        </div>

        <h1 ref={titleRef} className="title-section">
          Connexion
        </h1>
      </div>

      {/* ── Carte formulaire ── */}
      <div
        ref={cardRef}
        style={{
          width:      '100%',
          maxWidth:   '440px',
          padding:    'clamp(2rem,4vw,3rem)',
          border:     '1px solid var(--color-border)',
          borderLeft: '2px solid var(--color-accent)',
          background: 'var(--color-surface)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.1rem,1.8vw,1.5rem)' }}
        >
          {/* Email */}
          <div>
            <label htmlFor="la-email" style={LABEL}>Email</label>
            <input
              id="la-email"
              type="email"
              placeholder="admin@marsai.fr"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={FIELD}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="la-password" style={LABEL}>Mot de passe</label>
            <input
              id="la-password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={FIELD}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              padding:    '0.85rem 1.1rem',
              border:     '1px solid rgba(220,80,80,0.25)',
              borderLeft: '2px solid rgba(220,80,80,0.70)',
              background: 'rgba(220,80,80,0.06)',
            }}>
              <p style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.72rem',
                letterSpacing: '0.08em',
                color:         'rgba(220,100,100,0.90)',
                margin:        0,
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Succès */}
          {success && (
            <div style={{
              padding:    '0.85rem 1.1rem',
              border:     '1px solid rgba(180,209,195,0.25)',
              borderLeft: '2px solid var(--color-accent)',
              background: 'rgba(180,209,195,0.05)',
            }}>
              <p style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      '0.72rem',
                letterSpacing: '0.08em',
                color:         'var(--color-accent)',
                margin:        0,
              }}>
                {success}
              </p>
            </div>
          )}

          {/* Bouton — même style que le bouton de confirmation de Contact */}
          <div style={{ paddingTop: '0.3rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width:          '100%',
                padding:        'clamp(0.8rem,1.2vw,1rem) 1.5rem',
                fontFamily:     'var(--font-sans)',
                fontWeight:     700,
                fontSize:       '0.60rem',
                letterSpacing:  '0.22em',
                textTransform:  'uppercase',
                color:          loading ? 'var(--color-text-faint)' : 'var(--color-bg-pure)',
                background:     loading ? 'var(--color-surface-high)' : 'var(--color-accent)',
                border:         '1px solid var(--color-accent)',
                borderRadius:   'var(--radius-sm)',
                cursor:         loading ? 'not-allowed' : 'pointer',
                transition:     'background 260ms var(--ease-out), color 260ms var(--ease-out), opacity 260ms',
                opacity:        loading ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--color-text)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-accent)'; }}
            >
              {loading ? 'Authentification…' : 'Accéder à la gestion'}
            </button>
          </div>
        </form>
      </div>

      {/* Responsive + placeholders */}
      <style>{`
        input::placeholder {
          color: var(--color-text-faint);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}