/**
 * HeroImpact.jsx — MARSAI Festival
 *
 * ═══════════════════════════════════════════════════════════════
 * SÉQUENCE CINÉMATOGRAPHIQUE — 5 PHASES
 * ═══════════════════════════════════════════════════════════════
 *
 * Phase 1 — APPARITION (0.9s)
 *   Titre flou émerge. Fumée thermique dense s'élève des lettres.
 *
 * Phase 2 — TENSION (4 paliers)
 *   Palier 3 : fumée bascule en TUNNEL DE VITESSE — force radiale
 *   centrifuge + stries de vitesse atmosphériques (SmokeSpeedLine).
 *   Nuage épais qui explose vers l'extérieur. Inévitable.
 *
 * Phase 3 — SUPERNOVA
 *   GLOW supernova instantané → nuclear → breathing.
 *   SPEED BURST : 90 lignes radiales anime style, triple passe de blur.
 *   BRASIER : 200 FlameParticles, taille 6–24px, spawn rate GSAP animé
 *             de 0.75 → 0 sur 2.5s (le brasier se dissipe naturellement).
 *   4 ondes de choc volumétriques (7 bandes spectrales).
 *   Aberration chromatique v4 (±100px + skewX + flicker).
 *   Solar Bloom 7 couches.
 *
 * Phase 4 — RÉVÉLATION
 *   Blur dissout, titre cristallise.
 *
 * Phase 5 — POST-NOVA
 *   Nébuleuse CSS + Débris radioactifs verticaux (incitent au scroll).
 */

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

const DEBRIS_COUNT_DESK = 55;
const DEBRIS_COUNT_MOBI = 24;
const SMOKE_COUNT_DESK  = 45;
const SMOKE_COUNT_MOBI  = 22;
const FLAME_COUNT_DESK  = 200;
const FLAME_COUNT_MOBI  = 100;
const SPEED_LINES_COUNT = 90;

const GLOW = {
  dormant:
    '0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
  charge1:
    '0 0 8px rgba(255,255,255,0.30), 0 0 20px rgba(251,191,36,0.20), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
  charge2:
    '0 0 15px rgba(255,255,255,0.70), 0 0 40px rgba(251,191,36,0.40), 0 0 80px rgba(180,83,9,0.20), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
  charge3:
    '0 0 25px rgba(255,255,255,1), 0 0 70px rgba(251,191,36,0.80), 0 0 140px rgba(180,83,9,0.65), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)',
  preimpact:
    '0 0 40px rgba(255,255,255,1), 0 0 100px rgba(251,191,36,1), 0 0 200px rgba(180,83,9,1), 0 0 300px rgba(124,45,18,0.40), 0 0 0px rgba(0,0,0,0)',
  supernova:
    '0 0 60px rgba(255,255,255,1), 0 0 130px rgba(255,255,255,1), 0 0 240px rgba(251,191,36,1), 0 0 400px rgba(251,191,36,0.90), 0 0 580px rgba(180,83,9,0.70)',
  nuclear:
    '0 0 20px rgba(255,255,255,1), 0 0 50px rgba(255,255,255,1), 0 0 100px rgba(251,191,36,1), 0 0 180px rgba(180,83,9,1), 0 0 280px rgba(124,45,18,1)',
  breathing:
    '0 0 10px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1), 0 0 70px rgba(251,191,36,1), 0 0 130px rgba(180,83,9,1), 0 0 200px rgba(124,45,18,0.60)',
};

// ─────────────────────────────────────────────
// COMPOSANT — Solar Bloom 7 couches
// ─────────────────────────────────────────────
const SolarBloom = () => (
  <div
    className="solar-bloom absolute inset-0 flex items-center justify-center pointer-events-none z-[47] opacity-0"
    style={{ mixBlendMode: 'screen' }}
  >
    <div className="s-bloom-1 absolute w-[8vw]   h-[15vh]  bg-white         blur-[8px]   rounded-full opacity-0" />
    <div className="s-bloom-2 absolute w-[25vw]  h-[28vh]  bg-white/90      blur-[20px]  rounded-full opacity-0" />
    <div className="s-bloom-3 absolute w-[50vw]  h-[45vh]  bg-amber-200/70  blur-[40px]  rounded-full opacity-0" />
    <div className="s-bloom-4 absolute w-[80vw]  h-[65vh]  bg-amber-400/45  blur-[65px]  rounded-full opacity-0" />
    <div className="s-bloom-5 absolute w-[110vw] h-[90vh]  bg-orange-500/25 blur-[90px]  rounded-full opacity-0" />
    <div className="s-bloom-6 absolute w-[150vw] h-[120vh] bg-amber-600/15  blur-[110px] rounded-full opacity-0" />
    <div className="s-bloom-7 absolute w-[200vw] h-[200vh] bg-amber-900/8   blur-[140px] rounded-full opacity-0" />
  </div>
);

// ─────────────────────────────────────────────
// COMPOSANT — Nébuleuse résiduelle (CSS)
// ─────────────────────────────────────────────
const NEBULA_CLOUDS = [
  { id: 'n1', w: '55vw', h: '40vh', bg: 'rgba(120,40,180,0.18)',  blur: '80px',  tx: '-20vw', ty:  '-8vh', rot:  15 },
  { id: 'n2', w: '45vw', h: '35vh', bg: 'rgba(30,80,220,0.15)',   blur: '70px',  tx:  '18vw', ty:   '5vh', rot: -20 },
  { id: 'n3', w: '50vw', h: '30vh', bg: 'rgba(200,80,10,0.12)',   blur: '90px',  tx: '-15vw', ty:  '12vh', rot:   8 },
  { id: 'n4', w: '40vw', h: '28vh', bg: 'rgba(0,180,220,0.10)',   blur: '75px',  tx:  '22vw', ty: '-15vh', rot: -12 },
  { id: 'n5', w: '60vw', h: '25vh', bg: 'rgba(180,30,120,0.08)',  blur: '100px', tx:   '0vw', ty: '-20vh', rot:   5 },
  { id: 'n6', w: '70vw', h: '22vh', bg: 'rgba(255,140,0,0.07)',   blur: '110px', tx:   '5vw', ty:  '18vh', rot:  -6 },
];

