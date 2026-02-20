/**
 * HeroImpact.jsx — MARSAI Festival
 *
 * Architecture de la séquence :
 *   Phase 1 — DISPERSION     : Les éclats textuels orbitent autour du centre
 *   Phase 2 — CONVERGENCE    : Ils fusionnent vers le point zéro
 *   Phase 3 — LE CHOC        : Impact, flash, onde de choc, explosion de particules
 *   Phase 4 — CRISTALLISATION : MARSAI émerge, net, solide, vivant
 *   Phase 5 — VIE COSMIQUE   : Rayons stellaires, respiration du halo, lumière interne
 *
 * Décisions d'architecture :
 *   — Scanner anamorphique supprimé (décision d'équipe)
 *   — CosmicRayBurst : 36 rayons CSS positionnés depuis un point central
 *     avec mix-blend-screen — la lumière paraît émaner des lettres elles-mêmes
 *   — Données rayons et particules stables via useMemo (jamais de Math.random au render)
 *   — Toutes les boucles infinies déclenchées par gsap.delayedCall coordonné
 *   — will-change sur les éléments animés en boucle GPU-intensive
 *   — z-index stack cohérent, aucune valeur Tailwind invalide
 */

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

const PARTICLE_COUNT = 180;
const RAY_COUNT      = 36;

const SHARDS = [
  { id: 'tl', text: 'M4RS41',   x: '-55vw', y: '-55vh', color: '#FF003C' },
  { id: 't',  text: 'SYST3M',   x: '0vw',   y: '-62vh', color: '#00FF66' },
  { id: 'tr', text: '011011',   x: '55vw',  y: '-55vh', color: '#00E5FF' },
  { id: 'r',  text: 'F4T4L_',   x: '62vw',  y: '0vh',   color: '#FFB300' },
  { id: 'br', text: 'ERROR_',   x: '55vw',  y: '55vh',  color: '#FF003C' },
  { id: 'b',  text: 'C0R3',     x: '0vw',   y: '62vh',  color: '#00FF66' },
  { id: 'bl', text: 'D4T4',     x: '-55vw', y: '55vh',  color: '#00E5FF' },
  { id: 'l',  text: 'N3TW0RK',  x: '-62vw', y: '0vh',   color: '#FFB300' },
];

const GLOW = {
  dormant:   '0 0 5px #fff, 0 0 15px rgba(255,255,255,0.3)',
  nuclear:   '0 0 10px #fff, 0 0 30px #fff, 0 0 60px #fbbf24, 0 0 100px #b45309, 0 0 180px #7c2d12',
  breathing: '0 0 5px #fff, 0 0 20px #fff, 0 0 45px #fbbf24, 0 0 90px #b45309',
};

// ─────────────────────────────────────────────
// SUB-COMPOSANTS
// ─────────────────────────────────────────────

/**
 * CosmicRayBurst
 *
 * Simule l'explosion de rayons lumineux du GIF de référence.
 * Chaque rayon est un div positionné depuis le centre de l'écran,
 * tourné selon son angle propre. transform-origin: '0% 50%' = le pivot
 * est à gauche du div = le centre de l'écran.
 *
 * mix-blend-screen sur le container : les rayons s'additionnent
 * au blanc du titre, donnant l'illusion que la lumière ÉMERGE des lettres.
 *
 * Deux familles :
 *   — Principaux (2/3) : longs, larges, blanc-bleu pur
 *   — Secondaires (1/3) : fins, courts, bleu électrique, densifient le réseau
 */
