// @ts-nocheck
/**
 * HeroImpact.jsx — MARSAI Festival
 * Phase 1.1 + 1.2 — Héros cinématographique sobre + Bande de statistiques
 * Étape 4.1 + Révision responsive & lisibilité
 *
 * ═══════════════════════════════════════════════════════════════
 * CHANGEMENTS DE CETTE RÉVISION
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. CTA "Soumettre mon film" supprimé — redondant avec la navbar
 *    (LuminousButton) et la SectionCTA. Le héros est épuré.
 *    ctaRef et son animation GSAP sont retirés.
 *
 * 2. .heroReadability ajouté — couche d'overlay statique,
 *    jamais animée par GSAP. Protège la lisibilité du texte
 *    quelle que soit l'image de fond. Voir module CSS.
 *
 * 3. Overlay GSAP cible opacity:0.68 (vs 0.55 avant) —
 *    base de protection renforcée après révélation cinéma.
 *
 * ═══════════════════════════════════════════════════════════════
 * RÈGLE DES STYLES INLINE RESTANTS — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. willChange sur imageRef et titleRef :
 *    Hints GSAP (opacity+scale / filter+opacity). Inline = activés
 *    uniquement au montage. En CSS = permanents pour tous. Non.
 *
 * 2. borderRight / borderBottom sur les cartes stat :
 *    Calculés depuis l'index i — dynamiques par nature.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef }        from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LuminousButton    from '@/components/common/LuminousButton';
import { useTranslation } from 'react-i18next';
import { ROUTES }        from '@/constants/routes';
import styles            from './HeroImpact.module.css';

gsap.registerPlugin(ScrollTrigger);

const getStats = (t) => [
  { value: '600', label: t('hero.stat1'),  target: 600, suffix: '' },
  { value: '120', label: t('hero.stat2'), target: 120, suffix: '' },
  { value: '50',  label: t('hero.stat3'),    target: 50,  suffix: '' },
  { value: '50',  label: t('hero.stat4'),         target: 50,  suffix: '' },
];

export default function HeroImpact() {
  const { t } = useTranslation('common');
  const heroRef      = useRef(null);
  const imageRef     = useRef(null);
  const overlayRef   = useRef(null);
  const overlineRef  = useRef(null);
  const titleRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const dateLineRef  = useRef(null);
  const scrollIndRef = useRef(null); // scroll indicator (bounce GSAP)
  const heroBtnRef   = useRef(null); // bouton Soumettre (fade-in seul, pas de bounce)
  const statsRef     = useRef(null);

  useGSAP(() => {
    // ── États initiaux ─────────────────────────────────────────
    gsap.set(imageRef.current,    { opacity: 0, scale: 1.06 });
    gsap.set(overlayRef.current,  { opacity: 1 });
    gsap.set(overlineRef.current, { opacity: 0, y: 18 });
    gsap.set(titleRef.current,    { opacity: 0, filter: 'blur(24px)' });
    gsap.set(subtitleRef.current, { opacity: 0, y: 22 });
    gsap.set(dateLineRef.current, { opacity: 0, y: 16 });
    gsap.set(scrollIndRef.current,{ opacity: 0 });
    gsap.set(heroBtnRef.current,  { opacity: 0 });

    // ── Timeline principale ────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.2 });

    // Image — fondu + décélération du scale
    tl.to(imageRef.current, {
      opacity: 1, scale: 1,
      duration: 1.8, ease: 'power2.out',
    }, 0);

    // Overlay — s'allège pour laisser l'image respirer.
    // Cible 0.68 (vs 0.55 avant) : meilleure base de lisibilité.
    tl.to(overlayRef.current, {
      opacity: 0.68,
      duration: 2.0, ease: 'power1.out',
    }, 0.3);

    // Surtitre
    tl.to(overlineRef.current, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power2.out',
    }, 0.5);

    // Titre MARSAI — cristallisation depuis le flou
    tl.to(titleRef.current, {
      opacity: 1, filter: 'blur(0px)',
      duration: 1.1, ease: 'power2.out',
    }, 0.8);

    // Accroche
    tl.to(subtitleRef.current, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power2.out',
    }, 1.5);

    // Date + filet
    tl.to(dateLineRef.current, {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out',
    }, 1.75);

    // Indicateur scroll — apparition puis loop
    tl.to(scrollIndRef.current, {
      opacity: 1,
      duration: 0.5, ease: 'power1.out',
      onComplete() {
        gsap.to(scrollIndRef.current, {
          y: 10, opacity: 0.3,
          duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      },
    }, 2.4);

    // Bouton Soumettre — apparition synchronisée avec le scroll indicator.
    // Fade simple, pas de bounce — le bouton est interactif, pas décoratif.
    tl.to(heroBtnRef.current, {
      opacity: 1,
      duration: 0.5, ease: 'power1.out',
    }, 2.4);

    // ── Statistiques — ScrollTrigger stagger ──────────────────
    const statItems = gsap.utils.toArray('.stat-item');
    gsap.set(statItems, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: statsRef.current,
      start:   'top 80%',
      once:    true,
      onEnter() {
        gsap.to(statItems, {
          opacity: 1, y: 0,
          duration: 0.7, stagger: 0.12, ease: 'power2.out',
        });

        statItems.forEach((item) => {
          const valueEl = item.querySelector('.stat-value');
          if (!valueEl) return;
          const target = parseInt(valueEl.dataset.target, 10);
          if (isNaN(target)) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target, duration: 1.8, delay: 0.3, ease: 'power2.out',
            onUpdate() {
              const suffix = valueEl.dataset.suffix || '';
              valueEl.textContent = Math.round(counter.val) + suffix;
            },
          });
        });
      },
    });

  }, { scope: heroRef });

  return (
    <div ref={heroRef}>

      {/* ══════════════════════════════════════════════════════
          §1.1 — HÉROS PLEIN ÉCRAN
          ══════════════════════════════════════════════════ */}
      <section
        className={`relative w-full overflow-hidden ${styles.heroSection}`}
        aria-label="MARSAI Festival — Héros"
      >

        {/* ── Image cinématographique ──────────────────────── */}
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=90&w=2400&auto=format&fit=crop"
          alt="Cinéma génératif — MARSAI Festival"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* ── Overlay cinématographique — animé par GSAP ───────
            Rôle : révélation cinéma (noir → image).
            GSAP cible opacity:0.68 au terme de l'animation. */}
        <div
          ref={overlayRef}
          className={`absolute inset-0 ${styles.heroOverlay}`}
        />

        {/* ── Couche de lisibilité — JAMAIS animée ─────────────
            Protège le texte en permanence quelle que soit
            l'image de fond. Toujours présente, toujours sombre
            dans la zone du contenu textuel. */}
        <div
          className={`absolute inset-0 ${styles.heroReadability}`}
          aria-hidden="true"
        />

        {/* ── Grain — texture pellicule cinéma ─────────────── */}
        <div
          className={`absolute inset-0 pointer-events-none ${styles.heroGrain}`}
        />

        {/* ── Fondu bas mobile — dissout le héros dans les stats ──
            Visible uniquement sur mobile (display:none sur desktop).
            Élimine la coupure noire entre le contenu centré et
            la section suivante. */}
        <div
          className={styles.heroBottomFade}
          aria-hidden="true"
        />

        {/* ── Contenu principal ────────────────────────────── */}
        <div
          className={`absolute inset-0 flex flex-col justify-end ${styles.heroContent}`}
        >

          {/* Surtitre */}
          <div ref={overlineRef} className="flex items-center gap-4 mb-6">
            <span className={`label-overline ${styles.overlineAccent}`}>
              {t('hero.overline1')}
            </span>
            <span className={`hidden sm:block ${styles.overlineSeparator}`} />
            <span className="label-overline hidden sm:block">{t('hero.overline2')}</span>
          </div>

          {/* Titre principal — MARSAI */}
          <h1
            ref={titleRef}
            className={styles.heroTitle}
            style={{ willChange: 'filter, opacity' }}
          >
            MARSAI
          </h1>

          {/* Accroche */}
          {/* Subtitle — deux lignes superposées :
              Ligne 1 : prestige pour le 40+ pro ("cinéma génératif")
              Ligne 2 : invitation pour le 22 ans ("quelque chose à dire")
              Lecture à deux niveaux — aucun des deux n'est exclu. */}
          <p ref={subtitleRef} className={styles.heroSubtitle}>
            {t('hero.subtitle1')} 
            <span className={styles.heroSubtitleSub}>
              {' '}{t('hero.subtitle2')}
            </span>
          </p>

          {/* Date + filet */}
          <div
            ref={dateLineRef}
            className="flex items-center gap-5"
          >
            <span className={styles.dateLineSeparator} />
            <span className={styles.dateLineText}>
              {t('hero.date')}
            </span>
          </div>

          {/* CTA supprimé — présent dans la navbar et la SectionCTA */}

        </div>

        {/* ── Zone bas-droite : bouton + indicateur scroll ──── */}
        {/*
          Architecture à deux refs distincts — critique :
          • heroBtnRef  → fade-in seul (pas de bounce). LuminousButton
                          est un lien interactif — l'animer en bounce
                          continu nuirait à l'UX et à l'accessibilité.
          • scrollIndRef → fade-in puis bounce loop (décoratif).
                          aria-hidden="true" — purement indicatif.
          Les deux apparaissent à t=2.4 (même position timeline).
          scrollArea masqué sur mobile (redondant avec la navbar).
        */}
        <div className={`absolute ${styles.scrollArea}`}>

          {/* Bouton Soumettre — noBreath : pas de halo respirant en idle.
              Sur fond de héros animé (image cinéma), le halo idle
              disputerait l'attention visuelle. Hover reste complet.
              heroBtnWrapper : écrin backdrop blur + halo statique sable —
              le bouton s'ancre sur l'image sans animation. */}
          <div ref={heroBtnRef} className={styles.heroBtnWrapper}>
            <LuminousButton
              label={t("hero.submitBtn")}
              to={ROUTES.SOUMETTRE}
              variant="dark"
              size="lg"
              noBreath
            />
          </div>

          {/* Indicateur scroll — décoratif, bounce loop GSAP */}
          <div
            ref={scrollIndRef}
            className={`flex flex-col items-center gap-2 ${styles.scrollIndicator}`}
            aria-hidden="true"
          >
            <span className={styles.scrollIndicatorLabel}>{t('hero.scrollBtn')}</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.scrollIndicatorSvg}
            >
              <rect x="6.5" y="0.5" width="3" height="5" rx="1.5"
                fill="rgba(241,245,249,0.8)" />
              <rect x="0.5" y="0.5" width="15" height="23" rx="7.5"
                stroke="rgba(241,245,249,0.3)" strokeWidth="1" />
            </svg>
          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════
          §1.2 — BANDE DE STATISTIQUES
          ══════════════════════════════════════════════════ */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
          {getStats(t).map(({ value, label, target, suffix }, i) => (
            <div
              key={label}
              className="stat-item flex flex-col items-center justify-center text-center py-10 md:py-14 px-6"
              style={{
                borderRight:  i < getStats(t).length - 1 ? '1px solid var(--color-border)' : 'none',
                borderBottom: i < 2                ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span
                className={`stat-value ${styles.statValue}`}
                data-target={target}
                data-suffix={suffix}
              >
                {value}
              </span>
              <span className="label-overline">{label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}