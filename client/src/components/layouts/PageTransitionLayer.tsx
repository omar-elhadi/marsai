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
 * 7 transitions par route :
 *   ROUTES.HOME      → FLASH ARGENTIQUE (obturateur qui s'ouvre)
 *   ROUTES.NEWS      → LAMES DU PROJECTEUR (12 bandes stagger)
 *   ROUTES.EVENTS    → LAMES DU PROJECTEUR (12 bandes stagger)
 *   ROUTES.GALERIE   → IRIS PORTAIL (clip-path circulaire)
 *   ROUTES.FILM_BASE → IRIS PORTAIL (film/:id — startsWith)
 *   ROUTES.SOUMETTRE → GRAIN DISSOLVE (bruit argentique)
 *   ROUTES.CONTACT   → VOILE DÉCHIQUETÉ (3 pans qui s'ouvrent)
 *   default          → SWEEP CINÉMA (balayage latéral)
 *
 * Grain SVG injecté sur chaque transition — cohérence filmic.
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ROUTES } from "@/constants/routes";

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const BG = "#000000";
const BG_WARM = "#0a0806";
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Styles communs overlay
const BASE_OV = [
  "position:fixed",
  "inset:0",
  "z-index:9998",
  "pointer-events:none",
].join(";");

// ─── ABORT MÉCANISME — évite l'accumulation d'overlays ───────
// Stocke les éléments DOM et la timeline de la transition en cours.
// killActiveTransition() les détruit avant d'en lancer une nouvelle.
// ─────────────────────────────────────────────────────────────
let activeOverlays: HTMLElement[] = [];
let activeTimeline: gsap.core.Timeline | null = null;

function killActiveTransition() {
  if (activeTimeline) {
    activeTimeline.kill();
    activeTimeline = null;
  }
  activeOverlays.forEach((el) => {
    if (el.parentNode) el.remove();
  });
  activeOverlays = [];
}

function registerElements(...els: HTMLElement[]) {
  activeOverlays.push(...els);
}

function registerTimeline(tl: gsap.core.Timeline) {
  activeTimeline = tl;
}

// ─────────────────────────────────────────────────────────────
// HELPERS — création d'éléments DOM
// ─────────────────────────────────────────────────────────────
function mkDiv(extra = "") {
  const d = document.createElement("div");
  d.setAttribute("aria-hidden", "true");
  d.style.cssText = `${BASE_OV};${extra}`;
  document.body.appendChild(d);
  registerElements(d);
  return d;
}

function mkGrain(parent: HTMLElement, opacity = 0.045) {
  const g = document.createElement("div");
  g.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    `background-image:${GRAIN_URL}`,
    "background-size:200px 200px",
    `opacity:${opacity}`,
    "mix-blend-mode:overlay",
  ].join(";");
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
function transitionLames(onDone: () => void) {
  const N = 12;
  const W = 100 / N;
  const strips: HTMLElement[] = [];
  const wrapper = mkDiv(`background:transparent;overflow:hidden;`);

  for (let i = 0; i < N; i++) {
    const s = document.createElement("div");
    registerElements(s);
    s.style.cssText = [
      "position:absolute",
      "top:0",
      "bottom:0",
      `left:${i * W}%`,
      `width:${W + 0.15}%`,
      `background:${i % 3 === 0 ? BG : BG_WARM}`,
      "transform-origin:center top",
    ].join(";");
    mkGrain(s, 0.055);
    wrapper.appendChild(s);
    strips.push(s);
  }

  // Ordre de révélation : depuis le centre vers les bords
  const center = Math.floor(N / 2);
  const order = Array.from({ length: N }, (_, i) => i).sort(
    (a, b) => Math.abs(a - center) - Math.abs(b - center),
  );

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  gsap.set(strips, { scaleY: 1 });

  order.forEach((idx, rank) => {
    const origin = idx % 2 === 0 ? "center top" : "center bottom";
    gsap.set(strips[idx], { transformOrigin: origin });
    tl.to(
      strips[idx],
      {
        scaleY: 0,
        duration: 0.55,
        ease: "power3.inOut",
      },
      rank * 0.042,
    );
  });

  tl.add(() => {
    setTimeout(() => wrapper.remove(), 200);
  }, "+=0.05");
}

/**
 * T2 — IRIS PORTAIL
 * clip-path circulaire qui s'ouvre depuis le centre.
 * Évoque l'iris d'une caméra qui s'ouvre sur le monde.
 */
function transitionIris(onDone: () => void) {
  const ov = mkDiv(`background:${BG};`);
  mkGrain(ov, 0.038);

  const halo = document.createElement("div");
  registerElements(halo);
  halo.style.cssText = [
    "position:absolute",
    "top:50%",
    "left:50%",
    "width:60vmax",
    "height:60vmax",
    "transform:translate(-50%,-50%)",
    "border-radius:50%",
    `background:radial-gradient(circle, rgba(226,209,195,0.08) 0%,
      rgba(226,209,195,0.03) 40%, transparent 70%)`,
    "pointer-events:none",
  ].join(";");
  ov.appendChild(halo);

  gsap.set(ov, { clipPath: "circle(150% at 50% 50%)" });

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  tl.to(ov, {
    clipPath: "circle(55% at 50% 50%)",
    duration: 0.3,
    ease: "power2.in",
  });

  tl.to(ov, {
    clipPath: "circle(0% at 50% 50%)",
    duration: 0.52,
    ease: "power3.out",
    onComplete() {
      ov.remove();
    },
  });

  tl.to(
    halo,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    },
    0.28,
  );
}