const CosmicRayBurst = () => {
  const rays = useMemo(() => {
    const step = 360 / RAY_COUNT;
    return Array.from({ length: RAY_COUNT }, (_, i) => {
      const isPrimary = i % 3 !== 2;
      return {
        id:      i,
        angle:   i * step + (Math.random() * 7 - 3.5),
        length:  isPrimary ? 28 + Math.random() * 18 : 14 + Math.random() * 10,
        width:   isPrimary ? 1.5 + Math.random() * 2  : 0.8 + Math.random() * 1,
        opacity: isPrimary ? 0.5 + Math.random() * 0.4 : 0.3 + Math.random() * 0.3,
        color:   isPrimary ? 'rgba(220, 240, 255, 1)' : 'rgba(100, 180, 255, 1)',
      };
    });
  }, []);

  return (
    <div
      className="cosmic-burst absolute inset-0 pointer-events-none z-[28] mix-blend-screen opacity-0"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Point central — trois couches concentriques de profondeur */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-white blur-[8px]" style={{ willChange: 'opacity, transform' }} />
        <div className="absolute w-32 h-32 rounded-full bg-blue-100/80 blur-[25px]" style={{ willChange: 'opacity, transform' }} />
        <div className="absolute w-64 h-64 rounded-full bg-blue-400/30 blur-[60px]" style={{ willChange: 'opacity, transform' }} />
      </div>

      {/* Les rayons */}
      {rays.map(({ id, angle, length, width, opacity, color }) => (
        <div
          key={id}
          className="cosmic-ray absolute"
          style={{
            width:           `${length}vw`,
            height:          `${width}px`,
            left:            '50%',
            top:             '50%',
            transformOrigin: '0% 50%',
            transform:       `rotate(${angle}deg) translateY(-50%)`,
            background:      `linear-gradient(to right, ${color}, transparent)`,
            opacity,
            willChange:      'opacity',
          }}
        />
      ))}
    </div>
  );
};

/**
 * ImpactParticles — données stables via useMemo
 */
const ImpactParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id:      i,
      width:   Math.random() * 6 + 3,
      height:  Math.random() * 6 + 3,
      isAmber: i % 2 === 0,
    }))
  , []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {particles.map(({ id, width, height, isAmber }) => (
        <div
          key={id}
          className={`impact-particle absolute rounded-full mix-blend-screen opacity-0 ${
            isAmber
              ? 'bg-amber-300 shadow-[0_0_10px_#fbbf24]'
              : 'bg-fuchsia-300 shadow-[0_0_15px_#f0abfc]'
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      ))}
    </div>
  );
};

/**
 * AmbientAura — halo d'ambiance, deux couches de profondeur
 */
const AmbientAura = () => (
  <div className="ambient-aura absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-screen opacity-0">
    <div className="absolute w-[65vw] h-[22vh] bg-amber-400/20 blur-[70px] rounded-full" />
    <div className="absolute w-[85vw] h-[32vh] bg-fuchsia-500/10 blur-[100px] rounded-full" />
  </div>
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
  const shockwaveRef           = useRef(null);
  const subtitleRef            = useRef(null);

  const baseText = 'text-[12vw] md:text-[14vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none';

  useGSAP(() => {
    gsap.set(containerRef.current, { visibility: 'visible' });

    const W = containerRef.current.offsetWidth;

    // ── SETUP INITIAL ────────────────────────────────────────
    SHARDS.forEach(({ id, x, y, color }) => {
      gsap.set(`.shard-${id}`, {
        x, y,
        scale:      0.5,
        opacity:    0,
        rotation:   Math.random() * 60 - 30,
        color,
        textShadow: `0 0 12px ${color}`,
      });
    });

    gsap.set(marsaiWrapperRef.current, { scale: 1.6, opacity: 0, filter: 'blur(40px)' });
    gsap.set(marsaiGlowRef.current,    { textShadow: GLOW.dormant });
    gsap.set(plasmaRef.current,        { opacity: 0, scale: 1.05, filter: 'blur(20px)' });
    gsap.set('.cosmic-burst',          { scale: 0.2, opacity: 0, rotation: 0 });

    // ── TIMELINE MAÎTRESSE ────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.4 });

    // ─ PHASE 1 + 2 : CONVERGENCE ─────────────────────────────
    tl.addLabel('converge');

    tl.to('.shard-text', {
      x: '0vw', y: '0vh',
      rotation: 0, scale: 1, opacity: 1,
      duration: 2,
      ease: 'power3.in',
      stagger: { amount: 0.08, from: 'random' },
    }, 'converge');

    tl.to('.shard-text', {
      color: '#FFFFFF',
      textShadow: '0 0 20px #FFFFFF',
      duration: 0.8,
      ease: 'power2.in',
    }, 'converge+=1.2');

    tl.to(marsaiWrapperRef.current, {
      scale: 1.08, opacity: 0.45, filter: 'blur(12px)',
      duration: 2,
      ease: 'power2.inOut',
    }, 'converge');

    // ─ PHASE 3 : LE CHOC ─────────────────────────────────────
    tl.addLabel('impact', 'converge+=2');

    tl.set(shockwaveRef.current,  { opacity: 1 }, 'impact');
    tl.to(shockwaveRef.current,   { opacity: 0, duration: 0.35, ease: 'expo.out' }, 'impact+=0.04');

    tl.fromTo(containerRef.current,
      { x: -18 },
      { x: 0, duration: 0.07, yoyo: true, repeat: 9, ease: 'none' },
      'impact'
    );

    tl.set('.shard-text', { opacity: 1 }, 'impact');
    SHARDS.forEach(({ id }) => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = W * (Math.random() * 0.55 + 0.3);
      tl.to(`.shard-${id}`, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        scale: 0,
        opacity: 0,
        filter: 'blur(40px)',
        duration: 1.1 + Math.random() * 0.4,
        ease: 'power4.out',
      }, 'impact');
    });

    const particles = gsap.utils.toArray('.impact-particle');
    tl.set(particles, { x: 0, y: 0, opacity: 1, scale: 2.5 }, 'impact');
    particles.forEach((p) => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = W * (Math.random() * 0.55 + 0.28);
      tl.to(p, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        opacity: 0,
        scale: 0,
        duration: 1.2 + Math.random() * 1.2,
        ease: 'power3.out',
      }, 'impact');
    });

    // ─ PHASE 4 : CRISTALLISATION ─────────────────────────────
    tl.to(marsaiWrapperRef.current, {
      scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 0.28, ease: 'expo.out',
    }, 'impact');

    tl.to(marsaiGlowRef.current, {
      textShadow: GLOW.nuclear,
      duration: 0.28, ease: 'expo.out',
    }, 'impact');

    tl.to('.ambient-aura', {
      opacity: 1, duration: 0.5, ease: 'expo.out',
    }, 'impact');

    tl.fromTo(plasmaRef.current,
      { opacity: 0, scale: 1,    filter: 'blur(15px)' },
      { opacity: 1, scale: 1.06, filter: 'blur(45px)', duration: 0.5, ease: 'expo.out' },
      'impact'
    );

    // ─ EXPLOSION COSMIQUE ─────────────────────────────────────
    // Surgit au moment de l'impact avec une légère sur-extension, puis se pose.
    tl.to('.cosmic-burst', {
      scale: 1.15, opacity: 1,
      duration: 0.6, ease: 'expo.out',
    }, 'impact');

    tl.to('.cosmic-burst', {
      scale: 1,
      duration: 1.2, ease: 'power2.out',
    }, 'impact+=0.6');

    // Sous-titre
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' },
      'impact+=0.45'
    );

    // ─ PHASE 5 : VIE COSMIQUE ────────────────────────────────
    // Délai calculé depuis la durée réelle de la timeline — coordination garantie.
    const ORGANIC_DELAY = tl.totalDuration() + 0.2;

    // 5a. Respiration du halo
    gsap.delayedCall(ORGANIC_DELAY, () => {
      gsap.to(marsaiGlowRef.current, {
        textShadow: GLOW.breathing,
        duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // 5b. Instabilité organique du plasma
    gsap.delayedCall(ORGANIC_DELAY + 0.15, () => {
      gsap.to(plasmaRef.current, {
        scale: 1.18, opacity: 0.65, filter: 'blur(55px)',
        duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // 5c. Dérive lumineuse interne du gradient
    gsap.delayedCall(ORGANIC_DELAY, () => {
      gsap.to(marsaiInternalLightRef.current, {
        backgroundPosition: '200% center',
        duration: 4, repeat: -1, ease: 'none',
      });
    });

    // 5d. Rotation lente et majestueuse du burst — une révolution en 80s
    // Invisible à l'œil comme mouvement direct, mais perceptible comme "vie".
    gsap.delayedCall(ORGANIC_DELAY, () => {
      gsap.to('.cosmic-burst', {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    });

    // 5e. Pulsation individuelle des rayons — chaque rayon respire à son propre rythme
    gsap.delayedCall(ORGANIC_DELAY + 0.1, () => {
      gsap.to('.cosmic-ray', {
        opacity:  'random(0.15, 1)',
        duration: 'random(1.2, 3.5)',
        repeat:   -1,
        yoyo:     true,
        ease:     'sine.inOut',
        stagger:  { amount: 5, from: 'random' },
      });
    });

    // 5f. Pulsation du cœur central — légèrement désynchronisée des rayons
    gsap.delayedCall(ORGANIC_DELAY + 0.3, () => {
      gsap.to('.cosmic-burst > div > div', {
        opacity: 'random(0.6, 1)',
        scale:   'random(0.85, 1.15)',
        duration: 'random(1.8, 3)',
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        stagger: { amount: 1.5, from: 'center' },
      });
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center invisible"
    >
      {/* Onde de choc */}
      <div
        ref={shockwaveRef}
        className="absolute inset-0 bg-white mix-blend-screen opacity-0 pointer-events-none z-50"
      />

      {/* Éclats textuels orbitaux */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {SHARDS.map(({ id, text }) => (
          <h2
            key={id}
            className={`shard-text shard-${id} absolute text-[5vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap opacity-0`}
          >
            {text}
          </h2>
        ))}
      </div>

      {/* Halo ambiant */}
      <AmbientAura />

      {/*
       * Burst Cosmique — z-[28], entre l'aura (z-20) et le titre (z-30)
       * mix-blend-screen : les rayons bleus s'additionnent au blanc des lettres.
       * La lumière cosmique semble naître du titre lui-même.
       */}
      <CosmicRayBurst />

      {/* ── LE TITRE — 3 couches superposées ── */}
      <div
        ref={marsaiWrapperRef}
        className="relative z-30 flex items-center justify-center"
      >
        {/* Couche A — PLASMA : profondeur lumineuse et instabilité organique */}
        <h1
          ref={plasmaRef}
          className={`${baseText} absolute text-amber-500 mix-blend-screen`}
          aria-hidden="true"
        >
          MARSAI
        </h1>

        {/* Couche B — GLOW : titre lisible, porteur du text-shadow nucléaire */}
        <h1
          ref={marsaiGlowRef}
          className={`${baseText} relative z-10 text-white`}
        >
          MARSAI
        </h1>

        {/* Couche C — LUMIÈRE INTERNE : gradient animé simulant un mouvement dans les lettres */}
        <h1
          ref={marsaiInternalLightRef}
          className={`${baseText} absolute inset-0 z-20 text-transparent bg-clip-text mix-blend-screen`}
          style={{
            backgroundImage:    'linear-gradient(to right, #ffffff, #fbbf24, #d8b4fe, #f0abfc, #ffffff, #fbbf24)',
            backgroundSize:     '300% auto',
            backgroundPosition: '0% center',
          }}
          aria-hidden="true"
        >
          MARSAI
        </h1>
      </div>

      {/* Signature */}
      <div
        ref={subtitleRef}
        className="relative z-40 mt-12 opacity-0 pointer-events-none"
      >
        <p className="text-sm md:text-xl text-zinc-400 font-light tracking-[0.5em] uppercase text-center">
          L&rsquo;apogée du cinéma génératif
        </p>
      </div>

      {/* Particules d'impact */}
      <ImpactParticles />
    </div>
  );
}