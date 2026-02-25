/**
 * PageTransitionLayer.jsx — MARSAI Festival
 * Phase 8 — Transitions cinématographiques
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE : Système de révélation
 * ═══════════════════════════════════════════════════════════════
 *
 * Principe :
 *   React Router monte la nouvelle page IMMÉDIATEMENT.
 *   Ce système crée un overlay impératif sur document.body
 *   qui MASQUE la nouvelle page, puis la RÉVÈLE avec l'animation.
 *   Résultat : zéro flash, zéro saut, transition totale.
 *
 * Overlays 100% sur document.body :
 *   Jamais dans l'arbre React → immunisé contre tout stacking
 *   context, transform parent, ou z-index concurrent.
 *
 * 5 transitions par route :
 *   '/'          → LAMES DU PROJECTEUR (12 bandes stagger)
 *   '/galerie'   → IRIS PORTAIL (clip-path circulaire)
 *   '/soumettre' → GRAIN DISSOLVE (bruit argentique)
 *   '/contact'   → SPLIT ÉCRAN (haut/bas s'écartent)
 *   default      → SWEEP CINÉMA (balayage latéral)
 *
 * Grain SVG injecté sur chaque transition — cohérence filmic.
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from 'react';
import { useLocation }       from 'react-router-dom';
import gsap                  from 'gsap';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const BG        = '#000000';
const BG_WARM   = '#0a0806';
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Styles communs overlay
const BASE_OV = [
  'position:fixed', 'inset:0', 'z-index:9998', 'pointer-events:none',
].join(';');

// ─────────────────────────────────────────────────────────────
// HELPERS — création d'éléments DOM
// ─────────────────────────────────────────────────────────────
function mkDiv(extra = '') {
  const d = document.createElement('div');
  d.setAttribute('aria-hidden', 'true');
  d.style.cssText = `${BASE_OV};${extra}`;
  document.body.appendChild(d);
  return d;
}

function mkGrain(parent, opacity = 0.045) {
  const g = document.createElement('div');
  g.style.cssText = [
    'position:absolute', 'inset:0', 'pointer-events:none',
    `background-image:${GRAIN_URL}`,
    'background-size:200px 200px',
    `opacity:${opacity}`,
    'mix-blend-mode:overlay',
  ].join(';');
  parent.appendChild(g);
  return g;
}

// ─────────────────────────────────────────────────────────────
// TRANSITIONS
// ─────────────────────────────────────────────────────────────

/**
 * T1 — LAMES DU PROJECTEUR
 * 12 bandes verticales, révélées depuis le centre vers les bords.
 * Alternance transformOrigin top/bottom pour l'organique.
 * Référence : changement de bobine dans une cabine de projection.
 */
function transitionLames(onDone) {
  const N       = 12;
  const W       = 100 / N;
  const strips  = [];
  const wrapper = mkDiv(`background:transparent;overflow:hidden;`);

  for (let i = 0; i < N; i++) {
    const s = document.createElement('div');
    s.style.cssText = [
      'position:absolute', 'top:0', 'bottom:0',
      `left:${i * W}%`, `width:${W + 0.15}%`,
      `background:${i % 3 === 0 ? BG : BG_WARM}`,
      'transform-origin:center top',
    ].join(';');
    mkGrain(s, 0.055);
    wrapper.appendChild(s);
    strips.push(s);
  }

  // Ordre de révélation : depuis le centre vers les bords
  const center = Math.floor(N / 2);
  const order  = Array.from({ length: N }, (_, i) => i).sort(
    (a, b) => Math.abs(a - center) - Math.abs(b - center)
  );

  const tl = gsap.timeline({ onComplete: onDone });

  // Apparition instantanée de l'overlay (masque la nouvelle page)
  gsap.set(strips, { scaleY: 1 });

  // Révélation stagger depuis le centre
  order.forEach((idx, rank) => {
    const origin = idx % 2 === 0 ? 'center top' : 'center bottom';
    gsap.set(strips[idx], { transformOrigin: origin });
    tl.to(strips[idx], {
      scaleY:   0,
      duration: 0.55,
      ease:     'power3.inOut',
    }, rank * 0.042);
  });

  tl.add(() => {
    // Nettoyage léger décalé
    setTimeout(() => wrapper.remove(), 200);
  }, '+=0.05');
}

