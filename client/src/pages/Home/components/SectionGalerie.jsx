/**
 * SectionGalerie.jsx — MARSAI Festival
 * Phase 6 — "L'Avant-première"
 * Étape 4.3 — Refactoring CSS → SectionGalerie.module.css
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Vitrine cinématographique
 * ═══════════════════════════════════════════════════════════════
 *
 * Layout asymétrique (desktop) :
 *   Colonne 1 : grande carte (grid-row: span 2) — film en vedette
 *   Colonne 2 : carte standard
 *   Colonne 3 : carte standard décalée vers le bas
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Handlers onMouseEnter/onMouseLeave supprimés intégralement.
 *    Tous les états hover vivent dans SectionGalerie.module.css
 *    via sélecteurs :hover descendant.
 *
 * 2. film.isFeatured → classes variantes CSS Module :
 *    .filmCard + .filmCardFeatured — appliquées conditionnellement.
 *    Même principe pour le badge mention et le titre.
 *
 * 3. clearProps: 'all' sur les 3 animations GSAP d'entrée —
 *    GSAP nettoie ses styles inline, les :hover CSS prennent
 *    le contrôle sans conflit de transform.
 *
 * 4. href="/galerie" → Link to={ROUTES.GALERIE} (Étape 1).
 *    Les ancres film (#film-id) sont concaténées à ROUTES.GALERIE.
 *
 * 5. Seul style{{}} restant : marginTop sur FilmCard.
 *    La prop offsetTop est une valeur dynamique (60px sur carte 3).
 *    Non extractible vers CSS sans classe utilitaire dédiée.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import { Link }          from 'react-router-dom';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES }        from '@/constants/routes';
import styles            from './SectionGalerie.module.css';

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
    isFeatured:  true,
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

// ─────────────────────────────────────────────────────────────
// CONFIGS D'ANIMATION — gestes distincts par carte
// ─────────────────────────────────────────────────────────────
const ANIM_IN = [
  {
    from: { scale: 0.95, opacity: 0 },
    to:   { scale: 1,    opacity: 1, duration: 1.0,  ease: 'power2.out' },
  },
  {
    from: { y: 60, opacity: 0 },
    to:   { y: 0,  opacity: 1, duration: 0.85, ease: 'power3.out' },
  },
  {
    from: { x: 50, filter: 'blur(6px)', opacity: 0 },
    to:   { x: 0,  filter: 'blur(0px)', opacity: 1, duration: 0.90, ease: 'power2.out' },
  },
];

// ─────────────────────────────────────────────────────────────
// SOUS-COMPOSANT : Carte film
// Aucun handler JS de style — tout est CSS Module.
// ─────────────────────────────────────────────────────────────
function FilmCard({ film, cardRef, offsetTop = 0 }) {
  return (
    <Link
      ref={cardRef}
      to={`${ROUTES.GALERIE}#${film.id}`}
      aria-label={`${film.titre} — ${film.realisateur}`}
      className={`${styles.filmCard} ${film.isFeatured ? styles.filmCardFeatured : ''}`}
      style={
        /* offsetTop est une valeur dynamique transmise par prop (60px sur carte 3).
           Non extractible vers CSS sans classe utilitaire dédiée — exception documentée. */
        offsetTop ? { marginTop: `${offsetTop}px` } : undefined
      }
    >

      {/* ── Image ──────────────────────────────────────── */}
      <img
        src={film.img}
        alt={film.alt}
        className={styles.filmImg}
      />

      {/* ── Overlay gradient ─────────────────────────── */}
      <div
        className={styles.filmOverlay}
        aria-hidden="true"
      />

      {/* ── Grain ────────────────────────────────────── */}
      <div
        className={styles.filmGrain}
        aria-hidden="true"
      />

      {/* ── Badge mention — haut gauche ──────────────── */}
      <div className={styles.mentionWrapper}>
        <span
          className={`${styles.mentionBadge} ${
            film.isFeatured ? styles.mentionBadgeFeatured : styles.mentionBadgeStandard
          }`}
        >
          {film.mention}
        </span>
      </div>

      {/* ── Texte — bas de carte ─────────────────────── */}
      <div className={styles.filmTextContent}>

        {/* Genre */}
        <span className={`label-overline ${styles.filmGenre}`}>
          {film.genre}
        </span>

        {/* Titre */}
        <h3
          className={`${styles.filmTitre} ${
            film.isFeatured ? styles.filmTitreFeatured : ''
          }`}
        >
          {film.titre}
        </h3>

        {/* Réalisateur + pays */}
        <div className={styles.filmMeta}>
          <span className={styles.filmRealisateur}>{film.realisateur}</span>
          <span className={styles.filmSeparator} aria-hidden="true">·</span>
          <span className={styles.filmPays}>{film.pays}</span>
        </div>

        {/* "Voir le film" — révélé au hover via CSS */}
        <div
          className={styles.filmVoir}
          aria-hidden="true"
        >
          <span className={styles.filmVoirLabel}>Voir le film</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path
              d="M1 4H13M10 1L13 4L10 7"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

      </div>
    </Link>
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

        // Cartes — gestes individuels + clearProps.
        // clearProps: 'all' → GSAP nettoie ses styles inline
        // à la fin de chaque animation. Les :hover CSS du module
        // prennent le contrôle sans conflit de transform/opacity.
        cardRefs.forEach((ref, i) => {
          tl.to(ref.current, {
            ...ANIM_IN[i].to,
            clearProps: 'all',
          }, 0.40 + i * 0.15);
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
      className={styles.sectionGalerie}
    >
      <div className={styles.container}>

        {/* ── En-tête ───────────────────────────────────────── */}
        <div className={styles.header}>

          <div ref={overlineRef} className="flex items-center gap-4">
            <span className={styles.overlineLine} />
            <span className="label-overline">Sélection Officielle 2026</span>
          </div>

          {/* Titre — effet rideau 2 lignes */}
          <div>
            <div className={styles.titleLineWrapper}>
              <span
                ref={line1Ref}
                className={`${styles.titleSpan} ${styles.titleSpanMain}`}
              >
                La Sélection
              </span>
            </div>
            <div className={styles.titleLineWrapper}>
              <span
                ref={line2Ref}
                className={`${styles.titleSpan} ${styles.titleSpanAccent}`}
              >
                Officielle
              </span>
            </div>
          </div>
        </div>

        {/* ── Grille asymétrique ───────────────────────────────── */}
        <div className={styles.galerieGrid}>

          {/* Carte 1 — grande, span 2 rangées */}
          <div className={styles.featuredWrapper}>
            <FilmCard film={FILMS[0]} cardRef={card1Ref} />
          </div>

          {/* Carte 2 — standard */}
          <FilmCard film={FILMS[1]} cardRef={card2Ref} />

          {/* Carte 3 — décalée vers le bas (offsetTop dynamique) */}
          <FilmCard film={FILMS[2]} cardRef={card3Ref} offsetTop={60} />

        </div>

        {/* ── CTA typographique ────────────────────────────────── */}
        <div ref={ctaRef} className={styles.ctaWrapper}>
          <Link
            to={ROUTES.GALERIE}
            className={styles.ctaLink}
          >
            <span className={styles.ctaTexte}>
              Découvrir toute la sélection
            </span>
            <span className={styles.ctaArrow} aria-hidden="true">
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <path
                  d="M1 5H21M16 1L21 5L16 9"
                  stroke="var(--color-accent)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}