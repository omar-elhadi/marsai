/**
 * Header.jsx — MARSAI Festival
 *
 * ═══════════════════════════════════════════════════════════════
 * LAYOUT CENTRÉ (référence Image 4)
 *   [Accueil · Galerie]  ✦ MARSAI ✦  [Events · Soumettre · Contacter]
 *
 * ═══════════════════════════════════════════════════════════════
 * SYSTÈME 1 — CANVAS REFRACTED GLASS (14 faisceaux)
 *   Centre : ambre chaud #fbbf24 / #f97316  (cohérence HeroImpact)
 *   Radiation : #FFCCF2 → #977DFF → #0033FF → #0600AB → #00003D
 *   Technique : fillRect + linearGradient horizontal, zéro shadowBlur
 *   Chaque faisceau a sa propre phase sin + fréquence de dérive
 *
 * SYSTÈME 2 — FAISCEAU CURSEUR
 *   Spot ambre qui suit la souris, lerp dans le RAF (zéro React state)
 *   Amplifié ×2.8 quand le header est en hover
 *
 * SYSTÈME 3 — LOGO VOLUMÉTRIQUE
 *   Breathing glow ambre (coherence HeroImpact.jsx)
 *   Flash immédiat au mouseenter
 *
 * SYSTÈME 4 — HOVER NAV — EFFET VERRE PRISMATIQUE (Image 3)
 *   Un sweep iridescent traverse le texte à l'entrée :
 *   gradient cyan → violet → rose → or → transparent animé en
 *   backgroundPosition (GSAP, 320ms)
 *   Underline arc-en-ciel scaleX 0→1 (180ms power2.out)
 *   Lens flare canvas mini au bord droit
 *
 * SYSTÈME 5 — MOBILE OVERLAY GSAP PUR
 *   display none ↔ flex géré par GSAP
 *   5 liens (tous présents), stagger 80ms
 *   Ligne déco dégradé (palette Image 5)
 *
 * CORRECTIONS vs Header.jsx original :
 *   - document.body.style.overflow = '' (pas 'unset')
 *   - Tous les liens internes en <Link to>, ancres en <a href>
 *   - Soumettre + Contacter présents dans le mobile
 *   - "Le Festival" → "Accueil" (cohérence desktop)
 *   - Routing unifié
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─────────────────────────────────────────────────────────────
// PALETTE — Images 5 & 6 combinées
// 14 faisceaux, symétrie depuis le centre ambre
// ─────────────────────────────────────────────────────────────
const BEAM_COLORS = [
  // Index 0 → 6  : bord gauche → centre
  [  0,   0,  61],   // 0  #00003D — bleu nuit
  [  6,   0, 171],   // 1  #0600AB — bleu profond
  [  0,  51, 255],   // 2  #0033FF — bleu électrique
  [151, 125, 255],   // 3  #977DFF — violet
  [255, 204, 242],   // 4  #FFCCF2 — rose pâle chaud
  [249, 115,  22],   // 5  orange  — transition chaleur
  [251, 191,  36],   // 6  #fbbf24 — AMBRE (centre gauche)
  // Index 7 → 13 : centre → bord droit (miroir)
  [251, 191,  36],   // 7  #fbbf24 — AMBRE (centre droit)
  [249, 115,  22],   // 8  orange
  [255, 204, 242],   // 9  #FFCCF2 — rose pâle
  [151, 125, 255],   // 10 #977DFF — violet
  [  0,  51, 255],   // 11 #0033FF
  [  6,   0, 171],   // 12 #0600AB
  [  0,   0,  61],   // 13 #00003D
];

const BEAM_COUNT = BEAM_COLORS.length; // 14

// Opacités de base — centre plus lumineux
const BEAM_BASE_OPACITY = [
  0.045, 0.055, 0.070, 0.090,
  0.075, 0.120, 0.160,          // 0→6
  0.160, 0.120, 0.075,
  0.090, 0.070, 0.055, 0.045,  // 7→13
];

// Logo : texte-ombre cohérent avec HeroImpact
const LOGO_GLOW_IDLE =
  '0 0 8px rgba(255,200,70,0.55), 0 0 22px rgba(251,191,36,0.25), 0 0 45px rgba(180,83,9,0.12)';
const LOGO_GLOW_PEAK =
  '0 0 14px rgba(255,215,80,0.90), 0 0 38px rgba(251,191,36,0.55), 0 0 75px rgba(180,83,9,0.28)';
const LOGO_GLOW_HOVER =
  '0 0 20px rgba(255,215,80,1), 0 0 52px rgba(251,191,36,0.80), 0 0 95px rgba(180,83,9,0.42)';

// Navigation — deux groupes
const NAV_LEFT = [
  { label: 'Accueil', href: '/#accueil', isAnchor: true  },
  { label: 'Galerie', href: '/galerie',  isAnchor: false },
];
const NAV_RIGHT = [
  { label: 'Events',    href: '/events',    isAnchor: false },
  { label: 'Soumettre', href: '/soumettre', isAnchor: false },
  { label: 'Contacter', href: '/contact',   isAnchor: false },
];
const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT];

// ─────────────────────────────────────────────────────────────
// CLASSE — LightBeam
//
// Faisceau lumineux vertical, dérive sinusoïdale.
// Rendu : un seul fillRect par faisceau avec linearGradient
// horizontal → coût GPU ≈ 0.
// ─────────────────────────────────────────────────────────────
class LightBeam {
  constructor(index, W, H) {
    const [r, g, b]  = BEAM_COLORS[index];
    this.r           = r;
    this.g           = g;
    this.b           = b;
    this.W           = W;
    this.H           = H;
    this.xBase       = (W / BEAM_COUNT) * (index + 0.5);
    this.x           = this.xBase;
    // Chaque faisceau : fréquence et phase uniques → dérive organique
    this.freq        = 0.00025 + index * 0.000032 + Math.random() * 0.00018;
    this.phase       = index * 0.62 + Math.random() * 0.95;
    this.amplitude   = W * 0.048 + Math.random() * W * 0.022;
    this.halfW       = 18 + Math.random() * 22;
    this.baseOp      = BEAM_BASE_OPACITY[index];
    this.op          = this.baseOp;
  }

  update(t, targetMult) {
    this.x  = this.xBase + Math.sin(t * this.freq + this.phase) * this.amplitude;
    // Lerp opacité vers cible (hover amplifie ×2.8, idle ×1)
    this.op += (this.baseOp * targetMult - this.op) * 0.038;
  }

  draw(ctx) {
    const hw  = this.halfW * 2.5;
    const grd = ctx.createLinearGradient(this.x - hw, 0, this.x + hw, 0);
    grd.addColorStop(0,    'rgba(0,0,0,0)');
    grd.addColorStop(0.18, `rgba(${this.r},${this.g},${this.b},${this.op * 0.22})`);
    grd.addColorStop(0.50, `rgba(${this.r},${this.g},${this.b},${this.op})`);
    grd.addColorStop(0.82, `rgba(${this.r},${this.g},${this.b},${this.op * 0.22})`);
    grd.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(this.x - hw, 0, hw * 2, this.H);
  }
}

// ─────────────────────────────────────────────────────────────
// HOOK — useBeamCanvas
// Encapsule toute la logique canvas dans un hook propre
// ─────────────────────────────────────────────────────────────
function useBeamCanvas(canvasRef, headerRef) {
  const rafRef       = useRef(null);
  const beamsRef     = useRef([]);
  const tRef         = useRef(0);
  const hoveredRef   = useRef(false);
  const cursorXRef   = useRef(-9999);
  const cursorLerpX  = useRef(-9999);

  const buildBeams = useCallback((W, H) => {
    beamsRef.current = Array.from(
      { length: BEAM_COUNT },
      (_, i) => new LightBeam(i, W, H)
    );
  }, []);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    const header = headerRef.current;
    if (!canvas || !header) return;
    const W = header.offsetWidth;
    const H = header.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    buildBeams(W, H);

    const ctx = canvas.getContext('2d');

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      const t    = ++tRef.current;
      const hov  = hoveredRef.current;
      const mult = hov ? 2.8 : 1.0;

      ctx.clearRect(0, 0, W, H);

      // Faisceaux principaux
      beamsRef.current.forEach((b) => {
        b.update(t, mult);
        b.draw(ctx);
      });

      // Faisceau curseur (lerp fluide)
      if (hov) {
        cursorLerpX.current += (cursorXRef.current - cursorLerpX.current) * 0.12;
        const cx  = cursorLerpX.current;
        const hw  = 68;
        const grd = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
        grd.addColorStop(0,    'rgba(0,0,0,0)');
        grd.addColorStop(0.22, 'rgba(255,175,50,0.14)');
        grd.addColorStop(0.50, 'rgba(255,210,90,0.28)');
        grd.addColorStop(0.78, 'rgba(255,175,50,0.14)');
        grd.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(cx - hw, 0, hw * 2, H);
      }
    };

    render();
  }, [canvasRef, headerRef, buildBeams]);

  // Mouse tracking
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onEnter = ()  => { hoveredRef.current = true; };
    const onLeave = ()  => {
      hoveredRef.current   = false;
      cursorXRef.current   = -9999;
      cursorLerpX.current  = -9999;
    };
    const onMove  = (e) => {
      cursorXRef.current = e.clientX - header.getBoundingClientRect().left;
    };

    header.addEventListener('mouseenter', onEnter);
    header.addEventListener('mouseleave', onLeave);
    header.addEventListener('mousemove',  onMove, { passive: true });
    return () => {
      header.removeEventListener('mouseenter', onEnter);
      header.removeEventListener('mouseleave', onLeave);
      header.removeEventListener('mousemove',  onMove);
    };
  }, [headerRef]);

  // Resize
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      const header = headerRef.current;
      if (!canvas || !header) return;
      const W = header.offsetWidth;
      const H = header.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      buildBeams(W, H);
    });
    if (headerRef.current) ro.observe(headerRef.current);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, headerRef, buildBeams]);

  return { start };
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT — NavLink desktop avec effet prisme de verre
//
// À l'entrée :
//   ① Sweep iridescent traverse le texte (backgroundPosition GSAP)
//   ② Underline arc-en-ciel scaleX 0→1
//   ③ Lens flare au bord droit
//   ④ Texte → blanc chaud
// ─────────────────────────────────────────────────────────────
const NavLink = ({ item }) => {
  const wrapRef   = useRef(null);
  const shardRef  = useRef(null);
  const prismRef  = useRef(null);
  const flareRef  = useRef(null);

  const onEnter = useCallback(() => {
    const wrap  = wrapRef.current;
    const shard = shardRef.current;
    const prism = prismRef.current;
    const flare = flareRef.current;
    if (!wrap) return;

    gsap.killTweensOf([wrap, shard, prism, flare]);

    // Texte blanc chaud
    gsap.to(wrap, { color: '#fffef0', duration: 0.14, ease: 'power1.out' });

    // Sweep prismatique
    gsap.fromTo(
      prism,
      { backgroundPosition: '-200% center', opacity: 0.85 },
      { backgroundPosition: '200% center',  opacity: 0,
        duration: 0.52, ease: 'power1.inOut' }
    );

    // Underline arc-en-ciel
    gsap.fromTo(
      shard,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, opacity: 1, duration: 0.20, ease: 'power2.out' }
    );

    // Flare droit
    gsap.fromTo(
      flare,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, delay: 0.14, ease: 'back.out(2.5)' }
    );
    gsap.to(flare, { scale: 0, opacity: 0, duration: 0.18, delay: 0.45 });

  }, []);

  const onLeave = useCallback(() => {
    const wrap  = wrapRef.current;
    const shard = shardRef.current;
    if (!wrap) return;
    gsap.killTweensOf([wrap, shard]);
    gsap.to(wrap,  { color: '',     duration: 0.18 });
    gsap.to(shard, { scaleX: 0, opacity: 0, duration: 0.14, ease: 'power2.in' });
  }, []);

  const inner = (
    <span
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative inline-block text-[0.66rem] font-bold uppercase tracking-[0.20em] text-zinc-300 cursor-pointer select-none"
      style={{ willChange: 'color' }}
    >
      {item.label}

      {/*
       * Overlay sweep prismatique — Image 3 (cubes de glace)
       * gradient iridescent cyan → violet → rose → ambre
       * backgroundSize 400% — animé en backgroundPosition
       */}
      <span
        ref={prismRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:    'linear-gradient(105deg, transparent 0%, rgba(0,220,255,0.18) 15%, rgba(200,0,255,0.16) 30%, rgba(255,100,200,0.14) 45%, rgba(255,210,50,0.18) 60%, rgba(0,220,200,0.14) 75%, transparent 100%)',
          backgroundSize:     '400% 100%',
          backgroundPosition: '-200% center',
          opacity:            0,
          mixBlendMode:       'screen',
          borderRadius:       '2px',
        }}
      />

      {/* Underline arc-en-ciel */}
      <span
        ref={shardRef}
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-[-4px] h-[1px] origin-left"
        style={{
          background:  'linear-gradient(90deg, #0033ff 0%, #977dff 22%, #fff5dc 44%, #fbbf24 56%, #977dff 78%, #0033ff 100%)',
          boxShadow:   '0 0 5px rgba(151,125,255,0.60), 0 0 12px rgba(251,191,36,0.40)',
          transform:   'scaleX(0)',
          opacity:     0,
        }}
      />

      {/* Lens flare coin droit */}
      <span
        ref={flareRef}
        aria-hidden="true"
        className="absolute -bottom-1 right-0 w-[7px] h-[7px] rounded-full"
        style={{
          background:  'radial-gradient(circle, rgba(255,245,180,0.95) 0%, rgba(151,125,255,0.50) 55%, transparent 100%)',
          transform:   'scale(0)',
          opacity:     0,
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
  const canvasRef    = useRef(null);
  const logoRef      = useRef(null);
  const overlayRef   = useRef(null);
  const mobileNavRef = useRef(null);
  const burgerRef    = useRef(null);

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { start } = useBeamCanvas(canvasRef, headerRef);

  // ── Scroll listener ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mobile overlay GSAP ──────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const nav     = mobileNavRef.current;
    const burger  = burgerRef.current;
    if (!overlay || !nav) return;

    const items = nav.querySelectorAll('.m-link');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay,  { opacity: 1, duration: 0.42, ease: 'power2.out' });
      gsap.fromTo(
        items,
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

  // ── Logo hover ───────────────────────────────────────────
  const onLogoEnter = useCallback(() => {
    gsap.to(logoRef.current, {
      textShadow: LOGO_GLOW_HOVER, duration: 0.22, ease: 'power2.out',
    });
  }, []);
  const onLogoLeave = useCallback(() => {
    gsap.to(logoRef.current, {
      textShadow: LOGO_GLOW_IDLE, duration: 0.38, ease: 'power2.out',
    });
  }, []);

  // ── GSAP montage ─────────────────────────────────────────
  useGSAP(() => {
    // Démarrer le canvas
    start();

    // Entrée header
    gsap.from(headerRef.current, {
      y: -28, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.25,
    });

    // Logo breathing glow
    gsap.fromTo(
      logoRef.current,
      { textShadow: LOGO_GLOW_IDLE },
      {
        textShadow: LOGO_GLOW_PEAK,
        duration:   3.0,
        repeat:     -1,
        yoyo:       true,
        ease:       'sine.inOut',
        delay:      1.0,
      }
    );

  }, { dependencies: [], revertOnUpdate: false });

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════
          HEADER FIXE
      ══════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className={`
          fixed top-0 left-0 w-full z-[100] overflow-hidden
          transition-[background,border-color,box-shadow] duration-500
          ${scrolled
            ? 'bg-black/92 border-b border-white/10 shadow-[0_2px_30px_rgba(0,0,0,0.55)]'
            : 'bg-black/55 border-b border-white/[0.04]'}
        `}
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/*
         * CANVAS FAISCEAUX RÉFRACTÉS
         * z-0, mix-blend-mode screen, pointer-events none
         * Ne bloque aucune interaction
         */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{ zIndex: 0, mixBlendMode: 'screen' }}
        />

        {/*
         * CONTENU HEADER (z-10)
         * Grille : 3 colonnes — nav gauche / logo / nav droite
         * Chaque colonne = 1fr pour centrer parfaitement le logo
         */}
        <div
          className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10"
          style={{ height: '64px' }}
        >

          {/* ── Col 1 : Nav gauche ── */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 justify-start">
            {NAV_LEFT.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* ── Col 2 : Logo centré ── */}
          <div className="flex items-center justify-center gap-2 md:gap-3">

            {/* Ornement gauche */}
            <span
              aria-hidden="true"
              className="hidden md:block text-amber-400/50 text-[0.55rem] select-none leading-none"
            >
              ✦
            </span>

            {/* LOGO */}
            <Link
              to="/"
              aria-label="MARSAI — retour à l'accueil"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-sm"
            >
              <span
                ref={logoRef}
                onMouseEnter={onLogoEnter}
                onMouseLeave={onLogoLeave}
                className="
                  block font-black uppercase select-none cursor-pointer
                  text-white tracking-[-0.04em] leading-none
                "
                style={{
                  fontSize:   'clamp(1.05rem, 2.0vw, 1.45rem)',
                  textShadow: LOGO_GLOW_IDLE,
                  willChange: 'text-shadow',
                }}
              >
                MARSAI
              </span>
            </Link>

            {/* Ornement droit */}
            <span
              aria-hidden="true"
              className="hidden md:block text-amber-400/50 text-[0.55rem] select-none leading-none"
            >
              ✦
            </span>
          </div>

          {/* ── Col 3 : Nav droite ── */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 justify-end">
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* ── Burger mobile — extrémité droite ── */}
          <div className="md:hidden col-start-3 flex justify-end">
            <button
              ref={burgerRef}
              onClick={() => setIsOpen((v) => !v)}
              className="relative z-[110] w-10 h-10 flex flex-col items-end justify-center gap-[5px] focus:outline-none"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
            >
              {/* Barre 1 */}
              <span
                className="block bg-white transition-all duration-300 origin-right"
                style={{
                  height:    '1.5px',
                  width:     isOpen ? '1.4rem' : '1.9rem',
                  transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none',
                }}
              />
              {/* Barre 2 */}
              <span
                className="block bg-white transition-all duration-300"
                style={{
                  height:  '1.5px',
                  width:   isOpen ? 0 : '1.4rem',
                  opacity: isOpen ? 0 : 1,
                }}
              />
              {/* Barre 3 */}
              <span
                className="block bg-white transition-all duration-300 origin-right"
                style={{
                  height:    '1.5px',
                  width:     isOpen ? '1.4rem' : '0.9rem',
                  transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          OVERLAY MOBILE
          Géré intégralement par GSAP
          display none ↔ flex — pas de Tailwind toggle
      ══════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[105] flex-col items-center justify-center md:hidden"
        style={{
          display:   'none',
          opacity:   0,
          background:'rgba(0,0,0,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/*
         * Ligne déco — dégradé palette Image 5
         * Marque la séparation avec le header
         */}
        <div
          aria-hidden="true"
          className="absolute top-[64px] left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,51,255,0.35) 15%, rgba(151,125,255,0.50) 35%, rgba(251,191,36,0.65) 50%, rgba(151,125,255,0.50) 65%, rgba(0,51,255,0.35) 85%, transparent 100%)',
          }}
        />

        {/* Liens */}
        <nav
          ref={mobileNavRef}
          className="flex flex-col items-center gap-8"
          aria-label="Navigation principale"
        >
          {NAV_ALL.map((item) => (
            <span key={item.href} className="m-link" style={{ opacity: 0 }}>
              {item.isAnchor ? (
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[1.75rem] font-black uppercase tracking-[0.14em] text-white hover:text-amber-300 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[1.75rem] font-black uppercase tracking-[0.14em] text-white hover:text-amber-300 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Logo fantôme en bas */}
        <div
          aria-hidden="true"
          className="absolute bottom-9 font-black uppercase tracking-[-0.04em] select-none"
          style={{
            fontSize:   '0.85rem',
            color:      'transparent',
            background: 'linear-gradient(90deg, rgba(0,51,255,0.3), rgba(151,125,255,0.4), rgba(251,191,36,0.5), rgba(151,125,255,0.4), rgba(0,51,255,0.3))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
          }}
        >
          MARSAI
        </div>
      </div>
    </>
  );
}