/**
 * T2 — IRIS PORTAIL
 * clip-path circulaire qui s'ouvre depuis le centre.
 * Évoque l'iris d'une caméra qui s'ouvre sur le monde.
 * Référence directe : portal effect de Slider Revolution.
 */
function transitionIris(onDone) {
  const ov = mkDiv(`background:${BG};`);
  mkGrain(ov, 0.038);

  // Halo central — impression d'une source lumineuse derrière l'iris
  const halo = document.createElement('div');
  halo.style.cssText = [
    'position:absolute',
    'top:50%', 'left:50%',
    'width:60vmax', 'height:60vmax',
    'transform:translate(-50%,-50%)',
    'border-radius:50%',
    `background:radial-gradient(circle, rgba(226,209,195,0.08) 0%,
      rgba(226,209,195,0.03) 40%, transparent 70%)`,
    'pointer-events:none',
  ].join(';');
  ov.appendChild(halo);

  // L'iris est fermé sur la nouvelle page (masque plein)
  gsap.set(ov, { clipPath: 'circle(150% at 50% 50%)' });

  const tl = gsap.timeline({ onComplete: onDone });

  // Phase 1 : contraction légère d'abord → suspense
  tl.to(ov, {
    clipPath:  'circle(55% at 50% 50%)',
    duration:  0.30,
    ease:      'power2.in',
  });

  // Phase 2 : ouverture explosive depuis le centre
  tl.to(ov, {
    clipPath:  'circle(0% at 50% 50%)',
    duration:  0.52,
    ease:      'power3.out',
    onComplete() { ov.remove(); },
  });

  // Halo pulse au moment de l'ouverture
  tl.to(halo, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  }, 0.28);
}

/**
 * T3 — GRAIN DISSOLVE
 * Overlay noir avec grain SVG qui se dissout.
 * Évoque la fin de bobine argentique — granuleux, organique, poétique.
 * Référence : fondu fin de séquence dans un film 16mm.
 */
function transitionGrainDissolve(onDone) {
  const ov = mkDiv(`background:${BG};`);

  // Couche de grain dynamique — plus dense
  const grain1 = mkGrain(ov, 0.18);
  const grain2 = mkGrain(ov, 0.09);

  // Bandes horizontales de scan — artefact pellicule
  const scan = document.createElement('div');
  scan.style.cssText = [
    'position:absolute', 'inset:0', 'pointer-events:none',
    `background:repeating-linear-gradient(
      to bottom,
      transparent 0px, transparent 3px,
      rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px
    )`,
    'opacity:0.4',
  ].join(';');
  ov.appendChild(scan);

  const tl = gsap.timeline({ onComplete: onDone });

  // Scintillement grain avant dissolution
  tl.to([grain1, grain2], {
    opacity:  '+=0.06',
    duration: 0.12,
    yoyo:     true,
    repeat:   3,
    ease:     'none',
  });

  // Dissolution finale — l'image émerge du grain
  tl.to(ov, {
    opacity:  0,
    duration: 0.65,
    ease:     'expo.out',
    onComplete() { ov.remove(); },
  }, '+=0.04');

  tl.to(scan, {
    opacity: 0,
    duration: 0.4,
  }, '-=0.55');
}

/**
 * T4 — SPLIT ÉCRAN
 * Deux demi-écrans s'écartent en sens inverse, révélant la page.
 * Haut part vers le haut, bas vers le bas. Léger décalage temporel.
 * Référence : ouverture de rideau de scène — théâtral et cinématographique.
 */
function transitionSplit(onDone) {
  const top = mkDiv(`
    background:${BG_WARM};
    top:0; bottom:50%; left:0; right:0;
    transform-origin:center top;
  `);
  const bot = mkDiv(`
    background:${BG};
    top:50%; bottom:0; left:0; right:0;
    transform-origin:center bottom;
  `);

  mkGrain(top, 0.05);
  mkGrain(bot, 0.05);

  // Filet central — ligne de rupture
  const line = mkDiv(`
    height:1px;
    background:rgba(226,209,195,0.15);
    top:50%; bottom:auto;
    left:0; right:0;
  `);

  const tl = gsap.timeline({ onComplete: onDone });

  // Léger rapprochement avant l'écartement — tension dramatique
  tl.to(top, { y:  4, duration: 0.12, ease: 'power1.in' })
    .to(bot, { y: -4, duration: 0.12, ease: 'power1.in' }, 0);

  // Écartement — le haut part d'abord
  tl.to(top, {
    y:        '-102%',
    duration:  0.62,
    ease:      'power3.inOut',
  }, 0.08);
  tl.to(bot, {
    y:         '102%',
    duration:  0.62,
    ease:      'power3.inOut',
    onComplete() { top.remove(); bot.remove(); line.remove(); },
  }, 0.08 + 0.035); // 35ms de décalage
}

