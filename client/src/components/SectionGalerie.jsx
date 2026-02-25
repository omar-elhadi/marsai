/**
 * SectionGalerie.jsx — MARSAI Festival
 * Phase 6 — "L'Avant-première"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Vitrine cinématographique
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Le festival produit des films. La page d'accueil doit
 *   en montrer. Trois affiches en vitrine — format poster
 *   vertical 2:3, référence directe au cinéma de festival.
 *   Pas une grille uniforme : une composition vivante,
 *   asymétrique, qui donne envie de tout voir.
 *
 * Layout asymétrique (desktop) :
 *   Colonne 1 : grande carte (grid-row: span 2) — film en vedette
 *   Colonne 2 : carte standard
 *   Colonne 3 : carte standard décalée vers le bas
 *
 * Hover :
 *   Image scale(1.04) + overlay allégé
 *   Titre → var(--color-accent)
 *   "Voir le film →" apparaît depuis y:8→0
 *
 * Animations d'entrée — 3 gestes distincts :
 *   Carte 1 : scale(0.95→1) + opacity  — présence massive
 *   Carte 2 : y(60→0) + opacity        — montée
 *   Carte 3 : x(50→0) + blur(6px→0)   — glissement latéral
 *
 * CTA de section :
 *   Lien typographique "Découvrir toute la sélection"
 *   Flèche SVG animée x:0→6 au hover
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES — Sélection officielle 2026
// ─────────────────────────────────────────────────────────────
const FILMS = [
  {
    id:          'film-01',
    titre:       'Mémoire Synthétique',
    realisateur: 'K. Okafor',
    pays:        'Nigeria · France',
    genre:       'Drame / Mémoire',
    mention:     'Sélection Officielle',
    isFeatured:  true,          // Grande carte — colonne 1
    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=88&w=900&auto=format&fit=crop',
    alt: 'Mémoire Synthétique — film IA en sélection officielle MARSAI',
  },
  {
    id:          'film-02',
    titre:       'Éclat de Rien',
    realisateur: 'M. Chen',
    pays:        'Taiwan',
    genre:       'Poésie Visuelle',
    mention:     'Mention Spéciale',
    isFeatured:  false,
    img: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?q=88&w=900&auto=format&fit=crop',
    alt: 'Éclat de Rien — poésie visuelle IA MARSAI',
  },
  {
    id:          'film-03',
    titre:       'La Dernière Fréquence',
    realisateur: 'A. Petrov',
    pays:        'Russie · Allemagne',
    genre:       'Science-fiction',
    mention:     'Compétition',
    isFeatured:  false,
    img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=88&w=900&auto=format&fit=crop',
    alt: 'La Dernière Fréquence — science-fiction IA MARSAI',
  },
];

// Configs d'animation — une par carte, gestes distincts
const ANIM_IN = [
  // Carte 1 (grande) — présence, scale depuis légère compression
  { from: { scale: 0.95, opacity: 0 },
    to:   { scale: 1,    opacity: 1, duration: 1.0, ease: 'power2.out' } },
  // Carte 2 — montée franche
  { from: { y: 60, opacity: 0 },
    to:   { y: 0,  opacity: 1, duration: 0.85, ease: 'power3.out' } },
  // Carte 3 — glissement latéral + désfloutage
  { from: { x: 50, filter: 'blur(6px)', opacity: 0 },
    to:   { x: 0,  filter: 'blur(0px)', opacity: 1, duration: 0.90, ease: 'power2.out' } },
];

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT : Carte film
// ─────────────────────────────────────────────────────────────
function FilmCard({ film, cardRef, offsetTop = 0 }) {
  return (
    <a
      ref={cardRef}
      href={`/galerie#${film.id}`}
      aria-label={`${film.titre} — ${film.realisateur}`}
      className="film-card"
      style={{
        display:      'block',
        position:     'relative',
        overflow:     'hidden',
        borderRadius: 'var(--radius-sm)',
        // Format poster 2:3 — hauteur doublée pour la featured
        aspectRatio:  film.isFeatured ? 'auto' : '2 / 3',
        height:       film.isFeatured ? '100%' : 'auto',
        minHeight:    film.isFeatured ? '480px' : '320px',
        marginTop:    offsetTop ? `${offsetTop}px` : 0,
        textDecoration: 'none',
        cursor:       'pointer',
        background:   'var(--color-surface)',
        willChange:   'transform',
        transition:   `box-shadow 0.4s var(--ease-out),
                       transform  0.4s var(--ease-out)`,
        boxShadow:    '0 8px 40px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => {
        const el       = e.currentTarget;
        const img      = el.querySelector('.film-img');
        const overlay  = el.querySelector('.film-overlay');
        const titre    = el.querySelector('.film-titre');
        const voir     = el.querySelector('.film-voir');
        el.style.transform  = 'translateY(-5px)';
        el.style.boxShadow  = '0 28px 70px rgba(0,0,0,0.65)';
        if (img)     img.style.transform   = 'scale(1.05)';
        if (overlay) overlay.style.opacity = '0.45';
        if (titre)   titre.style.color     = 'var(--color-accent)';
        if (voir) {
          voir.style.opacity   = '1';
          voir.style.transform = 'translateY(0)';
        }
      }}
      onMouseLeave={e => {
        const el       = e.currentTarget;
        const img      = el.querySelector('.film-img');
        const overlay  = el.querySelector('.film-overlay');
        const titre    = el.querySelector('.film-titre');
        const voir     = el.querySelector('.film-voir');
        el.style.transform  = 'translateY(0)';
        el.style.boxShadow  = '0 8px 40px rgba(0,0,0,0.4)';
        if (img)     img.style.transform   = 'scale(1)';
        if (overlay) overlay.style.opacity = '0.72';
        if (titre)   titre.style.color     = 'var(--color-text)';
        if (voir) {
          voir.style.opacity   = '0';
          voir.style.transform = 'translateY(8px)';
        }
      }}
    >
      {/* Image */}
      <img
        src={film.img}
        alt={film.alt}
        className="film-img"
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center 30%',
          transform:      'scale(1)',
          transition:     'transform 0.55s var(--ease-out)',
          willChange:     'transform',
        }}
      />

      {/* Overlay gradient */}
      <div
        className="film-overlay"
        aria-hidden="true"
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.50) 45%,
            rgba(0,0,0,0.08) 100%
          )`,
          opacity:    0.72,
          transition: 'opacity 0.5s var(--ease-out)',
        }}
      />

      {/* Grain — cohérence avec le héros et le thème */}
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize:  '180px 180px',
          opacity:         0.03,
          mixBlendMode:    'overlay',
          pointerEvents:   'none',
        }}
      />

      {/* Mention sélection — haut gauche */}
      <div
        style={{
          position: 'absolute',
          top:      'clamp(0.9rem, 1.5vw, 1.4rem)',
          left:     'clamp(0.9rem, 1.5vw, 1.4rem)',
          zIndex:   2,
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    600,
            fontSize:      '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         film.isFeatured
              ? 'var(--color-bg-pure)'
              : 'var(--color-text-muted)',
            background: film.isFeatured
              ? 'var(--color-accent)'
              : 'transparent',
            border: film.isFeatured
              ? 'none'
              : '1px solid rgba(241,245,249,0.2)',
            padding:      film.isFeatured ? '0.3em 0.7em' : '0.25em 0.6em',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {film.mention}
        </span>
      </div>

      {/* Texte — bas de carte */}
      <div
        style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          padding:  'clamp(1rem, 2vw, 1.6rem)',
          zIndex:   2,
        }}
      >
        {/* Genre */}
        <span
          className="label-overline"
          style={{ display: 'block', marginBottom: '0.35rem', opacity: 0.55 }}
        >
          {film.genre}
        </span>

        {/* Titre */}
        <h3
          className="film-titre"
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    800,
            fontSize:      film.isFeatured
              ? 'clamp(1.2rem, 2.5vw, 1.7rem)'
              : 'clamp(1rem, 2vw, 1.3rem)',
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
            lineHeight:    1.1,
            color:         'var(--color-text)',
            marginBottom:  '0.3rem',
            transition:    'color 0.35s var(--ease-out)',
          }}
        >
          {film.titre}
        </h3>

        {/* Réalisateur + pays */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    400,
              fontSize:      'clamp(0.68rem, 1vw, 0.78rem)',
              letterSpacing: '0.06em',
              color:         'rgba(241,245,249,0.55)',
            }}
          >
            {film.realisateur}
          </span>
          <span style={{ color: 'rgba(241,245,249,0.2)', fontSize: '0.6rem' }}>·</span>
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    400,
              fontSize:      'clamp(0.62rem, 0.9vw, 0.70rem)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color:         'rgba(241,245,249,0.35)',
            }}
          >
            {film.pays}
          </span>
        </div>

        {/* "Voir le film" — apparaît au hover */}
        <div
          className="film-voir"
          aria-hidden="true"
          style={{
            marginTop:   '0.9rem',
            display:     'flex',
            alignItems:  'center',
            gap:         '0.5rem',
            opacity:     0,
            transform:   'translateY(8px)',
            transition:  `opacity   0.35s var(--ease-out),
                          transform 0.35s var(--ease-out)`,
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    600,
              fontSize:      '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color:         'var(--color-accent)',
            }}
          >
            Voir le film
          </span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1 4H13M10 1L13 4L10 7"
              stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function SectionGalerie() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);
  const ctaRef      = useRef(null);
  const card1Ref    = useRef(null);
  const card2Ref    = useRef(null);
  const card3Ref    = useRef(null);

  const cardRefs = [card1Ref, card2Ref, card3Ref];

  useGSAP(() => {
    // ── États initiaux ────────────────────────────────────────
    gsap.set(overlineRef.current,  { opacity: 0, y: 14 });
    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 105 });
    gsap.set(ctaRef.current,       { opacity: 0, x: -10 });

    cardRefs.forEach((ref, i) => {
      gsap.set(ref.current, ANIM_IN[i].from);
    });

    // ── ScrollTrigger principal ───────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 70%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // Overline
        tl.to(overlineRef.current, {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
        });

        // Titre — effet rideau, 2 lignes
        tl.to([line1Ref.current, line2Ref.current], {
          yPercent:  0,
          duration:  0.85,
          stagger:   0.13,
          ease:      'power3.out',
        }, 0.15);

        // Cartes — gestes individuels, stagger 0.15s
        cardRefs.forEach((ref, i) => {
          tl.to(ref.current, ANIM_IN[i].to, 0.40 + i * 0.15);
        });

        // CTA
        tl.to(ctaRef.current, {
          opacity: 1, x: 0,
          duration: 0.65, ease: 'power2.out',
        }, 0.90);
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="galerie"
      aria-label="Aperçu de la sélection — Galerie MARSAI"
      style={{
        background: 'var(--color-bg-pure)',
        borderTop:  '1px solid var(--color-border)',
        padding:    'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── En-tête ───────────────────────────────────────── */}
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           'clamp(1rem, 1.8vw, 1.5rem)',
            marginBottom:  'clamp(3.5rem, 7vw, 6rem)',
          }}
        >
          {/* Overline */}
          <div ref={overlineRef} className="flex items-center gap-4">
            <span style={{
              display: 'block', width: 'clamp(2rem, 3vw, 3rem)',
              height: '1px', background: 'var(--color-accent)', flexShrink: 0,
            }} />
            <span className="label-overline">Sélection Officielle 2026</span>
          </div>

          {/* Titre — effet rideau 2 lignes */}
          <div>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span
                ref={line1Ref}
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(2.8rem, 7.5vw, 7rem)',
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text)',
                  paddingBottom: '0.06em',
                }}
              >
                La Sélection
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span
                ref={line2Ref}
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(2.8rem, 7.5vw, 7rem)',
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  color:         'var(--color-accent)',
                  paddingBottom: '0.06em',
                }}
              >
                Officielle
              </span>
            </div>
          </div>
        </div>

        {/* ── Grille asymétrique ───────────────────────────────
            Desktop : 3 colonnes, carte 1 sur 2 rangées
            Tablette : 2 colonnes
            Mobile   : 1 colonne
            ──────────────────────────────────────────────── */}
        <div
          className="galerie-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            gridTemplateRows:    'auto',
            gap:                 'clamp(0.8rem, 1.5vw, 1.4rem)',
            alignItems:          'start',
            marginBottom:        'clamp(3rem, 5vw, 5rem)',
          }}
        >
          {/* Carte 1 — grande, span 2 rangées */}
          <div style={{ gridRow: '1 / 3' }}>
            <FilmCard film={FILMS[0]} cardRef={card1Ref} />
          </div>

          {/* Carte 2 — standard */}
          <FilmCard film={FILMS[1]} cardRef={card2Ref} />

          {/* Carte 3 — décalée vers le bas */}
          <FilmCard film={FILMS[2]} cardRef={card3Ref} offsetTop={60} />
        </div>

        {/* ── CTA typographique ────────────────────────────────
            Pas un bouton pill — un lien sobre avec flèche
            ──────────────────────────────────────────────── */}
        <div
          ref={ctaRef}
          style={{
            display:        'flex',
            justifyContent: 'flex-end',
          }}
        >
          <a
            href="/galerie"
            className="cta-galerie"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.8rem',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily:    'var(--font-sans)',
                fontWeight:    700,
                fontSize:      'clamp(0.78rem, 1.1vw, 0.9rem)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color:         'var(--color-text)',
                transition:    'color 0.3s var(--ease-out)',
              }}
              className="cta-galerie-texte"
            >
              Découvrir toute la sélection
            </span>
            {/* Flèche qui glisse au hover */}
            <span
              className="cta-galerie-arrow"
              style={{
                display:    'inline-flex',
                transition: 'transform 0.3s var(--ease-out)',
              }}
            >
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <path d="M1 5H21M16 1L21 5L16 9"
                  stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
          </a>
        </div>

      </div>

      {/* ── Styles hover + responsive ─────────────────────────── */}
      <style>{`
        .cta-galerie:hover .cta-galerie-texte {
          color: var(--color-accent);
        }
        .cta-galerie:hover .cta-galerie-arrow {
          transform: translateX(6px);
        }

        @media (max-width: 860px) {
          .galerie-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .galerie-grid > div:first-child {
            grid-row: auto !important;
          }
        }
        @media (max-width: 540px) {
          .galerie-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}