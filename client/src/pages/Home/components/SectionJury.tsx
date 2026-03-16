/**
 * SectionJury.jsx — MARSAI Festival
 * Phase 4 — "{t('jury.title1')} International"
 * Étape 4.2 — Refactoring CSS → SectionJury.module.css
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
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Handlers onMouseEnter/onMouseLeave supprimés.
 *    Tous les états hover sont désormais des sélecteurs CSS
 *    dans SectionJury.module.css (.juryCard:hover .juryPhoto, etc.)
 *    Gain : zéro recalcul React au survol, transitions plus fluides.
 *
 * 2. clearProps: 'all' ajouté à chaque animation d'entrée GSAP.
 *    Sans cette ligne, GSAP laisserait des transform inline qui
 *    écraseraient les :hover CSS. clearProps nettoie les styles
 *    inline dès que l'animation se termine — CSS reprend le contrôle.
 *
 * 3. Le <style> tag global JSX est supprimé.
 *    Les breakpoints responsive et le box-shadow vivent dans le module.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles            from './SectionJury.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES — Jury International
// ─────────────────────────────────────────────────────────────
const JURY = [
  {
    id:     'spalliero',
    nom:    'S. Spalliero',
    prenom: 'Sofia',
    role:   'Directrice Artistique',
    pays:   'Italie',
    bio:    'Pionnière du cinéma génératif européen. Fondatrice du studio Chromatic AI, primée à la Mostra de Venise.',
    img:    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=88&w=800&auto=format&fit=crop&crop=face',
    alt:    'Portrait de Sofia Spalliero, Directrice Artistique',
  },
  {
    id:     'deltoro',
    nom:    'G. Del Toro',
    prenom: 'Gabriel',
    role:   'Réalisateur',
    pays:   'Mexique',
    bio:    'Maître de l\'image narrative. 20 ans de recherche sur la convergence entre émotion humaine et algorithme créatif.',
    img:    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=88&w=800&auto=format&fit=crop&crop=face',
    alt:    'Portrait de Gabriel Del Toro, Réalisateur',
  },
  {
    id:     'elenavanee',
    nom:    'Elena-Vanee',
    prenom: 'Elena',
    role:   'Compositrice IA',
    pays:   'France',
    bio:    'Compositrice et chercheuse en musique générative. Ses œuvres ont été interprétées dans 30 pays.',
    img:    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=88&w=800&auto=format&fit=crop&crop=face',
    alt:    'Portrait d\'Elena-Vanee, Compositrice IA',
  },
  {
    id:     'thorne',
    nom:    'Marc Thorne',
    prenom: 'Marc',
    role:   'Critique & Théoricien',
    pays:   'Royaume-Uni',
    bio:    'Auteur de "The Algorithm Gaze". Éditorialiste pour Sight & Sound, spécialiste du post-cinéma.',
    img:    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=88&w=800&auto=format&fit=crop&crop=face',
    alt:    'Portrait de Marc Thorne, Critique et Théoricien',
  },
];

// ─────────────────────────────────────────────────────────────
// CONFIGS D'ANIMATION — une par carte
// ─────────────────────────────────────────────────────────────
const ANIM_CONFIGS = [
  {
    from: { x: -60, opacity: 0 },
    to:   { x: 0,   opacity: 1, duration: 0.90, ease: 'power3.out' },
  },
  {
    from: { y: 80, scale: 0.92, opacity: 0 },
    to:   { y: 0,  scale: 1,    opacity: 1, duration: 1.00, ease: 'power2.out' },
  },
  {
    from: { y: 40, rotation: 2,  opacity: 0 },
    to:   { y: 0,  rotation: 0,  opacity: 1, duration: 0.85, ease: 'back.out(1.2)' },
  },
  {
    from: { x: 60, filter: 'blur(8px)', opacity: 0 },
    to:   { x: 0,  filter: 'blur(0px)', opacity: 1, duration: 0.90, ease: 'power3.out' },
  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT CARTE JURÉ
// Tous les états hover sont gérés par CSS Module.
// Aucun handler JS de style ne subsiste ici.
// ─────────────────────────────────────────────────────────────
function JuryCard({ juré, cardRef }) {
  return (
    <article
      ref={cardRef}
      aria-label={`${juré.prenom} ${juré.nom} — ${juré.role}`}
      className={styles.juryCard}
    >

      {/* ── Photo portrait ──────────────────────────────── */}
      <img
        src={juré.img}
        alt={juré.alt}
        className={styles.juryPhoto}
      />

      {/* ── Overlay gradient — lisibilité du texte bas ─── */}
      <div
        className={styles.juryOverlay}
        aria-hidden="true"
      />

      {/* ── Texte — ancré en bas gauche ─────────────────── */}
      <div className={styles.juryTextContent}>

        <span className={`label-overline ${styles.juryPays}`}>
          {juré.pays}
        </span>

        <h3 className={styles.juryNom}>
          {juré.nom}
        </h3>

        <span className="label-category">{juré.role}</span>
      </div>

      {/* ── Numéro discret en haut droite ────────────────── */}
      <span aria-hidden="true" className={styles.juryNumber}>
        0{JURY.findIndex(j => j.id === juré.id) + 1}
      </span>

    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function SectionJury() {
  const { t } = useTranslation('common');
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const introRef    = useRef(null);
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

        // Animations d'entrée des cartes.
        // clearProps: 'all' — GSAP nettoie ses styles inline
        // une fois l'animation terminée. Les :hover CSS du module
        // peuvent alors s'appliquer sans conflit de transform.
        cardRefs.forEach((ref, i) => {
          tl.to(ref.current, {
            ...ANIM_CONFIGS[i].to,
            clearProps: 'all',
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
      className={styles.sectionJury}
    >
      <div className={styles.container}>

        {/* ── En-tête ──────────────────────────────────────── */}
        <div className={styles.header}>

          <div ref={overlineRef} className="flex items-center gap-4">
            <span className={styles.overlineLine} />
            <span className="label-overline">Festival du Cinéma I.A. · Tous niveaux</span>
          </div>

          <h2 ref={titleRef} className="title-section">
            Le Jury<br />
            <span className={styles.titleAccent}>{t('jury.title2')}</span>
          </h2>

          <p
            ref={introRef}
            className={`body-editorial ${styles.introText}`}
          >
            Quatre regards. Quatre continents. Une exigence commune :
            que l'émotion prime sur la technique, que l'humanité
            survive à l'algorithme.
          </p>
        </div>

        {/* ── Grille des cartes ────────────────────────────── */}
        <div className={styles.juryGrid}>
          <JuryCard juré={JURY[0]} cardRef={card1Ref} />
          <JuryCard juré={JURY[1]} cardRef={card2Ref} />
          <JuryCard juré={JURY[2]} cardRef={card3Ref} />
          <JuryCard juré={JURY[3]} cardRef={card4Ref} />
        </div>

        {/* ── Note de bas de section ───────────────────────── */}
        <div className={styles.bottomNote}>
          <hr className={styles.bottomNoteHr} />
          <span className={`label-overline ${styles.bottomNoteLabel}`}>
            Composition complète annoncée en Avril 2026
          </span>
          <hr className={styles.bottomNoteHr} />
        </div>

      </div>
    </section>
  );
}