/**
 * SectionAlliances.jsx — MARSAI Festival
 * "Les Architectes du Possible"
 * Refactoring Étape 4 + Logo Slider infini
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE : Deux couches complémentaires
 * ═══════════════════════════════════════════════════════════════
 *
 * §A — LOGO SLIDER (nouveau)
 *   Bande défilante CSS pure — zéro JS pour l'animation.
 *   Piste doublée (logos × 2) + @keyframes translateX(-50%).
 *   Durée 20s — plus rapide que la référence, noms lisibles.
 *   Masques latéraux CSS — fade aux bords, profondeur cinéma.
 *   Pause au hover — respecte le visiteur qui veut lire.
 *
 * §B — CARTES ÉDITORIALES (nettoyées)
 *   Hover JS → CSS pur (.card:hover dans le module).
 *   <style> tag global supprimé.
 *   clearProps: 'all' sur l'animation d'entrée GSAP.
 *
 * ═══════════════════════════════════════════════════════════════
 * RÈGLE DES STYLES INLINE RESTANTS — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * borderLeft sur les cartes : calculé depuis l'index i du map().
 * Non extractible vers CSS sans logique conditionnelle de classes
 * qui nuirait à la lisibilité. Exception documentée.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles            from './SectionAlliances.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES PARTENAIRES
// ─────────────────────────────────────────────────────────────
const PARTENAIRES = [
  {
    index:   '01',
    nom:     'Sora Studio',
    secteur: 'Génération Vidéo',
    desc:    'Pionnier de la génération vidéo haute fidélité. Partenaire technologique officiel pour les ateliers du festival.',
    href:    '#',
  },
  {
    index:   '02',
    nom:     'Anthropic Labs',
    secteur: 'Intelligence Artificielle',
    desc:    'Recherche fondamentale en IA responsable. Soutien à la création d\'outils narratifs de nouvelle génération.',
    href:    '#',
  },
  {
    index:   '03',
    nom:     'CNC',
    secteur: 'Soutien au Cinéma',
    desc:    'Centre National du Cinéma et de l\'image animée. Reconnaissance officielle du festival dans le paysage culturel français.',
    href:    '#',
  },
  {
    index:   '04',
    nom:     'EDF Pulse',
    secteur: 'Innovation & Énergie',
    desc:    'Programme d\'accélération pour les projets culturels innovants. Dotation en infrastructure pour les finalistes.',
    href:    '#',
  },
];

// ─────────────────────────────────────────────────────────────
// LOGO SLIDER — COMPOSANT INTERNE
// ─────────────────────────────────────────────────────────────
// La piste contient les logos deux fois (original + duplicata).
// @keyframes allianceScroll translate de 0 à -50% — quand la
// piste a parcouru la moitié de sa largeur totale, elle est
// revenue exactement à son point de départ. Boucle seamless.
// Rendu null au-dessous de 540px (mobile portrait) —
// le slider devient illisible à cette largeur.
function LogoSlider() {
  // Assemblage d'une piste : logos intercalés de séparateurs dot
  const SliderItems = () => (
    <>
      {PARTENAIRES.map(({ index, nom, secteur }) => (
        <div key={index} className={styles.sliderItem} aria-hidden="true">
          <span className={styles.sliderName}>{nom}</span>
          <span className={styles.sliderSector}>{secteur}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className={styles.sliderWrapper} aria-hidden="true">
      {/*
        .sliderTrack contient deux fois les items.
        CSS translateX(-50%) ramène exactement au début.
        La boucle est invisible — pas de saut.
      */}
      <div className={styles.sliderTrack}>
        {/* Piste originale */}
        <SliderItems />
        {/* Duplicata — nécessaire pour la boucle seamless */}
        <SliderItems />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function SectionAlliances() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const sliderRef   = useRef(null);
  const gridRef     = useRef(null);

  useGSAP(() => {
    // ── États initiaux ─────────────────────────────────────────
    gsap.set(overlineRef.current, { opacity: 0, y: 14 });
    gsap.set(titleRef.current,    { opacity: 0, y: 28 });
    gsap.set(sliderRef.current,   { opacity: 0 });

    const cols = gridRef.current
      ? Array.from(gridRef.current.children)
      : [];
    gsap.set(cols, { opacity: 0, y: 35 });

    // ── ScrollTrigger ─────────────────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 72%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // Overline
        tl.to(overlineRef.current, {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
        });

        // Titre
        tl.to(titleRef.current, {
          opacity: 1, y: 0,
          duration: 0.75, ease: 'power2.out',
        }, 0.12);

        // Slider — apparition douce, l'animation CSS prend le relais
        tl.to(sliderRef.current, {
          opacity:    1,
          duration:   0.9,
          ease:       'power2.out',
          clearProps: 'opacity',  // CSS animation reprend le contrôle
        }, 0.30);

        // Cartes — stagger rise+fade
        // clearProps: 'all' — GSAP nettoie ses styles inline.
        // Les hover CSS du module reprennent le contrôle.
        tl.to(cols, {
          opacity:    1,
          y:          0,
          duration:   0.65,
          stagger:    0.12,
          ease:       'power2.out',
          clearProps: 'all',
        }, 0.45);
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="partenaires"
      aria-label="Partenaires et alliances du festival MARSAI"
      className={styles.section}
    >
      <div className={styles.container}>

        {/* ── Overline ───────────────────────────────────────── */}
        <div ref={overlineRef} className={styles.overlineRow}>
          <span className={styles.overlineLine} aria-hidden="true" />
          <span className="label-overline">Partenaires Officiels</span>
        </div>

        {/* ── Titre ──────────────────────────────────────────── */}
        <h2
          ref={titleRef}
          className={`title-section ${styles.title}`}
        >
          Les Architectes<br />
          <span className={styles.titleAccent}>du Possible</span>
        </h2>

      </div>

      {/* ── §A : Logo Slider ───────────────────────────────────
          Hors du container pour aller bord à bord.
          aria-hidden : contenu décoratif, lu dans les cartes. */}
      <div ref={sliderRef}>
        <LogoSlider />
      </div>

      {/* ── §B : Cartes éditoriales ────────────────────────────
          Dans le container pour l'alignement avec le reste. */}
      <div className={styles.container}>
        <div ref={gridRef} className={styles.grid}>
          {PARTENAIRES.map(({ index, nom, secteur, desc, href }, i) => (
            <a
              key={index}
              href={href}
              className={styles.card}
              aria-label={`Partenaire ${nom} — ${secteur}`}
              style={{
                /* borderLeft : calculé depuis l'index i.
                   Dynamique par nature — inline documenté.
                   Premier enfant : pas de bordure gauche.
                   Suivants : filet de séparation. */
                borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {/* Numéro décoratif — arrière-plan profond */}
              <span className={styles.cardIndex} aria-hidden="true">
                {index}
              </span>

              {/* Index small */}
              <span className={styles.cardNum} aria-hidden="true">
                {index}
              </span>

              {/* Nom */}
              <h3 className={styles.cardName}>{nom}</h3>

              {/* Secteur */}
              <span className="label-category">{secteur}</span>

              {/* Filet */}
              <hr className={styles.cardHr} />

              {/* Description */}
              <p className={`body-meta ${styles.cardDesc}`}>{desc}</p>

            </a>
          ))}
        </div>
      </div>

    </section>
  );
}