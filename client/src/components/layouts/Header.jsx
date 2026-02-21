/**
 * Header.jsx — MARSAI Festival
 * ═══════════════════════════════════════════════════════════════
 * KODAWARI / SHOKUNIN — chaque pixel est intentionnel.
 * L'intemporel naît de la précision absolue, jamais de l'excès.
 * ═══════════════════════════════════════════════════════════════
 *
 * SYSTÈME 1 — VERRE FRACTAL (40 côtes de cristal)
 *   Inspiration : Image 1 — verre cannelé physique.
 *   40 côtes alternant face brillante (pair) / creux ombré (impair).
 *   Face : gradient blanc→teinté→transparent, arête 0.5px brillante.
 *   Creux : gradient noir→teinté→noir, ombre interne.
 *   La teinte de chaque côte suit la palette Image 2 depuis le centre
 *   ambre vers les bords bleu nuit — chromatisme positionnel.
 *   Résultat : verre cannelé photophysique, récursivité de la coupe.
 *   GSAP : container scaleX 0.02→1, ease power4.out — soufflet qui claque.
 *
 * SYSTÈME 2 — LIQUID GLASS BUTTONS (Images 2 & 3)
 *   Chaque bouton = capsule de verre liquide à épaisseur physique :
 *     • Arête supérieure : arc spéculaire blanc (inset-shadow haut)
 *     • Arête inférieure : rim prismatique arc-en-ciel (1px gradient)
 *     • Intérieur : backdrop-filter blur+saturate, gradient 180° clair→clair
 *     • Ombre portée : 2 couches (lift + contact) = flottement physique
 *     • Rim extérieur : border 0.5px rgba(255,255,255,0.22)
 *   Hover — 4 actes :
 *     ① Lift : scale 1→1.07, y 0→-2px, ombre approfondie
 *     ② Arc spéculaire : brightening du shine haut
 *     ③ Aberration chromatique : textShadow R/B + skewX sur le label
 *     ④ Sweep holographique intense + crack lines + underline + flare
 *
 * SYSTÈME 3 — STÈLES DÉCOMPOSÉES (3 couches par panneau)
 *   STELE_LAYERS[3] : fond flou large, milieu, avant nette.
 *   Chaque couche : insetPx décroissant, opMul croissant, ombre propre.
 *
 * SYSTÈME 4 — FILM HOLOGRAPHIQUE (CSS @keyframes, zéro JS continu)
 *   3 couches : palette drift 8s, conic-spin 22s, scan-line 12s.
 *   Opacités 0.22–0.35 (visibles, pas subtiles).
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
// LOGO GLOW — cohérence HeroImpact.jsx
// ─────────────────────────────────────────────────────────────
const LOGO_GLOW_IDLE =
  '0 0 8px rgba(255,200,70,0.55), 0 0 22px rgba(251,191,36,0.25), 0 0 45px rgba(180,83,9,0.12)';
const LOGO_GLOW_PEAK =
  '0 0 14px rgba(255,215,80,0.90), 0 0 38px rgba(251,191,36,0.55), 0 0 75px rgba(180,83,9,0.28)';
const LOGO_GLOW_HOVER =
  '0 0 20px rgba(255,215,80,1.00), 0 0 52px rgba(251,191,36,0.80), 0 0 95px rgba(180,83,9,0.42)';

// ─────────────────────────────────────────────────────────────
// LIQUID GLASS — box-shadow stacks
//
// LG_SHADOW_IDLE  : bouton au repos — flottement léger
// LG_SHADOW_HOVER : bouton survolé — élévation prononcée
//
// Décomposition :
//   ① inset haut       : arc spéculaire blanc (filet de lumière)
//   ② inset bas        : arête inférieure intérieure
//   ③ inset body       : halo intérieur diffus
//   ④ drop lift        : ombre de levitation (diffuse)
//   ⑤ drop contact     : ombre de contact (précise)
//   ⑥ rim              : bord lumineux extérieur
// ─────────────────────────────────────────────────────────────
const LG_SHADOW_IDLE = [
  'inset 0 1.5px 0 rgba(255,255,255,0.62)',
  'inset 0 -0.5px 0 rgba(255,255,255,0.14)',
  'inset 0 0 18px rgba(255,255,255,0.05)',
  '0 5px 18px rgba(0,0,0,0.36)',
  '0 1px 4px rgba(0,0,0,0.24)',
  '0 0 0 0.5px rgba(255,255,255,0.18)',
].join(', ');

const LG_SHADOW_HOVER = [
  'inset 0 2px 0 rgba(255,255,255,0.82)',
  'inset 0 -0.5px 0 rgba(255,255,255,0.25)',
  'inset 0 0 28px rgba(255,255,255,0.11)',
  '0 10px 30px rgba(0,0,0,0.46)',
  '0 2px 8px rgba(0,0,0,0.32)',
  '0 0 0 0.5px rgba(255,255,255,0.32)',
].join(', ');

// ─────────────────────────────────────────────────────────────
// STELE_LAYERS — 3 couches de profondeur sous chaque panneau
// ─────────────────────────────────────────────────────────────
const STELE_LAYERS = [
  { dy: 13, h: 2,   insetPx: 16, opMul: 0.28, blur: '2px',   shadow: '0 5px 12px rgba(0,0,0,0.65), 0 2px 5px rgba(0,0,0,0.42)' },
  { dy: 7,  h: 2.5, insetPx: 8,  opMul: 0.52, blur: '1px',   shadow: '0 3px 7px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.38)'  },
  { dy: 1,  h: 3.5, insetPx: 0,  opMul: 0.88, blur: '0.4px', shadow: '0 1px 4px rgba(0,0,0,0.45)'                               },
];

// ─────────────────────────────────────────────────────────────
// VERRE FRACTAL — 40 côtes de cristal
//
// Chaque côte = une tranche de verre côtelé (Image 1).
// Pair  = face brillante (lumière captée)
// Impair = creux ombré (lumière absorbée)
//
// La teinte chromatique de chaque côte suit la position :
//   Centre [0–0.20] : ambre  #fbbf24
//   Zone   [0.20–0.38]: orange
//   Zone   [0.38–0.56]: rose pâle #FFCCF2
//   Zone   [0.56–0.74]: violet #977DFF
//   Zone   [0.74–0.88]: bleu électrique #0033FF
//   Bords  [0.88–1.00]: bleu nuit #0600AB
// ─────────────────────────────────────────────────────────────
const PLEAT_COUNT = 40;

const PLEAT_DEFS = Array.from({ length: PLEAT_COUNT }, (_, i) => {
  const pos   = i / (PLEAT_COUNT - 1);
  const cDist = Math.abs(pos - 0.5) * 2; // 0 = centre, 1 = bord
  const isEven = i % 2 === 0;

  // Teinte positionnelle
  let tR, tG, tB;
  if      (cDist < 0.20) { tR = 251; tG = 191; tB =  36; }
  else if (cDist < 0.38) { tR = 249; tG = 115; tB =  22; }
  else if (cDist < 0.56) { tR = 255; tG = 204; tB = 242; }
  else if (cDist < 0.74) { tR = 151; tG = 125; tB = 255; }
  else if (cDist < 0.88) { tR =   0; tG =  51; tB = 255; }
  else                    { tR =   6; tG =   0; tB = 171; }

  const col = `rgba(${tR},${tG},${tB},`;

  // Face brillante — gradient : blanc → teinte → transparent
  const bgEven = [
    'linear-gradient(to right,',
    `  rgba(255,255,255,0.26) 0%,`,
    `  ${col}0.10) 16%,`,
    `  rgba(255,255,255,0.06) 38%,`,
    `  rgba(255,255,255,0.01) 62%,`,
    `  rgba(255,255,255,0.04) 100%)`,
  ].join('');

  // Creux ombré — gradient : transparent → sombre → teinte sombre
  const bgOdd = [
    'linear-gradient(to right,',
    `  rgba(0,0,0,0.00) 0%,`,
    `  rgba(0,0,0,0.08) 22%,`,
    `  ${col}0.05) 48%,`,
    `  rgba(0,0,0,0.16) 74%,`,
    `  rgba(0,0,0,0.11) 100%)`,
  ].join('');

  return {
    i, isEven,
    bg:      isEven ? bgEven : bgOdd,
    // Arête de coupure : filet brillant sur le bord gauche des faces paires
    edgeClr: isEven
      ? `rgba(255,255,255,${0.36 + (1 - cDist) * 0.14})`  // plus vif au centre
      : 'transparent',
    tR, tG, tB,
  };
});

// ─────────────────────────────────────────────────────────────
// PANEL_DEFS — 9 éléments : 7 panneaux + 2 séparateurs
// ─────────────────────────────────────────────────────────────
const PANEL_DEFS = [
  {
    id: 'accueil',   type: 'link',  label: 'Accueil',
    href: '/#accueil', isAnchor: true,
    bg:         'linear-gradient(170deg, rgba(242,230,238,0.09) 0%, rgba(151,125,255,0.06) 100%)',
    steleClr:   'rgba(242,230,238,1)',
    fissureClr: 'rgba(242,230,238,0.28)',
  },
  {
    id: 'galerie',   type: 'link',  label: 'Galerie',
    href: '/galerie', isAnchor: false,
    bg:         'linear-gradient(170deg, rgba(255,204,242,0.10) 0%, rgba(0,51,255,0.06) 100%)',
    steleClr:   'rgba(255,204,242,1)',
    fissureClr: 'rgba(255,204,242,0.28)',
  },
  {
    id: 'sep-left', type: 'sep',
    color: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.85) 50%, transparent 100%)',
  },
  {
    id: 'logo',      type: 'logo',  href: '/',
    bg:         'linear-gradient(170deg, rgba(251,191,36,0.08) 0%, rgba(249,115,22,0.05) 100%)',
    steleClr:   'rgba(251,191,36,1)',
  },
  {
    id: 'sep-right', type: 'sep',
    color: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.85) 50%, transparent 100%)',
  },
  {
    id: 'events',    type: 'link',  label: 'Events',
    href: '/events', isAnchor: false,
    bg:         'linear-gradient(170deg, rgba(151,125,255,0.10) 0%, rgba(6,0,171,0.06) 100%)',
    steleClr:   'rgba(151,125,255,1)',
    fissureClr: 'rgba(151,125,255,0.28)',
  },
  {
    id: 'soumettre', type: 'link',  label: 'Soumettre',
    href: '/soumettre', isAnchor: false,
    bg:         'linear-gradient(170deg, rgba(0,51,255,0.09) 0%, rgba(0,0,61,0.06) 100%)',
    steleClr:   'rgba(0,100,255,1)',
    fissureClr: 'rgba(0,51,255,0.26)',
  },
  {
    id: 'contacter', type: 'link',  label: 'Contacter',
    href: '/contact', isAnchor: false,
    bg:         'linear-gradient(170deg, rgba(6,0,171,0.08) 0%, rgba(0,0,61,0.05) 100%)',
    steleClr:   'rgba(6,0,171,1)',
    fissureClr: null,
  },
];

const NAV_ALL = PANEL_DEFS.filter((d) => d.type === 'link' || d.type === 'logo');

// ─────────────────────────────────────────────────────────────
// COMPOSANT — NavLink : CAPSULE LIQUID GLASS
//
// Structure physique (Images 2 & 3) :
//   ┌─────────────────────────────┐  ← arc spéculaire (shine)
//   │     ░░░░ LABEL ░░░░        │  ← backdrop-filter glass
//   └─────────────────────────────┘  ← rim prismatique (1px)
//           ▿▿▿ shadow ▿▿▿          ← ombre portée 2 couches
//
// Hover — 4 actes GSAP :
//   ① Lift : scale 1→1.07, y 0→-2, shadow approfondie
//   ② Shine : arc spéculaire brightening
//   ③ Aberration + cracks : glitch de verre
//   ④ Sweep holo + underline spectral + lens flare
// ─────────────────────────────────────────────────────────────
const NavLink = ({ item }) => {
  const pillRef  = useRef(null);  // capsule glass
  const shineRef = useRef(null);  // arc spéculaire haut
  const prismRef = useRef(null);  // sweep holographique
  const shardRef = useRef(null);  // underline arc-en-ciel
  const crackRef = useRef(null);  // éclats de verre
  const flareRef = useRef(null);  // lens flare
  const labelRef = useRef(null);  // texte du lien

  const onEnter = useCallback(() => {
    const pill  = pillRef.current;
    const shine = shineRef.current;
    const prism = prismRef.current;
    const shard = shardRef.current;
    const crack = crackRef.current;
    const flare = flareRef.current;
    const label = labelRef.current;
    if (!pill) return;

    gsap.killTweensOf([pill, shine, prism, shard, crack, flare, label]);

    // ── ACTE I : LIFT DE LA CAPSULE ───────────────────────
    gsap.to(pill, {
      scale:     1.07,
      y:         -2,
      boxShadow: LG_SHADOW_HOVER,
      duration:  0.22,
      ease:      'power2.out',
    });

    // ── ACTE II : ARC SPÉCULAIRE ──────────────────────────
    gsap.to(shine, { opacity: 1, duration: 0.18, ease: 'power2.out' });

    // ── ACTE III : ABERRATION CHROMATIQUE + CRACKS ────────
    // Le verre se brise instantanément puis se ressoude
    gsap.timeline()
      .set(label,  { color: '#ffffff' })
      .to(label, {
        textShadow: '-5px 0 rgba(255,20,70,0.90), 5px 0 rgba(20,70,255,0.90)',
        skewX: -9,
        duration: 0.06,
        ease: 'power3.out',
      })
      .to(label, {
        textShadow: '-2px 0 rgba(255,60,100,0.55), 2px 0 rgba(60,100,255,0.55)',
        skewX: 4,
        duration: 0.07,
        ease: 'power2.inOut',
      })
      .to(label, {
        textShadow: '',
        skewX: 0,
        duration: 0.16,
        ease: 'power2.out',
      });

    // Éclats de verre (3 lignes de crack)
    gsap.set(crack, { opacity: 1 });
    gsap.to(crack,  { opacity: 0, duration: 0.40, delay: 0.04, ease: 'power2.in' });

    // ── ACTE IV : SWEEP HOLOGRAPHIQUE + UNDERLINE + FLARE ─
    gsap.fromTo(prism,
      { backgroundPosition: '-320% center', opacity: 0   },
      { backgroundPosition: '320% center',  opacity: 0.95,
        duration: 0.55, ease: 'power2.inOut' }
    );
    gsap.to(prism, { opacity: 0, duration: 0.20, delay: 0.55 });

    gsap.fromTo(shard,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, opacity: 1, duration: 0.24, ease: 'power2.out' }
    );

    gsap.fromTo(flare,
      { scale: 0, opacity: 0 },
      { scale: 1.6, opacity: 1, duration: 0.22, delay: 0.12, ease: 'back.out(3)' }
    );
    gsap.to(flare, { scale: 0, opacity: 0, duration: 0.20, delay: 0.44 });

  }, []);

  const onLeave = useCallback(() => {
    const pill  = pillRef.current;
    const shine = shineRef.current;
    const shard = shardRef.current;
    const label = labelRef.current;
    if (!pill) return;

    gsap.killTweensOf([pill, shine, shard, label]);

    gsap.to(pill, {
      scale:     1,
      y:         0,
      boxShadow: LG_SHADOW_IDLE,
      duration:  0.30,
      ease:      'power2.out',
    });
    gsap.to(shine, { opacity: 0.55, duration: 0.25 });
    gsap.to(label, { color: '', textShadow: '', skewX: 0, duration: 0.20 });
    gsap.to(shard, { scaleX: 0, opacity: 0, duration: 0.14, ease: 'power2.in' });

  }, []);

  const inner = (
    /*
     * Capsule liquid glass
     *   py-1.5 px-3.5 → padding interne équilibré
     *   Le verre a une "épaisseur" simulée par :
     *     - arc spéculaire (shineRef) en haut
     *     - rim prismatique en bas (1px gradient)
     *     - box-shadow stack LG_SHADOW_IDLE
     */
    <div
      ref={pillRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{
        padding:              '6px 14px',
        borderRadius:         '999px',
        background:           [
          'linear-gradient(180deg,',
          '  rgba(255,255,255,0.16) 0%,',
          '  rgba(255,255,255,0.06) 35%,',
          '  rgba(255,255,255,0.03) 65%,',
          '  rgba(255,255,255,0.11) 100%)',
        ].join(''),
        backdropFilter:       'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border:               '0.5px solid rgba(255,255,255,0.22)',
        boxShadow:            LG_SHADOW_IDLE,
        willChange:           'transform, box-shadow',
      }}
    >
      {/*
       * Arc spéculaire haut
       * Simule la courbure de la face supérieure du verre.
       * Fade du centre vers les bords = effet lentille.
       */}
      <div
        ref={shineRef}
        aria-hidden="true"
        className="absolute inset-x-3 top-0 pointer-events-none"
        style={{
          height:       '55%',
          background:   'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)',
          borderRadius: '999px 999px 50% 50%',
          opacity:      0.55,
        }}
      />

      {/*
       * Rim prismatique bas — 1px arc-en-ciel
       * L'arête inférieure du verre disperse la lumière.
       * Palette complète : rose → cyan → violet.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height:       '1px',
          borderRadius: '0 0 999px 999px',
          background:   [
            'linear-gradient(90deg,',
            '  transparent              0%,',
            '  rgba(255,80,180,0.60)    18%,',
            '  rgba(80,200,255,0.65)    38%,',
            '  rgba(255,230,80,0.60)    52%,',
            '  rgba(80,100,255,0.65)    68%,',
            '  rgba(200,80,255,0.60)    82%,',
            '  transparent              100%)',
          ].join(''),
          opacity: 0.80,
        }}
      />

      {/*
       * Sweep holographique (Acte IV)
       * 7 couleurs saturées, backgroundSize 640% pour une passe complète.
       */}
      <div
        ref={prismRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius:       '999px',
          backgroundImage:    [
            'linear-gradient(105deg,',
            '  transparent           0%,',
            '  rgba(255,0,120,0.72)  7%,',
            '  rgba(0,200,255,0.72)  21%,',
            '  rgba(200,0,255,0.72)  35%,',
            '  rgba(255,220,0,0.76)  50%,',
            '  rgba(0,255,150,0.72)  64%,',
            '  rgba(255,80,0,0.68)   78%,',
            '  rgba(0,100,255,0.72)  91%,',
            '  transparent           100%)',
          ].join(''),
          backgroundSize:     '640% 100%',
          backgroundPosition: '-320% center',
          opacity:            0,
          mixBlendMode:       'screen',
        }}
      />

      {/*
       * Éclats de verre (Acte III)
       * 3 lignes diagonales surgissant à l'impact.
       */}
      <div
        ref={crackRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ borderRadius: '999px', opacity: 0 }}
      >
        <span className="absolute" style={{
          top: '30%', left: '8%', width: '40%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.55) 75%, transparent)',
          transform: 'rotate(-20deg)', transformOrigin: '0% 50%',
        }}/>
        <span className="absolute" style={{
          top: '60%', left: '40%', width: '32%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.82) 40%, rgba(255,255,255,0.40) 80%, transparent)',
          transform: 'rotate(28deg)', transformOrigin: '0% 50%',
        }}/>
        <span className="absolute" style={{
          top: '18%', left: '58%', width: '22%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.68) 50%, transparent)',
          transform: 'rotate(-6deg)', transformOrigin: '0% 50%',
        }}/>
      </div>

      {/* Label */}
      <span
        ref={labelRef}
        className="relative z-10 text-[0.63rem] font-bold uppercase tracking-[0.22em] text-white/90 select-none"
        style={{ willChange: 'transform, color, text-shadow' }}
      >
        {item.label}
      </span>

      {/* Underline spectral arc-en-ciel */}
      <span
        ref={shardRef}
        aria-hidden="true"
        className="absolute left-2 right-2 bottom-[-5px] h-[1px] origin-left pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #0033ff 0%, #977dff 18%, #ff00cc 34%, #fff5dc 50%, #fbbf24 64%, #977dff 82%, #0033ff 100%)',
          boxShadow:  '0 0 8px rgba(151,125,255,0.70), 0 0 18px rgba(251,191,36,0.52)',
          transform:  'scaleX(0)',
          opacity:    0,
        }}
      />

      {/* Lens flare */}
      <span
        ref={flareRef}
        aria-hidden="true"
        className="absolute -bottom-1.5 right-1 w-[9px] h-[9px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,245,180,1) 0%, rgba(255,80,200,0.62) 40%, rgba(151,125,255,0.30) 70%, transparent 100%)',
          transform:  'scale(0)',
          opacity:    0,
        }}
      />
    </div>
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

    // ── SOUFFLET : scaleX 0.02 → 1 ────────────────────────
    // Le verre fractal claque en s'ouvrant depuis le centre.
    // power4.out = démarrage ultra-rapide (le claquement),
    // décélération longue et élégante (le déploiement).
    if (pleatWrapRef.current) {
      gsap.from(pleatWrapRef.current, {
        scaleX:          0.02,
        y:               -6,
        opacity:         0.20,
        transformOrigin: 'center center',
        duration:        1.15,
        ease:            'power4.out',
        delay:           0.16,
      });
    }

    // ── PANNEAUX : chute staggerée depuis le centre ────────
    const panels = panelRefs.current.filter(Boolean);
    if (panels.length) {
      gsap.from(panels, {
        y:       -32,
        opacity: 0,
        duration: 0.70,
        stagger:  { each: 0.06, from: 'center' },
        ease:     'power3.out',
        delay:    0.36,
      });
    }

    // ── HEADER + BURGER ────────────────────────────────────
    gsap.from(headerRef.current, {
      opacity: 0, duration: 0.50, ease: 'power2.out', delay: 0.10,
    });
    if (burgerRef.current) {
      gsap.from(burgerRef.current, {
        opacity: 0, x: 12, duration: 0.55, ease: 'power2.out', delay: 0.58,
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
          CSS KEYFRAMES
            holo-drift      : palette en défilement (8s)
            holo-spin       : conic-gradient rotatif (22s)
            scan-line       : scan spéculaire (12s)
            sep-pulse       : séparateurs ambre (4s)
            stele-pulse     : stèles en respiration
            bellows-shimmer : côtes de verre (variation d'éclat)
          ════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes holo-drift {
          0%   { background-position: 0%   50%; opacity: 0.26; }
          35%  { opacity: 0.35; }
          65%  { opacity: 0.30; }
          100% { background-position: 300% 50%; opacity: 0.26; }
        }
        @keyframes holo-spin {
          0%   { transform: rotate(0deg)   scale(3.2); opacity: 0.20; }
          25%  { opacity: 0.30; }
          50%  { opacity: 0.24; }
          75%  { opacity: 0.28; }
          100% { transform: rotate(360deg) scale(3.2); opacity: 0.20; }
        }
        @keyframes scan-line {
          0%   { top: 110%; opacity: 0;    }
          5%   { opacity: 0.28; }
          50%  { top: 35%;  opacity: 0.14; }
          95%  { opacity: 0.07; }
          100% { top: -10%; opacity: 0;    }
        }
        @keyframes sep-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1.00; }
        }
        @keyframes stele-pulse {
          0%, 100% { opacity: 0.70; filter: blur(0.4px); }
          50%      { opacity: 1.00; filter: blur(1.2px);  }
        }
        @keyframes bellows-shimmer {
          0%   { opacity: 0.75; }
          40%  { opacity: 1.00; }
          70%  { opacity: 0.85; }
          100% { opacity: 0.75; }
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
            ? 'border-b border-white/14 shadow-[0_2px_36px_rgba(0,0,0,0.68)]'
            : 'border-b border-white/[0.05]'}
        `}
        style={{
          height:               '64px',
          backdropFilter:       'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          background:           'rgba(0,0,0,0.52)',
          overflow:             'visible',
        }}
      >

        {/* ════════════════════════════════════════════════════
            SYSTÈME 1 — VERRE FRACTAL (40 côtes)
            z-1 : couche de fond, GSAP scaleX depuis centre.
            overflow-hidden : les bords skewés restent dans le cadre.
            ════════════════════════════════════════════════════ */}
        <div
          ref={pleatWrapRef}
          aria-hidden="true"
          className="absolute inset-0 flex items-stretch overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {PLEAT_DEFS.map(({ i, isEven, bg, edgeClr, tR, tG, tB }) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden"
              style={{
                background: bg,
                // Arête de coupure : filet brillant sur chaque face paire
                borderLeft: isEven && edgeClr !== 'transparent'
                  ? `0.5px solid ${edgeClr}`
                  : 'none',
                // Ombre latérale dans les creux
                boxShadow: isEven
                  ? 'none'
                  : [
                      'inset 2px  0 5px rgba(0,0,0,0.24)',
                      'inset -2px 0 5px rgba(0,0,0,0.20)',
                    ].join(', '),
                // Légère coloration de fond au voisinage du pli
                ...(isEven && {
                  animation:      `bellows-shimmer ${3.6 + (i % 6) * 0.35}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.15) % 2.8}s`,
                }),
              }}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            SYSTÈME 2 — PANNEAUX VITRÉS + STÈLES
            z-2 : teinte de section + fissures + stèles décomposées
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
                    animationDelay: `${i * 0.32}s`,
                  }}
                />
              );
            }

            // ── Panneau (link / logo) ─────────────────────
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
                    boxShadow: [
                      'inset 0 1px 0 rgba(255,255,255,0.07)',
                      def.fissureClr
                        ? `inset -1px 0 0 ${def.fissureClr}`
                        : '',
                    ].filter(Boolean).join(', '),
                  }}
                />

                {/*
                 * Stèles décomposées (3 couches)
                 * Chaque couche positionnée en bottom négatif = dépasse.
                 * Les couches arrière sont plus étroites (insetPx) =
                 * illusion de perspective / profondeur physique.
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
                      animation:  `stele-pulse ${4.0 + li * 0.55 + i * 0.18}s ease-in-out infinite`,
                      animationDelay: `${(i * 0.16 + li * 0.22) % 3.2}s`,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════
            SYSTÈME 4 — FILM HOLOGRAPHIQUE INTENSE
            z-3 : 3 couches CSS @keyframes, zéro JS continu.
            ════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 3 }}
        >
          {/* Couche 1 — palette linéaire en défilement */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                'linear-gradient(105deg,',
                '  rgba(242,230,238,0.16)  0%,',
                '  rgba(255,0,150,0.20)    9%,',
                '  rgba(151,125,255,0.26)  23%,',
                '  rgba(0,51,255,0.22)     37%,',
                '  rgba(0,0,61,0.10)       50%,',
                '  rgba(251,191,36,0.18)   57%,',
                '  rgba(255,80,0,0.16)     65%,',
                '  rgba(151,125,255,0.20)  77%,',
                '  rgba(255,204,242,0.18)  89%,',
                '  rgba(242,230,238,0.14)  100%)',
              ].join(''),
              backgroundSize: '300% 100%',
              mixBlendMode:   'screen',
              animation:      'holo-drift 8s linear infinite',
            }}
          />

          {/* Couche 2 — conic-gradient arc-en-ciel rotatif */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset:      '-60%',
              background: [
                'conic-gradient(from 0deg at 50% 50%,',
                '  rgba(255,0,120,0.24)    0deg,',
                '  rgba(255,200,0,0.24)    60deg,',
                '  rgba(0,255,140,0.18)    120deg,',
                '  rgba(0,120,255,0.24)    180deg,',
                '  rgba(200,0,255,0.24)    240deg,',
                '  rgba(255,100,0,0.18)    300deg,',
                '  rgba(255,0,120,0.24)    360deg)',
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
              background:     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 15%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.07) 85%, transparent 100%)',
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
          <nav className="hidden md:flex items-center justify-start h-full gap-2 pl-3"
            aria-label="Navigation gauche">
            <div className="flex items-center justify-center h-full px-2">
              <NavLink item={PANEL_DEFS[0]} />
            </div>
            <div className="flex items-center justify-center h-full px-2">
              <NavLink item={PANEL_DEFS[1]} />
            </div>
          </nav>

          {/* ── Logo centré ── */}
          <div className="flex items-center justify-center gap-2 px-6 md:px-8 h-full">
            <span aria-hidden="true"
              className="hidden md:block text-amber-400/58 text-[0.50rem] select-none leading-none">✦</span>

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
              className="hidden md:block text-amber-400/58 text-[0.50rem] select-none leading-none">✦</span>
          </div>

          {/* ── Nav droite ── */}
          <nav className="hidden md:flex items-center justify-end h-full gap-2 pr-3"
            aria-label="Navigation droite">
            <div className="flex items-center justify-center h-full px-2">
              <NavLink item={PANEL_DEFS[5]} />
            </div>
            <div className="flex items-center justify-center h-full px-2">
              <NavLink item={PANEL_DEFS[6]} />
            </div>
            <div className="flex items-center justify-center h-full px-2">
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
          backdropFilter:       'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <div aria-hidden="true" className="absolute top-[64px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,51,255,0.42) 14%, rgba(151,125,255,0.62) 34%, rgba(251,191,36,0.82) 50%, rgba(151,125,255,0.62) 66%, rgba(0,51,255,0.42) 86%, transparent 100%)' }}
        />

        <div aria-hidden="true" className="absolute pointer-events-none"
          style={{
            inset: '-40%',
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,0,120,0.05), rgba(255,200,0,0.05), rgba(0,150,255,0.05), rgba(200,0,255,0.05), rgba(255,0,120,0.05))',
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
            background: 'linear-gradient(90deg, rgba(0,51,255,0.42), rgba(151,125,255,0.58), rgba(251,191,36,0.72), rgba(151,125,255,0.58), rgba(0,51,255,0.42))',
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