/**
 * Header.jsx — MARSAI Festival
 * ═══════════════════════════════════════════════════════════════
 * KODAWARI / SHOKUNIN — chaque pixel est intentionnel.
 * L'intemporel naît de la précision absolue, jamais de l'excès.
 * ═══════════════════════════════════════════════════════════════
 *
 * LiquidGlassPill — composant universel réutilisable.
 *   Tout composant enveloppé reçoit automatiquement :
 *   ① Lumière organique instable (GSAP random walk)
 *      → au repos : lent, organique (sine.inOut)
 *      → au hover : frénétique (power2.inOut), "essaie de s'échapper"
 *   ② Irisation oil-slick au hover
 *      gradient 400% translateX, animationPlayState contrôlé
 *   ③ Arc spéculaire haut (courbure physique du verre)
 *   ④ Rim prismatique bas 1px (dispersion chromatique)
 *   ⑤ Pré-fissure : vibration + aberration chromatique
 *      Escalade sur 2.2s : 0.25° → 5.75°, 85ms → 28ms
 *   ⑥ Clic : brisure scale elastic + 18 particules colorées
 *
 * NavLink — wrapping transparent autour de LiquidGlassPill.
 *
 * Header — navbar floating liquid glass pill.
 *   Lumière ambre interne depuis le logo (cohérence HeroImpact)
 *   Aberration chromatique sur les rims (inset shadows gauche/droite)
 *   Séparateurs ambre flanquant le logo
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link }                                     from 'react-router-dom';
import gsap                                          from 'gsap';
import { useGSAP }                                   from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// LOGO GLOW — cohérence absolue avec HeroImpact.jsx
// ─────────────────────────────────────────────────────────────
const LOGO_GLOW_IDLE  =
  '0 0 8px rgba(255,200,70,0.55), 0 0 22px rgba(251,191,36,0.25), 0 0 45px rgba(180,83,9,0.12)';
const LOGO_GLOW_PEAK  =
  '0 0 14px rgba(255,215,80,0.90), 0 0 38px rgba(251,191,36,0.55), 0 0 75px rgba(180,83,9,0.28)';
const LOGO_GLOW_HOVER =
  '0 0 20px rgba(255,215,80,1.00), 0 0 52px rgba(251,191,36,0.80), 0 0 95px rgba(180,83,9,0.42)';

// ─────────────────────────────────────────────────────────────
// LIQUID GLASS — shadow stacks
//
// Décomposition physique :
//   ① inset haut       : arc spéculaire (lumière sur l'arête haute)
//   ② inset bas        : filet intérieur bas
//   ③ inset body       : halo diffus intérieur
//   ④ drop lift        : élévation diffuse
//   ⑤ drop contact     : ombre de contact précise
//   ⑥ rim              : bord extérieur semi-transparent
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

// Navbar pill — même logique, légèrement amplifiée
// rims colorés : inset gauche bleu / droite ambre = aberration chromatique
const NAV_PILL_SHADOW = [
  'inset 0  2px   0    rgba(255,255,255,0.52)',
  'inset 0 -1px   0    rgba(255,255,255,0.12)',
  'inset  3px 0  14px  rgba(80,100,255,0.11)',    // rim gauche : bleu froid
  'inset -3px 0  14px  rgba(255,170,40,0.11)',    // rim droite : ambre chaud
  '0  8px 36px rgba(0,0,0,0.50)',
  '0  2px  8px rgba(0,0,0,0.28)',
  '0  0    0   0.5px rgba(255,255,255,0.20)',
].join(', ');

// ─────────────────────────────────────────────────────────────
// PARTICULES — palette chromatique complète
// ─────────────────────────────────────────────────────────────
const PARTICLE_COLORS = [
  '#ff0080', '#00c8ff', '#ffd600', '#c800ff',
  '#ffffff', '#00ff96', '#ff6400', '#0064ff',
  '#ffb0d8', '#80ffee', '#ffee80', '#a080ff',
];

// ─────────────────────────────────────────────────────────────
// NAVIGATION — données
// ─────────────────────────────────────────────────────────────
const NAV_LEFT   = [
  { id: 'accueil',   label: 'Accueil',   href: '/#accueil',  isAnchor: true  },
  { id: 'galerie',   label: 'Galerie',   href: '/galerie',   isAnchor: false },
];
const NAV_RIGHT  = [
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
// COMPOSANT — LiquidGlassPill
//
// Props :
//   children      — contenu (label, icône, etc.)
//   onClick       — callback clic externe (optionnel)
//   className     — classes additionnelles
//   style         — styles inline additionnels
//
// ─── STRUCTURE PHYSIQUE ─────────────────────────────────────
//
//   pill (overflow:visible)
//   ├── glassInner (overflow:hidden, borderRadius:999px)
//   │   ├── organic light blob        (random walk GSAP)
//   │   ├── iris drift stripe         (400% gradient translate)
//   │   ├── arc spéculaire haut       (static)
//   │   └── rim prismatique bas 1px   (static)
//   ├── sparkles container            (overflow:visible)
//   └── contentRef                   (vibration target z-10)
//
// ─── BOUCLES GSAP ────────────────────────────────────────────
//
//   loopLight()   — random walk infini, vitesse via lightFastRef
//   vibrateStep() — récursion escalante via onComplete
//
//   Toutes deux lisent uniquement des refs → useCallback([]) stable
// ─────────────────────────────────────────────────────────────
const LiquidGlassPill = ({ children, onClick, className = '', style: ext = {} }) => {

  // ── Refs DOM ───────────────────────────────────────────
  const pillRef    = useRef(null);  // capsule principale
  const glassInner = useRef(null);  // couche clippée
  const lightRef   = useRef(null);  // blob organique
  const irisRef    = useRef(null);  // irisation drift
  const shineRef   = useRef(null);  // arc spéculaire
  const contentRef = useRef(null);  // cible de vibration
  const sparkleRef = useRef(null);  // container particules

  // ── Refs état ──────────────────────────────────────────
  const mountedRef    = useRef(true);
  const isHoveringRef = useRef(false);
  const lightFastRef  = useRef(false);  // true = frénétique au hover
  const lightLoopRef  = useRef(null);   // tween en cours
  const vibrateRef    = useRef(null);   // tween vibration en cours
  const hoverStartRef = useRef(0);      // timestamp mouseenter

  // ── BOUCLE LUMIÈRE ORGANIQUE ───────────────────────────
  //
  // Lit lightFastRef à chaque appel → jamais de closure stale.
  // Au repos   : r=82, dur 0.8–1.7s, sine.inOut   → respiration lente
  // Au hover   : r=115, dur 0.2–0.5s, power2.inOut → frénésie
  //
  const loopLight = useCallback(() => {
    const el = lightRef.current;
    if (!mountedRef.current || !el) return;
    const fast = lightFastRef.current;
    const r    = fast ? 115 : 82;
    const x    = (Math.random() - 0.5) * r;
    const y    = (Math.random() - 0.5) * (r * 0.68);
    const dur  = fast ? 0.20 + Math.random() * 0.30 : 0.80 + Math.random() * 0.92;
    lightLoopRef.current = gsap.to(el, {
      x: `${x}%`,
      y: `${y}%`,
      duration:   dur,
      ease:       fast ? 'power2.inOut' : 'sine.inOut',
      onComplete: loopLight,
    });
  }, []);

  // ── ESCALADE VIBRATION ─────────────────────────────────
  //
  // Lit hoverStartRef à chaque step → progression temporelle réelle.
  //
  // t       : 0 → 1 sur 2.2 secondes de hover
  // amp     : 0.25° → 5.75°   (presque imperceptible → fracture visible)
  // dur     : 85ms → 28ms     (vibration de plus en plus rapide)
  // ca      : 0 → 4px         (aberration chromatique R/B, s'active à t>0.35)
  //
  const vibrateStep = useCallback(() => {
    const el = contentRef.current;
    if (!mountedRef.current || !isHoveringRef.current || !el) return;
    const t    = Math.min((Date.now() - hoverStartRef.current) / 2200, 1);
    const amp  = 0.25 + t * 5.5;
    const dur  = Math.max(0.028, 0.085 - t * 0.057);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const ca   = t > 0.35 ? t * 4.0 : 0;
    const cOp  = t > 0.35 ? (t - 0.35) * 1.1 : 0;
    vibrateRef.current = gsap.to(el, {
      skewX: sign * amp,
      textShadow: ca > 0
        ? [
            `${-sign * ca}px 0 rgba(255,20,70,${cOp.toFixed(2)})`,
            `${sign  * ca}px 0 rgba(20,70,255,${cOp.toFixed(2)})`,
          ].join(', ')
        : '',
      duration: dur,
      ease:     'none',
      onComplete() {
        // Return to zero — demi-période
        gsap.to(el, {
          skewX: 0,
          duration: dur * 0.5,
          ease: 'none',
          onComplete: vibrateStep,
        });
      },
    });
  }, []);

  // ── MONTAGE / DÉMONTAGE ────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    loopLight();
    return () => {
      mountedRef.current = false;
      lightLoopRef.current?.kill();
      vibrateRef.current?.kill();
    };
  }, [loopLight]);

  // ── MOUSEENTER ────────────────────────────────────────
  const handleEnter = useCallback(() => {
    isHoveringRef.current = true;
    lightFastRef.current  = true;
    hoverStartRef.current = Date.now();

    // Redémarre la boucle en mode rapide
    lightLoopRef.current?.kill();
    loopLight();

    // Lift de la capsule
    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, {
      scale:     1.07,
      y:         -2,
      boxShadow: LG_SHADOW_HOVER,
      duration:  0.22,
      ease:      'power2.out',
    });

    // Arc spéculaire s'embrase
    gsap.to(shineRef.current, { opacity: 1.0, duration: 0.16 });

    // Irisation : démarre l'animation et la révèle
    if (irisRef.current) {
      irisRef.current.style.animationPlayState = 'running';
      gsap.to(irisRef.current, { opacity: 0.90, duration: 0.22 });
    }

    // Lance l'escalade de vibration
    vibrateStep();
  }, [loopLight, vibrateStep]);

  // ── MOUSELEAVE ────────────────────────────────────────
  const handleLeave = useCallback(() => {
    isHoveringRef.current = false;
    lightFastRef.current  = false;

    // Redémarre la boucle en mode lent
    lightLoopRef.current?.kill();
    loopLight();

    // Descend la capsule
    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, {
      scale:     1,
      y:         0,
      boxShadow: LG_SHADOW_IDLE,
      duration:  0.30,
      ease:      'power2.out',
    });

    // Arc spéculaire se calme
    gsap.to(shineRef.current, { opacity: 0.55, duration: 0.25 });

    // Irisation : fondu puis pause (économie GPU)
    gsap.to(irisRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        if (irisRef.current) irisRef.current.style.animationPlayState = 'paused';
      },
    });

    // Stoppe la vibration et remet à zéro le contenu
    vibrateRef.current?.kill();
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        skewX:      0,
        textShadow: '',
        duration:   0.20,
        ease:       'power2.out',
      });
    }
  }, [loopLight]);

  // ── CLIC : BRISURE + PARTICULES ───────────────────────
  const handleClick = useCallback((e) => {
    const pill = pillRef.current;
    if (!pill) return;

    // Snap instantané du contenu (fin de vibration)
    vibrateRef.current?.kill();
    if (contentRef.current) {
      gsap.to(contentRef.current, { skewX: 0, textShadow: '', duration: 0.04 });
    }

    // Séquence de brisure :
    //   1.14 → 0.94 → 1.00 elastic.out = le verre se brise puis se "ressaisit"
    gsap.timeline()
      .to(pill, { scale: 1.14, duration: 0.05, ease: 'power3.out' })
      .to(pill, { scale: 0.94, duration: 0.08, ease: 'power3.in'  })
      .to(pill, { scale: 1.00, duration: 0.30, ease: 'elastic.out(1, 0.35)' });

    // 18 particules de lumière s'échappent
    const cont = sparkleRef.current;
    if (cont) {
      for (let i = 0; i < 18; i++) {
        const p     = document.createElement('span');
        const sz    = 2.0 + Math.random() * 4.5;
        const clr   = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        const elong = Math.random() > 0.50; // certaines sont allongées (éclats)
        p.style.cssText = [
          'position:absolute;pointer-events:none;border-radius:999px;',
          `width:${elong ? sz * 0.55 : sz}px;`,
          `height:${elong ? sz * 2.80 : sz}px;`,
          `background:${clr};`,
          'top:50%;left:50%;',
          'transform-origin:center center;',
          'transform:translate(-50%,-50%);',
        ].join('');
        cont.appendChild(p);

        const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.90;
        const dist  = 30 + Math.random() * 72;
        const rot   = (Math.random() - 0.5) * 620;
        gsap.to(p, {
          x:        Math.cos(angle) * dist,
          y:        Math.sin(angle) * dist,
          rotation: rot,
          opacity:  0,
          scale:    0.20 + Math.random() * 1.70,
          duration: 0.32 + Math.random() * 0.34,
          ease:     'power2.out',
          onComplete() { p.parentNode?.removeChild(p); },
        });
      }
    }

    onClick?.(e);
  }, [onClick]);

  // ─────────────────────────────────────────────────────
  // RENDER LIQUID GLASS PILL
  // ─────────────────────────────────────────────────────
  return (
    <div
      ref={pillRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        padding:              '6px 14px',
        borderRadius:         '999px',
        // Fond de verre : légèrement plus blanc en haut, effilement vers le bas
        background: [
          'linear-gradient(180deg,',
          '  rgba(255,255,255,0.16) 0%,',
          '  rgba(255,255,255,0.06) 35%,',
          '  rgba(255,255,255,0.03) 65%,',
          '  rgba(255,255,255,0.10) 100%)',
        ].join(''),
        backdropFilter:       'blur(14px) saturate(165%)',
        WebkitBackdropFilter: 'blur(14px) saturate(165%)',
        border:               '0.5px solid rgba(255,255,255,0.22)',
        boxShadow:            LG_SHADOW_IDLE,
        willChange:           'transform, box-shadow',
        overflow:             'visible',     // pour que les particules s'échappent
        ...ext,
      }}
    >
      {/*
       * Couche intérieure clippée
       * overflow:hidden + borderRadius:999px → tous les effets visuels
       * (light, iris, shine, rim) restent dans la silhouette de la capsule.
       */}
      <div
        ref={glassInner}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: '999px', overflow: 'hidden' }}
      >
        {/*
         * Lumière organique instable
         * Blob ambre/blanc, filter:blur(9px) = doux et volumétrique.
         * GSAP random walk → illusion d'une source lumineuse vivante.
         * Au hover la fréquence × 4 : la lumière "panique".
         */}
        <div
          ref={lightRef}
          style={{
            position:     'absolute',
            width:        '52%',
            height:       '78%',
            top:          '11%',
            left:         '24%',
            background:   [
              'radial-gradient(ellipse at center,',
              '  rgba(255,235,150,0.65) 0%,',
              '  rgba(255,200,100,0.34) 36%,',
              '  rgba(255,140,60,0.15)  65%,',
              '  transparent            85%)',
            ].join(''),
            filter:       'blur(9px)',
            mixBlendMode: 'screen',
            willChange:   'transform',
          }}
        />

        {/*
         * Irisation oil-slick
         * Gradient 400% de large, translateX loop CSS (animationPlayState contrôlé).
         * Visible uniquement au hover (opacity 0 → 0.90 via GSAP).
         * mix-blend-mode screen : lumière additive sur fond sombre.
         */}
        <div
          ref={irisRef}
          style={{
            position:           'absolute',
            top:                0,
            left:               0,
            width:              '400%',
            height:             '100%',
            background:         [
              'linear-gradient(90deg,',
              '  transparent              0%,',
              '  rgba(255,0,120,0.30)     6%,',
              '  rgba(0,200,255,0.30)     14%,',
              '  rgba(200,0,255,0.26)     22%,',
              '  rgba(255,220,0,0.30)     30%,',
              '  rgba(0,255,150,0.26)     38%,',
              '  rgba(255,0,120,0.30)     46%,',
              '  rgba(0,200,255,0.30)     54%,',
              '  rgba(200,0,255,0.26)     62%,',
              '  rgba(255,220,0,0.30)     70%,',
              '  rgba(0,255,150,0.26)     78%,',
              '  transparent              84%,',
              '  transparent              100%)',
            ].join(''),
            mixBlendMode:       'screen',
            opacity:            0,
            animation:          'iris-drift 2.5s linear infinite',
            animationPlayState: 'paused',
            willChange:         'transform, opacity',
          }}
        />

        {/*
         * Arc spéculaire haut
         * La lumière frappe l'arête supérieure du verre épais.
         * Gradient blanc → transparent sur 50% de la hauteur.
         * Bords en borderRadius 999px/50% pour suivre la courbure de la capsule.
         */}
        <div
          ref={shineRef}
          style={{
            position:     'absolute',
            top:          0,
            left:         '8%',
            right:        '8%',
            height:       '50%',
            background:   [
              'linear-gradient(180deg,',
              '  rgba(255,255,255,0.42) 0%,',
              '  rgba(255,255,255,0.09) 55%,',
              '  transparent           100%)',
            ].join(''),
            borderRadius: '999px 999px 50% 50%',
            opacity:      0.55,
          }}
        />

        {/*
         * Rim prismatique bas — 1px
         * L'arête inférieure épaisse du verre disperse la lumière.
         * 6 stops spectraux : rose → cyan → jaune → bleu → violet.
         */}
        <div
          style={{
            position:     'absolute',
            left:         0,
            right:        0,
            bottom:       0,
            height:       '1px',
            borderRadius: '0 0 999px 999px',
            background:   [
              'linear-gradient(90deg,',
              '  transparent           0%,',
              '  rgba(255,80,180,0.68) 15%,',
              '  rgba(80,200,255,0.70) 32%,',
              '  rgba(255,235,80,0.64) 50%,',
              '  rgba(80,100,255,0.70) 68%,',
              '  rgba(200,80,255,0.65) 85%,',
              '  transparent           100%)',
            ].join(''),
            opacity: 0.85,
          }}
        />
      </div>

      {/*
       * Container particules — overflow:visible intentionnel.
       * Les 18 particules s'échappent dans toutes les directions
       * au-delà des bornes de la capsule.
       */}
      <div
        ref={sparkleRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          overflow:      'visible',
          borderRadius:  '999px',
          zIndex:        20,
        }}
      />

      {/*
       * Contenu — z-10, cible de la vibration.
       * willChange:transform → browser crée un layer dédié.
       */}
      <div
        ref={contentRef}
        className="relative z-10"
        style={{ willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT — NavLink
// Wrapping transparent autour de LiquidGlassPill.
// ─────────────────────────────────────────────────────────────
const NavLink = ({ item }) => {
  const label = (
    <span
      className="text-[0.63rem] font-bold uppercase text-white/90 select-none"
      style={{ letterSpacing: '0.22em' }}
    >
      {item.label}
    </span>
  );

  const pill = <LiquidGlassPill>{label}</LiquidGlassPill>;

  if (item.isAnchor) return <a href={item.href}>{pill}</a>;
  return <Link to={item.href}>{pill}</Link>;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL — Header
// ─────────────────────────────────────────────────────────────
export default function Header() {
  const headerRef    = useRef(null);
  const navPillRef   = useRef(null);  // capsule navbar
  const navLightRef  = useRef(null);  // lumière ambre interne navbar
  const logoRef      = useRef(null);  // texte logo
  const overlayRef   = useRef(null);  // overlay mobile
  const mobileNavRef = useRef(null);  // nav mobile items
  const burgerRef    = useRef(null);  // burger button

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Scroll ────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mobile overlay GSAP ───────────────────────────────
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

  // ── Logo hover ────────────────────────────────────────
  const onLogoEnter = useCallback(() => {
    gsap.to(logoRef.current, { textShadow: LOGO_GLOW_HOVER, duration: 0.22, ease: 'power2.out' });
  }, []);
  const onLogoLeave = useCallback(() => {
    gsap.to(logoRef.current, { textShadow: LOGO_GLOW_IDLE, duration: 0.38, ease: 'power2.out' });
  }, []);

  // ── GSAP montage ──────────────────────────────────────
  useGSAP(() => {

    // Navbar pill — entrée depuis le haut
    if (navPillRef.current) {
      gsap.from(navPillRef.current, {
        y:        -50,
        opacity:  0,
        scale:    0.92,
        duration: 0.95,
        ease:     'power3.out',
        delay:    0.18,
      });
    }

    // Burger mobile
    if (burgerRef.current) {
      gsap.from(burgerRef.current, {
        opacity: 0, x: 14, duration: 0.55, ease: 'power2.out', delay: 0.60,
      });
    }

    // Logo breathing glow — cohérence HeroImpact
    gsap.fromTo(
      logoRef.current,
      { textShadow: LOGO_GLOW_IDLE },
      {
        textShadow: LOGO_GLOW_PEAK,
        duration:   3.0,
        repeat:     -1,
        yoyo:       true,
        ease:       'sine.inOut',
        delay:      1.2,
      }
    );

    // Lumière interne navbar — breathing ambre (capte le glow du logo)
    if (navLightRef.current) {
      gsap.fromTo(navLightRef.current,
        { opacity: 0.28, scale: 0.82 },
        {
          opacity:  0.60,
          scale:    1.18,
          duration: 2.9,
          repeat:   -1,
          yoyo:     true,
          ease:     'sine.inOut',
        }
      );
    }

  }, { dependencies: [], revertOnUpdate: false });

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <>
      {/* ════════════════════════════════════════════════
          CSS KEYFRAMES
          iris-drift  : irisation oil-slick (translateX, 2.5s)
          holo-drift  : overlay mobile gradient défilant
          holo-spin   : overlay mobile conic rotatif
          ════════════════════════════════════════════════ */}
      <style>{`
        @keyframes iris-drift {
          from { transform: translateX(0%);   }
          to   { transform: translateX(-75%); }
        }
        @keyframes holo-drift {
          from { background-position: 0%   50%; }
          to   { background-position: 300% 50%; }
        }
        @keyframes holo-spin {
          from { transform: rotate(0deg)   scale(3.2); }
          to   { transform: rotate(360deg) scale(3.2); }
        }
      `}</style>

      {/* ════════════════════════════════════════════════
          HEADER PRINCIPAL
          Transparent — la navbar pill gère sa propre visibilité.
          ════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-center"
        style={{ height: '72px', background: 'transparent', pointerEvents: 'none' }}
      >

        {/* ════════════════════════════════════════════════
            NAVBAR — LIQUID GLASS PILL (desktop)
            Capsule unique flottante contenant toute la navigation.

            MATIÈRE :
              Même glass treatment que LiquidGlassPill mais
              à échelle navbar. Dégradé vertical légèrement plus
              accentué pour donner de la profondeur au pill épais.

            LUMIÈRE INTERNE (navLightRef) :
              Blob ambre centré sur la position du logo.
              GSAP breathing (opacity + scale) synchro avec le
              logo glow — comme si le logo rayonnait vers l'intérieur
              de la capsule.

            ABERRATION CHROMATIQUE :
              inset gauche  : bleu froid (lumière entrante)
              inset droite  : ambre chaud (lumière réfractée vers logo)
              → impression de thick glass dispersant la lumière.

            RIM PRISMATIQUE BAS :
              Gradient spectral 8 stops centré sur l'ambre du logo.
            ════════════════════════════════════════════════ */}
        <div
          ref={navPillRef}
          className="hidden md:flex items-center relative"
          style={{
            borderRadius:         '999px',
            background: [
              'linear-gradient(180deg,',
              '  rgba(255,255,255,0.14) 0%,',
              '  rgba(255,255,255,0.05) 35%,',
              '  rgba(255,255,255,0.02) 65%,',
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
          {/* Lumière ambre interne — depuis le logo (centre) */}
          <div
            ref={navLightRef}
            aria-hidden="true"
            style={{
              position:      'absolute',
              top:           '50%',
              left:          '50%',
              transform:     'translate(-50%, -50%)',
              width:         '32%',
              height:        '180%',
              background:    [
                'radial-gradient(ellipse at center,',
                '  rgba(255,210,80,0.34)  0%,',
                '  rgba(251,191,36,0.20)  26%,',
                '  rgba(249,115,22,0.09)  56%,',
                '  transparent            78%)',
              ].join(''),
              filter:        'blur(14px)',
              mixBlendMode:  'screen',
              pointerEvents: 'none',
              zIndex:        1,
              willChange:    'transform, opacity',
            }}
          />

          {/* Rim prismatique bas de la navbar */}
          <div
            aria-hidden="true"
            style={{
              position:      'absolute',
              left:          0,
              right:         0,
              bottom:        0,
              height:        '1.5px',
              borderRadius:  '0 0 999px 999px',
              background:    [
                'linear-gradient(90deg,',
                '  transparent               0%,',
                '  rgba(0,51,255,0.32)       7%,',
                '  rgba(151,125,255,0.42)    18%,',
                '  rgba(255,80,180,0.40)     30%,',
                '  rgba(255,210,80,0.55)     50%,',  // ambre centre = logo
                '  rgba(255,80,180,0.40)     70%,',
                '  rgba(151,125,255,0.42)    82%,',
                '  rgba(0,51,255,0.32)       93%,',
                '  transparent               100%)',
              ].join(''),
              zIndex:        2,
              pointerEvents: 'none',
            }}
          />

          {/* Contenu navigable — z-10 par rapport au pill */}
          <div className="relative z-10 flex items-center gap-1">

            {/* Nav gauche */}
            {NAV_LEFT.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}

            {/* Séparateur gauche — filet ambre */}
            <div
              aria-hidden="true"
              style={{
                width:      '1px',
                height:     '22px',
                margin:     '0 10px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.70) 50%, transparent 100%)',
              }}
            />

            {/* Logo MARSAI */}
            <Link
              to="/"
              aria-label="MARSAI — accueil"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-sm"
              style={{ padding: '0 16px' }}
            >
              <span
                ref={logoRef}
                onMouseEnter={onLogoEnter}
                onMouseLeave={onLogoLeave}
                className="block font-black uppercase select-none cursor-pointer text-white leading-none"
                style={{
                  fontSize:      'clamp(1.02rem, 1.9vw, 1.40rem)',
                  letterSpacing: '-0.04em',
                  textShadow:    LOGO_GLOW_IDLE,
                  willChange:    'text-shadow',
                }}
              >
                MARSAI
              </span>
            </Link>

            {/* Séparateur droit — filet ambre */}
            <div
              aria-hidden="true"
              style={{
                width:      '1px',
                height:     '22px',
                margin:     '0 10px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.70) 50%, transparent 100%)',
              }}
            />

            {/* Nav droite */}
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Burger mobile */}
        <div
          className="md:hidden absolute right-5 top-1/2 -translate-y-1/2"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            ref={burgerRef}
            onClick={() => setIsOpen((v) => !v)}
            className="z-[110] w-10 h-10 flex flex-col items-end justify-center gap-[5px] focus:outline-none"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            <span className="block bg-white transition-all duration-300 origin-right"
              style={{ height: '1.5px', width: isOpen ? '1.4rem' : '1.9rem',
                transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none' }} />
            <span className="block bg-white transition-all duration-300"
              style={{ height: '1.5px', width: isOpen ? 0 : '1.4rem', opacity: isOpen ? 0 : 1 }} />
            <span className="block bg-white transition-all duration-300 origin-right"
              style={{ height: '1.5px', width: isOpen ? '1.4rem' : '0.9rem',
                transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          OVERLAY MOBILE — GSAP PUR
          ════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[105] flex-col items-center justify-center md:hidden"
        style={{
          display:              'none',
          opacity:              0,
          background:           'rgba(0,0,0,0.97)',
          backdropFilter:       'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {/* Ligne déco palette */}
        <div
          aria-hidden="true"
          className="absolute top-[72px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,51,255,0.42) 14%, rgba(151,125,255,0.62) 34%, rgba(251,191,36,0.82) 50%, rgba(151,125,255,0.62) 66%, rgba(0,51,255,0.42) 86%, transparent 100%)' }}
        />

        {/* Film holographique ambiant */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            inset:         '-40%',
            background:    'conic-gradient(from 0deg at 50% 50%, rgba(255,0,120,0.05), rgba(255,200,0,0.05), rgba(0,150,255,0.05), rgba(200,0,255,0.05), rgba(255,0,120,0.05))',
            animation:     'holo-spin 32s linear infinite',
            mixBlendMode:  'screen',
            pointerEvents: 'none',
          }}
        />

        <nav
          ref={mobileNavRef}
          className="flex flex-col items-center gap-7"
          aria-label="Navigation mobile"
        >
          {NAV_MOBILE.map((item) => (
            <span key={item.id} className="m-link" style={{ opacity: 0 }}>
              {item.isLogo ? (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[1.75rem] font-black uppercase tracking-[-0.03em] text-white hover:text-amber-300 transition-colors duration-200"
                >
                  MARSAI
                </Link>
              ) : item.isAnchor ? (
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[1.5rem] font-bold uppercase tracking-[0.12em] text-white hover:text-amber-300 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[1.5rem] font-bold uppercase tracking-[0.12em] text-white hover:text-amber-300 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Signature fantôme */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 select-none font-black uppercase leading-none"
          style={{
            fontSize:             '0.80rem',
            letterSpacing:        '-0.04em',
            color:                'transparent',
            background:           'linear-gradient(90deg, rgba(0,51,255,0.42), rgba(151,125,255,0.58), rgba(251,191,36,0.72), rgba(151,125,255,0.58), rgba(0,51,255,0.42))',
            backgroundClip:       'text',
            WebkitBackgroundClip: 'text',
            backgroundSize:       '300% 100%',
            animation:            'holo-drift 10s linear infinite',
          }}
        >
          MARSAI
        </div>
      </div>
    </>
  );
}