/**
 * T3 — GRAIN DISSOLVE
 * Overlay noir avec grain SVG qui se dissout.
 * Évoque la fin de bobine argentique — granuleux, organique, poétique.
 */
function transitionGrainDissolve(onDone: () => void) {
  const ov = mkDiv(`background:${BG};`);

  const grain1 = mkGrain(ov, 0.18);
  const grain2 = mkGrain(ov, 0.09);

  const scan = document.createElement("div");
  registerElements(scan);
  scan.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    `background:repeating-linear-gradient(
      to bottom,
      transparent 0px, transparent 3px,
      rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px
    )`,
    "opacity:0.4",
  ].join(";");
  ov.appendChild(scan);

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  tl.to([grain1, grain2], {
    opacity: "+=0.06",
    duration: 0.12,
    yoyo: true,
    repeat: 3,
    ease: "none",
  });

  tl.to(
    ov,
    {
      opacity: 0,
      duration: 0.65,
      ease: "expo.out",
      onComplete() {
        ov.remove();
      },
    },
    "+=0.04",
  );

  tl.to(
    scan,
    {
      opacity: 0,
      duration: 0.4,
    },
    "-=0.55",
  );
}

/**
 * T4 — SPLIT ÉCRAN
 * Deux demi-écrans s'écartent en sens inverse, révélant la page.
 */
function transitionSplit(onDone: () => void) {
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

  const line = mkDiv(`
    height:1px;
    background:rgba(226,209,195,0.15);
    top:50%; bottom:auto;
    left:0; right:0;
  `);

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  tl.to(top, { y: 4, duration: 0.12, ease: "power1.in" }).to(
    bot,
    { y: -4, duration: 0.12, ease: "power1.in" },
    0,
  );

  tl.to(
    top,
    {
      y: "-102%",
      duration: 0.62,
      ease: "power3.inOut",
    },
    0.08,
  );
  tl.to(
    bot,
    {
      y: "102%",
      duration: 0.62,
      ease: "power3.inOut",
      onComplete() {
        top.remove();
        bot.remove();
        line.remove();
      },
    },
    0.08 + 0.035,
  );
}

/**
 * T5 — SWEEP CINÉMA
 * Sweep latéral avec léger trail — évoque l'avancement d'une pellicule.
 * Transition par défaut — élégante, rapide, directionnelle.
 */
function transitionSweep(onDone: () => void) {
  const ov = mkDiv(`
    background:linear-gradient(to right, ${BG} 0%, ${BG_WARM} 50%, ${BG} 100%);
    transform-origin:left center;
  `);
  mkGrain(ov, 0.048);

  const edge = document.createElement("div");
  registerElements(edge);
  edge.style.cssText = [
    "position:absolute",
    "top:0",
    "right:0",
    "bottom:0",
    "width:2px",
    `background:linear-gradient(to bottom,
      transparent 0%, rgba(226,209,195,0.25) 20%,
      rgba(226,209,195,0.45) 50%,
      rgba(226,209,195,0.25) 80%, transparent 100%)`,
  ].join(";");
  ov.appendChild(edge);

  gsap.set(ov, { scaleX: 1, x: 0 });

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  tl.to(ov, {
    x: "-105%",
    duration: 0.62,
    ease: "power3.inOut",
    onComplete() {
      ov.remove();
    },
  });
}

/**
 * T6 — FLASH ARGENTIQUE  →  ROUTES.HOME
 * Un éclat de lumière sable explose depuis le centre.
 */
