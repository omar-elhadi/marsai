/**
 * HeroImpact.jsx — MARSAI Festival
 *
 * Séquence :
 *   1. APPARITION    — titre flou émerge du néant
 *   2. TENSION       — 4 paliers de glow + aftershocks organiques décroissants
 *   3. SUPERNOVA     — Solar Bloom 7 couches + aberration chromatique v3
 *   4. RÉVÉLATION    — blur 22px → 0px progressif
 *   5. POST-NOVA     — anneaux de choc + nébuleuse CSS + cendres stellaires
 *
 * Aberration chromatique v3 :
 *   Phase 1 — BLAST       : divergence violente ±80px en 0.05s expo.out
 *   Phase 2 — TREMBLEMENT : keyframes asymétriques par canal (R ≠ B),
 *                           amplitude décroissante sur 1.2s, organique
 *   Phase 3 — CONVERGENCE : retour x:0 + fade opacity sur 1.0s power3.inOut
 *
 * Responsive :
 *   ResizeObserver remet le canvas aux bonnes dimensions à chaque resize.
 *   Pools Canvas réduits sur mobile (< 768px) pour éviter le lag.
 *   Typographie, tracking et marges adaptés 375px → desktop.
 *   Nebula clouds réduits en opacité sur petits écrans.
 */

import { useRef, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

const IMPACT_COUNT    = 100;
const ASH_COUNT_DESK  = 120;
const ASH_COUNT_MOBI  = 60;  // < 768px

const GLOW = {
  dormant:   '0 0 0px transparent',
  charge1:   '0 0 8px #fff5, 0 0 20px #fbbf2433',
  charge2:   '0 0 15px #fffa, 0 0 40px #fbbf2466, 0 0 80px #b4530933',
  charge3:   '0 0 25px #fff, 0 0 70px #fbbf24cc, 0 0 140px #b45309aa',
  preimpact: '0 0 40px #fff, 0 0 100px #fbbf24, 0 0 200px #b45309, 0 0 300px #7c2d1266',
  nuclear:   '0 0 20px #fff, 0 0 50px #fff, 0 0 100px #fbbf24, 0 0 180px #b45309, 0 0 280px #7c2d12',
  breathing: '0 0 10px #fff, 0 0 30px #fff, 0 0 70px #fbbf24, 0 0 130px #b45309',
};

const ASH_PALETTE = [
  [255, 220, 120], [255, 200, 80],  [255, 180, 40],
  [255, 240, 180], [255, 255, 220], [255, 160, 30],
];

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
// Opacité max réduite sur mobile via data-attr + CSS
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
// CLASSE — Anneau de choc
// ─────────────────────────────────────────────
class ShockRing {
  constructor(W, H, cx, cy, delayFrames, cr, cg, cb) {
    this.maxR  = Math.sqrt(W * W + H * H) * 0.58;
    this.cx    = cx;
    this.cy    = cy;
    this.r     = 0;
    this.speed = 3 + Math.random() * 2;
    this.alive = false;
    this.wait  = delayFrames;
    this.age   = 0;
    this.cr    = cr;
    this.cg    = cg;
    this.cb    = cb;
  }

  update() {
    if (!this.alive) {
      if (++this.age >= this.wait) this.alive = true;
      return;
    }
    this.speed *= 1.003;
    this.r     += this.speed;
  }

  draw(ctx) {
    if (!this.alive || this.r > this.maxR) return;
    const p     = this.r / this.maxR;
    const alpha = Math.max(0, 1 - p);
    const thin  = Math.max(0.4, 2.5 * (1 - p));

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${this.cr},${this.cg},${this.cb},${alpha * 0.22})`;
    ctx.lineWidth   = thin * 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${this.cr},${this.cg},${this.cb},${alpha * 0.85})`;
    ctx.lineWidth   = thin;
    ctx.stroke();
  }

  isDead() { return this.r > this.maxR; }
}

// ─────────────────────────────────────────────
// CLASSE — Cendre stellaire
// ─────────────────────────────────────────────
class StellarAsh {
  constructor(W, H) {
    this.W = W;
    this.H = H;
    this.respawn(true);
  }

