/**
 * Header.jsx — MARSAI Festival
 * ═══════════════════════════════════════════════════════════════
 * KODAWARI / SHOKUNIN — l'intemporel naît de la précision absolue.
 * ═══════════════════════════════════════════════════════════════
 *
 * LiquidGlassPill — composant universel réutilisable.
 *
 *   Au repos   : blob de lumière ambre, respiration lente (sine.inOut).
 *   Au hover   : blob frénétique × 4 vitesse + escalade vibration.
 *   Pré-clic   : 5 fissures SVG se dessinent via strokeDashoffset
 *                au rythme de l'escalade (t > 0.42 → 0.78).
 *   Au clic    : brisure elastic.out + 10 rayons de lumière pure
 *                + bloom central — éclat de verre, pas confettis.
 *
 * Polices : Outfit (9 graisses, sans-serif cinématographique).
 * Texte   : mix-blend-mode difference → adaptatif sur toute surface.
 * Logo    : gradient text ambre↔blanc, subtitle trackée, filter glow.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link }                                     from 'react-router-dom';
import gsap                                          from 'gsap';
import { useGSAP }                                   from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// LOGO — filter glow (compatible gradient text, contrairement
//        à textShadow qui ne s'applique pas aux bg-clip text)
// ─────────────────────────────────────────────────────────────
const LOGO_FILTER_IDLE  =
  'drop-shadow(0 0 7px rgba(255,200,70,0.60)) drop-shadow(0 0 20px rgba(251,191,36,0.22))';
const LOGO_FILTER_PEAK  =
  'drop-shadow(0 0 13px rgba(255,215,80,0.92)) drop-shadow(0 0 36px rgba(251,191,36,0.50))';
const LOGO_FILTER_HOVER =
  'drop-shadow(0 0 18px rgba(255,220,80,1.00)) drop-shadow(0 0 50px rgba(251,191,36,0.78))';

// ─────────────────────────────────────────────────────────────
// LIQUID GLASS — stacks d'ombres physiques
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
// FISSURES SVG — 5 chemins pré-calculés
//
// viewBox "0 0 100 30" = proportions d'une pill de nav.
// Chaque chemin : point d'origine partagé (48, 15) = centre pill.
//
// len      : longueur approximative du chemin (pour strokeDasharray)
// tStart   : seuil de t (0→1 sur 2.2s) à partir duquel ce crack apparaît
//            → progression fractal naturelle : grand → détails
// ─────────────────────────────────────────────────────────────
const CRACK_PATHS = [
  { d: 'M 48 15 L 72 8 L 84 13',  len: 39, tStart: 0.42 }, // principal droite-haut
  { d: 'M 48 15 L 34 21 L 22 17', len: 27, tStart: 0.54 }, // branche gauche
  { d: 'M 72 8  L 77 3',           len:  8, tStart: 0.64 }, // micro haut droite
  { d: 'M 48 15 L 55 25 L 66 27', len: 23, tStart: 0.64 }, // branche bas droite
  { d: 'M 34 21 L 30 26',          len:  7, tStart: 0.76 }, // micro bas gauche
];

// ─────────────────────────────────────────────────────────────
// NAVIGATION — données
// ─────────────────────────────────────────────────────────────
const NAV_LEFT = [
  { id: 'accueil',   label: 'Accueil',   href: '/#accueil',  isAnchor: true  },
  { id: 'galerie',   label: 'Galerie',   href: '/galerie',   isAnchor: false },
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
// COMPOSANT — LiquidGlassPill
//
// Wrappez n'importe quel contenu : il reçoit automatiquement
// le traitement complet glass + animation.
// ─────────────────────────────────────────────────────────────
const LiquidGlassPill = ({ children, onClick, className = '', style: ext = {} }) => {

  const pillRef        = useRef(null);
  const glassInner     = useRef(null);
  const lightRef       = useRef(null);
  const shineRef       = useRef(null);
  const contentRef     = useRef(null);
  const burstRef       = useRef(null);   // container rayons de lumière
  const crackPathRefs  = useRef([]);     // 5 refs pour les paths SVG

  const mountedRef    = useRef(true);
  const isHoveringRef = useRef(false);
  const lightFastRef  = useRef(false);
  const lightLoopRef  = useRef(null);
  const vibrateRef    = useRef(null);
  const hoverStartRef = useRef(0);

  // ── LUMIÈRE ORGANIQUE (random walk) ───────────────────
  const loopLight = useCallback(() => {
    const el = lightRef.current;
    if (!mountedRef.current || !el) return;
    const fast = lightFastRef.current;
    const r    = fast ? 120 : 80;
    const x    = (Math.random() - 0.5) * r;
    const y    = (Math.random() - 0.5) * (r * 0.65);
    const dur  = fast ? 0.18 + Math.random() * 0.28 : 0.80 + Math.random() * 0.95;
    lightLoopRef.current = gsap.to(el, {
      x: `${x}%`, y: `${y}%`,
      duration: dur,
      ease:     fast ? 'power2.inOut' : 'sine.inOut',
      onComplete: loopLight,
    });
  }, []);

  // ── FISSURES SVG — reset et reveal helpers ─────────────
  const resetCracks = useCallback(() => {
    crackPathRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.strokeDashoffset = String(CRACK_PATHS[i].len);
      el.style.opacity          = '0';
    });
  }, []);

  // ── ESCALADE VIBRATION + FISSURES ─────────────────────
  const vibrateStep = useCallback(() => {
    const el = contentRef.current;
    if (!mountedRef.current || !isHoveringRef.current || !el) return;

    const t    = Math.min((Date.now() - hoverStartRef.current) / 2200, 1);
    const amp  = 0.25 + t * 5.50;
    const dur  = Math.max(0.026, 0.084 - t * 0.058);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const ca   = t > 0.35 ? t * 3.8  : 0;
    const cOp  = t > 0.35 ? Math.min((t - 0.35) * 1.1, 0.85) : 0;

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

    // Révèle progressivement les fissures SVG
    CRACK_PATHS.forEach((cfg, i) => {
      const pathEl = crackPathRefs.current[i];
      if (!pathEl || t < cfg.tStart) return;
      // Progression locale de ce crack : 0→1 depuis son seuil
      const localT  = Math.min((t - cfg.tStart) / (1 - cfg.tStart + 0.001), 1);
      const offset  = cfg.len * (1 - localT);
      pathEl.style.strokeDashoffset = String(offset);
      pathEl.style.opacity          = String(0.35 + localT * 0.55);
    });

  }, []);

  // ── MONTAGE / DÉMONTAGE ────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    resetCracks();
    loopLight();
    return () => {
      mountedRef.current = false;
      lightLoopRef.current?.kill();
      vibrateRef.current?.kill();
    };
  }, [loopLight, resetCracks]);

  // ── MOUSEENTER ────────────────────────────────────────
  const handleEnter = useCallback(() => {
    isHoveringRef.current = true;
    lightFastRef.current  = true;
    hoverStartRef.current = Date.now();
    lightLoopRef.current?.kill();
    loopLight();

    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, {
      scale:     1.07, y: -2,
      boxShadow: LG_SHADOW_HOVER,
      duration:  0.22, ease: 'power2.out',
    });
    gsap.to(shineRef.current, { opacity: 1.0, duration: 0.16 });
    vibrateStep();
  }, [loopLight, vibrateStep]);

  // ── MOUSELEAVE ────────────────────────────────────────
  const handleLeave = useCallback(() => {
    isHoveringRef.current = false;
    lightFastRef.current  = false;
    lightLoopRef.current?.kill();
    loopLight();

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
  }, [loopLight, resetCracks]);

  // ── CLIC : BRISURE + RAYONS DE LUMIÈRE ────────────────
  //
  // Pas de confettis. 10 rayons de lumière pure :
  //   – fins (1–2px), allongés (20–55px)
  //   – gradient blanc → transparent (lumière qui s'évanouit)
  //   – se propagent radialement depuis le centre
  //   – bloom central : cercle blanc 8px, scale 0→2→0 en 0.35s
  //   – durée : 0.28–0.48s, power2.out strict = décélération physique
  //   – zéro rotation → pur éclat de lumière, pas confettis
  //
  const handleClick = useCallback((e) => {
    const pill = pillRef.current;
    if (!pill) return;

    // Stop vibration
    vibrateRef.current?.kill();
    if (contentRef.current) {
      gsap.to(contentRef.current, { skewX: 0, textShadow: '', duration: 0.04 });
    }

    // Brisure de verre
    gsap.timeline()
      .to(pill, { scale: 1.12, duration: 0.05, ease: 'power3.out'           })
      .to(pill, { scale: 0.95, duration: 0.08, ease: 'power3.in'            })
      .to(pill, { scale: 1.00, duration: 0.35, ease: 'elastic.out(1, 0.38)' });

    // Cracks restent un court instant à pleine révélation puis reset
    setTimeout(() => { resetCracks(); }, 420);

    const cont = burstRef.current;
    if (!cont) { onClick?.(e); return; }

    // Bloom central
    const bloom = document.createElement('span');
    bloom.style.cssText = [
      'position:absolute;pointer-events:none;border-radius:50%;',
      'width:8px;height:8px;',
      'top:50%;left:50%;',
      'transform:translate(-50%,-50%) scale(0);',
      'background:rgba(255,248,200,1);',
      'box-shadow:0 0 12px 4px rgba(255,220,100,0.80);',
      'mix-blend-mode:screen;',
    ].join('');
    cont.appendChild(bloom);
    gsap.to(bloom, {
      scale: 3.5, opacity: 0, duration: 0.35, ease: 'power2.out',
      onComplete: () => bloom.parentNode?.removeChild(bloom),
    });

    // 10 rayons radiaux
    const RAY_COUNT = 10;
    for (let i = 0; i < RAY_COUNT; i++) {
      const angle  = (i / RAY_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.55;
      const len    = 22 + Math.random() * 34;       // longueur du rayon
      const w      = 1.0 + Math.random() * 1.2;     // épaisseur : 1–2.2px
      const delay  = Math.random() * 0.04;           // légère dispersion temporelle
      const dur    = 0.28 + Math.random() * 0.20;

      const ray = document.createElement('span');
      // Le rayon pointe vers l'extérieur depuis le centre.
      // On positionne son bord haut au centre et on le fait pointer
      // dans la direction angle via rotation.
      ray.style.cssText = [
        'position:absolute;pointer-events:none;border-radius:1px;',
        `width:${w}px;`,
        `height:${len}px;`,
        // gradient blanc pur en bas (origine) → transparent en haut (pointe)
        'background:linear-gradient(to top, rgba(255,255,255,0), rgba(255,248,200,0.96) 30%, rgba(255,255,255,1) 60%, transparent 100%);',
        'top:50%;left:50%;',
        `transform:translate(-50%,0) rotate(${angle * (180 / Math.PI)}deg);`,
        'transform-origin:50% 100%;',  // pivote depuis le bas = le centre pill
        'mix-blend-mode:screen;',
        'opacity:0;',
      ].join('');
      cont.appendChild(ray);

      gsap.to(ray, {
        opacity:     1,
        scaleY:      1.6,
        y:           -len * 0.55,
        duration:    0.06,
        delay,
        ease:        'power3.out',
        onComplete() {
          gsap.to(ray, {
            opacity:  0,
            scaleY:   0.2,
            duration: dur,
            ease:     'power2.out',
            onComplete: () => ray.parentNode?.removeChild(ray),
          });
        },
      });
    }

    // 4 étincelles : petits points lumineux
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
      const dist  = 18 + Math.random() * 28;
      const spark = document.createElement('span');
      spark.style.cssText = [
        'position:absolute;pointer-events:none;border-radius:50%;',
        'width:3px;height:3px;',
        'top:50%;left:50%;transform:translate(-50%,-50%);',
        'background:rgba(255,245,180,1);',
        'box-shadow:0 0 6px 2px rgba(255,210,80,0.70);',
        'mix-blend-mode:screen;',
      ].join('');
      cont.appendChild(spark);
      gsap.to(spark, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0, scale: 0.3,
        duration: 0.35 + Math.random() * 0.15,
        ease: 'power2.out',
        onComplete: () => spark.parentNode?.removeChild(spark),
      });
    }

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
      {/* ── Couche clippée : light, shine, rim, cracks ── */}
      <div
        ref={glassInner}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: '999px', overflow: 'hidden' }}
      >
        {/* Lumière organique instable */}
        <div
          ref={lightRef}
          style={{
            position:     'absolute',
            width:        '54%',
            height:       '80%',
            top:          '10%',
            left:         '23%',
            background: [
              'radial-gradient(ellipse at center,',
              '  rgba(255,238,155,0.68) 0%,',
              '  rgba(255,200,100,0.36) 36%,',
              '  rgba(255,145,60,0.16)  65%,',
              '  transparent            86%)',
            ].join(''),
            filter:       'blur(10px)',
            mixBlendMode: 'screen',
            willChange:   'transform',
          }}
        />

        {/* Arc spéculaire haut */}
        <div
          ref={shineRef}
          style={{
            position:     'absolute',
            top:          0,
            left:         '8%',
            right:        '8%',
            height:       '50%',
            background: [
              'linear-gradient(180deg,',
              '  rgba(255,255,255,0.44) 0%,',
              '  rgba(255,255,255,0.10) 55%,',
              '  transparent           100%)',
            ].join(''),
            borderRadius: '999px 999px 50% 50%',
            opacity:      0.55,
          }}
        />

        {/* Rim prismatique bas — 1px spectral */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height:   '1px',
            borderRadius: '0 0 999px 999px',
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
         * viewBox 100×30 = proportions d'une pill standard.
         * 5 paths, tous issus du point (48,15) = centre.
         * strokeDasharray = longueur totale du chemin.
         * strokeDashoffset animé par vibrateStep (plein→0 = tracé).
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
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="0.28"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray:  cfg.len,
                strokeDashoffset: cfg.len,
                opacity:          0,
                filter:           'drop-shadow(0 0 1px rgba(255,255,255,0.70))',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Container rayons de lumière — overflow:visible */}
      <div
        ref={burstRef}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none',
          overflow: 'visible',
          borderRadius: '999px',
          zIndex: 20,
        }}
      />

      {/* Contenu — cible de la vibration */}
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
// Police : Outfit 600. Texte : mix-blend-mode difference
// (blanc sur fond sombre, s'assombrit sur fond clair).
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
        color:         'white',
        mixBlendMode:  'difference',
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
// COMPOSANT PRINCIPAL — Header
// ─────────────────────────────────────────────────────────────
export default function Header() {
  const headerRef    = useRef(null);
  const navPillRef   = useRef(null);
  const navLightRef  = useRef(null);
  const logoWrapRef  = useRef(null);  // cible du filter glow GSAP
  const overlayRef   = useRef(null);
  const mobileNavRef = useRef(null);
  const burgerRef    = useRef(null);

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        opacity: 0, x: 14, duration: 0.55, ease: 'power2.out', delay: 0.60,
      });
    }
    // Logo breathing glow via filter
    if (logoWrapRef.current) {
      gsap.fromTo(
        logoWrapRef.current,
        { filter: LOGO_FILTER_IDLE },
        { filter: LOGO_FILTER_PEAK, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 }
      );
    }
    // Lumière interne navbar breathing
    if (navLightRef.current) {
      gsap.fromTo(navLightRef.current,
        { opacity: 0.28, scale: 0.82 },
        { opacity: 0.62, scale: 1.20, duration: 2.9, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }
  }, { dependencies: [], revertOnUpdate: false });

  return (
    <>
      {/* ════════════════════════════════════════════════
          GOOGLE FONTS — Outfit (9 graisses)
          ════════════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════════════
          HEADER — fond transparent, pill gère sa propre
          visibilité
          ════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-center"
        style={{ height: '72px', background: 'transparent', pointerEvents: 'none' }}
      >

        {/* ════════════════════════════════════════════════
            NAVBAR PILL DESKTOP — liquid glass flottante
            ════════════════════════════════════════════════ */}
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
          {/* Lumière ambre interne (capte le glow du logo) */}
          <div
            ref={navLightRef}
            aria-hidden="true"
            style={{
              position:      'absolute',
              top:           '50%',
              left:          '50%',
              transform:     'translate(-50%, -50%)',
              width:         '30%',
              height:        '190%',
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

          {/* Rim prismatique bas navbar — centré sur ambre logo */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: '1.5px', borderRadius: '0 0 999px 999px',
              background: [
                'linear-gradient(90deg,',
                '  transparent                0%,',
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

          {/* Contenu navigable */}
          <div className="relative z-10 flex items-center gap-1">

            {/* Nav gauche */}
            {NAV_LEFT.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}

            {/* Séparateur gauche — ambre */}
            <div aria-hidden="true" style={{
              width: '1px', height: '20px', margin: '0 12px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.72) 50%, transparent 100%)',
            }} />

            {/* ────────────────────────────────────────────
                LOGO MARSAI — redesign cinématographique
                ────────────────────────────────────────────
                Structure :
                  ◈  MARSAI  ◈       ← wordmark Outfit 900
                  ─────────────────  ← ligne ambre 0.5px
                  AI FILM FESTIVAL   ← subtitle Outfit 300

                Gradient text : ambre→blanc→ambre
                  (le blanc central  renforce la lisibilité,
                  l'ambre aux bords capte la lumière pill)

                Le tout est dans logoWrapRef pour le
                filter glow GSAP (drop-shadow sur gradient
                text → fonctionne, contrairement à textShadow)
                ──────────────────────────────────────────── */}
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
                {/* Ligne principale — MARSAI avec ornements */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily:  "'Outfit', sans-serif",
                      fontSize:    '0.48rem',
                      color:       'rgba(251,191,36,0.55)',
                      lineHeight:  1,
                      userSelect:  'none',
                    }}
                  >◈</span>

                  <span
                    style={{
                      fontFamily:           "'Outfit', -apple-system, sans-serif",
                      fontWeight:           900,
                      fontSize:             'clamp(1.05rem, 1.95vw, 1.42rem)',
                      letterSpacing:        '-0.025em',
                      lineHeight:           1,
                      userSelect:           'none',
                      // Gradient text ambre → blanc → ambre
                      background:           'linear-gradient(90deg, rgba(251,191,36,0.92) 0%, rgba(255,255,255,1) 32%, rgba(255,255,255,1) 68%, rgba(251,191,36,0.92) 100%)',
                      backgroundClip:       'text',
                      WebkitBackgroundClip: 'text',
                      color:                'transparent',
                    }}
                  >
                    MARSAI
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize:   '0.48rem',
                      color:      'rgba(251,191,36,0.55)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >◈</span>
                </div>

                {/* Ligne décorative ambre */}
                <div
                  aria-hidden="true"
                  style={{
                    height:     '0.5px',
                    width:      '88%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.50) 25%, rgba(255,255,255,0.35) 50%, rgba(251,191,36,0.50) 75%, transparent 100%)',
                  }}
                />

                {/* Subtitle */}
                <span
                  style={{
                    fontFamily:    "'Outfit', -apple-system, sans-serif",
                    fontWeight:    300,
                    fontSize:      'clamp(0.38rem, 0.7vw, 0.46rem)',
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color:         'rgba(255,255,255,0.52)',
                    lineHeight:    1,
                    userSelect:    'none',
                    paddingLeft:   '0.38em', // compense l'optical offset du tracking
                  }}
                >
                  A.I. Film Festival
                </span>
              </div>
            </Link>

            {/* Séparateur droit — ambre */}
            <div aria-hidden="true" style={{
              width: '1px', height: '20px', margin: '0 12px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.72) 50%, transparent 100%)',
            }} />

            {/* Nav droite */}
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Burger mobile */}
        <div className="md:hidden absolute right-5 top-1/2 -translate-y-1/2" style={{ pointerEvents: 'auto' }}>
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
        <div
          aria-hidden="true"
          className="absolute top-[72px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,51,255,0.42) 14%, rgba(151,125,255,0.62) 34%, rgba(251,191,36,0.82) 50%, rgba(151,125,255,0.62) 66%, rgba(0,51,255,0.42) 86%, transparent 100%)' }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: '-40%',
            background:   'conic-gradient(from 0deg at 50% 50%, rgba(255,0,120,0.05), rgba(255,200,0,0.05), rgba(0,150,255,0.05), rgba(200,0,255,0.05), rgba(255,0,120,0.05))',
            animation:    'holo-spin 32s linear infinite',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        <nav ref={mobileNavRef} className="flex flex-col items-center gap-7" aria-label="Navigation mobile">
          {NAV_MOBILE.map((item) => (
            <span key={item.id} className="m-link" style={{ opacity: 0 }}>
              {item.isLogo ? (
                <Link to={item.href} onClick={() => setIsOpen(false)}
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.025em', color: 'white', textDecoration: 'none' }}>
                  MARSAI
                </Link>
              ) : item.isAnchor ? (
                <a href={item.href} onClick={() => setIsOpen(false)}
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.45rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ) : (
                <Link to={item.href} onClick={() => setIsOpen(false)}
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.45rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}>
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div
          aria-hidden="true"
          className="absolute bottom-8 select-none"
          style={{
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
          }}
        >
          A.I. Film Festival
        </div>
      </div>
    </>
  );
}