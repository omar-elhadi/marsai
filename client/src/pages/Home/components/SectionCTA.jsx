/**
 * SectionCTA.jsx — MARSAI Festival
 * "C'est ton heure."
 * Refactoring Étape 4 + Révision cinématographique + Image de fond
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : L'Autel — le moment de bascule
 * ═══════════════════════════════════════════════════════════════
 *
 * La seule section à fond clair du site — polarité inversée.
 * Le contraste maximal rompt le pattern visuel et dit au visiteur :
 * quelque chose de différent se passe ici. C'est son moment.
 *
 * Tout est centré. Pas d'alignement à gauche — c'est un autel.
 * Le visiteur est face à quelque chose, pas devant une liste.
 *
 * Titre : "C'est ton heure." — tutoiement assumé, présent de
 * l'indicatif, trois mots. Personnel et direct.
 * Le dernier mot — "heure." — reçoit var(--color-accent).
 * C'est lui qui porte le sens. Il doit se distinguer.
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Titre changé — "Intégrez la matrice." est dystopique et froid.
 *    "C'est ton heure." est personnel, urgent, cinématographique.
 *    Tutoiement assumé : le festival parle directement au cinéaste.
 *
 * 2. Layout centré — la section est un autel, pas une liste.
 *    Toute la composition converge vers un seul point : le bouton.
 *
 * 3. Halo pulsant en CSS pur (.ctaBtnHalo::before) — le bouton
 *    vit au repos, jamais de GSAP pour une présence permanente.
 *
 * 4. Date de clôture sous le bouton — la rareté temporelle est le
 *    moteur de conversion le plus puissant. Elle chuchote, elle
 *    ne crie pas. Subtile mais inexorable.
 *
 * 5. clearProps: 'all' sur les wordRefs — GSAP nettoie ses styles
 *    inline après l'animation, le CSS Module reprend le contrôle.
 *
 * 6. ROUTES.SOUMETTRE — plus de href hardcodé.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES }        from '@/constants/routes';
import LuminousButton    from '@/components/common/LuminousButton/LuminousButton';
import styles            from './SectionCTA.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────────────────────

// Trois mots — révélés un par un par rideau GSAP.
// Le dernier reçoit la classe .ctaWordAccent (var(--color-accent)).
const MOTS = [
  { text: "C'est",  accent: false },
  { text: 'ta',    accent: false },
  { text: 'minute.', accent: true  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function SectionCTA() {
  const sectionRef  = useRef(null);
  const lineRef     = useRef(null);
  const word1Ref    = useRef(null);
  const word2Ref    = useRef(null);
  const word3Ref    = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef      = useRef(null);

  const wordRefs = [word1Ref, word2Ref, word3Ref];

  useGSAP(() => {
    // ── États initiaux ─────────────────────────────────────────
    gsap.set(lineRef.current, {
      scaleX: 0, transformOrigin: 'center center',
    });
    wordRefs.forEach(r => gsap.set(r.current, { yPercent: 110 }));
    gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
    gsap.set(btnRef.current,      { opacity: 0, y: 18 });

    // ── ScrollTrigger ─────────────────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 70%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // Filet — s'étire depuis le centre vers les deux bords
        tl.to(lineRef.current, {
          scaleX: 1, duration: 0.9, ease: 'power2.inOut',
        });

        // Mots — rideau de bas en haut, stagger 130ms.
        // clearProps: 'all' — GSAP nettoie ses styles inline
        // après l'animation. Le CSS Module reprend le contrôle
        // des couleurs et du letter-spacing.
        tl.to(wordRefs.map(r => r.current), {
          yPercent:   0,
          duration:   0.88,
          stagger:    0.13,
          ease:       'power3.out',
          clearProps: 'all',
        }, 0.25);

        // Sous-titre
        tl.to(subtitleRef.current, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, 0.72);

        // Bloc bouton + deadline
        tl.to(btnRef.current, {
          opacity: 1, y: 0,
          duration: 0.62, ease: 'power2.out',
        }, 0.90);
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="soumettre"
      aria-label="Soumettre un film — appel à candidatures MARSAI"
      className={styles.sectionCTA}
    >

      {/* ── Image de fond — projecteur de cinéma dans le noir ──
          Un faisceau qui attend quelqu'un. C'est ton heure.
          Unsplash libre de droits — opacity 0.35 dans le CSS. */}
      <div className={styles.ctaBgImage} aria-hidden="true" />

      {/* ── Overlay sombre — ramène la profondeur ────────────── */}
      <div className={styles.ctaOverlay} aria-hidden="true" />

      {/* ── Grain — texture pellicule cinéma ─────────────────── */}
      <div className={styles.ctaGrain} aria-hidden="true" />

      {/* ── Vignette radiale — projecteur centré ─────────────── */}
      <div className={styles.ctaVignette} aria-hidden="true" />

      {/* ── Contenu ──────────────────────────────────────────── */}
      <div className={styles.container}>

        {/* Filet d'ouverture — scaleX 0→1 depuis le centre */}
        <div
          ref={lineRef}
          className={styles.ctaLine}
          aria-hidden="true"
        />

        {/* Titre — mots révélés un par un, rideau GSAP */}
        <div className={styles.ctaTitleWrapper}>
          {MOTS.map(({ text, accent }, i) => (
            <div key={text} className={styles.ctaWordMask}>
              <span
                ref={wordRefs[i]}
                className={`${styles.ctaWord} ${accent ? styles.ctaWordAccent : ''}`}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Sous-titre — poétique, centré, dense */}
        <p ref={subtitleRef} className={styles.ctaSubtitle}>
          600 cinéastes. Une minute. L'éternité.
        </p>

        {/* Bloc bouton + deadline — animé ensemble */}
        <div ref={btnRef} className={styles.ctaBtnBlock}>

          {/* Halo pulsant — wrapper CSS, jamais GSAP */}
          <div className={styles.ctaBtnHalo}>
            <LuminousButton
              label   ="Soumettre une œuvre"
              to      ={ROUTES.SOUMETTRE}
              size    ="lg"
            />
          </div>

          {/* Date de clôture — rareté temporelle chuchotée.
              La tension de l'urgence, sans crier. */}
          <p className={styles.ctaDeadline}>
            Soumissions ouvertes jusqu'au{' '}
            <span className={styles.ctaDeadlineAccent}>15 Mai 2026</span>
          </p>

        </div>

      </div>
    </section>
  );
}