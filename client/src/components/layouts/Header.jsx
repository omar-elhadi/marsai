/**
 * Header.jsx — MARSAI Festival
 * ═══════════════════════════════════════════════════════════════
 * KODAWARI / SHOKUNIN — l'intemporel naît de la précision absolue.
 * ═══════════════════════════════════════════════════════════════
 *
 * LiquidGlassPill — composant universel réutilisable.
 *
 *   REPOS     : capsule statique, arc spéculaire, rim prismatique.
 *
 *   HOVER     : escalade de vibration (skewX) + fissures SVG fractales.
 *               8 chemins issus du centre, strokeDashoffset → tracé
 *               progressif. À partir de t=0.72 : micro-éclats de verre
 *               qui se détachent des bords (throttle 220ms).
 *               À t=0.88 : éclats plus grands, pré-explosion visible.
 *
 *   CLIC      : brisure instantanée (scale flash) + 32 éclats de verre
 *               polygonaux en clip-path, explosion radiale 55–210px,
 *               gravité, spin ±200–900°, power3.out, 0.40–0.72s.
 *               Aucune lumière, aucun confetti — verre pur.
 *
 * Texte       : mix-blend-mode:difference + color:white
 *               → inversion automatique sur toute surface (noir/blanc/
 *                 couleur). Jamais illisible.
 *
 * Logo        : Outfit 900, gradient ambre↔blanc, subtitle 300,
 *               ornements ◈, filter glow GSAP breathing.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link }                                     from 'react-router-dom';
import gsap                                          from 'gsap';
import { useGSAP }                                   from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// LOGO — filter glow GSAP (drop-shadow, compatible gradient-text)
// ─────────────────────────────────────────────────────────────
const LOGO_FILTER_IDLE  =
  'drop-shadow(0 0 7px rgba(255,200,70,0.60)) drop-shadow(0 0 20px rgba(251,191,36,0.22))';
const LOGO_FILTER_PEAK  =
  'drop-shadow(0 0 13px rgba(255,215,80,0.92)) drop-shadow(0 0 36px rgba(251,191,36,0.50))';
const LOGO_FILTER_HOVER =
  'drop-shadow(0 0 18px rgba(255,220,80,1.00)) drop-shadow(0 0 50px rgba(251,191,36,0.78))';

// ─────────────────────────────────────────────────────────────
// SHADOW STACKS
// ─────────────────────────────────────────────────────────────
const LG_SHADOW_IDLE = [
  'inset 0  1.5px 0   rgba(255,255,255,0.60)',
  'inset 0 -0.5px 0   rgba(255,255,255,0.14)',
  'inset 0  0    20px rgba(255,255,255,0.05)',
  '0  5px 18px rgba(0,0,0,0.36)',
  '0  1px  4px rgba(0,0,0,0.24)',
  '0  0    0   0.5px rgba(255,255,255,0.18)',
].join(', ');

const LG_SHADOW_HOVER = [
  'inset 0  2px   0   rgba(255,255,255,0.82)',
  'inset 0 -0.5px 0   rgba(255,255,255,0.25)',
  'inset 0  0    32px rgba(255,255,255,0.10)',
  '0 10px 30px rgba(0,0,0,0.46)',
  '0  2px  8px rgba(0,0,0,0.32)',
  '0  0    0   0.5px rgba(255,255,255,0.30)',
].join(', ');

const NAV_PILL_SHADOW = [
  'inset 0  2px   0    rgba(255,255,255,0.52)',
  'inset 0 -1px   0    rgba(255,255,255,0.12)',
  'inset  3px 0  14px  rgba(80,100,255,0.11)',
  'inset -3px 0  14px  rgba(255,170,40,0.11)',
  '0  8px 36px rgba(0,0,0,0.50)',
  '0  2px  8px rgba(0,0,0,0.28)',
  '0  0    0   0.5px rgba(255,255,255,0.20)',
].join(', ');

// ─────────────────────────────────────────────────────────────
// FISSURES SVG — 8 chemins fractals
//
// viewBox "0 0 100 30" = proportions d'une pill de nav.
// Tous issus du point (50, 15) = centre.
// 4 primaires (épais, tôt) + 4 secondaires (fins, tardifs).
//
// tStart  : seuil de t (0→1 sur 2.2s) pour révélation
// w       : strokeWidth du chemin
// ─────────────────────────────────────────────────────────────
const CRACK_PATHS = [
  { d: 'M 50 15 L 80 5  L 95 13',    len: 48, tStart: 0.36, w: 0.55 }, // primaire droite-haut
  { d: 'M 50 15 L 28 23 L 12 13',    len: 40, tStart: 0.44, w: 0.52 }, // primaire gauche
  { d: 'M 50 15 L 60 28 L 74 26',    len: 24, tStart: 0.52, w: 0.48 }, // branche bas-droite
  { d: 'M 50 15 L 40 3  L 32 8',     len: 20, tStart: 0.52, w: 0.45 }, // branche haut-gauche
  { d: 'M 80 5  L 88 0',             len: 10, tStart: 0.60, w: 0.32 }, // micro extrémité droite
  { d: 'M 28 23 L 20 29',            len:  9, tStart: 0.60, w: 0.30 }, // micro extrémité gauche
  { d: 'M 50 15 L 66 17 L 75 9',     len: 26, tStart: 0.68, w: 0.38 }, // branche centre-droite
  { d: 'M 60 28 L 58 30',            len:  3, tStart: 0.80, w: 0.28 }, // micro bas
];

// ─────────────────────────────────────────────────────────────
// ÉCLATS DE VERRE — 16 formes polygonales prédéfinies
//
// clip-path polygon(x% y%, ...) — formes irrégulières
// simulant des fragments de verre cassé.
// ─────────────────────────────────────────────────────────────
const SHARD_SHAPES = [
  'polygon(0% 20%, 58% 0%, 100% 38%, 82% 100%, 14% 88%)',
  'polygon(28% 0%, 100% 12%, 74% 100%, 0% 82%)',
  'polygon(0% 0%, 80% 16%, 100% 88%, 16% 100%)',
  'polygon(48% 0%, 100% 42%, 80% 100%, 0% 68%)',
  'polygon(15% 0%, 100% 0%, 85% 100%, 0% 55%)',
  'polygon(0% 30%, 74% 0%, 100% 70%, 36% 100%)',
  'polygon(6% 0%, 94% 10%, 100% 90%, 0% 80%)',
  'polygon(38% 0%, 100% 26%, 64% 100%, 0% 76%)',
  'polygon(0% 10%, 84% 0%, 100% 60%, 16% 100%)',
  'polygon(22% 0%, 100% 36%, 80% 100%, 0% 50%)',
  'polygon(0% 38%, 64% 0%, 100% 56%, 46% 100%)',
  // Triangles pointus — éclats vifs
  'polygon(50% 0%, 100% 100%, 0% 100%)',
  'polygon(0% 0%, 100% 0%, 50% 100%)',
  'polygon(0% 0%, 100% 48%, 0% 100%)',
  'polygon(100% 0%, 100% 100%, 0% 50%)',
  'polygon(50% 0%, 100% 60%, 72% 100%, 0% 72%)',
];

// Gradients de verre capturant la lumière à différents angles
const SHARD_GRADIENTS = [
  'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(200,225,255,0.72) 55%, rgba(255,255,255,0.42) 100%)',
  'linear-gradient(225deg, rgba(255,255,255,0.92) 0%, rgba(220,238,255,0.68) 55%, rgba(255,255,255,0.38) 100%)',
  'linear-gradient(45deg,  rgba(255,255,255,0.94) 0%, rgba(210,232,255,0.70) 55%, rgba(255,255,255,0.44) 100%)',
  'linear-gradient(315deg, rgba(255,255,255,0.90) 0%, rgba(228,240,255,0.64) 55%, rgba(255,255,255,0.36) 100%)',
  'linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(238,246,255,0.78) 55%, rgba(255,255,255,0.52) 100%)',
  'linear-gradient(202deg, rgba(255,255,255,0.88) 0%, rgba(185,215,255,0.62) 55%, rgba(255,255,255,0.34) 100%)',
];

// ─────────────────────────────────────────────────────────────
// spawnShards — fonction pure (pas de closure stale possible)
//
// container  : DOM element overflow:visible
// count      : nombre d'éclats
// minD/maxD  : fourchette de distance en px
// minSz/maxSz: fourchette de taille en px
// baseDur    : durée de base en secondes
// jitter     : variation aléatoire de la durée
// gravity    : multiplicateur de la composante Y descendante
// ─────────────────────────────────────────────────────────────
function spawnShards(container, {
  count, minD, maxD, minSz, maxSz, baseDur, jitter = 0.15, gravity = 0.30,
}) {
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const dist   = minD + Math.random() * (maxD - minD);
    const sz     = minSz + Math.random() * (maxSz - minSz);
    const shape  = SHARD_SHAPES[Math.floor(Math.random() * SHARD_SHAPES.length)];
    const grad   = SHARD_GRADIENTS[Math.floor(Math.random() * SHARD_GRADIENTS.length)];
    const spin   = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 700);
    const delay  = Math.random() * 0.05;
    const dur    = baseDur + (Math.random() - 0.5) * jitter * 2;

    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist + dist * gravity; // gravité

    const el = document.createElement('div');
    el.style.cssText = [
      'position:absolute;pointer-events:none;border-radius:0;',
      `width:${sz}px;height:${sz}px;`,
      `background:${grad};`,
      `clip-path:${shape};`,
      'top:50%;left:50%;',
      'transform:translate(-50%,-50%);',
      // arête lumineuse = filet blanc ultra-fin
      'outline:0.5px solid rgba(255,255,255,0.55);',
      'mix-blend-mode:screen;',
      'will-change:transform,opacity;',
    ].join('');
    container.appendChild(el);

    gsap.to(el, {
      x: tx, y: ty,
      rotation:  spin,
      opacity:   0,
      scale:     0.08,
      duration:  dur,
      delay,
      ease:      'power3.out',
      onComplete: () => el.parentNode?.removeChild(el),
    });
  }
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────
const NAV_LEFT = [
  { id: 'accueil',   label: 'Accueil',   href: '/#accueil',  isAnchor: true  },
  { id: 'galerie',   label: 'Galerie',   href: '/galerie',   isAnchor: false },
  { id: 'calendrier',   label: 'Calendrier',   href: '/calendrier',   isAnchor: false },
];
const NAV_RIGHT = [
  { id: 'events',    label: 'Events',    href: '/events',    isAnchor: false },
  { id: 'soumettre', label: 'Soumettre', href: '/soumettre', isAnchor: false },
  { id: 'contacter', label: 'Contacter', href: '/contact',   isAnchor: false },
];
const NAV_MOBILE = [
  ...NAV_LEFT,
  { id: 'logo', label: 'MARSAI', href: '/', isAnchor: false, isLogo: true },
  ...NAV_RIGHT,
];

// ─────────────────────────────────────────────────────────────
// LiquidGlassPill
// ─────────────────────────────────────────────────────────────
const LiquidGlassPill = ({ children, onClick, className = '', style: ext = {} }) => {

  const pillRef       = useRef(null);
  const glassInner    = useRef(null);
  const shineRef      = useRef(null);
  const contentRef    = useRef(null);
  const shardContRef  = useRef(null); // container éclats — overflow:visible
  const crackPathRefs = useRef([]);

  const mountedRef      = useRef(true);
  const isHoveringRef   = useRef(false);
  const vibrateRef      = useRef(null);
  const hoverStartRef   = useRef(0);
  const lastChipTimeRef = useRef(0);  // throttle micro-éclats au hover

  // ── Fissures — reset ──────────────────────────────────
  const resetCracks = useCallback(() => {
    crackPathRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.strokeDashoffset = String(CRACK_PATHS[i].len);
      el.style.opacity          = '0';
    });
  }, []);

  // ── ESCALADE VIBRATION + FISSURES + MICRO-ÉCLATS ──────
  //
  // t   : 0→1 sur 2.2s
  // amp : 0.25°→6.5°  — vibration de plus en plus violente
  // dur : 85ms→24ms   — fréquence accélérée
  // ca  : 0→5px       — aberration chromatique R/B
  //
  // Micro-éclats hover :
  //   t > 0.72 : 2 tiny shards (3–6px, 8–18px dist) throttle 220ms
  //   t > 0.88 : +2 shards (5–9px, 14–28px dist)
  //
  const vibrateStep = useCallback(() => {
    const el = contentRef.current;
    if (!mountedRef.current || !isHoveringRef.current || !el) return;

    const now  = Date.now();
    const t    = Math.min((now - hoverStartRef.current) / 2200, 1);
    const amp  = 0.25 + t * 6.25;
    const dur  = Math.max(0.024, 0.085 - t * 0.061);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const ca   = t > 0.35 ? t * 5.0  : 0;
    const cOp  = t > 0.35 ? Math.min((t - 0.35) * 1.15, 0.88) : 0;

    vibrateRef.current = gsap.to(el, {
      skewX: sign * amp,
      textShadow: ca > 0
        ? `${-sign * ca}px 0 rgba(255,20,70,${cOp.toFixed(2)}), ${sign * ca}px 0 rgba(20,70,255,${cOp.toFixed(2)})`
        : '',
      duration: dur,
      ease: 'none',
      onComplete() {
        gsap.to(el, {
          skewX: 0, duration: dur * 0.5, ease: 'none',
          onComplete: vibrateStep,
        });
      },
    });

    // Révèle les fissures SVG progressivement
    CRACK_PATHS.forEach((cfg, i) => {
      const pathEl = crackPathRefs.current[i];
      if (!pathEl || t < cfg.tStart) return;
      const localT = Math.min((t - cfg.tStart) / (1 - cfg.tStart + 0.001), 1);
      pathEl.style.strokeDashoffset = String(cfg.len * (1 - localT));
      pathEl.style.opacity          = String(Math.min(0.30 + localT * 0.68, 0.98));
    });

    // Micro-éclats de bord au hover avancé
    const cont = shardContRef.current;
    if (cont && t > 0.72 && (now - lastChipTimeRef.current) > 220) {
      lastChipTimeRef.current = now;
      const count = t > 0.88 ? 4 : 2;
      spawnShards(cont, {
        count,
        minD:    t > 0.88 ? 14 : 8,
        maxD:    t > 0.88 ? 28 : 18,
        minSz:   t > 0.88 ? 4  : 2,
        maxSz:   t > 0.88 ? 8  : 5,
        baseDur: 0.28,
        jitter:  0.10,
        gravity: 0.40,
      });
    }

  }, []);

  // ── MONTAGE / DÉMONTAGE ───────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    resetCracks();
    return () => {
      mountedRef.current = false;
      vibrateRef.current?.kill();
    };
  }, [resetCracks]);

  // ── MOUSEENTER ────────────────────────────────────────
  const handleEnter = useCallback(() => {
    isHoveringRef.current = true;
    hoverStartRef.current = Date.now();
    lastChipTimeRef.current = 0;

    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, {
      scale: 1.06, y: -2,
      boxShadow: LG_SHADOW_HOVER,
      duration: 0.22, ease: 'power2.out',
    });
    gsap.to(shineRef.current, { opacity: 1.0, duration: 0.16 });
    vibrateStep();
  }, [vibrateStep]);

  // ── MOUSELEAVE ────────────────────────────────────────
  const handleLeave = useCallback(() => {
    isHoveringRef.current = false;

    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, {
      scale: 1, y: 0,
      boxShadow: LG_SHADOW_IDLE,
      duration: 0.30, ease: 'power2.out',
    });
    gsap.to(shineRef.current, { opacity: 0.55, duration: 0.25 });

    vibrateRef.current?.kill();
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        skewX: 0, textShadow: '',
        duration: 0.20, ease: 'power2.out',
      });
    }
    resetCracks();
  }, [resetCracks]);

  // ── CLIC : BRISURE MAXIMALE + 32 ÉCLATS ──────────────
  //
  // Séquence :
  //   1. Flash scale 1.22 (0.04s) — impact instantané
  //   2. Collapse 0.88 (0.07s) — le verre s'effondre
  //   3. Elastic retour 1.0 (0.42s) — le contenant se ressaisit
  //
  // 32 éclats polygonaux :
  //   • Taille : 5–24px
  //   • Distance : 55–210px (certains très loin)
  //   • Spin : ±200–900°
  //   • Durée : 0.40–0.72s
  //   • Gravité : y += dist * 0.30
  //
  const handleClick = useCallback((e) => {
    const pill = pillRef.current;
    if (!pill) return;

    // Arrêt vibration
    vibrateRef.current?.kill();
    if (contentRef.current) {
      gsap.to(contentRef.current, { skewX: 0, textShadow: '', duration: 0.03 });
    }

    // Flash de brisure — impact maximal
    gsap.timeline()
      .to(pill, { scale: 1.22, duration: 0.04, ease: 'power3.out'           })
      .to(pill, { scale: 0.88, duration: 0.07, ease: 'power3.in'            })
      .to(pill, { scale: 1.00, duration: 0.42, ease: 'elastic.out(1, 0.38)' });

    // Les fissures s'élargissent brièvement avant de se refermer
    crackPathRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, { strokeWidth: 0.9, opacity: 1, duration: 0.05 });
      gsap.to(el, { strokeWidth: 0, opacity: 0, duration: 0.30, delay: 0.05 });
    });
    setTimeout(() => resetCracks(), 400);

    const cont = shardContRef.current;
    if (!cont) { onClick?.(e); return; }

    // 32 éclats principaux — explosion totale
    spawnShards(cont, {
      count:   32,
      minD:    55,
      maxD:    210,
      minSz:   5,
      maxSz:   24,
      baseDur: 0.56,
      jitter:  0.22,
      gravity: 0.30,
    });

    // 10 micro-éclats supplémentaires très proches — densité au centre
    spawnShards(cont, {
      count:   10,
      minD:    12,
      maxD:    42,
      minSz:   2,
      maxSz:   7,
      baseDur: 0.28,
      jitter:  0.10,
      gravity: 0.20,
    });

    onClick?.(e);
  }, [onClick, resetCracks]);

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <div
      ref={pillRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        padding:              '6px 16px',
        borderRadius:         '999px',
        background: [
          'linear-gradient(180deg,',
          '  rgba(255,255,255,0.16) 0%,',
          '  rgba(255,255,255,0.06) 38%,',
          '  rgba(255,255,255,0.03) 66%,',
          '  rgba(255,255,255,0.10) 100%)',
        ].join(''),
        backdropFilter:       'blur(14px) saturate(165%)',
        WebkitBackdropFilter: 'blur(14px) saturate(165%)',
        border:               '0.5px solid rgba(255,255,255,0.22)',
        boxShadow:            LG_SHADOW_IDLE,
        willChange:           'transform, box-shadow',
        overflow:             'visible',
        ...ext,
      }}
    >
      {/* ── Couche clippée : shine, rim, cracks ─────── */}
      <div
        ref={glassInner}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: '999px', overflow: 'hidden' }}
      >
        {/*
         * Arc spéculaire haut
         * Gradient blanc→transparent sur 50% hauteur.
         * borderRadius 999px/50% suit la courbure de la capsule.
         */}
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            top: 0, left: '8%', right: '8%',
            height: '50%',
            background: [
              'linear-gradient(180deg,',
              '  rgba(255,255,255,0.44) 0%,',
              '  rgba(255,255,255,0.10) 55%,',
              '  transparent           100%)',
            ].join(''),
            borderRadius: '999px 999px 50% 50%',
            opacity: 0.55,
          }}
        />

        {/*
         * Rim prismatique bas — 1px spectral
         * Dispersion chromatique de l'arête inférieure épaisse.
         */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: '1px', borderRadius: '0 0 999px 999px',
            background: [
              'linear-gradient(90deg,',
              '  transparent           0%,',
              '  rgba(255,80,180,0.68) 15%,',
              '  rgba(80,200,255,0.70) 32%,',
              '  rgba(255,238,80,0.65) 50%,',
              '  rgba(80,100,255,0.70) 68%,',
              '  rgba(200,80,255,0.65) 85%,',
              '  transparent           100%)',
            ].join(''),
            opacity: 0.88,
          }}
        />

        {/*
         * SVG FISSURES FRACTALES
         *
         * 8 chemins — tous issus du centre (50, 15).
         * strokeDasharray = longueur totale = effacé au départ.
         * vibrateStep anime strokeDashoffset : longueur→0 = tracé.
         *
         * 4 primaires (w=0.45–0.55) + 4 secondaires (w=0.28–0.38).
         * filter drop-shadow(0 0 1.5px white) = lueur de brisure.
         */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
        >
          {CRACK_PATHS.map((cfg, i) => (
            <path
              key={i}
              ref={(el) => { crackPathRefs.current[i] = el; }}
              d={cfg.d}
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={cfg.w}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray:  cfg.len,
                strokeDashoffset: cfg.len,
                opacity:          0,
                filter:           'drop-shadow(0 0 1.5px rgba(255,255,255,0.80))',
                transition:       'none',
              }}
            />
          ))}
        </svg>
      </div>

      {/*
       * Container éclats de verre — overflow:visible intentionnel.
       * Les fragments peuvent sortir loin de la capsule.
       * z-index:30 — au-dessus de tout.
       */}
      <div
        ref={shardContRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          overflow:      'visible',
          borderRadius:  '999px',
          zIndex:        30,
        }}
      />

      {/*
       * Contenu — mix-blend-mode:difference + color:white.
       *
       * Fonctionnement de difference :
       *   result = |source_color - backdrop_color|
       *
       * Texte blanc (255,255,255) sur fond sombre → 255-0=255 (blanc)
       * Texte blanc (255,255,255) sur fond blanc  → 255-255=0 (noir)
       * Texte blanc sur fond coloré → couleur complémentaire
       *
       * → Toujours lisible, toujours contrasté, zéro JS.
       *
       * willChange:transform → layer GPU dédié pour la vibration.
       */}
      <div
        ref={contentRef}
        className="relative z-10"
        style={{
          willChange:   'transform',
          mixBlendMode: 'difference',
          color:        'white',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// NavLink — wrapper transparent
// ─────────────────────────────────────────────────────────────
const NavLink = ({ item }) => {
  const label = (
    <span
      style={{
        fontFamily:    "'Outfit', -apple-system, sans-serif",
        fontWeight:    600,
        fontSize:      '0.68rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        // color et mixBlendMode hérités du contentRef parent
        display:       'block',
        lineHeight:    1,
      }}
    >
      {item.label}
    </span>
  );

  const pill = <LiquidGlassPill>{label}</LiquidGlassPill>;
  if (item.isAnchor) return <a href={item.href}>{pill}</a>;
  return <Link to={item.href}>{pill}</Link>;
};

// ─────────────────────────────────────────────────────────────
// Header principal
// ─────────────────────────────────────────────────────────────
export default function Header() {
  const headerRef    = useRef(null);
  const navPillRef   = useRef(null);
  const navLightRef  = useRef(null);
  const logoWrapRef  = useRef(null);
  const overlayRef   = useRef(null);
  const mobileNavRef = useRef(null);
  const burgerRef    = useRef(null);

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const nav     = mobileNavRef.current;
    if (!overlay || !nav) return;
    const items = nav.querySelectorAll('.m-link');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay,  { opacity: 1, duration: 0.42, ease: 'power2.out' });
      gsap.fromTo(items,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.58, stagger: 0.08, ease: 'power3.out', delay: 0.20 }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(items,   { y: -26, opacity: 0, duration: 0.22, stagger: 0.05, ease: 'power2.in' });
      gsap.to(overlay, {
        opacity: 0, duration: 0.32, delay: 0.26, ease: 'power2.in',
        onComplete() { gsap.set(overlay, { display: 'none' }); },
      });
    }
  }, [isOpen]);

  const onLogoEnter = useCallback(() => {
    gsap.to(logoWrapRef.current, { filter: LOGO_FILTER_HOVER, duration: 0.22, ease: 'power2.out' });
  }, []);
  const onLogoLeave = useCallback(() => {
    gsap.to(logoWrapRef.current, { filter: LOGO_FILTER_IDLE, duration: 0.38, ease: 'power2.out' });
  }, []);

  useGSAP(() => {
    if (navPillRef.current) {
      gsap.from(navPillRef.current, {
        y: -50, opacity: 0, scale: 0.92,
        duration: 0.95, ease: 'power3.out', delay: 0.18,
      });
    }
    if (burgerRef.current) {
      gsap.from(burgerRef.current, {
        opacity: 0, x: 14,
        duration: 0.55, ease: 'power2.out', delay: 0.60,
      });
    }
    if (logoWrapRef.current) {
      gsap.fromTo(logoWrapRef.current,
        { filter: LOGO_FILTER_IDLE },
        { filter: LOGO_FILTER_PEAK, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 }
      );
    }
    if (navLightRef.current) {
      gsap.fromTo(navLightRef.current,
        { opacity: 0.28, scale: 0.82 },
        { opacity: 0.62, scale: 1.20, duration: 2.9, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }
  }, { dependencies: [], revertOnUpdate: false });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');

        @keyframes holo-drift {
          from { background-position: 0%   50%; }
          to   { background-position: 300% 50%; }
        }
        @keyframes holo-spin {
          from { transform: rotate(0deg)   scale(3.2); }
          to   { transform: rotate(360deg) scale(3.2); }
        }
      `}</style>

      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-center"
        style={{ height: '72px', background: 'transparent', pointerEvents: 'none' }}
      >
        {/* ── NAVBAR PILL DESKTOP ───────────────────────────── */}
        <div
          ref={navPillRef}
          className="hidden md:flex items-center relative"
          style={{
            borderRadius:         '999px',
            background: [
              'linear-gradient(180deg,',
              '  rgba(255,255,255,0.14) 0%,',
              '  rgba(255,255,255,0.05) 38%,',
              '  rgba(255,255,255,0.02) 66%,',
              '  rgba(255,255,255,0.09) 100%)',
            ].join(''),
            backdropFilter:       'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border:               '0.5px solid rgba(255,255,255,0.20)',
            boxShadow:            NAV_PILL_SHADOW,
            padding:              '10px 20px',
            gap:                  '2px',
            overflow:             'visible',
            willChange:           'transform',
            pointerEvents:        'auto',
          }}
        >
          {/* Lumière ambre interne */}
          <div
            ref={navLightRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '30%', height: '190%',
              background: [
                'radial-gradient(ellipse at center,',
                '  rgba(255,215,80,0.36)  0%,',
                '  rgba(251,191,36,0.22)  28%,',
                '  rgba(249,115,22,0.10)  58%,',
                '  transparent            80%)',
              ].join(''),
              filter:        'blur(16px)',
              mixBlendMode:  'screen',
              pointerEvents: 'none',
              zIndex:        1,
              willChange:    'transform, opacity',
            }}
          />

          {/* Rim prismatique navbar */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: '1.5px', borderRadius: '0 0 999px 999px',
              background: [
                'linear-gradient(90deg,',
                '  transparent               0%,',
                '  rgba(0,51,255,0.32)        7%,',
                '  rgba(151,125,255,0.42)     18%,',
                '  rgba(255,80,180,0.40)      30%,',
                '  rgba(255,215,80,0.58)      50%,',
                '  rgba(255,80,180,0.40)      70%,',
                '  rgba(151,125,255,0.42)     82%,',
                '  rgba(0,51,255,0.32)        93%,',
                '  transparent                100%)',
              ].join(''),
              zIndex: 2, pointerEvents: 'none',
            }}
          />

          {/* Contenu */}
          <div className="relative z-10 flex items-center gap-1">

            {NAV_LEFT.map((item) => <NavLink key={item.id} item={item} />)}

            {/* Séparateur gauche */}
            <div aria-hidden="true" style={{
              width: '1px', height: '20px', margin: '0 12px',
              background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.72), transparent)',
            }} />

            {/* ── LOGO MARSAI ──────────────────────────────── */}
            <Link
              to="/"
              aria-label="MARSAI — Festival du Film A.I."
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-sm"
              style={{ padding: '0 14px' }}
            >
              <div
                ref={logoWrapRef}
                onMouseEnter={onLogoEnter}
                onMouseLeave={onLogoLeave}
                style={{
                  display:       'flex',
                  flexDirection: 'column',
                  alignItems:    'center',
                  gap:           '3px',
                  cursor:        'pointer',
                  willChange:    'filter',
                  filter:        LOGO_FILTER_IDLE,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span aria-hidden="true" style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: '0.48rem',
                    color: 'rgba(251,191,36,0.55)', lineHeight: 1, userSelect: 'none',
                  }}>◈</span>

                  <span style={{
                    fontFamily:           "'Outfit', sans-serif",
                    fontWeight:           900,
                    fontSize:             'clamp(1.05rem, 1.95vw, 1.42rem)',
                    letterSpacing:        '-0.025em',
                    lineHeight:           1,
                    userSelect:           'none',
                    background:           'linear-gradient(90deg, rgba(251,191,36,0.92) 0%, rgba(255,255,255,1) 32%, rgba(255,255,255,1) 68%, rgba(251,191,36,0.92) 100%)',
                    backgroundClip:       'text',
                    WebkitBackgroundClip: 'text',
                    color:                'transparent',
                  }}>MARSAI</span>

                  <span aria-hidden="true" style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: '0.48rem',
                    color: 'rgba(251,191,36,0.55)', lineHeight: 1, userSelect: 'none',
                  }}>◈</span>
                </div>

                <div aria-hidden="true" style={{
                  height: '0.5px', width: '88%',
                  background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.50) 25%, rgba(255,255,255,0.35) 50%, rgba(251,191,36,0.50) 75%, transparent)',
                }} />

                <span style={{
                  fontFamily:    "'Outfit', sans-serif",
                  fontWeight:    300,
                  fontSize:      'clamp(0.38rem, 0.70vw, 0.46rem)',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color:         'rgba(255,255,255,0.52)',
                  lineHeight:    1,
                  userSelect:    'none',
                  paddingLeft:   '0.38em',
                }}>A.I. Film Festival</span>
              </div>
            </Link>

            {/* Séparateur droit */}
            <div aria-hidden="true" style={{
              width: '1px', height: '20px', margin: '0 12px',
              background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.72), transparent)',
            }} />

            {NAV_RIGHT.map((item) => <NavLink key={item.id} item={item} />)}
          </div>
        </div>

        {/* ── Burger mobile ─────────────────────────────────── */}
        <div className="md:hidden absolute right-5 top-1/2 -translate-y-1/2" style={{ pointerEvents: 'auto' }}>
          <button
            ref={burgerRef}
            onClick={() => setIsOpen((v) => !v)}
            className="z-[110] w-10 h-10 flex flex-col items-end justify-center gap-[5px] focus:outline-none"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            <span className="block bg-white transition-all duration-300 origin-right" style={{
              height: '1.5px', width: isOpen ? '1.4rem' : '1.9rem',
              transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none',
            }} />
            <span className="block bg-white transition-all duration-300" style={{
              height: '1.5px', width: isOpen ? 0 : '1.4rem', opacity: isOpen ? 0 : 1,
            }} />
            <span className="block bg-white transition-all duration-300 origin-right" style={{
              height: '1.5px', width: isOpen ? '1.4rem' : '0.9rem',
              transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none',
            }} />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          OVERLAY MOBILE
          ════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[105] flex-col items-center justify-center md:hidden"
        style={{
          display: 'none', opacity: 0,
          background:           'rgba(0,0,0,0.97)',
          backdropFilter:       'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <div aria-hidden="true" className="absolute top-[72px] left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,51,255,0.42) 14%, rgba(151,125,255,0.62) 34%, rgba(251,191,36,0.82) 50%, rgba(151,125,255,0.62) 66%, rgba(0,51,255,0.42) 86%, transparent)',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: '-40%',
          background:   'conic-gradient(from 0deg at 50% 50%, rgba(255,0,120,0.05), rgba(255,200,0,0.05), rgba(0,150,255,0.05), rgba(200,0,255,0.05), rgba(255,0,120,0.05))',
          animation:    'holo-spin 32s linear infinite',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }} />

        <nav ref={mobileNavRef} className="flex flex-col items-center gap-7" aria-label="Navigation mobile">
          {NAV_MOBILE.map((item) => (
            <span key={item.id} className="m-link" style={{ opacity: 0 }}>
              {item.isLogo ? (
                <Link to={item.href} onClick={() => setIsOpen(false)} style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                  fontSize: '1.75rem', letterSpacing: '-0.025em',
                  color: 'white', textDecoration: 'none',
                }}>MARSAI</Link>
              ) : item.isAnchor ? (
                <a href={item.href} onClick={() => setIsOpen(false)} style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  fontSize: '1.45rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'white', textDecoration: 'none',
                }}>{item.label}</a>
              ) : (
                <Link to={item.href} onClick={() => setIsOpen(false)} style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  fontSize: '1.45rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'white', textDecoration: 'none',
                }}>{item.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <div aria-hidden="true" className="absolute bottom-8 select-none" style={{
          fontFamily:           "'Outfit', sans-serif",
          fontWeight:           300,
          fontSize:             '0.72rem',
          letterSpacing:        '0.35em',
          textTransform:        'uppercase',
          color:                'transparent',
          background:           'linear-gradient(90deg, rgba(0,51,255,0.42), rgba(151,125,255,0.58), rgba(251,191,36,0.72), rgba(151,125,255,0.58), rgba(0,51,255,0.42))',
          backgroundClip:       'text',
          WebkitBackgroundClip: 'text',
          backgroundSize:       '300% 100%',
          animation:            'holo-drift 10s linear infinite',
        }}>
          A.I. Film Festival
        </div>
      </div>
    </>
  );
}