  respawn(initial = false) {
    this.x       = Math.random() * this.W;
    this.y       = initial ? -Math.random() * this.H * 1.2 : -10 - Math.random() * 50;
    this.vy      = 0.4 + Math.random() * 1.2;
    this.vx      = (Math.random() - 0.5) * 0.25;
    this.ay      = 0.002 + Math.random() * 0.003;
    this.size    = 0.8 + Math.random() * 2.2;
    this.hasTail = this.size > 2.2;
    this.swayF   = 0.008 + Math.random() * 0.012;
    this.swayA   = 0.3   + Math.random() * 0.7;
    this.swayO   = Math.random() * Math.PI * 2;
    const c      = ASH_PALETTE[Math.floor(Math.random() * ASH_PALETTE.length)];
    this.r       = c[0];
    this.g       = c[1];
    this.b       = c[2];
    this.maxOp   = 0.45 + Math.random() * 0.5;
    this.opacity = 0;
    this.frame   = 0;
  }

  update(t) {
    this.frame++;
    this.vy += this.ay;
    this.y  += this.vy;
    this.x  += this.vx + Math.sin(t * this.swayF + this.swayO) * this.swayA * 0.015;
    if (this.y > this.H + 15) { this.respawn(); return; }
    this.opacity = Math.min(1, this.frame / 40) * this.maxOp;
  }
}

// ─────────────────────────────────────────────
// Canvas + Impact
// ─────────────────────────────────────────────
const PostNovaCanvas = ({ canvasRef }) => (
  <canvas
    ref={canvasRef}
    className="absolute inset-0 pointer-events-none z-[24]"
    style={{ mixBlendMode: 'screen' }}
  />
);

