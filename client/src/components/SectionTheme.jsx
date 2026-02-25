/**
 * SectionTheme.jsx — MARSAI Festival
 * Phase 2.2 — "Imaginer des Futurs Souhaitables"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Section contemplative plein-largeur
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Après la règle (Manifeste), la vision.
 *   Aucun CTA. Aucune interaction. Pure présence.
 *   L'utilisateur s'arrête. Il regarde. Il comprend pourquoi ça compte.
 *
 * Composition :
 *   Image cinémascope plein-largeur (ratio 21:9)
 *   Overlay gradient minimal — laisser l'image respirer
 *   Centré : overline + titre massif sur 2 lignes + citation
 *
 * Animation GSAP ScrollTrigger :
 *   Image : parallaxe douce translateY pendant le scroll
 *   Texte : scale(0.95)→1 + opacity fade — sensation d'immersion
 *   Durée 0.9s ease power2.out
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTheme() {
  const sectionRef  = useRef(null);
  const imageRef    = useRef(null);
  const contentRef  = useRef(null);
  const overlineRef = useRef(null);
  const titleRef    = useRef(null);
  const quoteRef    = useRef(null);

  useGSAP(() => {

    // ── États initiaux ────────────────────────────────────────
    gsap.set(overlineRef.current, { opacity: 0, y: 14 });
    gsap.set(titleRef.current,    { opacity: 0, scale: 0.96, filter: 'blur(6px)' });
    gsap.set(quoteRef.current,    { opacity: 0, y: 18 });

    // ── Parallaxe image — douce et non déstabilisante ─────────
    gsap.to(imageRef.current, {
      yPercent: -12,
      ease:     'none',
      scrollTrigger: {
        trigger:          sectionRef.current,
        start:            'top bottom',
        end:              'bottom top',
        scrub:            true,
        invalidateOnRefresh: true,
      },
    });

    // ── Révélation du texte au scroll ─────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 65%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        tl.to(overlineRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.6,
          ease:     'power2.out',
        });

        tl.to(titleRef.current, {
          opacity:  1,
          scale:    1,
          filter:   'blur(0px)',
          duration: 0.9,
          ease:     'power2.out',
        }, 0.2);

        tl.to(quoteRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     'power2.out',
        }, 0.65);
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="theme"
      aria-label="Thème 2026 — Imaginer des futurs souhaitables"
      style={{
        position:   'relative',
        width:      '100%',
        overflow:   'hidden',
        /* Ratio cinémascope 21:9 sur desktop, plus généreux sur mobile */
        aspectRatio: 'auto',
        minHeight:  'clamp(420px, 56vw, 720px)',
        background: 'var(--color-bg-pure)',
      }}
    >

      {/* ── Image plein-largeur avec parallaxe ─────────────── */}
      <div
        style={{
          position: 'absolute',
          inset:    '-15% 0',   /* Espace pour le mouvement parallaxe */
          zIndex:   0,
        }}
      >
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=90&w=2800&auto=format&fit=crop"
          alt="Terre vue de l'espace — futurs souhaitables"
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: 'center 40%',
            willChange: 'transform',
          }}
        />
      </div>

      {/* ── Overlay — gradient noir sombre, image respire ─────
          Assez opaque pour lire le texte blanc.
          Pas trop : l'image doit dominer la composition.
          ──────────────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          zIndex:     1,
          background: `
            radial-gradient(
              ellipse at center,
              rgba(0,0,0,0.55) 0%,
              rgba(0,0,0,0.72) 100%
            )
          `,
        }}
      />

      {/* ── Grain — cohérence avec le héros ────────────────── */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          zIndex:          2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize:  '180px 180px',
          opacity:         0.035,
          mixBlendMode:    'overlay',
          pointerEvents:   'none',
        }}
      />

      {/* ── Contenu centré ─────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          position:       'relative',
          zIndex:         10,
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          textAlign:      'center',
          padding:        'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 6rem)',
          minHeight:      'clamp(420px, 56vw, 720px)',
        }}
      >

        {/* Overline */}
        <div
          ref={overlineRef}
          className="flex items-center justify-center gap-4 mb-8 md:mb-12"
        >
          <span
            style={{
              display:    'block',
              width:      'clamp(1.5rem, 2.5vw, 2.5rem)',
              height:     '1px',
              background: 'var(--color-accent)',
              flexShrink: 0,
            }}
          />
          <span className="label-overline">Thème 2026</span>
          <span
            style={{
              display:    'block',
              width:      'clamp(1.5rem, 2.5vw, 2.5rem)',
              height:     '1px',
              background: 'var(--color-accent)',
              flexShrink: 0,
            }}
          />
        </div>

        {/* Titre — 2 lignes, massif, centré */}
        <h2
          ref={titleRef}
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(2.2rem, 6vw, 6.5rem)',
            lineHeight:    0.95,
            letterSpacing: '-0.035em',
            textTransform: 'uppercase',
            color:         'var(--color-text)',
            marginBottom:  'clamp(1.5rem, 3vw, 2.5rem)',
            maxWidth:      '22ch',
            willChange:    'transform, filter, opacity',
          }}
        >
          Imaginer des<br />
          <span style={{ color: 'var(--color-accent)' }}>futurs souhaitables</span>
        </h2>

        {/* Citation — sobre, sans guillemets tape-à-l'œil */}
        <p
          ref={quoteRef}
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    300,
            fontStyle:     'italic',
            fontSize:      'clamp(0.95rem, 1.6vw, 1.15rem)',
            letterSpacing: '0.02em',
            color:         'rgba(241, 245, 249, 0.60)',
            maxWidth:      '44ch',
            lineHeight:    1.7,
          }}
        >
          Et si l'IA n'était pas la menace, mais le miroir dans lequel
          l'humanité voit enfin ce qu'elle veut devenir ?
        </p>

      </div>

    </section>
  );
}