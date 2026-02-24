/**
 * HeroImpact.jsx — MARSAI Festival
 * Phase 1.1 + 1.2 — Héros cinématographique sobre + Bande de statistiques
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Cinéma éditorial minimaliste
 * ═══════════════════════════════════════════════════════════════
 *
 * §1.1 — HÉROS
 *   Image plein-écran cinématographique
 *   Overlay gradient pour la lisibilité
 *   Grain CSS subtil — texture pellicule
 *   Typographie massive Manrope 900
 *   GSAP : cristallisation du titre depuis le noir (blur → net)
 *
 * §1.2 — STATISTIQUES
 *   4 chiffres : 600 / 120 / 50 / 50
 *   Entrée au scroll — ScrollTrigger stagger
 *
 * Aucun Canvas. Aucune particule. Aucune explosion.
 * La puissance vient de la composition et de la typographie.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// DONNÉES — Statistiques
// ─────────────────────────────────────────────
const STATS = [
  { value: '600',  label: 'Films soumis'      },
  { value: '120',  label: 'Présélections'     },
  { value: '50',   label: 'Finalistes'        },
  { value: '50',   label: 'Jurés'             },
];

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function HeroImpact() {
  const heroRef       = useRef(null);
  const imageRef      = useRef(null);
  const overlayRef    = useRef(null);
  const overlineRef   = useRef(null);
  const titleRef      = useRef(null);
  const subtitleRef   = useRef(null);
  const dateLineRef   = useRef(null);
  const ctaRef        = useRef(null);
  const scrollIndRef  = useRef(null);
  const statsRef      = useRef(null);

  useGSAP(() => {
    // ── États initiaux ─────────────────────────────────────────
    gsap.set(imageRef.current,    { opacity: 0, scale: 1.06 });
    gsap.set(overlayRef.current,  { opacity: 1 });
    gsap.set(overlineRef.current, { opacity: 0, y: 18 });
    gsap.set(titleRef.current,    { opacity: 0, filter: 'blur(24px)' });
    gsap.set(subtitleRef.current, { opacity: 0, y: 22 });
    gsap.set(dateLineRef.current, { opacity: 0, y: 16 });
    gsap.set(ctaRef.current,      { opacity: 0, y: 18 });
    gsap.set(scrollIndRef.current,{ opacity: 0 });

    // ── Timeline principale ────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.2 });

    // Image — fondu + légère désélération du scale
    tl.to(imageRef.current, {
      opacity:  1,
      scale:    1,
      duration: 1.8,
      ease:     'power2.out',
    }, 0);

    // Overlay — s'allège pour laisser l'image respirer
    tl.to(overlayRef.current, {
      opacity:  0.55,
      duration: 2.0,
      ease:     'power1.out',
    }, 0.3);

    // Surtitre
    tl.to(overlineRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.7,
      ease:     'power2.out',
    }, 0.5);

    // Titre MARSAI — cristallisation depuis le flou
    tl.to(titleRef.current, {
      opacity:  1,
      filter:   'blur(0px)',
      duration: 1.1,
      ease:     'power2.out',
    }, 0.8);

    // Accroche
    tl.to(subtitleRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.7,
      ease:     'power2.out',
    }, 1.5);

    // Date + filet
    tl.to(dateLineRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.6,
      ease:     'power2.out',
    }, 1.75);

    // CTA
    tl.to(ctaRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.6,
      ease:     'power2.out',
    }, 2.0);

    // Indicateur scroll — apparition puis loop
    tl.to(scrollIndRef.current, {
      opacity:  1,
      duration: 0.5,
      ease:     'power1.out',
      onComplete() {
        gsap.to(scrollIndRef.current, {
          y:        10,
          opacity:  0.3,
          duration: 1.2,
          repeat:   -1,
          yoyo:     true,
          ease:     'sine.inOut',
        });
      },
    }, 2.6);

    // ── Statistiques — ScrollTrigger stagger ──────────────────
    const statItems = gsap.utils.toArray('.stat-item');
    gsap.set(statItems, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger:  statsRef.current,
      start:    'top 80%',
      once:     true,
      onEnter() {
        gsap.to(statItems, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          stagger:  0.12,
          ease:     'power2.out',
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
        className="relative w-full overflow-hidden"
        style={{ height: '100dvh', minHeight: '600px' }}
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

        {/* ── Overlay gradient — du noir vers la transparence ─
            Bas opaque : lisibilité du contenu
            Haut semi-opaque : espace pour la navbar
            ──────────────────────────────────────────────── */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(0,0,0,0.92) 0%,
                rgba(0,0,0,0.60) 40%,
                rgba(0,0,0,0.30) 70%,
                rgba(0,0,0,0.20) 100%
              )
            `,
          }}
        />

        {/* ── Grain — texture pellicule cinéma ────────────────
            pseudo-élément CSS : bruit SVG filtré en overlay
            ──────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize:  '180px 180px',
            opacity:         0.04,
            mixBlendMode:    'overlay',
            zIndex:          2,
          }}
        />

        {/* ── Contenu principal ────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{
            padding:  'clamp(2rem, 5vw, 5rem)',
            zIndex:   10,
          }}
        >

          {/* Surtitre */}
          <div ref={overlineRef} className="flex items-center gap-4 mb-6">
            <span
              className="label-overline"
              style={{ color: 'var(--color-accent)', opacity: 0.9 }}
            >
              Festival des Cinéastes I.A.
            </span>
            <span
              className="hidden sm:block"
              style={{
                width:      '2rem',
                height:     '1px',
                background: 'var(--color-accent)',
                opacity:    0.5,
                flexShrink: 0,
              }}
            />
            <span className="label-overline hidden sm:block">Édition 2026</span>
          </div>

          {/* Titre principal — MARSAI */}
          <h1
            ref={titleRef}
            style={{
              fontFamily:    'var(--font-display)',
              fontWeight:    900,
              fontSize:      'clamp(4.5rem, 14vw, 13rem)',
              lineHeight:    0.88,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color:         'var(--color-text)',
              willChange:    'filter, opacity',
              marginBottom:  'clamp(1rem, 2vw, 1.8rem)',
            }}
          >
            MARSAI
          </h1>

          {/* Accroche */}
          <p
            ref={subtitleRef}
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    300,
              fontSize:      'clamp(1rem, 2vw, 1.35rem)',
              letterSpacing: '0.05em',
              color:         'rgba(241, 245, 249, 0.75)',
              marginBottom:  'clamp(1.5rem, 3vw, 2.5rem)',
              maxWidth:      '36ch',
            }}
          >
            Un futur à la fois <br/> Une minute à la fois
          </p>

          {/* Date + filet */}
          <div
            ref={dateLineRef}
            className="flex items-center gap-5 mb-8 md:mb-10"
          >
            <span
              style={{
                display:    'block',
                width:      'clamp(2rem, 4vw, 4rem)',
                height:     '1px',
                background: 'var(--color-accent)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily:    'var(--font-sans)',
                fontWeight:    600,
                fontSize:      'clamp(0.75rem, 1.2vw, 0.9rem)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'var(--color-accent)',
              }}
            >
              20 — 22 Juin 2026 · Marseille
            </span>
          </div>

          {/* CTA */}
          <div ref={ctaRef}>
            <a
              href="/soumettre"
              className="inline-block"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="cta-hero"
                style={{
                  display:       'inline-block',
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    700,
                  fontSize:      'clamp(0.72rem, 1vw, 0.82rem)',
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color:         'var(--color-bg-pure)',
                  background:    'var(--color-text)',
                  padding:       'clamp(0.85rem, 1.5vw, 1.1rem) clamp(2rem, 3.5vw, 3rem)',
                  borderRadius:  'var(--radius-pill)',
                  transition:    `background var(--duration-base) var(--ease-out),
                                  color    var(--duration-base) var(--ease-out)`,
                  cursor:        'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.color      = 'var(--color-bg-pure)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--color-text)';
                  e.currentTarget.style.color      = 'var(--color-bg-pure)';
                }}
              >
                Soumettre mon film
              </span>
            </a>
          </div>
        </div>

        {/* ── Indicateur de scroll ──────────────────────────── */}
        <div
          ref={scrollIndRef}
          className="absolute flex flex-col items-center gap-2"
          style={{
            bottom:    'clamp(1.5rem, 3vw, 2.5rem)',
            right:     'clamp(2rem, 5vw, 5rem)',
            zIndex:    10,
          }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    500,
              fontSize:      '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'rgba(241,245,249,0.35)',
              writingMode:   'vertical-rl',
              marginBottom:  '0.5rem',
            }}
          >
            Défiler
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.4 }}
          >
            <rect x="6.5" y="0.5" width="3" height="5" rx="1.5"
              fill="rgba(241,245,249,0.8)" />
            <rect x="0.5" y="0.5" width="15" height="23" rx="7.5"
              stroke="rgba(241,245,249,0.3)" strokeWidth="1" />
          </svg>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════
          §1.2 — BANDE DE STATISTIQUES
          ══════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        style={{
          background: 'var(--color-bg-pure)',
          borderTop:  '1px solid var(--color-border)',
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto"
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="stat-item flex flex-col items-center justify-center text-center py-10 md:py-14 px-6"
              style={{
                borderRight: i < STATS.length - 1
                  ? '1px solid var(--color-border)'
                  : 'none',
                borderBottom: i < 2
                  ? '1px solid var(--color-border)'
                  : 'none',
              }}
            >
              <span
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontWeight:    900,
                  fontSize:      'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight:    1,
                  letterSpacing: '-0.04em',
                  color:         'var(--color-text)',
                  marginBottom:  '0.5rem',
                  display:       'block',
                }}
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