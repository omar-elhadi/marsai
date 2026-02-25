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

// ─────────────────────────────────────────────────────────────
// ROUTEUR DE TRANSITIONS — sélection par pathname
// ─────────────────────────────────────────────────────────────
function runTransition(pathname, onDone) {
  // Scroll to top instantané — la nouvelle page part du sommet
  window.scrollTo({ top: 0, behavior: 'instant' });

  const p = pathname.replace(/\/$/, '') || '/';

  if (p === '/' || p === '/news' || p === '/events') {
    return transitionLames(onDone);
  }
  if (p === '/galerie' || p.startsWith('/film')) {
    return transitionIris(onDone);
  }
  if (p === '/soumettre') {
    return transitionGrainDissolve(onDone);
  }
  if (p === '/contact') {
    return transitionSplit(onDone);
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