const Nebula = () => (
  <div className="absolute inset-0 pointer-events-none z-[22] overflow-hidden">
    {NEBULA_CLOUDS.map(({ id, w, h, bg, blur, tx, ty, rot }) => (
      <div
        key={id}
        className={`nebula-${id} absolute opacity-0`}
        style={{
          width:        w,
          height:       h,
          left:         '50%',
          top:          '50%',
          transform:    `translate(-50%,-50%) translate(${tx},${ty}) rotate(${rot}deg)`,
          background:   `radial-gradient(ellipse, ${bg} 0%, transparent 70%)`,
          filter:       `blur(${blur})`,
          mixBlendMode: 'screen',
          borderRadius: '50%',
          willChange:   'transform, opacity',
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// CLASSE — Particule de fumée thermique
// ─────────────────────────────────────────────
class SmokeParticle {
  constructor(cx, cy, titleW, titleH) {
    this.cx     = cx;
    this.cy     = cy;
    this.titleW = titleW;
    this.titleH = titleH;
    this.reset(true);
  }

  reset(initial = false) {
    this.x        = this.cx + (Math.random() * 2 - 1) * this.titleW * 0.46;
    this.y        = this.cy + this.titleH * 0.28 + (Math.random() - 0.5) * 12;
    this.vx       = (Math.random() - 0.5) * 0.5;
    this.vy       = -(0.20 + Math.random() * 0.35);
    this.size     = 8 + Math.random() * 14;
    this.growRate = 0.07 + Math.random() * 0.10;
    this.maxLife  = 120 + Math.random() * 90;
    this.life     = initial ? Math.floor(Math.random() * 80) : 0;
    this.maxOp    = 0.10 + Math.random() * 0.12;
    this.opacity  = initial ? this.maxOp * Math.random() : 0;
    this.perspA   = 1.045 + Math.random() * 0.055;
  }

  update(phase) {
    this.life++;

    if (phase === 'fading') {
      this.opacity = Math.max(0, this.opacity - 0.010);
      this.vy     *= 1.025;
      this.vx     *= 1.015;
      this.size   += this.growRate * 1.5;
      this.x      += this.vx;
      this.y      += this.vy;
      return;
    }

    if (phase === 'perspective') {
      const dx   = this.x - this.cx;
      const dy   = this.y - (this.cy + this.titleH * 0.05);
      const dist = Math.hypot(dx, dy) + 1;
      const frc  = 0.10 * this.perspA;
      this.vx   += (dx / dist) * frc;
      this.vy   += (dy / dist) * frc - 0.04;
      this.size += this.growRate * 6;
      this.opacity = Math.min(this.maxOp * 1.8, this.opacity + 0.003);
    } else {
      this.size += this.growRate;
      const lt   = this.life / this.maxLife;
      if      (lt < 0.12) this.opacity = this.maxOp * (lt / 0.12);
      else if (lt < 0.65) this.opacity = this.maxOp;
      else                this.opacity = this.maxOp * (1 - (lt - 0.65) / 0.35);
    }

    this.x += this.vx;
    this.y += this.vy;
    if (phase === 'rising' && this.life >= this.maxLife) this.reset(false);
  }

  draw(ctx) {
    if (this.opacity < 0.005) return;
    const r   = this.size * 2.8;
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    grd.addColorStop(0,   `rgba(195,175,155,${this.opacity})`);
    grd.addColorStop(0.4, `rgba(155,140,130,${this.opacity * 0.55})`);
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() { return this.opacity < 0.005 && this.life > 30; }
}

// ─────────────────────────────────────────────
// CLASSE — Strie de vitesse dans la fumée
//
// Lignes centrifuges courtes, blanches-grises.
// Spanwées quand phase === 'perspective'.
// Simule le tunnel de vapeur compressée.
// ─────────────────────────────────────────────
class SmokeSpeedLine {
  constructor(cx, cy) {
    this.cx    = cx;
    this.cy    = cy;
    this.angle = Math.random() * Math.PI * 2;
    this.r     = 8 + Math.random() * 30;          // départ proche du centre
    this.len   = 20 + Math.random() * 55;         // longueur de la strie
    this.spd   = 8  + Math.random() * 14;         // vitesse d'expansion
    this.life  = 0;
    this.maxL  = 14 + Math.random() * 10;
    this.w     = 0.4 + Math.random() * 0.8;
    this.op    = 0.20 + Math.random() * 0.25;
  }

  update() { this.r += this.spd; this.life++; }

  draw(ctx) {
    if (this.life >= this.maxL) return;
    const fade = 1 - this.life / this.maxL;
    const x0   = this.cx + Math.cos(this.angle) * this.r;
    const y0   = this.cy + Math.sin(this.angle) * this.r;
    const x1   = this.cx + Math.cos(this.angle) * (this.r + this.len);
    const y1   = this.cy + Math.sin(this.angle) * (this.r + this.len);
    const grd  = ctx.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop(0,   `rgba(210,200,190,0)`);
    grd.addColorStop(0.3, `rgba(210,200,190,${this.op * fade})`);
    grd.addColorStop(1,   'rgba(210,200,190,0)');
    ctx.strokeStyle = grd;
    ctx.lineWidth   = this.w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  isDead() { return this.life >= this.maxL; }
}

// ─────────────────────────────────────────────
// CLASSE — Particule de flamme (BRASIER)
//
// Version puissante : taille 6–24px, vitesse 5–13px/frame.
// Turbulence sinusoïdale avec vx étalé.
// Spawn rate contrôlé par flameSpawnRateRef (GSAP 0.75 → 0).
// Palette blanc-chaud → jaune → orange → rouge.
// ─────────────────────────────────────────────
class FlameParticle {
  constructor(cx, cy, titleW, titleH) {
    this.cx     = cx;
    this.cy     = cy;
    this.titleW = titleW;
    this.titleH = titleH;
    this.alive  = false;
    this.reset();
  }

  reset() {
    // Spawn sur toute la largeur du titre, pas juste le bas
    this.x       = this.cx + (Math.random() * 2 - 1) * this.titleW * 0.46;
    this.y       = this.cy + this.titleH * 0.25 + (Math.random() - 0.5) * this.titleH * 0.5;
    this.vx      = (Math.random() - 0.5) * 5.0;
    this.vy      = -(5.0 + Math.random() * 8.0);
    this.turbF   = 0.10 + Math.random() * 0.20;
    this.turbA   = 0.8  + Math.random() * 1.5;
    this.size    = 6.0  + Math.random() * 18.0;
    this.maxLife = 35   + Math.random() * 55;
    this.life    = Math.random() * 10;
    this.alive   = true;
  }

  update() {
    if (!this.alive) return;
    this.life++;
    if (this.life >= this.maxLife) { this.alive = false; return; }
    this.vx   += Math.sin(this.life * this.turbF) * this.turbA * 0.08;
    this.vy   *= 0.986;
    this.x    += this.vx;
    this.y    += this.vy;
    this.size *= 0.976;
  }

  draw(ctx) {
    if (!this.alive || this.size < 0.5) return;
    const lt      = this.life / this.maxLife;
    // Opacité : plein peak jusqu'à 40% de la vie, puis décroît
    const opacity = lt < 0.4 ? 0.95 : Math.max(0, 0.95 * (1 - (lt - 0.4) / 0.6));
    let   cr, cg, cb;
    if      (lt < 0.18) { cr = 255; cg = 255; cb = Math.floor(220 * (1 - lt / 0.18)); }
    else if (lt < 0.45) { cr = 255; cg = Math.floor(255 - 165 * ((lt - 0.18) / 0.27)); cb = 0; }
    else if (lt < 0.75) { cr = 255; cg = Math.floor(90  - 75  * ((lt - 0.45) / 0.30)); cb = 0; }
    else                { cr = Math.floor(255 * (1 - (lt - 0.75) / 0.25)); cg = 0; cb = 0; }

    // Halo large
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.8);
    grd.addColorStop(0,   `rgba(${cr},${cg},${cb},${opacity})`);
    grd.addColorStop(0.35,`rgba(${cr},${cg},${cb},${opacity * 0.30})`);
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Noyau brillant
    ctx.globalAlpha = opacity;
    ctx.fillStyle   = `rgb(${cr},${cg},${cb})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────────────
// CLASSE — Anneau de choc volumétrique (7 bandes)
// ─────────────────────────────────────────────
class ShockRing {
  constructor(W, H, cx, cy, delayFrames, ringIndex) {
    this.maxR      = Math.sqrt(W * W + H * H) * 0.60;
    this.cx        = cx;
    this.cy        = cy;
    this.r         = 0;
    this.speed     = 2.5 + ringIndex * 0.4 + Math.random() * 1.5;
    this.alive     = false;
    this.wait      = delayFrames;
    this.age       = 0;
    this.ringIndex = ringIndex;
    this.intensity = 1 - ringIndex * 0.18;
  }

  update() {
    if (!this.alive) {
      if (++this.age >= this.wait) this.alive = true;
      return;
    }
    this.speed *= 1.0025;
    this.r     += this.speed;
  }

  draw(ctx) {
    if (!this.alive || this.r > this.maxR) return;
    const p     = this.r / this.maxR;
    const alpha = Math.max(0, Math.pow(1 - p, 1.3)) * this.intensity;
    if (alpha < 0.005) return;

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,200,140,${alpha * 0.06})`;
    ctx.lineWidth   = Math.max(5, 55 * (1 - p));
    ctx.stroke();

    const bands = [
      { dr: -6, ar: 0.10, cr:  30, cg:  90, cb: 255 },
      { dr: -4, ar: 0.28, cr: 100, cg: 170, cb: 255 },
      { dr: -2, ar: 0.55, cr: 200, cg: 230, cb: 255 },
      { dr:  0, ar: 1.00, cr: 255, cg: 255, cb: 255 },
      { dr:  2, ar: 0.65, cr: 255, cg: 225, cb: 170 },
      { dr:  4, ar: 0.32, cr: 255, cg: 165, cb:  55 },
      { dr:  6, ar: 0.14, cr: 255, cg: 100, cb:  15 },
    ];

    bands.forEach(({ dr, ar, cr, cg, cb }) => {
      const rv = this.r + dr;
      if (rv < 0) return;
      const baseW = this.ringIndex === 0 ? 3.0 : 2.2;
      const lw    = Math.max(0.3, (baseW - Math.abs(dr) * 0.35) * (1 - p * 0.5));
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, rv, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * ar})`;
      ctx.lineWidth   = lw;
      ctx.stroke();
    });

    if (this.r < 40) {
      const bf = Math.max(0, 1 - this.r / 40);
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${bf * 0.35})`;
      ctx.fill();
    }
  }

  isDead() { return this.r > this.maxR; }
}

// ─────────────────────────────────────────────
// CLASSE — Speed Burst (lignes de vitesse anime)
//
// 90 lignes radiales depuis le centre de l'explosion.
// Dessinées en 3 passes superposées :
//   ① large + transparent (halo de motion blur)
//   ② moyen + semi-opaque
//   ③ fin + brillant (core)
// Disparaissent en 15–25 frames — one-shot percutant.
// ─────────────────────────────────────────────
class SpeedLine {
  constructor(cx, cy, W, H) {
    this.cx    = cx;
    this.cy    = cy;
    this.angle = Math.random() * Math.PI * 2;
    // Chaque ligne a une vitesse propre → profondeur perçue
    this.speed = 35 + Math.random() * 55;
    this.r     = 5  + Math.random() * 20;          // rayon de départ
    this.maxR  = Math.sqrt(W * W + H * H) * 0.55;
    // Longueur de traîne : proportionnelle à la vitesse → blur optique
    this.trail = this.speed * (2.0 + Math.random() * 2.5);
    this.w     = 0.5 + Math.random() * 2.2;
    this.op    = 0.55 + Math.random() * 0.45;
    this.life  = 0;
    this.maxL  = Math.floor(12 + Math.random() * 14);
    this.alive = true;
  }

  update() {
    this.r    += this.speed;
    this.speed *= 1.04;   // accélération — l'onde gagne en vitesse
    this.life++;
    if (this.r > this.maxR || this.life >= this.maxL) this.alive = false;
  }

  draw(ctx) {
    if (!this.alive) return;
    const fade = Math.max(0, 1 - this.life / this.maxL);
    const r0   = Math.max(0, this.r - this.trail);
    const x0   = this.cx + Math.cos(this.angle) * r0;
    const y0   = this.cy + Math.sin(this.angle) * r0;
    const x1   = this.cx + Math.cos(this.angle) * this.r;
    const y1   = this.cy + Math.sin(this.angle) * this.r;

    // ① Motion blur halo — large, transparent
    ctx.strokeStyle = `rgba(255,230,180,${fade * this.op * 0.18})`;
    ctx.lineWidth   = this.w * 6;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // ② Corps semi-opaque — couleur blanc-ambre
    const grd = ctx.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop(0,   `rgba(255,220,160,0)`);
    grd.addColorStop(0.25,`rgba(255,240,200,${fade * this.op * 0.55})`);
    grd.addColorStop(1,   `rgba(255,255,255,${fade * this.op * 0.85})`);
    ctx.strokeStyle = grd;
    ctx.lineWidth   = this.w * 2.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // ③ Core — fin et brillant
    ctx.strokeStyle = `rgba(255,255,255,${fade * this.op})`;
    ctx.lineWidth   = this.w * 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
}

// ─────────────────────────────────────────────
// CLASSE — Débris radioactif (chute VERTICALE)
//
// Trajectoire ~verticale avec léger drift horizontal.
// Spawn en haut sur toute la largeur.
// Traîne pointant vers le HAUT (opposé à la chute).
// Invite naturellement au scroll.
// ─────────────────────────────────────────────
class RadioactiveDebris {
  constructor(W, H) {
    this.W = W;
    this.H = H;
    this.respawn(true);
  }

  respawn(initial = false) {
    this.x       = Math.random() * this.W;
    this.y       = initial ? -Math.random() * this.H * 0.8 : -15 - Math.random() * 60;
    // Presque vertical — léger drift aléatoire
    this.vx      = (Math.random() - 0.5) * 0.5;
    this.vy      = 1.6 + Math.random() * 2.8;
    this.size    = 0.6 + Math.random() * 2.0;
    this.isBig   = this.size > 1.4;
    // Traîne proportionnelle à la vitesse verticale
    this.tailLen = this.vy * (8 + Math.random() * 14);
    const pal    = [
      [255, 230, 140], [255, 210, 100], [220, 255, 180],
      [180, 255, 200], [255, 255, 200], [200, 255, 220],
    ];
    const c      = pal[Math.floor(Math.random() * pal.length)];
    this.r       = c[0];
    this.g       = c[1];
    this.b       = c[2];
    this.maxOp   = 0.22 + Math.random() * 0.38;
    this.opacity = 0;
    this.frame   = 0;
  }

  update() {
    this.frame++;
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > this.H + 20) { this.respawn(); return; }
    this.opacity = Math.min(1, this.frame / 30) * this.maxOp;
  }

  draw(ctx) {
    if (this.opacity < 0.01) return;

    // Traîne vers le HAUT (tail = position précédente, donc y - tailLen)
    const tx  = this.x - this.vx * (this.tailLen / this.vy); // en proportion
    const ty  = this.y - this.tailLen;

    const grd = ctx.createLinearGradient(tx, ty, this.x, this.y);
    grd.addColorStop(0,   'rgba(0,0,0,0)');
    grd.addColorStop(0.4, `rgba(${this.r},${this.g},${this.b},${this.opacity * 0.35})`);
    grd.addColorStop(1,   `rgba(${this.r},${this.g},${this.b},${this.opacity})`);
    ctx.strokeStyle = grd;
    ctx.lineWidth   = this.size * 0.55;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // Halo tête pour les grands débris
    if (this.isBig) {
      const g2 = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3.5);
      g2.addColorStop(0,   `rgba(${this.r},${this.g},${this.b},${this.opacity * 0.9})`);
      g2.addColorStop(0.5, `rgba(${this.r},${this.g},${this.b},${this.opacity * 0.25})`);
      g2.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = this.opacity;
    ctx.fillStyle   = `rgb(${this.r},${this.g},${this.b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────────────
// Composants Canvas
// ─────────────────────────────────────────────
const SmokeCanvas = ({ canvasRef }) => (
  <canvas
    ref={canvasRef}
    className="absolute inset-0 pointer-events-none z-[32]"
    style={{ mixBlendMode: 'normal' }}
  />
);

const PostNovaCanvas = ({ canvasRef }) => (
  <canvas
    ref={canvasRef}
    className="absolute inset-0 pointer-events-none z-[24]"
    style={{ mixBlendMode: 'screen' }}
  />
);

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function HeroImpact() {
  const containerRef           = useRef(null);
  const marsaiWrapperRef       = useRef(null);
  const marsaiGlowRef          = useRef(null);
  const marsaiInternalLightRef = useRef(null);
  const plasmaRef              = useRef(null);
  const subtitleRef            = useRef(null);
  const smokeCanvasRef         = useRef(null);
  const novaCanvasRef          = useRef(null);
  const caRedRef               = useRef(null);
  const caBlueRef              = useRef(null);

  const smokeRafRef       = useRef(null);
  const novaRafRef        = useRef(null);
  const smokePhaseRef     = useRef('idle');
  const flamesActiveRef   = useRef(false);
  const flameSpawnRateRef = useRef(0);   // animé par GSAP 0.75 → 0
  const ringsActiveRef    = useRef(false);
  const speedBurstActive  = useRef(false);
  const debrisActiveRef   = useRef(false);
  const smokeEngineOn     = useRef(false);
  const novaEngineOn      = useRef(false);

  const isMobile = useCallback(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );

  // ── MOTEUR FUMÉE + FLAMMES + STRIES ──────────────────────
  const startSmokeEngine = useCallback((W, H, cx, cy, titleW, titleH) => {
    if (smokeEngineOn.current) return;
    smokeEngineOn.current = true;

    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const mobile = isMobile();

    const smokes = Array.from(
      { length: mobile ? SMOKE_COUNT_MOBI : SMOKE_COUNT_DESK },
      () => new SmokeParticle(cx, cy, titleW, titleH)
    );
    const flames = Array.from(
      { length: mobile ? FLAME_COUNT_MOBI : FLAME_COUNT_DESK },
      () => new FlameParticle(cx, cy, titleW, titleH)
    );
    flames.forEach((f) => { f.alive = false; });

    // Pool de stries de fumée (recyclé)
    const smokeLines = [];
    let   lineTimer  = 0;

    const render = () => {
      smokeRafRef.current = requestAnimationFrame(render);
      ctx.clearRect(0, 0, W, H);

      const phase = smokePhaseRef.current;
      if (phase === 'idle') return;

      // ── Fumée
      ctx.globalCompositeOperation = 'source-over';
      smokes.forEach((s) => {
        s.update(phase);
        if (!s.isDead()) s.draw(ctx);
        else if (phase === 'rising' || phase === 'perspective') s.reset(false);
      });

      // ── Stries de vitesse en mode perspective
      if (phase === 'perspective') {
        lineTimer++;
        if (lineTimer % 5 === 0) {
          // Spawn un batch de 6 nouvelles stries
          for (let i = 0; i < 6; i++) smokeLines.push(new SmokeSpeedLine(cx, cy));
        }
        ctx.globalCompositeOperation = 'source-over';
        for (let i = smokeLines.length - 1; i >= 0; i--) {
          smokeLines[i].update();
          smokeLines[i].draw(ctx);
          if (smokeLines[i].isDead()) smokeLines.splice(i, 1);
        }
      }

      // ── Flammes
      if (flamesActiveRef.current) {
        ctx.globalCompositeOperation = 'screen';
        const rate = flameSpawnRateRef.current;
        flames.forEach((f) => {
          if (!f.alive) {
            if (rate > 0.01 && Math.random() < rate) f.reset();
            return;
          }
          f.update();
          f.draw(ctx);
        });
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    render();
  }, [isMobile]);

  // ── MOTEUR POST-NOVA (speed burst + anneaux + débris) ────
  const startNovaEngine = useCallback((W, H) => {
    if (novaEngineOn.current) return;
    novaEngineOn.current = true;

    const canvas = novaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx  = W * 0.5;
    const cy  = H * 0.5;

    const rings = [
      new ShockRing(W, H, cx, cy,  0, 0),
      new ShockRing(W, H, cx, cy, 22, 1),
      new ShockRing(W, H, cx, cy, 45, 2),
      new ShockRing(W, H, cx, cy, 68, 3),
    ];

    // Speed lines — créées une seule fois (one-shot burst)
    const speedLines = Array.from(
      { length: SPEED_LINES_COUNT },
      () => new SpeedLine(cx, cy, W, H)
    );

    const dCnt   = isMobile() ? DEBRIS_COUNT_MOBI : DEBRIS_COUNT_DESK;
    const debris = Array.from({ length: dCnt }, () => new RadioactiveDebris(W, H));

    let t = 0;

    const render = () => {
      novaRafRef.current = requestAnimationFrame(render);
      t++;
      ctx.fillStyle = 'rgba(0,0,0,0.13)';
      ctx.fillRect(0, 0, W, H);

      // ── Speed Burst anime (one-shot, ~25 frames)
      if (speedBurstActive.current) {
        ctx.save();
        ctx.lineCap = 'round';
        speedLines.forEach((sl) => {
          sl.update();
          sl.draw(ctx);
        });
        ctx.restore();
        // Désactiver une fois que toutes les lignes sont mortes
        if (speedLines.every((sl) => !sl.alive)) speedBurstActive.current = false;
      }

      // ── Anneaux
      if (ringsActiveRef.current) {
        ctx.save();
        ctx.lineCap = 'round';
        rings.forEach((ring) => { ring.update(); ring.draw(ctx); });
        ctx.restore();
      }

      // ── Débris verticaux — passe halos
      if (debrisActiveRef.current) {
        debris.forEach((d) => {
          d.update();
          if (d.opacity < 0.01 || !d.isBig) return;
          const hR  = d.size * 3.5;
          const g2  = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, hR);
          g2.addColorStop(0,   `rgba(${d.r},${d.g},${d.b},${d.opacity * 0.4})`);
          g2.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(d.x, d.y, hR, 0, Math.PI * 2);
          ctx.fill();
        });
        // Passe traînes + noyaux
        debris.forEach((d) => {
          if (d.opacity < 0.01) return;
          d.draw(ctx);
        });
      }
    };

    render();
  }, [isMobile]);

  // ── RESIZE ───────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const cont = containerRef.current;
      if (!cont || smokeEngineOn.current) return;
      [smokeCanvasRef, novaCanvasRef].forEach((ref) => {
        if (ref.current) {
          ref.current.width  = cont.offsetWidth;
          ref.current.height = cont.offsetHeight;
        }
      });
    };
    const ro = new ResizeObserver(onResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      if (smokeRafRef.current) cancelAnimationFrame(smokeRafRef.current);
      if (novaRafRef.current)  cancelAnimationFrame(novaRafRef.current);
      smokeEngineOn.current = false;
      novaEngineOn.current  = false;
    };
  }, []);

  // ── GSAP ─────────────────────────────────────────────────
  useGSAP(() => {
    gsap.set(containerRef.current, { visibility: 'visible' });
    const W      = containerRef.current.offsetWidth;
    const H      = containerRef.current.offsetHeight;
    const titleW = W * 0.82;
    const titleH = H * 0.20;
    const cx     = W * 0.5;
    const cy     = H * 0.5;

    [smokeCanvasRef, novaCanvasRef].forEach((ref) => {
      if (ref.current) { ref.current.width = W; ref.current.height = H; }
    });

    gsap.set(marsaiWrapperRef.current, { scale: 1.12, opacity: 0, filter: 'blur(28px)', x: 0, y: 0 });
    gsap.set(marsaiGlowRef.current,    { textShadow: GLOW.dormant });
    gsap.set(plasmaRef.current,        { opacity: 0, scale: 1.05, filter: 'blur(20px)' });
    gsap.set(smokeCanvasRef.current,   { opacity: 0 });
    gsap.set(novaCanvasRef.current,    { opacity: 0 });
    gsap.set('.solar-bloom',           { opacity: 0 });
    gsap.set('[class*="s-bloom-"]',    { opacity: 0 });
    NEBULA_CLOUDS.forEach(({ id }) => gsap.set(`.nebula-${id}`, { opacity: 0 }));
    gsap.set([caRedRef.current, caBlueRef.current], { opacity: 0, x: 0, y: 0, skewX: 0 });

    const tl = gsap.timeline({ delay: 0.6 });

    // ─ Phase 1 : Apparition ──────────────────────────────────
    tl.addLabel('apparition');
    tl.to(marsaiWrapperRef.current, {
      opacity: 1, scale: 1.06, duration: 0.9, ease: 'power2.out',
    }, 'apparition');
    tl.to(smokeCanvasRef.current, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
    }, 'apparition+=0.2');

    // ─ Phase 2 : Tension ─────────────────────────────────────
    tl.addLabel('tension', 'apparition+=0.9');
    tl.to(marsaiWrapperRef.current, {
      filter: 'blur(22px)', scale: 1.04, duration: 2.2, ease: 'power1.inOut',
    }, 'tension');

    // Palier 1
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge1, duration: 0.4, ease: 'power1.out' }, 'tension+=0.2');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x:  4, y: -2,  duration: 0.08 }, { x: -3, y:  1.5, duration: 0.09 },
        { x:  2, y: -1,  duration: 0.10 }, { x: -1, y:  0.5, duration: 0.11 },
        { x:  0, y:  0,  duration: 0.14, ease: 'power2.out' },
      ],
    }, 'tension+=0.3');

    // Palier 2
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge2, duration: 0.35, ease: 'power2.out' }, 'tension+=0.8');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x: -7, y:  3,   duration: 0.06 }, { x:  5, y: -2.5, duration: 0.07 },
        { x: -3, y:  1.5, duration: 0.08 }, { x:  2, y: -1,   duration: 0.09 },
        { x: -1, y:  0.5, duration: 0.10 }, { x:  0, y:  0,   duration: 0.15, ease: 'power2.out' },
      ],
    }, 'tension+=0.9');

    // Palier 3
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge3, duration: 0.30, ease: 'power3.out' }, 'tension+=1.35');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x:  12, y: -5,   duration: 0.040 }, { x:  -9, y:  4,   duration: 0.045 },
        { x:   7, y: -3,   duration: 0.050 }, { x:  -5, y:  2,   duration: 0.055 },
        { x:   3, y: -1.5, duration: 0.060 }, { x:  -2, y:  1,   duration: 0.070 },
        { x:   1, y: -0.5, duration: 0.080 }, { x:   0, y:  0,   duration: 0.16, ease: 'power2.out' },
      ],
    }, 'tension+=1.4');

    // Palier 4
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.preimpact, duration: 0.2, ease: 'power4.in' }, 'tension+=1.82');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x: -18, y:  8,   duration: 0.030 }, { x:  14, y: -6,   duration: 0.032 },
        { x: -11, y:  5,   duration: 0.035 }, { x:   8, y: -4,   duration: 0.040 },
        { x:  -6, y:  3,   duration: 0.045 }, { x:   4, y: -2,   duration: 0.050 },
        { x:  -2, y:  1,   duration: 0.060 }, { x:   1, y: -0.5, duration: 0.070 },
        { x:   0, y:  0,   duration: 0.18, ease: 'power2.out' },
      ],
    }, 'tension+=1.78');

    // ─ Phase 3 : Supernova ───────────────────────────────────
    tl.addLabel('impact', 'tension+=2.1');

    tl.to(containerRef.current, {
      keyframes: [
        { x: -25, duration: 0.055 }, { x:  20, duration: 0.055 },
        { x: -15, duration: 0.060 }, { x:  11, duration: 0.065 },
        { x:  -7, duration: 0.070 }, { x:   4, duration: 0.080 },
        { x:  -2, duration: 0.090 }, { x:   0, duration: 0.18, ease: 'power2.out' },
      ],
    }, 'impact');

    tl.to(marsaiGlowRef.current, { textShadow: GLOW.supernova, duration: 0.06, ease: 'expo.out' }, 'impact');
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.nuclear,   duration: 1.0,  ease: 'power2.out' }, 'impact+=0.35');

    tl.to(novaCanvasRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 'impact+=0.04');

    // Solar Bloom
    tl.to('.solar-bloom', { opacity: 1, duration: 0.03 }, 'impact');
    tl.to('.s-bloom-1',   { opacity: 1, duration: 0.15, ease: 'expo.out'   }, 'impact');
    tl.to('.s-bloom-2',   { opacity: 1, duration: 0.22, ease: 'power3.out' }, 'impact+=0.03');
    tl.to('.s-bloom-3',   { opacity: 1, duration: 0.30, ease: 'power2.out' }, 'impact+=0.06');
    tl.to('.s-bloom-4',   { opacity: 1, duration: 0.40, ease: 'power2.out' }, 'impact+=0.10');
    tl.to('.s-bloom-5',   { opacity: 1, duration: 0.50, ease: 'power1.out' }, 'impact+=0.14');
    tl.to('.s-bloom-6',   { opacity: 1, duration: 0.65, ease: 'power1.out' }, 'impact+=0.18');
    tl.to('.s-bloom-7',   { opacity: 1, duration: 0.80, ease: 'sine.out'   }, 'impact+=0.22');
    tl.to('.s-bloom-1',   { opacity: 0, duration: 0.8,  ease: 'power2.in' }, 'impact+=0.35');
    tl.to('.s-bloom-2',   { opacity: 0, duration: 1.0,  ease: 'power2.in' }, 'impact+=0.45');
    tl.to('.s-bloom-3',   { opacity: 0, duration: 1.4,  ease: 'power1.in' }, 'impact+=0.55');
    tl.to('.s-bloom-4',   { opacity: 0, duration: 1.8,  ease: 'power1.in' }, 'impact+=0.65');
    tl.to('.s-bloom-5',   { opacity: 0, duration: 2.2,  ease: 'sine.in'   }, 'impact+=0.80');
    tl.to('.s-bloom-6',   { opacity: 0, duration: 2.8,  ease: 'sine.in'   }, 'impact+=0.95');
    tl.to('.s-bloom-7',   { opacity: 0, duration: 3.5,  ease: 'sine.in'   }, 'impact+=1.10');
    tl.to('.solar-bloom', { opacity: 0, duration: 0.1                      }, 'impact+=4.5');

    // ── Aberration chromatique v4 ─────────────────────────────
    tl.set([caRedRef.current, caBlueRef.current], { x: 0, y: 0, skewX: 0, opacity: 0 }, 'impact');

    tl.to(caRedRef.current,  { x: -100, y: -16, skewX: -4, opacity: 1.0, duration: 0.055, ease: 'expo.out' }, 'impact');
    tl.to(caBlueRef.current, { x:  100, y:  16, skewX:  4, opacity: 1.0, duration: 0.055, ease: 'expo.out' }, 'impact');

    tl.to(caRedRef.current, {
      keyframes: [
        { x: -100, y: -16, skewX: -4, opacity: 1.0,  duration: 0.000 },
        { x:  -76, y:   7, skewX: -3, opacity: 0.50, duration: 0.065 },
        { x:  -88, y: -10, skewX: -3, opacity: 0.95, duration: 0.055 },
        { x:  -62, y:   5, skewX: -2, opacity: 0.55, duration: 0.070 },
        { x:  -74, y:  -8, skewX: -2, opacity: 0.90, duration: 0.060 },
        { x:  -52, y:   4, skewX: -1, opacity: 0.60, duration: 0.075 },
        { x:  -62, y:  -6, skewX: -1, opacity: 0.85, duration: 0.065 },
        { x:  -42, y:   3, skewX:  0, opacity: 0.65, duration: 0.080 },
        { x:  -50, y:  -5, skewX:  0, opacity: 0.80, duration: 0.070 },
        { x:  -30, y:   2, skewX:  0, opacity: 0.70, duration: 0.090 },
        { x:  -36, y:  -4, skewX:  0, opacity: 0.75, duration: 0.080 },
        { x:  -18, y:   1, skewX:  0, opacity: 0.55, duration: 0.095 },
      ],
    }, 'impact+=0.055');

    tl.to(caBlueRef.current, {
      keyframes: [
        { x:  100, y:  16, skewX: 4, opacity: 1.0,  duration: 0.000 },
        { x:   80, y:  -6, skewX: 3, opacity: 0.55, duration: 0.080 },
        { x:   92, y:   9, skewX: 3, opacity: 0.92, duration: 0.065 },
        { x:   70, y:  -5, skewX: 2, opacity: 0.60, duration: 0.085 },
        { x:   82, y:   7, skewX: 2, opacity: 0.88, duration: 0.070 },
        { x:   60, y:  -5, skewX: 1, opacity: 0.65, duration: 0.090 },
        { x:   70, y:   6, skewX: 1, opacity: 0.84, duration: 0.075 },
        { x:   50, y:  -4, skewX: 0, opacity: 0.70, duration: 0.095 },
        { x:   58, y:   5, skewX: 0, opacity: 0.80, duration: 0.080 },
        { x:   38, y:  -3, skewX: 0, opacity: 0.72, duration: 0.100 },
        { x:   44, y:   3, skewX: 0, opacity: 0.76, duration: 0.085 },
        { x:   24, y:  -2, skewX: 0, opacity: 0.58, duration: 0.110 },
      ],
    }, 'impact+=0.055');

    tl.to(caRedRef.current,  { x: 0, y: 0, skewX: 0, opacity: 0, duration: 1.05, ease: 'power3.inOut' }, 'impact+=1.30');
    tl.to(caBlueRef.current, { x: 0, y: 0, skewX: 0, opacity: 0, duration: 1.05, ease: 'power3.inOut' }, 'impact+=1.30');

    // ─ Phase 4 : Révélation ──────────────────────────────────
    tl.to(marsaiWrapperRef.current, {
      opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(22px)',
      duration: 0.25, ease: 'power2.out',
    }, 'impact+=0.18');
    tl.to(marsaiWrapperRef.current, {
      filter: 'blur(0px)', duration: 1.8, ease: 'power2.out',
    }, 'impact+=0.42');
    tl.fromTo(plasmaRef.current,
      { opacity: 0, scale: 1,    filter: 'blur(15px)' },
      { opacity: 1, scale: 1.06, filter: 'blur(45px)', duration: 0.6, ease: 'expo.out' },
      'impact+=0.22'
    );
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0,  duration: 1.4, ease: 'power2.out' },
      'impact+=1.6'
    );

    // ─ Phase 5 : Post-nova ───────────────────────────────────
    const ORGANIC   = tl.totalDuration() + 0.1;
    const delay     = tl.delay();
    const impactAt  = tl.labels['impact'] + delay;
    const tensionAt = tl.labels['tension'] + delay;

    // Fumée — départ avec le titre
    gsap.delayedCall(delay + 0.3, () => {
      startSmokeEngine(W, H, cx, cy, titleW, titleH);
      smokePhaseRef.current = 'rising';
    });

    // Perspective au palier 3
    gsap.delayedCall(tensionAt + 1.4, () => {
      smokePhaseRef.current = 'perspective';
    });

    // Impact : moteurs, speed burst, brasier, fumée fade
    gsap.delayedCall(impactAt + 0.04, () => {
      startNovaEngine(W, H);
      ringsActiveRef.current = true;
      speedBurstActive.current = true;
      flamesActiveRef.current  = true;
      flameSpawnRateRef.current = 0.75;
      smokePhaseRef.current    = 'fading';
    });

    // Brasier qui se dissipe — spawn rate animé GSAP 0.75 → 0 sur 2.5s
    gsap.delayedCall(impactAt + 0.5, () => {
      const proxy = { rate: 0.75 };
      gsap.to(proxy, {
        rate: 0,
        duration: 2.5,
        ease: 'power2.in',
        onUpdate() { flameSpawnRateRef.current = proxy.rate; },
        onComplete() { flamesActiveRef.current = false; },
      });
    });

    // Débris verticaux
    gsap.delayedCall(impactAt + 2.4, () => {
      debrisActiveRef.current = true;
    });

    // Nébuleuse
    gsap.delayedCall(impactAt + 1.9, () => {
      const maxOp = isMobile() ? 0.5 : 1;
      [
        { id: 'n1', dx: '3vw',  dy: '-5vh', dr:  8, d: 0   },
        { id: 'n2', dx: '-4vw', dy:  '3vh', dr:-10, d: 0.4 },
        { id: 'n3', dx: '5vw',  dy:  '4vh', dr:  6, d: 0.8 },
        { id: 'n4', dx: '-3vw', dy: '-4vh', dr:-14, d: 1.2 },
        { id: 'n5', dx: '2vw',  dy:  '6vh', dr:  4, d: 0.6 },
        { id: 'n6', dx: '-6vw', dy: '-2vh', dr: -8, d: 1.5 },
      ].forEach(({ id, dx, dy, dr, d }) => {
        gsap.to(`.nebula-${id}`, { opacity: maxOp, delay: d, duration: 2.5, ease: 'power1.out' });
        gsap.to(`.nebula-${id}`, {
          x: dx, y: dy, rotation: `+=${dr}`,
          delay: d, duration: 30 + Math.random() * 20,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      });
    });

    // Respiration titre
    gsap.delayedCall(ORGANIC + delay, () => {
      gsap.to(marsaiGlowRef.current, {
        textShadow: GLOW.breathing, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // Plasma instabilité
    gsap.delayedCall(ORGANIC + delay + 0.15, () => {
      gsap.to(plasmaRef.current, {
        scale: 1.18, opacity: 0.65, filter: 'blur(55px)',
        duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // Gradient interne
    gsap.delayedCall(ORGANIC + delay, () => {
      gsap.to(marsaiInternalLightRef.current, {
        backgroundPosition: '200% center', duration: 5, repeat: -1, ease: 'none',
      });
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-black overflow-hidden flex flex-col items-center justify-center invisible"
    >
      <SolarBloom />
      <Nebula />
      <PostNovaCanvas canvasRef={novaCanvasRef} />

      {/* TITRE — 5 couches */}
      <div
        ref={marsaiWrapperRef}
        className="relative z-30 flex items-center justify-center overflow-visible"
      >
        <h1
          ref={plasmaRef}
          className="absolute font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-amber-400 mix-blend-screen"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >MARSAI</h1>

        <h1
          ref={marsaiGlowRef}
          className="relative z-10 font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-white"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)', willChange: 'text-shadow' }}
        >MARSAI</h1>

        <h1
          ref={marsaiInternalLightRef}
          className="absolute inset-0 z-20 font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-transparent bg-clip-text mix-blend-screen"
          style={{
            fontSize:           'clamp(2.8rem, 12vw, 10rem)',
            backgroundImage:    'linear-gradient(to right, #ffffff, #fbbf24, #fff8dc, #fbbf24, #ffffff)',
            backgroundSize:     '300% auto',
            backgroundPosition: '0% center',
          }}
          aria-hidden="true"
        >MARSAI</h1>

        <h1
          ref={caRedRef}
          className="absolute inset-0 z-[25] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-red-500 mix-blend-screen opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >MARSAI</h1>

        <h1
          ref={caBlueRef}
          className="absolute inset-0 z-[25] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-blue-500 mix-blend-screen opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >MARSAI</h1>
      </div>

      {/* Canvas fumée + flammes */}
      <SmokeCanvas canvasRef={smokeCanvasRef} />

      {/* Sous-titre */}
      <div
        ref={subtitleRef}
        className="relative z-40 mt-6 md:mt-12 opacity-0 pointer-events-none px-4"
      >
        <p className="text-[0.6rem] sm:text-sm md:text-xl text-zinc-400 font-light tracking-[0.25em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase text-center">
          Le nouveau commencement
        </p>
      </div>
    </div>
  );
}