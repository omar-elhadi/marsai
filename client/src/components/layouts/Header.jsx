/**
 * Header.jsx — MARSAI Festival
 * ═══════════════════════════════════════════════════════════════
 * KODAWARI / SHOKUNIN — chaque pixel est intentionnel.
 * ═══════════════════════════════════════════════════════════════
 *
 * SYSTÈME 1 — SOUFFLET D'ACCORDÉON (28 plis de verre)
 *   28 plis générés au module-level (zéro recalcul).
 *   Even = face extérieure (brightness), Odd = creux intérieur (ombre).
 *   Chaque pli : skewX ±14° sur le fond uniquement — texte reste droit.
 *   GSAP montage : container scaleX 0.05→1 depuis centre = soufflet qui s'ouvre.
 *
 * SYSTÈME 2 — STÈLES DÉCOMPOSÉES (3 couches par panneau)
 *   STELE_LAYERS[3] : fond large/flou, milieu, avant-plan net.
 *   Chaque couche : hauteur, inset, opacité et ombre portée propres.
 *   Résultat : verre feuilleté physiquement lisible.
 *
 * SYSTÈME 3 — FILM HOLOGRAPHIQUE INTENSE (CSS @keyframes)
 *   Opacités relevées : drift 0.28–0.38, conic 0.22–0.32.
 *   3 couches : palette drift, conic-spin, scan-line.
 *   Zéro JS en continu.
 *
 * SYSTÈME 4 — HOVER DRAMATIQUE — 4 ACTES (GSAP)
 *   ① Aberration chromatique : textShadow canaux R/B + skewX glitch
 *   ② Lignes de crack : 3 spans 1px qui surgissent 80ms
 *   ③ Sweep arc-en-ciel intense : opacity 0.90
 *   ④ Underline spectral + lens flare
 *
 * SYSTÈME 5 — LOGO VOLUMÉTRIQUE
 *   Breathing glow ambre (cohérence HeroImpact.jsx).
 *
 * SYSTÈME 6 — MOBILE OVERLAY GSAP PUR
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link }                                     from 'react-router-dom';
import gsap                                          from 'gsap';
import { useGSAP }                                   from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// LOGO GLOW — cohérence absolue avec HeroImpact.jsx
// ─────────────────────────────────────────────────────────────
const LOGO_GLOW_IDLE =
  '0 0 8px rgba(255,200,70,0.55), 0 0 22px rgba(251,191,36,0.25), 0 0 45px rgba(180,83,9,0.12)';
const LOGO_GLOW_PEAK =
  '0 0 14px rgba(255,215,80,0.90), 0 0 38px rgba(251,191,36,0.55), 0 0 75px rgba(180,83,9,0.28)';
const LOGO_GLOW_HOVER =
  '0 0 20px rgba(255,215,80,1.00), 0 0 52px rgba(251,191,36,0.80), 0 0 95px rgba(180,83,9,0.42)';

// ─────────────────────────────────────────────────────────────
// STELE_LAYERS — 3 couches physiques sous chaque panneau
//
// Empilées de la plus reculée (index 0) à la plus proche (index 2).
// dy       : décalage vertical sous la base du panneau
// h        : hauteur de la couche
// insetPx  : rétrécissement horizontal (les couches arrière sont plus étroites)
// opMul    : multiplicateur d'opacité appliqué à steleClr du panneau
// shadow   : ombre portée sous cette couche
// blur     : blur propre de la couche
// ─────────────────────────────────────────────────────────────
const STELE_LAYERS = [
  // Couche 0 — la plus reculée (fond, large, floue)
  {
    dy:      12,
    h:       2,
    insetPx: 14,
    opMul:   0.30,
    blur:    '2px',
    shadow:  '0 4px 10px rgba(0,0,0,0.65), 0 2px 5px rgba(0,0,0,0.40)',
  },
  // Couche 1 — intermédiaire
  {
    dy:      6,
    h:       2.5,
    insetPx: 7,
    opMul:   0.55,
    blur:    '1px',
    shadow:  '0 2px 6px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.35)',
  },
  // Couche 2 — avant-plan (nette, la plus vivide, ombre légère)
  {
    dy:      1,
    h:       3.5,
    insetPx: 0,
    opMul:   0.90,
    blur:    '0.4px',
    shadow:  '0 1px 4px rgba(0,0,0,0.45)',
  },
];

// ─────────────────────────────────────────────────────────────
// SOUFFLET — 28 plis calculés une seule fois au module-level
//
// Even (pair)  = face extérieure du pli : plus lumineuse
// Odd (impair) = creux intérieur        : plus sombre (ombre)
//
// tint : teinte colorée issue de la position (palette Image 2)
//   Centre → ambre, demi-rayon → violet/rose, bords → bleu nuit
// ─────────────────────────────────────────────────────────────
const PLEAT_COUNT = 28;

const PLEAT_DEFS = Array.from({ length: PLEAT_COUNT }, (_, i) => {
  const pos    = i / (PLEAT_COUNT - 1); // 0..1 gauche→droite
  const cDist  = Math.abs(pos - 0.5) * 2; // 0=centre, 1=bord
  const isEven = i % 2 === 0;

  // Gradient de teinte holographique par position
  let tintR, tintG, tintB;
  if (cDist < 0.18) { tintR = 251; tintG = 191; tintB =  36; }       // ambre centre
  else if (cDist < 0.36) { tintR = 249; tintG = 115; tintB =  22; }  // orange
  else if (cDist < 0.55) { tintR = 255; tintG = 204; tintB = 242; }  // rose pâle
  else if (cDist < 0.72) { tintR = 151; tintG = 125; tintB = 255; }  // violet
  else if (cDist < 0.88) { tintR =   0; tintG =  51; tintB = 255; }  // bleu
  else                    { tintR =   6; tintG =   0; tintB = 171; }  // bleu nuit

  // Face extérieure (pair) : légère surbrillance + teinte
  // Creux intérieur (impair) : assombri, ombre
  const bgFace  = `linear-gradient(180deg,
    rgba(255,255,255,0.09) 0%,
    rgba(${tintR},${tintG},${tintB},0.07) 50%,
    rgba(255,255,255,0.04) 100%)`;
  const bgCreux = `linear-gradient(180deg,
    rgba(0,0,0,0.18) 0%,
    rgba(0,0,0,0.08) 60%,
    rgba(${tintR},${tintG},${tintB},0.04) 100%)`;

  return {
    i,
    isEven,
    skew:    isEven ? -14 : 14,   // angle de pli
    bg:      isEven ? bgFace : bgCreux,
    // Arête visible (bord gauche du pli extérieur)
    edgeOp:  isEven ? 0.22 : 0.08,
    tintR, tintG, tintB,
  };
});

// ─────────────────────────────────────────────────────────────
// PANEL_DEFS — 9 éléments : 7 panneaux + 2 séparateurs
// Palette Image 2 complète.
// ─────────────────────────────────────────────────────────────
const PANEL_DEFS = [
  {
    id: 'accueil', type: 'link', label: 'Accueil',
    href: '/#accueil', isAnchor: true,
    bg:        'linear-gradient(170deg, rgba(242,230,238,0.10) 0%, rgba(151,125,255,0.07) 100%)',
    steleClr:  'rgba(242,230,238,1)',
    fissureClr:'rgba(242,230,238,0.30)',
  },
  {
    id: 'galerie', type: 'link', label: 'Galerie',
    href: '/galerie', isAnchor: false,
    bg:        'linear-gradient(170deg, rgba(255,204,242,0.11) 0%, rgba(0,51,255,0.07) 100%)',
    steleClr:  'rgba(255,204,242,1)',
    fissureClr:'rgba(255,204,242,0.30)',
  },
  {
    id: 'sep-left', type: 'sep',
    color: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.80) 50%, transparent 100%)',
  },
  {
    id: 'logo', type: 'logo', href: '/',
    bg:        'linear-gradient(170deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.05) 100%)',
    steleClr:  'rgba(251,191,36,1)',
  },
  {
    id: 'sep-right', type: 'sep',
    color: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.80) 50%, transparent 100%)',
  },
  {
    id: 'events', type: 'link', label: 'Events',
    href: '/events', isAnchor: false,
    bg:        'linear-gradient(170deg, rgba(151,125,255,0.11) 0%, rgba(6,0,171,0.07) 100%)',
    steleClr:  'rgba(151,125,255,1)',
    fissureClr:'rgba(151,125,255,0.30)',
  },
  {
    id: 'soumettre', type: 'link', label: 'Soumettre',
    href: '/soumettre', isAnchor: false,
    bg:        'linear-gradient(170deg, rgba(0,51,255,0.10) 0%, rgba(0,0,61,0.07) 100%)',
    steleClr:  'rgba(0,100,255,1)',
    fissureClr:'rgba(0,51,255,0.28)',
  },
  {
    id: 'contacter', type: 'link', label: 'Contacter',
    href: '/contact', isAnchor: false,
    bg:        'linear-gradient(170deg, rgba(6,0,171,0.09) 0%, rgba(0,0,61,0.06) 100%)',
    steleClr:  'rgba(6,0,171,1)',
    fissureClr: null,
  },
];

const NAV_ALL = PANEL_DEFS.filter((d) => d.type === 'link' || d.type === 'logo');

// ─────────────────────────────────────────────────────────────
// COMPOSANT — NavLink
//
// 4 ACTES AU HOVER :
//   ① Aberration chromatique (textShadow R/B + skewX glitch, 180ms)
//   ② Lignes de crack (surgissent, disparaissent en 80ms)
//   ③ Sweep holographique intense (rainbow opacity 0.90, 550ms)
//   ④ Underline spectral + lens flare
// ─────────────────────────────────────────────────────────────
const NavLink = ({ item }) => {
  const wrapRef  = useRef(null);
  const prismRef = useRef(null);
  const shardRef = useRef(null);
  const crackRef = useRef(null);
  const flareRef = useRef(null);

  const onEnter = useCallback(() => {
    const wrap  = wrapRef.current;
    const prism = prismRef.current;
    const shard = shardRef.current;
    const crack = crackRef.current;
    const flare = flareRef.current;
    if (!wrap) return;

    gsap.killTweensOf([wrap, prism, shard, crack, flare]);

    // ── ACTE I : ABERRATION CHROMATIQUE + GLITCH ──────────
    // Le texte se déchire en canaux chromatiques R et B,
    // skewX exagéré → effet de brisure de verre instantanée
    const abTl = gsap.timeline();
    abTl
      .set(wrap, { color: '#ffffff' })
      .to(wrap, {
        textShadow: [
          '-6px 0 rgba(255,20,70,0.95)',
          ' 6px 0 rgba(20,70,255,0.95)',
          '0 0 18px rgba(255,255,255,0.50)',
        ].join(', '),
        skewX:    -10,
        duration: 0.06,
        ease:     'power3.out',
      })
      .to(wrap, {
        textShadow: [
          '-3px 0 rgba(255,60,100,0.65)',
          ' 3px 0 rgba(60,100,255,0.65)',
        ].join(', '),
        skewX:    5,
        duration: 0.07,
        ease:     'power2.inOut',
      })
      .to(wrap, {
        textShadow: '0px 0px rgba(0,0,0,0)',
        skewX:      0,
        duration:   0.14,
        ease:       'power2.out',
      });

    // ── ACTE II : LIGNES DE CRACK ─────────────────────────
    // 3 éclats surgissent simultanément à l'impact chromatique
    gsap.set(crack,  { opacity: 1 });
    gsap.to(crack,   { opacity: 0, duration: 0.45, delay: 0.05, ease: 'power2.in' });

    // ── ACTE III : SWEEP HOLOGRAPHIQUE INTENSE ────────────
    // La surface entière du lien s'embrase en arc-en-ciel
    gsap.fromTo(prism,
      { backgroundPosition: '-320% center', opacity: 0   },
      { backgroundPosition: '320% center',  opacity: 0.92,
        duration: 0.55, ease: 'power2.inOut' }
    );
    gsap.to(prism, { opacity: 0, duration: 0.22, delay: 0.55 });

    // ── ACTE IV : UNDERLINE + FLARE ───────────────────────
    gsap.fromTo(shard,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, opacity: 1, duration: 0.24, ease: 'power2.out' }
    );
    gsap.fromTo(flare,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 0.22, delay: 0.12, ease: 'back.out(3)' }
    );
    gsap.to(flare,  { scale: 0, opacity: 0, duration: 0.20, delay: 0.42 });

  }, []);

  const onLeave = useCallback(() => {
    const wrap  = wrapRef.current;
    const shard = shardRef.current;
    if (!wrap) return;
    gsap.killTweensOf([wrap, shard]);
    gsap.to(wrap,  { color: '', textShadow: '', skewX: 0, duration: 0.20, ease: 'power2.out' });
    gsap.to(shard, { scaleX: 0, opacity: 0, duration: 0.14, ease: 'power2.in' });
  }, []);

  const inner = (
    <span
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative inline-block text-[0.63rem] font-bold uppercase tracking-[0.22em] text-zinc-300 cursor-pointer select-none"
      style={{ willChange: 'transform, color, text-shadow' }}
    >
      {item.label}

      {/*
       * ──────────────────────────────────────────────────────
       * SWEEP HOLOGRAPHIQUE (Acte III)
       * Gradient très saturé, backgroundSize 640% pour un sweep
       * qui traverse toute la surface en une seule passe.
       * mix-blend-mode screen = lumière additive sur fond sombre.
       * ──────────────────────────────────────────────────────
       */}
      <span
        ref={prismRef}
        aria-hidden="true"
        className="absolute inset-[-2px] pointer-events-none rounded-sm"
        style={{
          backgroundImage: [
            'linear-gradient(105deg,',
            '  transparent             0%,',
            '  rgba(255,0,120,0.70)    8%,',
            '  rgba(0,200,255,0.70)    22%,',
            '  rgba(200,0,255,0.70)    36%,',
            '  rgba(255,220,0,0.75)    50%,',
            '  rgba(0,255,150,0.70)    64%,',
            '  rgba(255,80,0,0.65)     78%,',
            '  rgba(0,100,255,0.70)    90%,',
            '  transparent             100%)',
          ].join(''),
          backgroundSize:     '640% 100%',
          backgroundPosition: '-320% center',
          opacity:            0,
          mixBlendMode:       'screen',
        }}
      />

      {/*
       * ──────────────────────────────────────────────────────
       * LIGNES DE CRACK (Acte II)
       * 3 éclats de verre — surgissent à l'impact, disparaissent.
       * Radiaux depuis un point fictif légèrement décalé du centre.
       * ──────────────────────────────────────────────────────
       */}
      <span
        ref={crackRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Crack 1 — diagonal gauche-haut */}
        <span className="absolute" style={{
          top: '35%', left: '10%', width: '38%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.50) 70%, transparent)',
          transform:  'rotate(-18deg)',
          transformOrigin: '0% 50%',
        }}/>
        {/* Crack 2 — diagonal droit-bas */}
        <span className="absolute" style={{
          top: '55%', left: '42%', width: '30%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.80) 40%, rgba(255,255,255,0.35) 80%, transparent)',
          transform:  'rotate(25deg)',
          transformOrigin: '0% 50%',
        }}/>
        {/* Crack 3 — vertical léger */}
        <span className="absolute" style={{
          top: '15%', left: '60%', width: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65) 50%, transparent)',
          transform:  'rotate(-5deg)',
          transformOrigin: '0% 50%',
        }}/>
      </span>

      {/* Underline arc-en-ciel spectral */}
      <span
        ref={shardRef}
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-[-4px] h-[1px] origin-left"
        style={{
          background: 'linear-gradient(90deg, #0033ff 0%, #977dff 20%, #ff00aa 36%, #fff5dc 50%, #fbbf24 64%, #977dff 80%, #0033ff 100%)',
          boxShadow:  '0 0 7px rgba(151,125,255,0.70), 0 0 16px rgba(251,191,36,0.50)',
          transform:  'scaleX(0)',
          opacity:    0,
        }}
      />

      {/* Lens flare */}
      <span
        ref={flareRef}
        aria-hidden="true"
        className="absolute -bottom-1 right-0 w-[8px] h-[8px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,245,180,1) 0%, rgba(255,100,200,0.60) 40%, rgba(151,125,255,0.30) 70%, transparent 100%)',
          transform:  'scale(0)',
          opacity:    0,
        }}
      />
    </span>
  );

  if (item.isAnchor) return <a href={item.href}>{inner}</a>;
  return <Link to={item.href}>{inner}</Link>;
};

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Header() {
  const headerRef    = useRef(null);
  const logoRef      = useRef(null);
  const overlayRef   = useRef(null);
  const mobileNavRef = useRef(null);
  const burgerRef    = useRef(null);
  const pleatWrapRef = useRef(null);
  const panelRefs    = useRef([]);

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Scroll ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mobile overlay GSAP ───────────────────────────────────
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

  // ── Logo hover ────────────────────────────────────────────
  const onLogoEnter = useCallback(() => {
    gsap.to(logoRef.current, { textShadow: LOGO_GLOW_HOVER, duration: 0.22, ease: 'power2.out' });
  }, []);
  const onLogoLeave = useCallback(() => {
    gsap.to(logoRef.current, { textShadow: LOGO_GLOW_IDLE, duration: 0.38, ease: 'power2.out' });
  }, []);

  // ── GSAP montage ──────────────────────────────────────────
  useGSAP(() => {

    // ── SYSTÈME 1 : SOUFFLET QUI S'OUVRE ──────────────────
    //
    // Le container des plis part de scaleX 0.04 (soufflet fermé,
    // "compressé" comme un accordéon pincé) et s'expand à 1.
    // transformOrigin center → l'ouverture part du milieu vers
    // les deux bords, exactement comme un vrai soufflet d'accordéon.
    //
    // La légère surélévation (y:-8→0) donne l'impression que le
    // soufflet se détend également verticalement.
    if (pleatWrapRef.current) {
      gsap.from(pleatWrapRef.current, {
        scaleX:          0.04,
        y:               -8,
        opacity:         0.30,
        transformOrigin: 'center center',
        duration:        1.10,
        ease:            'power3.out',
        delay:           0.18,
      });
    }

    // ── PANNEAUX DE CONTENU : chute depuis le haut ─────────
    const panels = panelRefs.current.filter(Boolean);
    if (panels.length) {
      gsap.from(panels, {
        y:        -28,
        opacity:  0,
        duration: 0.75,
        stagger:  { each: 0.06, from: 'center' },
        ease:     'power3.out',
        delay:    0.38,
      });
    }

    // ── HEADER fade-in ─────────────────────────────────────
    gsap.from(headerRef.current, {
      opacity: 0, duration: 0.50, ease: 'power2.out', delay: 0.12,
    });

    // ── BURGER mobile ──────────────────────────────────────
    if (burgerRef.current) {
      gsap.from(burgerRef.current, {
        opacity: 0, x: 12, duration: 0.55, ease: 'power2.out', delay: 0.60,
      });
    }

    // ── LOGO breathing glow ────────────────────────────────
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

  }, { dependencies: [], revertOnUpdate: false });

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ════════════════════════════════════════════════════
          CSS KEYFRAMES — FILM HOLOGRAPHIQUE INTENSE
          Opacités relevées vs version précédente :
            drift : 0.28–0.38  (vs 0.045–0.065)
            spin  : 0.22–0.32  (vs 0.055–0.090)
          sep-pulse / stele-glow / bellows-shimmer conservés.
          ════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes holo-drift {
          0%   { background-position: 0%   50%; opacity: 0.28; }
          30%  { opacity: 0.38; }
          60%  { opacity: 0.32; }
          100% { background-position: 300% 50%; opacity: 0.28; }
        }
        @keyframes holo-spin {
          0%   { transform: rotate(0deg)   scale(3.2); opacity: 0.22; }
          25%  { opacity: 0.32; }
          50%  { opacity: 0.26; }
          75%  { opacity: 0.30; }
          100% { transform: rotate(360deg) scale(3.2); opacity: 0.22; }
        }
        @keyframes scan-line {
          0%   { top: 110%; opacity: 0;    }
          6%   { opacity: 0.30; }
          50%  { top:  35%; opacity: 0.16; }
          94%  { opacity: 0.08; }
          100% { top: -10%; opacity: 0;    }
        }
        @keyframes sep-pulse {
          0%, 100% { opacity: 0.50; }
          50%      { opacity: 0.95; }
        }
        @keyframes stele-pulse {
          0%, 100% { opacity: 0.70; filter: blur(0.4px); }
          50%      { opacity: 1.00; filter: blur(1.2px);  }
        }
        @keyframes bellows-shimmer {
          0%   { opacity: 0.55; }
          50%  { opacity: 0.80; }
          100% { opacity: 0.55; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════
          HEADER PRINCIPAL
          overflow:visible → stèles dépassent en bas
          ════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className={`
          fixed top-0 left-0 w-full z-[100]
          transition-[border-color,box-shadow,background] duration-500
          ${scrolled
            ? 'border-b border-white/15 shadow-[0_2px_32px_rgba(0,0,0,0.65)]'
            : 'border-b border-white/[0.05]'}
        `}
        style={{
          height:               '64px',
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background:           'rgba(0,0,0,0.55)',
          overflow:             'visible',
        }}
      >

        {/* ════════════════════════════════════════════════════
            SYSTÈME 1 — SOUFFLET (28 plis de verre)
            z-1 : couche de fond, derrière tout le contenu.
            overflow-hidden : les bords skewés ne débordent pas.
            GSAP anime le container entier (scaleX 0.04→1).
            ════════════════════════════════════════════════════ */}
        <div
          ref={pleatWrapRef}
          aria-hidden="true"
          className="absolute inset-0 flex items-stretch overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {PLEAT_DEFS.map(({ i, isEven, skew, bg, edgeOp, tintR, tintG, tintB }) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden"
              style={{
                // Le fond est skewé — le contenu (inexistant ici) resterait droit
                background:    bg,
                // Arête de pli : filet sur le bord gauche des faces extérieures
                borderLeft:    isEven
                  ? `0.5px solid rgba(${tintR},${tintG},${tintB},${edgeOp})`
                  : 'none',
                // Légère ombre portée verticale sur les creux
                boxShadow:     isEven
                  ? 'none'
                  : 'inset 2px 0 4px rgba(0,0,0,0.22), inset -2px 0 4px rgba(0,0,0,0.22)',
                // La face extérieure est légèrement inclinée
                transform:     `skewX(${skew}deg)`,
                transformOrigin: 'center center',
                animation:     isEven
                  ? `bellows-shimmer ${3.8 + (i % 5) * 0.4}s ease-in-out infinite`
                  : 'none',
                animationDelay: `${(i * 0.18) % 2.5}s`,
              }}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            SYSTÈME 2 — PANNEAUX VITRÉS (PANEL_DEFS)
            z-2 : teinte de chaque section + fissures + stèles
            ════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-stretch pointer-events-none overflow-visible"
          style={{ zIndex: 2 }}
        >
          {PANEL_DEFS.map((def, i) => {

            // ── Séparateur ambre ──────────────────────────
            if (def.type === 'sep') {
              return (
                <div
                  key={def.id}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  className="flex-none self-stretch"
                  style={{
                    width:          '1px',
                    background:     def.color,
                    animation:      'sep-pulse 4.5s ease-in-out infinite',
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              );
            }

            // ── Panneau de contenu / logo ─────────────────
            return (
              <div
                key={def.id}
                ref={(el) => { panelRefs.current[i] = el; }}
                className="relative flex-1 overflow-visible"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Fond de verre teinté */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    background:           def.bg,
                    backdropFilter:       'blur(3px)',
                    WebkitBackdropFilter: 'blur(3px)',
                    boxShadow:            [
                      'inset 0 1px 0 rgba(255,255,255,0.07)',
                      def.fissureClr
                        ? `inset -1px 0 0 ${def.fissureClr}`
                        : '',
                    ].filter(Boolean).join(', '),
                  }}
                />

                {/*
                 * ─────────────────────────────────────────
                 * SYSTÈME 2 — STÈLES DÉCOMPOSÉES (3 couches)
                 *
                 * Chaque couche est un div absolu positionné
                 * SOUS la base du panneau (bottom négatif).
                 * insetPx réduit la largeur pour simuler la
                 * perspective (les couches arrière sont plus
                 * étroites = elles semblent reculées).
                 *
                 * Du fond vers l'avant :
                 *   Layer 0 (i=0) : la plus large et floue
                 *   Layer 2 (i=2) : la plus nette et vivide
                 * ─────────────────────────────────────────
                 */}
                {STELE_LAYERS.map((layer, li) => (
                  <div
                    key={li}
                    aria-hidden="true"
                    className="absolute pointer-events-none"
                    style={{
                      bottom:     `-${layer.dy + layer.h}px`,
                      height:     `${layer.h}px`,
                      left:       `${layer.insetPx}px`,
                      right:      `${layer.insetPx}px`,
                      background: def.steleClr,
                      opacity:    layer.opMul,
                      filter:     `blur(${layer.blur})`,
                      boxShadow:  layer.shadow,
                      animation:  `stele-pulse ${4.0 + li * 0.6 + (i * 0.2)}s ease-in-out infinite`,
                      animationDelay: `${(i * 0.18 + li * 0.25) % 3.5}s`,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════
            SYSTÈME 3 — FILM HOLOGRAPHIQUE INTENSE
            z-3 : 3 couches, opacités ×4–5 vs version précédente.

            Couche 1 : palette linéaire en défilement (8s)
            Couche 2 : conic-gradient rotatif (22s)
            Couche 3 : scan-line spéculaire (12s)
            ════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 3 }}
        >
          {/* Couche 1 — défilement palette vivide */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                'linear-gradient(105deg,',
                '  rgba(242,230,238,0.18)  0%,',
                '  rgba(255,0,150,0.22)    10%,',
                '  rgba(151,125,255,0.28)  24%,',
                '  rgba(0,51,255,0.24)     38%,',
                '  rgba(0,0,61,0.12)       50%,',
                '  rgba(251,191,36,0.20)   58%,',
                '  rgba(255,80,0,0.18)     66%,',
                '  rgba(151,125,255,0.22)  78%,',
                '  rgba(255,204,242,0.20)  90%,',
                '  rgba(242,230,238,0.16)  100%)',
              ].join(''),
              backgroundSize: '300% 100%',
              mixBlendMode:   'screen',
              animation:      'holo-drift 8s linear infinite',
            }}
          />

          {/* Couche 2 — foil arc-en-ciel rotatif */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset:      '-60%',
              background: [
                'conic-gradient(from 0deg at 50% 50%,',
                '  rgba(255,0,120,0.26)    0deg,',
                '  rgba(255,200,0,0.26)    60deg,',
                '  rgba(0,255,140,0.20)    120deg,',
                '  rgba(0,120,255,0.26)    180deg,',
                '  rgba(200,0,255,0.26)    240deg,',
                '  rgba(255,100,0,0.20)    300deg,',
                '  rgba(255,0,120,0.26)    360deg)',
              ].join(''),
              mixBlendMode: 'screen',
              animation:    'holo-spin 22s linear infinite',
            }}
          />

          {/* Couche 3 — scan-line spéculaire */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height:         '2px',
              top:            '110%',
              background:     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 85%, transparent 100%)',
              animation:      'scan-line 12s ease-in-out infinite',
              animationDelay: '2.5s',
            }}
          />
        </div>

        {/* ════════════════════════════════════════════════════
            CONTENU NAVIGABLE — z-10
            Grid 3 colonnes : nav-gauche / logo / nav-droite
            ════════════════════════════════════════════════════ */}
        <div
          className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center h-full"
          aria-label="Navigation principale"
        >

          {/* ── Nav gauche ── */}
          <nav className="hidden md:flex items-center justify-start h-full" aria-label="Navigation gauche">
            <div className="flex-1 flex items-center justify-center h-full px-4">
              <NavLink item={PANEL_DEFS[0]} />
            </div>
            <div className="flex-1 flex items-center justify-center h-full px-4">
              <NavLink item={PANEL_DEFS[1]} />
            </div>
          </nav>

          {/* ── Logo centré ── */}
          <div className="flex items-center justify-center gap-2 px-6 md:px-10 h-full">
            <span aria-hidden="true"
              className="hidden md:block text-amber-400/55 text-[0.52rem] select-none leading-none">✦</span>

            <Link to="/" aria-label="MARSAI — retour à l'accueil"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-sm">
              <span
                ref={logoRef}
                onMouseEnter={onLogoEnter}
                onMouseLeave={onLogoLeave}
                className="block font-black uppercase select-none cursor-pointer text-white leading-none"
                style={{
                  fontSize:      'clamp(1.05rem, 2.0vw, 1.45rem)',
                  letterSpacing: '-0.04em',
                  textShadow:    LOGO_GLOW_IDLE,
                  willChange:    'text-shadow',
                }}
              >
                MARSAI
              </span>
            </Link>

            <span aria-hidden="true"
              className="hidden md:block text-amber-400/55 text-[0.52rem] select-none leading-none">✦</span>
          </div>

          {/* ── Nav droite ── */}
          <nav className="hidden md:flex items-center justify-end h-full" aria-label="Navigation droite">
            <div className="flex-1 flex items-center justify-center h-full px-4">
              <NavLink item={PANEL_DEFS[5]} />
            </div>
            <div className="flex-1 flex items-center justify-center h-full px-4">
              <NavLink item={PANEL_DEFS[6]} />
            </div>
            <div className="flex-1 flex items-center justify-center h-full px-4">
              <NavLink item={PANEL_DEFS[7]} />
            </div>
          </nav>

          {/* ── Burger mobile ── */}
          <div className="md:hidden col-start-3 flex justify-end pr-5 h-full items-center">
            <button
              ref={burgerRef}
              onClick={() => setIsOpen((v) => !v)}
              className="z-[110] w-10 h-10 flex flex-col items-end justify-center gap-[5px] focus:outline-none"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
            >
              <span className="block bg-white transition-all duration-300 origin-right"
                style={{ height:'1.5px', width: isOpen?'1.4rem':'1.9rem',
                  transform: isOpen?'rotate(-45deg) translateY(-1px)':'none' }}/>
              <span className="block bg-white transition-all duration-300"
                style={{ height:'1.5px', width: isOpen?0:'1.4rem', opacity: isOpen?0:1 }}/>
              <span className="block bg-white transition-all duration-300 origin-right"
                style={{ height:'1.5px', width: isOpen?'1.4rem':'0.9rem',
                  transform: isOpen?'rotate(45deg) translateY(1px)':'none' }}/>
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          OVERLAY MOBILE — GSAP PUR
          ════════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[105] flex-col items-center justify-center md:hidden"
        style={{
          display:              'none',
          opacity:              0,
          background:           'rgba(0,0,0,0.97)',
          backdropFilter:       'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div aria-hidden="true" className="absolute top-[64px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,51,255,0.40) 14%, rgba(151,125,255,0.60) 34%, rgba(251,191,36,0.80) 50%, rgba(151,125,255,0.60) 66%, rgba(0,51,255,0.40) 86%, transparent 100%)' }}
        />

        {/* Film holo dans l'overlay */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{
            inset: '-40%',
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,0,120,0.06), rgba(255,200,0,0.06), rgba(0,150,255,0.06), rgba(200,0,255,0.06), rgba(255,0,120,0.06))',
            animation: 'holo-spin 32s linear infinite',
            mixBlendMode: 'screen',
          }}
        />

        <nav ref={mobileNavRef} className="flex flex-col items-center gap-8" aria-label="Navigation mobile">
          {NAV_ALL.map((item) => (
            <span key={item.id} className="m-link" style={{ opacity: 0 }}>
              {item.type === 'logo' ? (
                <Link to={item.href} onClick={() => setIsOpen(false)}
                  className="text-[1.75rem] font-black uppercase tracking-[-0.03em] text-white hover:text-amber-300 transition-colors duration-200">
                  MARSAI
                </Link>
              ) : item.isAnchor ? (
                <a href={item.href} onClick={() => setIsOpen(false)}
                  className="text-[1.6rem] font-black uppercase tracking-[0.12em] text-white hover:text-amber-300 transition-colors duration-200">
                  {item.label}
                </a>
              ) : (
                <Link to={item.href} onClick={() => setIsOpen(false)}
                  className="text-[1.6rem] font-black uppercase tracking-[0.12em] text-white hover:text-amber-300 transition-colors duration-200">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div aria-hidden="true" className="absolute bottom-8 select-none font-black uppercase leading-none"
          style={{
            fontSize: '0.82rem', letterSpacing: '-0.04em',
            color: 'transparent',
            background: 'linear-gradient(90deg, rgba(0,51,255,0.40), rgba(151,125,255,0.55), rgba(251,191,36,0.70), rgba(151,125,255,0.55), rgba(0,51,255,0.40))',
            backgroundClip: 'text', WebkitBackgroundClip: 'text',
            backgroundSize: '300% 100%',
            animation: 'holo-drift 10s linear infinite',
          }}
        >
          MARSAI
        </div>
      </div>
    </>
  );
}