/**
 * T5 — SWEEP CINÉMA
 * Un sweep latéral avec léger trail — évoque l'avancement d'une pellicule.
 * Dégradé de densité gauche/droite pour l'effet de vitesse.
 * Transition par défaut — élégante, rapide, directionnelle.
 */
function transitionSweep(onDone) {
  const ov = mkDiv(`
    background:linear-gradient(to right, ${BG} 0%, ${BG_WARM} 50%, ${BG} 100%);
    transform-origin:left center;
  `);
  mkGrain(ov, 0.048);

  // Filet lumineux au bord droit — bord de pellicule
  const edge = document.createElement('div');
  edge.style.cssText = [
    'position:absolute', 'top:0', 'right:0', 'bottom:0',
    'width:2px',
    `background:linear-gradient(to bottom,
      transparent 0%, rgba(226,209,195,0.25) 20%,
      rgba(226,209,195,0.45) 50%,
      rgba(226,209,195,0.25) 80%, transparent 100%)`,
  ].join(';');
  ov.appendChild(edge);

  gsap.set(ov, { scaleX: 1, x: 0 });

  const tl = gsap.timeline({ onComplete: onDone });

  // L'overlay quitte vers la gauche — révélation droite→gauche
  tl.to(ov, {
    x:        '-105%',
    duration:  0.62,
    ease:      'power3.inOut',
    onComplete() { ov.remove(); },
  });
}

/**
 * T6 — FLASH ARGENTIQUE  →  route '/'
 * Un éclat de lumière sable explose depuis le centre,
 * comme l'ouverture soudaine d'un obturateur de caméra.
 * Noir absolu → halo sable se dilate → obscurité → page révélée.
 *
 * Trois temps :
 *   Phase 1 : le noir arrive instantanément (présent dès le départ)
 *   Phase 2 : un halo sable grandit depuis le centre (0.28s)
 *   Phase 3 : le halo s'éteint et l'overlay part vers le haut (0.38s)
 * Effet total : 0.66s — vif, organique, mémorable.
 */
function transitionFlashArgentique(onDone) {
  const ov = mkDiv(`background:${BG_WARM};`);
  mkGrain(ov, 0.055);

  // Halo sable — le cœur lumineux qui s'embrase
  const halo = document.createElement('div');
  halo.style.cssText = [
    'position:absolute',
    'top:50%', 'left:50%',
    'width:20px', 'height:20px',
    'transform:translate(-50%,-50%)',
    'border-radius:50%',
    'pointer-events:none',
    `background:radial-gradient(circle,
      rgba(255,253,240,0.95) 0%,
      rgba(226,209,195,0.75) 28%,
      rgba(180,160,130,0.30) 58%,
      transparent 80%)`,
    'opacity:0',
  ].join(';');
  ov.appendChild(halo);

  // Filet de bords de pellicule (horizontal haut + bas)
  ['top:0;height:2px', 'bottom:0;height:2px'].forEach(pos => {
    const r = document.createElement('div');
    r.style.cssText = [
      'position:absolute', 'left:0', 'right:0',
      pos,
      `background:linear-gradient(to right,
        transparent 0%, rgba(226,209,195,0.35) 20%,
        rgba(226,209,195,0.55) 50%,
        rgba(226,209,195,0.35) 80%, transparent 100%)`,
    ].join(';');
    ov.appendChild(r);
  });

  const tl = gsap.timeline({ onComplete: onDone });

  // Phase 2 — embrasement du halo
  tl.to(halo, {
    width:   '180vmax',
    height:  '180vmax',
    opacity: 1,
    duration: 0.28,
    ease:    'power2.out',
  });

  // Phase 3 — extinction + montée de l'overlay
  tl.to(halo, {
    opacity:  0,
    duration: 0.18,
    ease:     'power1.in',
  }, '+=0.04');

  tl.to(ov, {
    y:        '-105%',
    duration:  0.38,
    ease:      'power3.inOut',
    onComplete() { ov.remove(); },
  }, '-=0.10');
}