function transitionFlashArgentique(onDone: () => void) {
  const ov = mkDiv(`background:${BG_WARM};`);
  mkGrain(ov, 0.055);

  const halo = document.createElement("div");
  registerElements(halo);
  halo.style.cssText = [
    "position:absolute",
    "top:50%",
    "left:50%",
    "width:20px",
    "height:20px",
    "transform:translate(-50%,-50%)",
    "border-radius:50%",
    "pointer-events:none",
    `background:radial-gradient(circle,
      rgba(255,253,240,0.95) 0%,
      rgba(226,209,195,0.75) 28%,
      rgba(180,160,130,0.30) 58%,
      transparent 80%)`,
    "opacity:0",
  ].join(";");
  ov.appendChild(halo);

  ["top:0;height:2px", "bottom:0;height:2px"].forEach((pos) => {
    const r = document.createElement("div");
    registerElements(r);
    r.style.cssText = [
      "position:absolute",
      "left:0",
      "right:0",
      pos,
      `background:linear-gradient(to right,
        transparent 0%, rgba(226,209,195,0.35) 20%,
        rgba(226,209,195,0.55) 50%,
        rgba(226,209,195,0.35) 80%, transparent 100%)`,
    ].join(";");
    ov.appendChild(r);
  });

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  tl.to(halo, {
    width: "180vmax",
    height: "180vmax",
    opacity: 1,
    duration: 0.28,
    ease: "power2.out",
  });

  tl.to(
    halo,
    {
      opacity: 0,
      duration: 0.18,
      ease: "power1.in",
    },
    "+=0.04",
  );

  tl.to(
    ov,
    {
      y: "-105%",
      duration: 0.38,
      ease: "power3.inOut",
      onComplete() {
        ov.remove();
      },
    },
    "-=0.10",
  );
}

/**
 * T7 — VOILE DÉCHIQUETÉ  →  ROUTES.CONTACT
 * Trois bandes horizontales inégales partent dans des directions différentes.
 */
function transitionVoileDechiquete(onDone: () => void) {
  const BANDS = [
    { top: "0", height: "41%", dir: "y", val: "-107%", delay: 0, grain: 0.042 },
    {
      top: "40%",
      height: "33%",
      dir: "x",
      val: "107%",
      delay: 0.055,
      grain: 0.065,
    },
    {
      top: "72%",
      height: "30%",
      dir: "y",
      val: "107%",
      delay: 0.11,
      grain: 0.048,
    },
  ];

  const elements = BANDS.map(({ top, height, grain }) => {
    const band = mkDiv(`
      background:${BG_WARM};
      top:${top}; height:${height};
      left:0; right:0;
      bottom:auto;
    `);
    mkGrain(band, grain);

    const edge = document.createElement("div");
    registerElements(edge);
    edge.style.cssText = [
      "position:absolute",
      "bottom:0",
      "left:0",
      "right:0",
      "height:1px",
      `background:linear-gradient(to right,
        transparent 0%, rgba(226,209,195,0.28) 25%,
        rgba(226,209,195,0.45) 50%,
        rgba(226,209,195,0.28) 75%, transparent 100%)`,
    ].join(";");
    band.appendChild(edge);

    return band;
  });

  const tl = gsap.timeline({ onComplete: onDone });
  registerTimeline(tl);

  BANDS.forEach(({ dir, val, delay }, i) => {
    tl.to(
      elements[i],
      {
        [dir]: val,
        duration: 0.58,
        ease: "power3.inOut",
        onComplete() {
          elements[i].remove();
        },
      },
      delay,
    );
  });
}

// ─────────────────────────────────────────────────────────────
// ROUTEUR DE TRANSITIONS — sélection par pathname
// Toutes les comparaisons référencent ROUTES — zéro string brute.
// ─────────────────────────────────────────────────────────────
function runTransition(pathname: string, onDone: () => void) {
  // Tue la transition précédente — évite l'accumulation d'overlays
  killActiveTransition();

  // Scroll to top instantané — la nouvelle page part du sommet
  window.scrollTo({ top: 0, behavior: "instant" });

  const p = pathname.replace(/\/$/, "") || "/";

  // ROUTES.HOME — Flash argentique : obturateur qui s'ouvre
  if (p === ROUTES.HOME) {
    return transitionFlashArgentique(onDone);
  }
  // ROUTES.NEWS / ROUTES.EVENTS — Lames du projecteur
  if (p === ROUTES.NEWS || p === ROUTES.EVENTS) {
    return transitionLames(onDone);
  }
  // ROUTES.GALERIE / ROUTES.FILM_BASE — Iris portail
  // FILM_BASE ('/film') utilisé avec startsWith pour couvrir /film/:id
  if (p === ROUTES.GALERIE || p.startsWith(ROUTES.FILM_BASE)) {
    return transitionIris(onDone);
  }
  // ROUTES.SOUMETTRE — Grain dissolve argentique
  if (p === ROUTES.SOUMETTRE) {
    return transitionGrainDissolve(onDone);
  }
  // ROUTES.CONTACT — Voile déchiqueté : 3 pans qui s'ouvrent
  if (p === ROUTES.CONTACT) {
    return transitionVoileDechiquete(onDone);
  }
  // Défaut — Sweep cinéma : balayage latéral
  return transitionSweep(onDone);
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function PageTransitionLayer() {
  const location = useLocation();
  const prevPath = useRef<string | null>(null);
  const isFirst = useRef(true);

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

  // Cleanup au démontage du composant — tue les tweens et enlève les overlays
  useEffect(() => {
    return () => killActiveTransition();
  }, []);

  // Ce composant ne rend rien dans React —
  // tout est impératif sur document.body
  return null;
}