const ImpactParticles = () => {
  const pts = useMemo(() =>
    Array.from({ length: IMPACT_COUNT }, (_, i) => ({
      id:      i,
      width:   Math.random() * 6 + 2,
      height:  Math.random() * 6 + 2,
      isAmber: i % 3 !== 0,
    }))
  , []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {pts.map(({ id, width, height, isAmber }) => (
        <div
          key={id}
          className={`impact-particle absolute rounded-full mix-blend-screen opacity-0 ${
            isAmber ? 'bg-amber-300' : 'bg-white'
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      ))}
    </div>
  );
};

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
  const canvasRef              = useRef(null);
  const caRedRef               = useRef(null);
  const caBlueRef              = useRef(null);

  const rafRef       = useRef(null);
  const engineActive = useRef(false);
  const ringsActive  = useRef(false);
  const ashActive    = useRef(false);

  // Police responsive — se lit dans le DOM, stable via closure
  const isMobile = useCallback(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );

  // ── MOTEUR CANVAS ─────────────────────────────────────────
  const startCanvas = useCallback((W, H) => {
    if (engineActive.current) return;
    engineActive.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx  = W * 0.5;
    const cy  = H * 0.5;

    const rings = [
      new ShockRing(W, H, cx, cy,  0, 255, 255, 255),
      new ShockRing(W, H, cx, cy, 22, 255, 225, 160),
      new ShockRing(W, H, cx, cy, 44, 255, 175,  55),
      new ShockRing(W, H, cx, cy, 66, 255, 115,  15),
    ];

    const ashCount = isMobile() ? ASH_COUNT_MOBI : ASH_COUNT_DESK;
    const ashes    = Array.from({ length: ashCount }, () => new StellarAsh(W, H));

    let t = 0;

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      t++;

      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.fillRect(0, 0, W, H);

      if (ringsActive.current) {
        ctx.save();
        ctx.lineCap = 'round';
        rings.forEach((ring) => { ring.update(); ring.draw(ctx); });
        ctx.restore();
      }

      if (ashActive.current) {
        // Passe halos
        ashes.forEach((ash) => {
          ash.update(t);
          if (ash.opacity < 0.01 || ash.size <= 1.5) return;
          const hR  = ash.size * 3;
          const grd = ctx.createRadialGradient(ash.x, ash.y, 0, ash.x, ash.y, hR);
          grd.addColorStop(0, `rgba(${ash.r},${ash.g},${ash.b},${ash.opacity * 0.45})`);
          grd.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(ash.x, ash.y, hR, 0, Math.PI * 2);
          ctx.fill();
        });

        // Passe traînées + noyaux
        ashes.forEach((ash) => {
          if (ash.opacity < 0.01) return;
          if (ash.hasTail) {
            const tLen = ash.vy * 3.5;
            const grd  = ctx.createLinearGradient(ash.x, ash.y - tLen, ash.x, ash.y);
            grd.addColorStop(0, `rgba(${ash.r},${ash.g},${ash.b},0)`);
            grd.addColorStop(1, `rgba(${ash.r},${ash.g},${ash.b},${ash.opacity * 0.5})`);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = ash.size * 0.35;
            ctx.beginPath();
            ctx.moveTo(ash.x, ash.y - tLen);
            ctx.lineTo(ash.x, ash.y);
            ctx.stroke();
          }
          ctx.globalAlpha = ash.opacity;
          ctx.fillStyle   = `rgb(${ash.r},${ash.g},${ash.b})`;
          ctx.beginPath();
          ctx.arc(ash.x, ash.y, ash.size * 0.55, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = 1;
      }
    };

    render();
  }, [isMobile]);

  // ── RESIZE — recalcule le canvas sans relancer le moteur ──
  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current;
      const cont   = containerRef.current;
      if (!canvas || !cont) return;
      // Le moteur continue — on redimensionne seulement si pas encore démarré
      if (!engineActive.current) {
        canvas.width  = cont.offsetWidth;
        canvas.height = cont.offsetHeight;
      }
    };

    const ro = new ResizeObserver(onResize);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      engineActive.current = false;
    };
  }, []);

  // ── GSAP ──────────────────────────────────────────────────
  useGSAP(() => {
    gsap.set(containerRef.current, { visibility: 'visible' });
    const W = containerRef.current.offsetWidth;
    const H = containerRef.current.offsetHeight;

    if (canvasRef.current) {
      canvasRef.current.width  = W;
      canvasRef.current.height = H;
    }

    // Setup initial
    gsap.set(marsaiWrapperRef.current, { scale: 1.12, opacity: 0, filter: 'blur(28px)', x: 0, y: 0 });
    gsap.set(marsaiGlowRef.current,    { textShadow: GLOW.dormant });
    gsap.set(plasmaRef.current,        { opacity: 0, scale: 1.05, filter: 'blur(20px)' });
    gsap.set(canvasRef.current,        { opacity: 0 });
    gsap.set('.solar-bloom',           { opacity: 0 });
    gsap.set('[class*="s-bloom-"]',    { opacity: 0 });
    NEBULA_CLOUDS.forEach(({ id }) => gsap.set(`.nebula-${id}`, { opacity: 0 }));
    gsap.set([caRedRef.current, caBlueRef.current], { opacity: 0, x: 0, y: 0 });

    const tl = gsap.timeline({ delay: 0.6 });

    // ─ Phase 1 : Apparition ──────────────────────────────────
    tl.addLabel('apparition');
    tl.to(marsaiWrapperRef.current, {
      opacity: 1, scale: 1.06, duration: 1.6, ease: 'power2.out',
    }, 'apparition');

    // ─ Phase 2 : Tension ─────────────────────────────────────
    tl.addLabel('tension', 'apparition+=1.6');

    tl.to(marsaiWrapperRef.current, {
      filter: 'blur(22px)', scale: 1.04, duration: 2.2, ease: 'power1.inOut',
    }, 'tension');

    // Palier 1
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge1, duration: 0.4, ease: 'power1.out' }, 'tension+=0.2');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x:  4,  y: -2,  duration: 0.08 },
        { x: -3,  y:  1.5,duration: 0.09 },
        { x:  2,  y: -1,  duration: 0.10 },
        { x: -1,  y:  0.5,duration: 0.11 },
        { x:  0,  y:  0,  duration: 0.14, ease: 'power2.out' },
      ],
    }, 'tension+=0.3');

    // Palier 2
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge2, duration: 0.35, ease: 'power2.out' }, 'tension+=0.8');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x: -7,  y:  3,   duration: 0.06 },
        { x:  5,  y: -2.5, duration: 0.07 },
        { x: -3,  y:  1.5, duration: 0.08 },
        { x:  2,  y: -1,   duration: 0.09 },
        { x: -1,  y:  0.5, duration: 0.10 },
        { x:  0,  y:  0,   duration: 0.15, ease: 'power2.out' },
      ],
    }, 'tension+=0.9');

    // Palier 3
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.charge3, duration: 0.3, ease: 'power3.out' }, 'tension+=1.35');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x:  12,  y: -5,   duration: 0.04  },
        { x:  -9,  y:  4,   duration: 0.045 },
        { x:   7,  y: -3,   duration: 0.05  },
        { x:  -5,  y:  2,   duration: 0.055 },
        { x:   3,  y: -1.5, duration: 0.06  },
        { x:  -2,  y:  1,   duration: 0.07  },
        { x:   1,  y: -0.5, duration: 0.08  },
        { x:   0,  y:  0,   duration: 0.16, ease: 'power2.out' },
      ],
    }, 'tension+=1.4');

    // Palier 4
    tl.to(marsaiGlowRef.current, { textShadow: GLOW.preimpact, duration: 0.2, ease: 'power4.in' }, 'tension+=1.82');
    tl.to(marsaiWrapperRef.current, {
      keyframes: [
        { x: -18,  y:  8,   duration: 0.030 },
        { x:  14,  y: -6,   duration: 0.032 },
        { x: -11,  y:  5,   duration: 0.035 },
        { x:   8,  y: -4,   duration: 0.040 },
        { x:  -6,  y:  3,   duration: 0.045 },
        { x:   4,  y: -2,   duration: 0.050 },
        { x:  -2,  y:  1,   duration: 0.060 },
        { x:   1,  y: -0.5, duration: 0.070 },
        { x:   0,  y:  0,   duration: 0.180, ease: 'power2.out' },
      ],
    }, 'tension+=1.78');

    // ─ Phase 3 : Supernova ───────────────────────────────────
    tl.addLabel('impact', 'tension+=2.1');

    tl.to(containerRef.current, {
      keyframes: [
        { x: -25, duration: 0.055 },
        { x:  20, duration: 0.055 },
        { x: -15, duration: 0.060 },
        { x:  11, duration: 0.065 },
        { x:  -7, duration: 0.070 },
        { x:   4, duration: 0.080 },
        { x:  -2, duration: 0.090 },
        { x:   0, duration: 0.180, ease: 'power2.out' },
      ],
    }, 'impact');

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

    // ─────────────────────────────────────────────────────────
    // ABERRATION CHROMATIQUE v3
    //
    // Phase 1 — BLAST (0.00s → 0.05s)
    //   Les deux canaux explosent depuis le centre.
    //   Rouge : gauche + légèrement vers le haut (-80px, -12px)
    //   Bleu  : droite + légèrement vers le bas  (+80px, +12px)
    //   Opacité : 0 → 0.95 instantané.
    //
    // Phase 2 — TREMBLEMENT ASYMÉTRIQUE (0.05s → 1.25s)
    //   Chaque canal tremble DIFFÉREMMENT — pas en miroir.
    //   Le rouge est plus nerveux avec un drift vertical irrégulier.
    //   Le bleu est plus lent, avec un rebond latéral plus ample.
    //   Amplitude décroissante : chaque keyframe est plus petite.
    //   Les durées sont légèrement différentes pour briser la symétrie.
    //
    // Phase 3 — CONVERGENCE (1.25s → 2.25s)
    //   Les deux canaux reviennent à x:0, y:0 avec power3.inOut.
    //   L'opacité fond de 0.85 → 0 simultanément.
    //   Le titre "se recompose" visuellement pendant la révélation.
    // ─────────────────────────────────────────────────────────

    // Setup : visible, au centre
    tl.set([caRedRef.current, caBlueRef.current], { x: 0, y: 0, opacity: 0 }, 'impact');

    // PHASE 1 — BLAST : divergence violente
    tl.to(caRedRef.current, {
      x: -80, y: -12, opacity: 0.95,
      duration: 0.05, ease: 'expo.out',
    }, 'impact');
    tl.to(caBlueRef.current, {
      x:  80, y:  12, opacity: 0.95,
      duration: 0.05, ease: 'expo.out',
    }, 'impact');

    // PHASE 2 — TREMBLEMENT ROUGE
    // Canal rouge : nerveux, irrégulier, drift vers la gauche
    tl.to(caRedRef.current, {
      keyframes: [
        { x: -80, y: -12, duration: 0.000 }, // point de départ blast
        { x: -62, y:   6, duration: 0.065 }, // rebond partiel
        { x: -74, y:  -9, duration: 0.055 },
        { x: -52, y:   4, duration: 0.070 },
        { x: -64, y:  -7, duration: 0.060 },
        { x: -44, y:   5, duration: 0.075 },
        { x: -54, y:  -5, duration: 0.065 },
        { x: -36, y:   3, duration: 0.080 },
        { x: -44, y:  -4, duration: 0.070 },
        { x: -28, y:   2, duration: 0.085 },
        { x: -34, y:  -3, duration: 0.075 },
        { x: -20, y:   1, duration: 0.090 },
        { x: -24, y:  -2, duration: 0.080 },
        { x: -12, y:   1, duration: 0.095 },
      ],
    }, 'impact+=0.05');

    // PHASE 2 — TREMBLEMENT BLEU
    // Canal bleu : plus lent, ample, légèrement visqueux
    tl.to(caBlueRef.current, {
      keyframes: [
        { x:  80, y:  12, duration: 0.000 }, // point de départ blast
        { x:  68, y:  -5, duration: 0.080 }, // rebond différent
        { x:  76, y:   8, duration: 0.065 },
        { x:  58, y:  -4, duration: 0.085 },
        { x:  68, y:   6, duration: 0.070 },
        { x:  50, y:  -4, duration: 0.090 },
        { x:  60, y:   5, duration: 0.075 },
        { x:  42, y:  -3, duration: 0.095 },
        { x:  50, y:   4, duration: 0.080 },
        { x:  32, y:  -3, duration: 0.100 },
        { x:  40, y:   3, duration: 0.085 },
        { x:  22, y:  -2, duration: 0.105 },
        { x:  28, y:   2, duration: 0.090 },
        { x:  14, y:  -1, duration: 0.110 },
      ],
    }, 'impact+=0.05');

    // PHASE 3 — CONVERGENCE
    // Les deux canaux rentrent vers le centre — le titre se recompose.
    // Opacité : 0.85 → 0 pendant la convergence.
    tl.to(caRedRef.current, {
      x: 0, y: 0, opacity: 0,
      duration: 1.0, ease: 'power3.inOut',
    }, 'impact+=1.25');

    tl.to(caBlueRef.current, {
      x: 0, y: 0, opacity: 0,
      duration: 1.0, ease: 'power3.inOut',
    }, 'impact+=1.25');

    // Canvas
    tl.to(canvasRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 'impact+=0.05');

    // Particules d'impact
    gsap.utils.toArray('.impact-particle').forEach((p) => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = W * (Math.random() * 0.6 + 0.25);
      tl.set(p, { x: 0, y: 0, opacity: 1, scale: 2.5 }, 'impact');
      tl.to(p, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        opacity: 0, scale: 0,
        duration: 0.8 + Math.random() * 1.2,
        ease: 'power3.out',
      }, 'impact');
    });

    // ─ Phase 4 : Révélation ──────────────────────────────────
    tl.to(marsaiWrapperRef.current, {
      opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(22px)',
      duration: 0.25, ease: 'power2.out',
    }, 'impact+=0.18');

    tl.to(marsaiGlowRef.current, {
      textShadow: GLOW.nuclear, duration: 0.25, ease: 'expo.out',
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
    const ORGANIC  = tl.totalDuration() + 0.1;
    const impactAt = tl.labels['impact'];

    // Anneaux
    gsap.delayedCall(impactAt + 0.04, () => {
      startCanvas(W, H);
      ringsActive.current = true;
    });

    // Nébuleuse
    gsap.delayedCall(impactAt + 1.9, () => {
      // Sur mobile : opacité max réduite pour économiser le GPU
      const nebulaMaxOp = isMobile() ? 0.5 : 1;
      [
        { id: 'n1', dx: '3vw',  dy: '-5vh', dr:  8, delay: 0   },
        { id: 'n2', dx: '-4vw', dy:  '3vh', dr:-10, delay: 0.4 },
        { id: 'n3', dx: '5vw',  dy:  '4vh', dr:  6, delay: 0.8 },
        { id: 'n4', dx: '-3vw', dy: '-4vh', dr:-14, delay: 1.2 },
        { id: 'n5', dx: '2vw',  dy:  '6vh', dr:  4, delay: 0.6 },
        { id: 'n6', dx: '-6vw', dy: '-2vh', dr: -8, delay: 1.5 },
      ].forEach(({ id, dx, dy, dr, delay }) => {
        gsap.to(`.nebula-${id}`, {
          opacity: nebulaMaxOp, delay, duration: 2.5, ease: 'power1.out',
        });
        gsap.to(`.nebula-${id}`, {
          x: dx, y: dy, rotation: `+=${dr}`,
          delay,
          duration: 30 + Math.random() * 20,
          repeat:  -1,
          yoyo:     true,
          ease:    'sine.inOut',
        });
      });
    });

    // Cendres
    gsap.delayedCall(impactAt + 2.4, () => {
      ashActive.current = true;
    });

    // Respiration titre
    gsap.delayedCall(ORGANIC, () => {
      gsap.to(marsaiGlowRef.current, {
        textShadow: GLOW.breathing,
        duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // Plasma instabilité
    gsap.delayedCall(ORGANIC + 0.15, () => {
      gsap.to(plasmaRef.current, {
        scale: 1.18, opacity: 0.65, filter: 'blur(55px)',
        duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // Gradient interne
    gsap.delayedCall(ORGANIC, () => {
      gsap.to(marsaiInternalLightRef.current, {
        backgroundPosition: '200% center',
        duration: 5, repeat: -1, ease: 'none',
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
      <PostNovaCanvas canvasRef={canvasRef} />

      {/*
       * TITRE — 5 couches
       *
       * Layout responsive :
       *   — text-[clamp(2.8rem,12vw,10rem)] : taille proportionnelle à la largeur
       *     mais bornée entre 2.8rem (iPhone mini) et 10rem (desktop large)
       *   — select-none, whitespace-nowrap : protège contre la rupture de ligne
       *   — Le wrapper overflow:hidden empêche les canaux CA de déborder
       */}
      <div
        ref={marsaiWrapperRef}
        className="relative z-30 flex items-center justify-center overflow-visible"
      >
        {/* Plasma */}
        <h1
          ref={plasmaRef}
          className="absolute font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-amber-400 mix-blend-screen"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >
          MARSAI
        </h1>

        {/* Glow — source de lumière */}
        <h1
          ref={marsaiGlowRef}
          className="relative z-10 font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-white"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)', willChange: 'text-shadow' }}
        >
          MARSAI
        </h1>

        {/* Gradient interne */}
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
        >
          MARSAI
        </h1>

        {/*
         * Aberration chromatique — canal rouge
         * text-red-500 + mix-blend-screen :
         *   sur fond noir = invisible
         *   sur le blanc du titre = s'additionne, crée la décomposition rouge
         */}
        <h1
          ref={caRedRef}
          className="absolute inset-0 z-[25] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-red-500 mix-blend-screen opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >
          MARSAI
        </h1>

        {/* Aberration chromatique — canal bleu */}
        <h1
          ref={caBlueRef}
          className="absolute inset-0 z-[25] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none text-blue-500 mix-blend-screen opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 12vw, 10rem)' }}
          aria-hidden="true"
        >
          MARSAI
        </h1>
      </div>

      {/*
       * Sous-titre
       * tracking réduit sur mobile pour éviter le débordement sur 375px.
       * mt-6 sur mobile, mt-12 sur desktop.
       */}
      <div
        ref={subtitleRef}
        className="relative z-40 mt-6 md:mt-12 opacity-0 pointer-events-none px-4"
      >
        <p className="text-[0.6rem] sm:text-sm md:text-xl text-zinc-400 font-light tracking-[0.25em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase text-center">
          L&rsquo;apogée du cinéma génératif
        </p>
      </div>

      <ImpactParticles />
    </div>
  );
}