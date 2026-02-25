/**
 * SectionRecompenses.jsx — MARSAI Festival
 * Phase 5 — "Les Récompenses"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : La gravité du chiffre
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Les récompenses sont le climax émotionnel de la page.
 *   Ce pour quoi les cinéastes passeront des nuits blanches.
 *   Le chiffre s'impose — massif, incontestable.
 *   Puis les prix secondaires suivent, dans leur ordre naturel.
 *
 * Composition en deux temps :
 *
 *   TEMPS 1 — Grand Prix (héros de section)
 *     Layout 2 colonnes asymétriques (5fr / 3fr)
 *     Gauche  : chiffre "$50 000" + titre + description
 *     Droite  : 3 conditions d'éligibilité — légitimité
 *     Compteur animé GSAP : 0 → 50 000 en 1.8s
 *
 *   TEMPS 2 — Prix secondaires (grille 3 colonnes)
 *     Prix du Jury / Prix Révélation / Certification
 *     Hiérarchie typographique réduite
 *     Stagger rise+fade 120ms
 *
 * Animation GSAP ScrollTrigger :
 *   Grand Prix : chiffre compte depuis 0, rise+fade simultanés
 *   Colonne droite : rise+fade décalé +0.2s
 *   Prix secondaires : stagger 120ms
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────────────────────

const GRAND_PRIX = {
  montant:    50000,
  devise:     '$',
  separateur: '\u202F', // Espace fine insécable — typographie française
  titre:      'Grand Prix MARSAI',
  description:
    'Décerné au film qui incarne le mieux la vision du festival : ' +
    'une émotion vraie portée par une IA maîtrisée. ' +
    'Le jury vote à l\'unanimité.',
  conditions: [
    { num: '01', label: 'Film de 60 secondes maximum' },
    { num: '02', label: 'Généré intégralement par IA' },
    { num: '03', label: 'Première mondiale obligatoire' },
  ],
};

const PRIX_SECONDAIRES = [
  {
    index:  '02',
    titre:  'Prix du Jury',
    valeur: '$15 000',
    description:
      'Attribué à l\'œuvre la plus audacieuse formellement. ' +
      'Celui qui brise les règles de la manière la plus convaincante.',
  },
  {
    index:  '03',
    titre:  'Prix Révélation',
    valeur: '$8 000',
    description:
      'Réservé aux cinéastes présentant leur premier film en compétition. ' +
      'La promesse d\'un talent qui vient d\'éclore.',
  },
  {
    index:  '04',
    titre:  'Certification MARSAI',
    valeur: 'Tous les finalistes',
    description:
      'Label d\'excellence remis aux 50 films finalistes. ' +
      'Reconnaissance internationale, réseau d\'élite, accès aux partenaires.',
    isSpecial: true,
  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function SectionRecompenses() {
  const sectionRef    = useRef(null);
  const overlineRef   = useRef(null);
  const titleRef      = useRef(null);

  // Grand Prix
  const counterRef    = useRef(null);
  const gpTitreRef    = useRef(null);
  const gpDescRef     = useRef(null);
  const gpColDroite   = useRef(null);

  // Prix secondaires
  const secondRef     = useRef(null);

  useGSAP(() => {
    // ── États initiaux ────────────────────────────────────────
    gsap.set(overlineRef.current,  { opacity: 0, y: 14 });
    gsap.set(titleRef.current,     { opacity: 0, y: 30 });
    gsap.set(counterRef.current,   { opacity: 0, y: 40 });
    gsap.set(gpTitreRef.current,   { opacity: 0, y: 22 });
    gsap.set(gpDescRef.current,    { opacity: 0, y: 18 });
    gsap.set(gpColDroite.current,  { opacity: 0, x: 30 });

    const cards = secondRef.current
      ? Array.from(secondRef.current.children)
      : [];
    gsap.set(cards, { opacity: 0, y: 35 });

    // ── ScrollTrigger ─────────────────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 68%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // Overline + titre
        tl.to(overlineRef.current, {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
        });
        tl.to(titleRef.current, {
          opacity: 1, y: 0,
          duration: 0.75, ease: 'power2.out',
        }, 0.12);

        // Chiffre — rise + compteur simultanés
        tl.to(counterRef.current, {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power2.out',
        }, 0.35);

        // Compteur numérique 0 → 50 000
        const counter = { val: 0 };
        tl.to(counter, {
          val:      GRAND_PRIX.montant,
          duration: 1.8,
          ease:     'power2.out',
          onUpdate() {
            if (counterRef.current) {
              // Formatage : 50 000 avec espace fine insécable
              const formatted = Math.round(counter.val)
                .toLocaleString('fr-FR')
                .replace(/\s/g, '\u202F');
              counterRef.current.textContent =
                GRAND_PRIX.devise + '\u202F' + formatted;
            }
          },
        }, 0.45);

        // Titre + description Grand Prix
        tl.to(gpTitreRef.current, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, 0.55);
        tl.to(gpDescRef.current, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, 0.70);

        // Colonne droite — légèrement décalée
        tl.to(gpColDroite.current, {
          opacity: 1, x: 0,
          duration: 0.80, ease: 'power2.out',
        }, 0.55);

        // Prix secondaires — stagger
        tl.to(cards, {
          opacity: 1, y: 0,
          duration: 0.65,
          stagger:  0.12,
          ease:     'power2.out',
        }, 1.0);
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="recompenses"
      aria-label="Récompenses du festival MARSAI"
      style={{
        background: 'var(--color-bg-pure)',
        borderTop:  '1px solid var(--color-border)',
        padding:    'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Overline ──────────────────────────────────────── */}
        <div ref={overlineRef} className="flex items-center gap-4 mb-10 md:mb-14">
          <span style={{
            display: 'block', width: 'clamp(2rem, 3vw, 3rem)',
            height: '1px', background: 'var(--color-accent)', flexShrink: 0,
          }} />
          <span className="label-overline">Dotations & Reconnaissances</span>
        </div>

        {/* ── Titre ─────────────────────────────────────────── */}
        <h2
          ref={titleRef}
          className="title-section"
          style={{ marginBottom: 'clamp(3.5rem, 7vw, 6rem)' }}
        >
          Ce que tu peux<br />
          <span style={{ color: 'var(--color-accent)' }}>remporter</span>
        </h2>

        {/* ══════════════════════════════════════════════════
            TEMPS 1 — GRAND PRIX
            Layout asymétrique 5fr / 3fr
            ══════════════════════════════════════════════ */}
        <div
          className="grand-prix-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: '5fr 3fr',
            gap:                 'clamp(2rem, 4vw, 5rem)',
            alignItems:          'start',
            padding:             'clamp(2.5rem, 4vw, 4rem)',
            background:          'var(--color-surface)',
            borderRadius:        'var(--radius-sm)',
            border:              '1px solid var(--color-border)',
            marginBottom:        'clamp(3rem, 5vw, 5rem)',
            position:            'relative',
            overflow:            'hidden',
          }}
        >
          {/* Numéro d'index vertical — décoratif */}
          <span
            aria-hidden="true"
            style={{
              position:      'absolute',
              top:           'clamp(1.5rem, 2.5vw, 2.5rem)',
              right:         'clamp(1.5rem, 2.5vw, 2.5rem)',
              fontFamily:    'var(--font-sans)',
              fontWeight:    900,
              fontSize:      'clamp(0.55rem, 0.8vw, 0.65rem)',
              letterSpacing: '0.20em',
              color:         'rgba(226,209,195,0.25)',
              textTransform: 'uppercase',
            }}
          >
            Grand Prix — 01
          </span>

          {/* Colonne gauche */}
          <div>
            {/* Chiffre animé */}
            <div
              ref={counterRef}
              aria-label={`${GRAND_PRIX.devise} ${GRAND_PRIX.montant.toLocaleString('fr-FR')}`}
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    900,
                fontSize:      'clamp(4rem, 12vw, 10rem)',
                lineHeight:    0.9,
                letterSpacing: '-0.04em',
                color:         'var(--color-accent)',
                marginBottom:  'clamp(1.5rem, 2.5vw, 2rem)',
                willChange:    'transform, opacity',
                // Valeur initiale visible avant l'animation
              }}
            >
              {GRAND_PRIX.devise}&thinsp;0
            </div>

            {/* Titre du prix */}
            <h3
              ref={gpTitreRef}
              style={{
                fontFamily:    'var(--font-sans)',
                fontWeight:    800,
                fontSize:      'clamp(1.2rem, 2.5vw, 1.8rem)',
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
                color:         'var(--color-text)',
                marginBottom:  'clamp(0.8rem, 1.5vw, 1.2rem)',
                lineHeight:    1.15,
              }}
            >
              {GRAND_PRIX.titre}
            </h3>

            {/* Description */}
            <p
              ref={gpDescRef}
              className="body-editorial"
              style={{ maxWidth: '52ch' }}
            >
              {GRAND_PRIX.description}
            </p>
          </div>

          {/* Colonne droite — conditions */}
          <div
            ref={gpColDroite}
            style={{
              paddingTop:  'clamp(0.5rem, 2vw, 1rem)',
              borderLeft:  '1px solid var(--color-border)',
              paddingLeft: 'clamp(1.5rem, 3vw, 3rem)',
            }}
          >
            <span
              className="label-overline"
              style={{
                display:      'block',
                marginBottom: 'clamp(1.2rem, 2vw, 1.8rem)',
                opacity:      0.55,
              }}
            >
              Conditions de remise
            </span>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {GRAND_PRIX.conditions.map(({ num, label }) => (
                <li
                  key={num}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}
                >
                  <span
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontWeight:    900,
                      fontSize:      '0.6rem',
                      letterSpacing: '0.18em',
                      color:         'var(--color-accent)',
                      opacity:       0.7,
                      flexShrink:    0,
                      paddingTop:    '0.15em',
                    }}
                  >
                    {num}
                  </span>
                  <span className="body-meta">{label}</span>
                </li>
              ))}
            </ul>

            {/* Filet + note jury */}
            <div
              style={{
                marginTop:  'clamp(1.5rem, 3vw, 2.5rem)',
                paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
                borderTop:  '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {/* Dot accent */}
                <span style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: 'var(--color-accent)', flexShrink: 0,
                }} />
                <span
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontWeight:    500,
                    fontSize:      '0.68rem',
                    letterSpacing: '0.08em',
                    color:         'var(--color-text-muted)',
                    fontStyle:     'italic',
                  }}
                >
                  Vote à l'unanimité du jury
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            Séparateur décoratif entre les deux temps
            ══════════════════════════════════════════════ */}
        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '1.2rem',
            marginBottom:  'clamp(2.5rem, 4vw, 4rem)',
          }}
        >
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
          <span className="label-overline" style={{ opacity: 0.45, flexShrink: 0 }}>
            Prix secondaires
          </span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
        </div>

        {/* ══════════════════════════════════════════════════
            TEMPS 2 — PRIX SECONDAIRES
            Grille 3 colonnes → 1 col mobile
            ══════════════════════════════════════════════ */}
        <div
          ref={secondRef}
          className="prix-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          {PRIX_SECONDAIRES.map(({ index, titre, valeur, description, isSpecial }) => (
            <article
              key={index}
              style={{
                padding:      'clamp(1.8rem, 3vw, 2.5rem)',
                background:   isSpecial
                  ? 'transparent'
                  : 'var(--color-surface)',
                border:       '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                display:      'flex',
                flexDirection:'column',
                gap:          '0.8rem',
                position:     'relative',
                // Bordure gauche colorée sur hover — CSS géré ci-dessous
              }}
              className="prix-card"
            >
              {/* Bord gauche accent au hover */}
              <span
                aria-hidden="true"
                style={{
                  position:        'absolute',
                  top: 0, left: 0,
                  width:           '2px',
                  height:          '100%',
                  background:      'var(--color-accent)',
                  transform:       'scaleY(0)',
                  transformOrigin: 'bottom center',
                  transition:      'transform 0.25s var(--ease-out)',
                }}
                className="prix-border"
              />

              {/* Index */}
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    900,
                  fontSize:      '0.6rem',
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color:         'var(--color-accent)',
                  opacity:       0.8,
                }}
              >
                {index}
              </span>

              {/* Valeur monétaire */}
              <div
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(1.6rem, 3.5vw, 2.6rem)',
                  letterSpacing: '-0.03em',
                  lineHeight:    1,
                  color:         isSpecial
                    ? 'var(--color-text-muted)'
                    : 'var(--color-text)',
                }}
              >
                {valeur}
              </div>

              {/* Titre */}
              <h3
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    700,
                  fontSize:      'clamp(0.9rem, 1.5vw, 1.1rem)',
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text)',
                  lineHeight:    1.2,
                  transition:    'color 0.3s var(--ease-out)',
                }}
                className="prix-titre"
              >
                {titre}
              </h3>

              {/* Séparateur */}
              <hr style={{
                border: 'none',
                borderTop: '1px solid var(--color-border)',
                margin: '0.2rem 0',
              }} />

              {/* Description */}
              <p className="body-meta" style={{ lineHeight: 1.65 }}>
                {description}
              </p>
            </article>
          ))}
        </div>

      </div>

      {/* ── Styles hover — partagés entre les cartes secondaires ── */}
      <style>{`
        .prix-card:hover .prix-border {
          transform: scaleY(1);
        }
        .prix-card:hover .prix-titre {
          color: var(--color-accent);
        }
        @media (max-width: 900px) {
          .grand-prix-grid {
            grid-template-columns: 1fr !important;
          }
          .grand-prix-grid > div:last-child {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--color-border);
            padding-top: clamp(1.5rem, 3vw, 2rem);
          }
        }
        @media (max-width: 680px) {
          .prix-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}