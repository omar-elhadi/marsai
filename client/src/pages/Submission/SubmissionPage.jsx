/**
 * SubmissionPage.jsx — MARSAI Festival · Phase 9
 * "La candidature comme un acte solennel"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE
 * ═══════════════════════════════════════════════════════════════
 *
 * Zéro bg-midnight, zéro text-indigo-400, zéro text-slate.
 * 100% design system MARSAI.
 *
 * Hero : thème + 3 règles éditoriales en colonnes
 * Formulaire : SubmissionForm conservé intact — wrapper redesigné
 * Animations GSAP : rideau 2 lignes + stagger règles
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SubmissionForm    from './SubmissionForm';

gsap.registerPlugin(ScrollTrigger);

const REGLES = [
  { index: '01', titre: 'Ouvert à tous',  corps: 'Amateurs ou professionnels, sans distinction.' },
  { index: '02', titre: '60 Secondes',   corps: 'Générique inclus. Pas une de plus. La contrainte est la forme.' },
  { index: '03', titre: '100% IA',        corps: 'Génération visuelle et sonore intégralement par intelligence artificielle.' },
];

export default function SubmissionPage() {
  const pageRef     = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);
  const themeRef    = useRef(null);
  const rulesRef    = useRef(null);
  const formRef     = useRef(null);

  useGSAP(() => {
    gsap.set(overlineRef.current,                { opacity: 0, y: 14 });
    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });
    gsap.set(themeRef.current,                   { opacity: 0, y: 20 });
    const rules = rulesRef.current ? Array.from(rulesRef.current.children) : [];
    gsap.set(rules, { opacity: 0, y: 24 });

    // Séquence héro
    const tl = gsap.timeline({ delay: 0.10 });
    tl.to(overlineRef.current,
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
    tl.to([line1Ref.current, line2Ref.current],
      { yPercent: 0, duration: 0.85, stagger: 0.11, ease: 'power3.out' }, 0.15);
    tl.to(themeRef.current,
      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.52);
    tl.to(rules,
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' }, 0.68);

    // Formulaire — révélation douce
    if (formRef.current) {
      gsap.set(formRef.current, { opacity: 0 });
      ScrollTrigger.create({
        trigger: formRef.current,
        start:   'top 82%',
        once:    true,
        onEnter: () => gsap.to(formRef.current, { opacity: 1, duration: 0.85, ease: 'power2.out' }),
      });
    }
  }, { scope: pageRef });

  return (
    <div
      ref={pageRef}
      style={{
        background: 'var(--color-bg-pure)',
        minHeight:  '100vh',
        paddingTop: 'clamp(6rem,10vw,8rem)',
      }}
    >

      {/* ── Section héro ─────────────────────────────── */}
      <section
        aria-label="Appel à candidatures"
        style={{
          padding:      'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)',
          borderBottom: '1px solid var(--color-border)',
          maxWidth:     '1200px',
          margin:       '0 auto',
        }}
      >
        {/* Overline */}
        <div
          ref={overlineRef}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
        >
          <span style={{
            display:    'block',
            width:      'clamp(2rem,3vw,3rem)',
            height:     '1px',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }} />
          <span className="label-overline">Appel à candidatures · 2026</span>
        </div>

        {/* Titre rideau 2 lignes */}
        <div style={{ marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
          <div style={{ overflow: 'hidden', lineHeight: 1 }}>
            <span ref={line1Ref} style={{
              display:       'block',
              fontFamily:    'var(--font-display)',
              fontWeight:    900,
              fontSize:      'clamp(2.8rem,7vw,6.5rem)',
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color:         'var(--color-text)',
              paddingBottom: '0.06em',
            }}>
              Soumettre
            </span>
          </div>
          <div style={{ overflow: 'hidden', lineHeight: 1 }}>
            <span ref={line2Ref} style={{
              display:       'block',
              fontFamily:    'var(--font-display)',
              fontWeight:    900,
              fontSize:      'clamp(2.8rem,7vw,6.5rem)',
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color:         'var(--color-accent)',
              paddingBottom: '0.06em',
            }}>
              votre film
            </span>
          </div>
        </div>

        {/* Thème */}
        <div ref={themeRef} style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}>
          <p className="body-meta" style={{ marginBottom: '0.4rem' }}>
            Thème de l'édition 2026
          </p>
          <p style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    300,
            fontSize:      'clamp(1.1rem,2.2vw,1.5rem)',
            fontStyle:     'italic',
            color:         'var(--color-text)',
            lineHeight:    1.4,
          }}>
            "Imaginer des futurs souhaitables"
          </p>
        </div>

        {/* 3 Règles */}
        <div
          ref={rulesRef}
          className="submission-rules-grid"
          style={{
            display:     'grid',
            borderTop:   '1px solid var(--color-border)',
            paddingTop:  'clamp(2rem,4vw,3rem)',
          }}
        >
          {REGLES.map(({ index, titre, corps }, i) => (
            <div
              key={index}
              style={{
                padding:    'clamp(1.2rem,2.5vw,2rem) clamp(1rem,2vw,1.8rem)',
                borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span style={{
                display:       'block',
                fontFamily:    'var(--font-display)',
                fontWeight:    900,
                fontSize:      'clamp(2.2rem,4.5vw,3.5rem)',
                letterSpacing: '-0.04em',
                color:         'var(--color-accent)',
                lineHeight:    1,
                marginBottom:  '0.6rem',
                opacity:       0.55,
              }}>
                {index}
              </span>
              <h3 style={{
                fontFamily:    'var(--font-sans)',
                fontWeight:    800,
                fontSize:      'clamp(0.8rem,1.2vw,0.92rem)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'var(--color-text)',
                marginBottom:  '0.45rem',
              }}>
                {titre}
              </h3>
              <p className="body-meta">{corps}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section formulaire ───────────────────────── */}
      <section
        ref={formRef}
        aria-label="Formulaire de soumission"
        style={{
          padding:  'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,6rem)',
          maxWidth: '1200px',
          margin:   '0 auto',
        }}
      >
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '1rem',
          marginBottom:  'clamp(2.5rem,5vw,4rem)',
        }}>
          <span style={{
            display:    'block',
            width:      'clamp(2rem,3vw,3rem)',
            height:     '1px',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }} />
          <span className="label-overline">Formulaire de soumission</span>
        </div>

        <SubmissionForm />
      </section>

      {/* Responsive */}
      <style>{`
        .submission-rules-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 660px) {
          .submission-rules-grid {
            grid-template-columns: 1fr;
          }
          .submission-rules-grid > div {
            border-left: none !important;
            border-top: 1px solid var(--color-border);
          }
          .submission-rules-grid > div:first-child {
            border-top: none;
          }
        }
      `}</style>
    </div>
  );
}