/**
 * T7 — VOILE DÉCHIQUETÉ  →  route '/contact'
 * Trois bandes horizontales inégales partent dans
 * des directions différentes — comme un rideau de scène
 * déchiré en trois pans qui s'ouvrent de façon organique.
 *
 *   Bande haute  (40% de l'écran) → monte  vers le haut
 *   Bande milieu (32% de l'écran) → glisse vers la droite
 *   Bande basse  (28% de l'écran) → descend vers le bas
 *
 * Stagger 55ms — pas simultané, pas mécanique.
 * Grain plus dense sur la bande du milieu — texture vivante.
 */
function transitionVoileDechiquete(onDone) {
  const BANDS = [
    { top: '0',    height: '41%',  dir: 'y',  val: '-107%', delay: 0,     grain: 0.042 },
    { top: '40%',  height: '33%',  dir: 'x',  val:  '107%', delay: 0.055, grain: 0.065 },
    { top: '72%',  height: '30%',  dir: 'y',  val:  '107%', delay: 0.110, grain: 0.048 },
  ];

  const elements = BANDS.map(({ top, height, grain }) => {
    const band = mkDiv(`
      background:${BG_WARM};
      top:${top}; height:${height};
      left:0; right:0;
      bottom:auto;
    `);
    mkGrain(band, grain);

    // Filet lumineux sable sur le bord bas de chaque bande
    const edge = document.createElement('div');
    edge.style.cssText = [
      'position:absolute', 'bottom:0', 'left:0', 'right:0',
      'height:1px',
      `background:linear-gradient(to right,
        transparent 0%, rgba(226,209,195,0.28) 25%,
        rgba(226,209,195,0.45) 50%,
        rgba(226,209,195,0.28) 75%, transparent 100%)`,
    ].join(';');
    band.appendChild(edge);

    return band;
  });

  const tl = gsap.timeline({ onComplete: onDone });

  BANDS.forEach(({ dir, val, delay }, i) => {
    tl.to(elements[i], {
      [dir]:     val,
      duration:  0.58,
      ease:      'power3.inOut',
      onComplete() { elements[i].remove(); },
    }, delay);
  });
}

// ─────────────────────────────────────────────────────────────
// ROUTEUR DE TRANSITIONS — sélection par pathname
// ─────────────────────────────────────────────────────────────
function runTransition(pathname, onDone) {
  // Scroll to top instantané — la nouvelle page part du sommet
  window.scrollTo({ top: 0, behavior: 'instant' });

  const p = pathname.replace(/\/$/, '') || '/';

  // '/' — Flash argentique : obturateur qui s'ouvre
  if (p === '/') {
    return transitionFlashArgentique(onDone);
  }
  // '/news' '/events' — Lames du projecteur
  if (p === '/news' || p === '/events') {
    return transitionLames(onDone);
  }
  // '/galerie' '/film/:id' — Iris portail
  if (p === '/galerie' || p.startsWith('/film')) {
    return transitionIris(onDone);
  }
  // '/soumettre' — Grain dissolve argentique
  if (p === '/soumettre') {
    return transitionGrainDissolve(onDone);
  }
  // '/contact' — Voile déchiqueté : 3 pans qui s'ouvrent
  if (p === '/contact') {
    return transitionVoileDechiquete(onDone);
  }
  return transitionSweep(onDone);
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function PageTransitionLayer() {
  const location   = useLocation();
  const prevPath   = useRef(null);
  const isFirst    = useRef(true);

  useEffect(() => {
    const current = location.pathname;

    // Pas de transition sur le premier chargement
    if (isFirst.current) {
      isFirst.current = false;
      prevPath.current = current;
      return;
    }

    // Pas de transition si même route
    if (prevPath.current === current) return;
    prevPath.current = current;

    // Lance la transition
    runTransition(current, () => {});

  }, [location.pathname]);

  // Ce composant ne rend rien dans React —
  // tout est impératif sur document.body
  return null;
}