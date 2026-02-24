/**
 * SectionJury.jsx — MARSAI Festival
 * Phase 4 — "Le Jury International"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Portrait éditorial cinématographique
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Chaque juré est un personnage — pas une entrée de liste.
 *   Les portraits en N&B révèlent leur couleur au hover.
 *   La grille asymétrique crée un rythme éditorial vivant.
 *
 * Animations — 4 gestes distincts, 1 seul tempo :
 *   Carte 1 : glissement gauche     (x:-60→0)
 *   Carte 2 : montée + scale        (y:80→0, scale:0.92→1)
 *   Carte 3 : rotation légère       (y:40→0, rotation:2→0)
 *   Carte 4 : glissement droit+blur (x:60→0, blur:8px→0)
 *   → Diversité dans le geste, cohérence dans la durée (~0.9s)
 *
 * Hover :
 *   Photo : grayscale(100%) → grayscale(0%)
 *   Carte : translateY(-4px) + shadow plus profonde
 *   Nom   : → var(--color-accent)
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES — Jury International
// Remplacer par les vrais profils en production
// ─────────────────────────────────────────────────────────────
const JURY = [
  {
    id:      'spalliero',
    nom:     'S. Spalliero',
    prenom:  'Sofia',
    role:    'Directrice Artistique',
    pays:    'Italie',
    bio:     'Pionnière du cinéma génératif européen. Fondatrice du studio Chromatic AI, primée à la Mostra de Venise.',
    img:     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=800&auto=format&fit=crop&crop=face',
    alt:     'Portrait de Sofia Spalliero, Directrice Artistique',
  },
  {
    id:      'deltoro',
    nom:     'G. Del Toro',
    prenom:  'Gabriel',
    role:    'Réalisateur',
    pays:    'Mexique',
    bio:     'Maître de l\'image narrative. 20 ans de recherche sur la convergence entre émotion humaine et algorithme créatif.',
    img:     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=85&w=800&auto=format&fit=crop&crop=face',
    alt:     'Portrait de Gabriel Del Toro, Réalisateur',
  },
  {
    id:      'elenavanee',
    nom:     'Elena-Vanee',
    prenom:  'Elena',
    role:    'Compositrice IA',
    pays:    'France',
    bio:     'Compositrice et chercheuse en musique générative. Ses œuvres ont été interprétées dans 30 pays.',
    img:     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=85&w=800&auto=format&fit=crop&crop=face',
    alt:     'Portrait d\'Elena-Vanee, Compositrice IA',
  },
  {
    id:      'thorne',
    nom:     'Marc Thorne',
    prenom:  'Marc',
    role:    'Critique & Théoricien',
    pays:    'Royaume-Uni',
    bio:     'Auteur de "The Algorithm Gaze". Éditorialiste pour Sight & Sound, spécialiste du post-cinéma.',
    img:     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=85&w=800&auto=format&fit=crop&crop=face',
    alt:     'Portrait de Marc Thorne, Critique et Théoricien',
  },
];

// ─────────────────────────────────────────────────────────────
// CONFIGS D'ANIMATION — une par carte
// Chaque carte reçoit son propre "geste" d'entrée
// ─────────────────────────────────────────────────────────────
const ANIM_CONFIGS = [
  // Carte 1 — Glissement depuis la gauche
  {
    from: { x: -60, opacity: 0 },
    to:   { x: 0,   opacity: 1, duration: 0.90, ease: 'power3.out' },
  },
  // Carte 2 — Montée depuis le bas avec scale
  {
    from: { y: 80, scale: 0.92, opacity: 0 },
    to:   { y: 0,  scale: 1,    opacity: 1, duration: 1.00, ease: 'power2.out' },
  },
  // Carte 3 — Fondu avec légère rotation
  {
    from: { y: 40, rotation: 2,  opacity: 0 },
    to:   { y: 0,  rotation: 0,  opacity: 1, duration: 0.85, ease: 'back.out(1.2)' },
  },
  // Carte 4 — Glissement depuis la droite + désfloutage
  {
    from: { x: 60, filter: 'blur(8px)', opacity: 0 },
    to:   { x: 0,  filter: 'blur(0px)', opacity: 1, duration: 0.90, ease: 'power3.out' },
  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT CARTE JURÉ
// ─────────────────────────────────────────────────────────────
function JuryCard({ juré, animConfig, cardRef }) {
  return (
    <article
      ref={cardRef}
      aria-label={`${juré.prenom} ${juré.nom} — ${juré.role}`}
      className="jury-card"
      style={{
        position:   'relative',
        overflow:   'hidden',
        cursor:     'default',
        borderRadius: 'var(--radius-sm)',
        // Hauteur adaptative selon la taille d'écran
        aspectRatio: '3 / 4',
        background: 'var(--color-surface)',
        willChange: 'transform',
        transition: `transform 0.4s var(--ease-out),
                     box-shadow 0.4s var(--ease-out)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform  = 'translateY(-6px)';
        el.style.boxShadow  = '0 30px 70px rgba(0,0,0,0.6)';
        const img = el.querySelector('.jury-photo');
        const overlay = el.querySelector('.jury-overlay');
        const nom = el.querySelector('.jury-nom');
        if (img) {
          img.style.filter    = 'grayscale(0%)';
          img.style.transform = 'scale(1.04)';
        }
        if (overlay) overlay.style.opacity = '0.55';
        if (nom)     nom.style.color      = 'var(--color-accent)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';
        const img = el.querySelector('.jury-photo');
        const overlay = el.querySelector('.jury-overlay');
        const nom = el.querySelector('.jury-nom');
        if (img) {
          img.style.filter    = 'grayscale(100%)';
          img.style.transform = 'scale(1)';
        }
        if (overlay) overlay.style.opacity = '0.72';
        if (nom)     nom.style.color      = 'var(--color-text)';
      }}
    >
      {/* ── Photo portrait ──────────────────────────────── */}
      <img
        src={juré.img}
        alt={juré.alt}
        className="jury-photo"
        style={{
          position:   'absolute',
          inset:      0,
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          objectPosition: 'center 20%',
          // N&B par défaut — couleur révélée au hover
          filter:     'grayscale(100%)',
          transform:  'scale(1)',
          transition: `filter    0.55s var(--ease-out),
                       transform 0.55s var(--ease-out)`,
          willChange: 'filter, transform',
        }}
      />

      {/* ── Overlay gradient — lisibilité du texte bas ─── */}
      <div
        className="jury-overlay"
        aria-hidden="true"
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.40) 50%,
            rgba(0,0,0,0.05) 100%
          )`,
          opacity:    0.72,
          transition: 'opacity 0.55s var(--ease-out)',
        }}
      />

      {/* ── Texte — ancré en bas gauche ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          padding:  'clamp(1.2rem, 2.5vw, 2rem)',
          zIndex:   2,
        }}
      >
        {/* Pays */}
        <span
          className="label-overline"
          style={{
            display:      'block',
            marginBottom: '0.4rem',
            opacity:      0.65,
          }}
        >
          {juré.pays}
        </span>

        {/* Nom */}
        <h3
          className="jury-nom"
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    800,
            fontSize:      'clamp(1.05rem, 2vw, 1.45rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            lineHeight:    1.1,
            color:         'var(--color-text)',
            marginBottom:  '0.35rem',
            transition:    'color 0.4s var(--ease-out)',
          }}
        >
          {juré.nom}
        </h3>

        {/* Rôle */}
        <span className="label-category">{juré.role}</span>
      </div>

      {/* ── Numéro discret en haut droite ────────────────── */}
      <span
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           'clamp(0.8rem, 1.5vw, 1.2rem)',
          right:         'clamp(0.8rem, 1.5vw, 1.2rem)',
          fontFamily:    'var(--font-sans)',
          fontWeight:    900,
          fontSize:      '0.6rem',
          letterSpacing: '0.18em',
          color:         'rgba(226,209,195,0.45)',
          zIndex:        2,
        }}
      >
        0{JURY.findIndex(j => j.id === juré.id) + 1}
      </span>

    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function SectionJury() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const introRef    = useRef(null);
  // Une ref par carte pour les animations individuelles
  const card1Ref    = useRef(null);
  const card2Ref    = useRef(null);
  const card3Ref    = useRef(null);
  const card4Ref    = useRef(null);

  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref];

  useGSAP(() => {
    // ── États initiaux ─────────────────────────────────────
    gsap.set(overlineRef.current, { opacity: 0, y: 14 });
    gsap.set(titleRef.current,    { opacity: 0, y: 30 });
    gsap.set(introRef.current,    { opacity: 0, y: 20 });

    // Chaque carte reçoit son propre état initial
    cardRefs.forEach((ref, i) => {
      gsap.set(ref.current, ANIM_CONFIGS[i].from);
    });

    // ── ScrollTrigger ──────────────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 70%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // En-tête — cascade rapide
        tl.to(overlineRef.current, {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
        });

        tl.to(titleRef.current, {
          opacity: 1, y: 0,
          duration: 0.75, ease: 'power2.out',
        }, 0.12);

        tl.to(introRef.current, {
          opacity: 1, y: 0,
          duration: 0.60, ease: 'power2.out',
        }, 0.28);

        // Cartes — animations individuelles en stagger
        // Chaque carte démarre 0.15s après la précédente
        // mais avec son propre geste
        cardRefs.forEach((ref, i) => {
          tl.to(ref.current, {
            ...ANIM_CONFIGS[i].to,
          }, 0.45 + i * 0.15);
        });
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="jury"
      aria-label="Le Jury International MARSAI"
      style={{
        background: 'var(--color-bg-pure)',
        borderTop:  '1px solid var(--color-border)',
        padding:    'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── En-tête ──────────────────────────────────────── */}
        <div
          style={{
            display:         'flex',
            flexDirection:   'column',
            gap:             'clamp(1.2rem, 2vw, 1.8rem)',
            marginBottom:    'clamp(3.5rem, 7vw, 6rem)',
          }}
        >
          {/* Overline */}
          <div ref={overlineRef} className="flex items-center gap-4">
            <span style={{
              display:    'block',
              width:      'clamp(2rem, 3vw, 3rem)',
              height:     '1px',
              background: 'var(--color-accent)',
              flexShrink: 0,
            }} />
            <span className="label-overline">Festival des Cinéastes I.A.</span>
          </div>

          {/* Titre */}
          <h2
            ref={titleRef}
            className="title-section"
          >
            Le Jury<br />
            <span style={{ color: 'var(--color-accent)' }}>International</span>
          </h2>

          {/* Introduction */}
          <p
            ref={introRef}
            className="body-editorial"
            style={{ maxWidth: '52ch' }}
          >
            Quatre regards. Quatre continents. Une exigence commune :
            que l'émotion prime sur la technique, que l'humanité
            survive à l'algorithme.
          </p>
        </div>

        {/* ── Grille des cartes — layout asymétrique ──────────
            Desktop : 4 colonnes égales
            Tablette : 2 × 2
            Mobile   : 1 colonne
            L'asymétrie vient du décalage vertical via
            marginTop sur les cartes 2 et 4 (desktop only)
            ──────────────────────────────────────────────── */}
        <div
          className="jury-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 'clamp(0.8rem, 1.5vw, 1.4rem)',
          }}
        >
          <JuryCard juré={JURY[0]} animConfig={ANIM_CONFIGS[0]} cardRef={card1Ref} />
          <JuryCard juré={JURY[1]} animConfig={ANIM_CONFIGS[1]} cardRef={card2Ref} />
          <JuryCard juré={JURY[2]} animConfig={ANIM_CONFIGS[2]} cardRef={card3Ref} />
          <JuryCard juré={JURY[3]} animConfig={ANIM_CONFIGS[3]} cardRef={card4Ref} />
        </div>

        {/* ── Note de bas de section ───────────────────────── */}
        <div
          style={{
            marginTop:   'clamp(2.5rem, 4vw, 3.5rem)',
            display:     'flex',
            alignItems:  'center',
            gap:         '1rem',
          }}
        >
          <hr style={{
            flex:        1,
            border:      'none',
            borderTop:   '1px solid var(--color-border)',
          }} />
          <span
            className="label-overline"
            style={{ flexShrink: 0, opacity: 0.5 }}
          >
            Composition complète annoncée en Avril 2026
          </span>
          <hr style={{
            flex:        1,
            border:      'none',
            borderTop:   '1px solid var(--color-border)',
          }} />
        </div>

      </div>

      {/* ── Responsive — grille adaptative ──────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          .jury-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .jury-grid {
            grid-template-columns: 1fr !important;
          }
          .jury-grid article {
            aspect-ratio: 4 / 3 !important;
          }
        }
        .jury-card {
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }
      `}</style>

    </section>
  );
}