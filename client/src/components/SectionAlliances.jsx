/**
 * SectionAlliances.jsx — MARSAI Festival
 * "Les Architectes du Possible"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Un mur de partenaires, pas une grille de logos
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Chaque partenaire mérite un nom, un secteur, une raison d'être.
 *   4 colonnes verticales séparées par des filets d'1px.
 *   Numéro d'index en grand, très pâle — décoratif, profond.
 *   Bord gauche accent au hover — cohérence absolue avec le site.
 *
 * Animation ScrollTrigger :
 *   Colonnes : rise+fade stagger 120ms
 *   Numéros : apparition séparée, opacité 0→0.07
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARTENAIRES = [
  {
    index:       '01',
    nom:         'Sora Studio',
    secteur:     'Génération Vidéo',
    description: 'Pionnier de la génération vidéo haute fidélité. Partenaire technologique officiel pour les ateliers du festival.',
    lien:        '#',
  },
  {
    index:       '02',
    nom:         'Anthropic Labs',
    secteur:     'Intelligence Artificielle',
    description: 'Recherche fondamentale en IA responsable. Soutien à la création d\'outils narratifs de nouvelle génération.',
    lien:        '#',
  },
  {
    index:       '03',
    nom:         'CNC',
    secteur:     'Soutien au Cinéma',
    description: 'Centre National du Cinéma et de l\'image animée. Reconnaissance officielle du festival dans le paysage culturel français.',
    lien:        '#',
  },
  {
    index:       '04',
    nom:         'EDF Pulse',
    secteur:     'Innovation & Énergie',
    description: 'Programme d\'accélération pour les projets culturels innovants. Dotation en infrastructure pour les finalistes.',
    lien:        '#',
  },
];

export default function SectionAlliances() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const gridRef     = useRef(null);

  useGSAP(() => {
    gsap.set(overlineRef.current, { opacity: 0, y: 14 });
    gsap.set(titleRef.current,    { opacity: 0, y: 28 });
    const cols = gridRef.current ? Array.from(gridRef.current.children) : [];
    gsap.set(cols, { opacity: 0, y: 35 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 72%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();
        tl.to(overlineRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
        tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.12);
        tl.to(cols, {
          opacity: 1, y: 0,
          duration: 0.65, stagger: 0.12, ease: 'power2.out',
        }, 0.35);
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="partenaires"
      aria-label="Partenaires et alliances du festival MARSAI"
      style={{
        background: 'var(--color-surface)',
        borderTop:  '1px solid var(--color-border)',
        padding:    'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,6rem)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Overline */}
        <div ref={overlineRef} className="flex items-center gap-4 mb-10 md:mb-14">
          <span style={{
            display: 'block', width: 'clamp(2rem,3vw,3rem)',
            height: '1px', background: 'var(--color-accent)', flexShrink: 0,
          }} />
          <span className="label-overline">Partenaires Officiels</span>
        </div>

        {/* Titre */}
        <h2
          ref={titleRef}
          className="title-section"
          style={{ marginBottom: 'clamp(3.5rem,7vw,6rem)' }}
        >
          Les Architectes<br />
          <span style={{ color: 'var(--color-accent)' }}>du Possible</span>
        </h2>

        {/* Grille 4 colonnes séparées par filets */}
        <div
          ref={gridRef}
          className="alliances-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {PARTENAIRES.map(({ index, nom, secteur, description, lien }, i) => (
            <a
              key={index}
              href={lien}
              className="alliance-card"
              style={{
                position:       'relative',
                display:        'flex',
                flexDirection:  'column',
                gap:            'clamp(0.8rem,1.5vw,1.2rem)',
                padding:        'clamp(1.8rem,3vw,2.8rem) clamp(1.5rem,2.5vw,2.2rem)',
                borderLeft:     i > 0 ? '1px solid var(--color-border)' : 'none',
                borderTop:      '2px solid transparent',
                textDecoration: 'none',
                overflow:       'hidden',
                transition:     'background 300ms var(--ease-out)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background  = 'var(--color-surface-high)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background  = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Numéro décoratif — arrière-plan */}
              <span
                aria-hidden="true"
                style={{
                  position:      'absolute',
                  bottom:        '-0.5rem',
                  right:         'clamp(0.5rem,1.5vw,1rem)',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(4rem,8vw,7rem)',
                  lineHeight:    1,
                  letterSpacing: '-0.04em',
                  color:         'var(--color-text)',
                  opacity:       0.04,
                  userSelect:    'none',
                  pointerEvents: 'none',
                }}
              >
                {index}
              </span>

              {/* Index small */}
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    900,
                  fontSize:      '0.6rem',
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color:         'var(--color-accent)',
                  opacity:       0.7,
                }}
              >
                {index}
              </span>

              {/* Nom */}
              <h3
                className="alliance-nom"
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    800,
                  fontSize:      'clamp(1rem,1.8vw,1.35rem)',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text)',
                  lineHeight:    1.1,
                  transition:    'color 300ms var(--ease-out)',
                }}
              >
                {nom}
              </h3>

              {/* Secteur */}
              <span className="label-category">{secteur}</span>

              {/* Filet */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />

              {/* Description */}
              <p className="body-meta" style={{ lineHeight: 1.65 }}>{description}</p>
            </a>
          ))}
        </div>

      </div>

      <style>{`
        .alliance-card:hover .alliance-nom {
          color: var(--color-accent);
        }
        @media (max-width: 900px) {
          .alliances-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .alliance-card:nth-child(odd) {
            border-left: none !important;
          }
          .alliance-card:nth-child(3),
          .alliance-card:nth-child(4) {
            border-top: 1px solid var(--color-border) !important;
          }
        }
        @media (max-width: 540px) {
          .alliances-grid {
            grid-template-columns: 1fr !important;
          }
          .alliance-card {
            border-left: none !important;
            border-top: 1px solid var(--color-border) !important;
          }
          .alliance-card:first-child {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}