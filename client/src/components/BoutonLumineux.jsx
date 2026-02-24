/**
 * LuminousButton.jsx — MARSAI Festival
 * Le bouton signature. Trois phases. Aucun compromis.
 *
 * ═══════════════════════════════════════════════════════════════
 * PHASE 1 — IDLE : La barre qui respire
 *   Halo triple couche en keyframe infini 3s.
 *   Pulse organique — une flamme, pas une LED.
 *   Le bouton existe avant qu'on le remarque.
 *
 * PHASE 2 — HOVER : L'intensification
 *   Halo × 2.2 — spread 8→18px / 18→40px / 32→65px
 *   Bloom sur le texte via text-shadow
 *   Barre scale(1.2) + opacité pleine
 *   Transition 400ms — graduel, jamais abrupt
 *
 * PHASE 3 — CLICK : La révélation
 *   Un cercle de lumière explose depuis la barre
 *   clip-path circle(0 at X,Y) → circle(200vmax at X,Y)
 *   GSAP 700ms power2.inOut
 *   Flash final opacity → 0 avant navigation
 *   navigate('/soumettre') — la page charge dans la lumière
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────
// KEYFRAMES — injectées une seule fois dans le document
// ─────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes marsai-bar-breathe {
    0%   { opacity: 0.75; box-shadow:
             0 0  6px rgba(226,209,195,0.80),
             0 0 14px rgba(226,209,195,0.35),
             0 0 26px rgba(226,209,195,0.12); }
    100% { opacity: 1.00; box-shadow:
             0 0 10px rgba(226,209,195,0.95),
             0 0 22px rgba(226,209,195,0.50),
             0 0 42px rgba(226,209,195,0.20); }
  }
  @keyframes marsai-btn-breathe {
    0%   { box-shadow:
             0 0  8px rgba(226,209,195,0.08),
             inset 0 0 0px rgba(226,209,195,0); }
    100% { box-shadow:
             0 0 18px rgba(226,209,195,0.16),
             inset 0 0 12px rgba(226,209,195,0.04); }
  }
`;

let _keyframesInjected = false;
function ensureKeyframes() {
  if (_keyframesInjected) return;
  const style = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  _keyframesInjected = true;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function LuminousButton({
  label    = 'Soumettre',
  to       = '/soumettre',
  // Variante claire (section CTA sur fond blanc cassé)
  variant  = 'dark',   // 'dark' | 'light'
  size     = 'sm',     // 'sm' (navbar) | 'lg' (CTA section)
}) {
  const [hovered,   setHovered]   = useState(false);
  const [clicking,  setClicking]  = useState(false);
  const buttonRef   = useRef(null);
  const overlayRef  = useRef(null);
  const navigate    = useNavigate();

  // Inject keyframes on first render
  if (typeof document !== 'undefined') ensureKeyframes();

  // ── Palette selon la variante ─────────────────────────────
  const isDark = variant === 'dark';

  const barColor    = isDark ? '#e2d1c3' : '#0f0f0f';
  const barGlow     = isDark
    ? 'rgba(226,209,195,{a})'
    : 'rgba(15,15,15,{a})';

  const textColor   = hovered
    ? (isDark ? '#000000' : '#f1f5f9')
    : (isDark ? '#e2d1c3' : '#0f0f0f');

  const btnBg       = hovered
    ? (isDark ? '#e2d1c3' : '#0f0f0f')
    : 'transparent';

  const borderColor = hovered
    ? (isDark ? '#e2d1c3' : '#0f0f0f')
    : (isDark ? 'rgba(226,209,195,0.30)' : 'rgba(15,15,15,0.30)');

  const glowColor = (a) => barGlow.replace('{a}', a);

  // ── Tailles ───────────────────────────────────────────────
  const isLg = size === 'lg';

  // ── Styles barre ─────────────────────────────────────────
  const barStyle = {
    display:      'block',
    width:        '2px',
    height:       isLg ? '20px' : '14px',
    borderRadius: '1px',
    background:   barColor,
    flexShrink:   0,
    transform:    hovered ? 'scaleY(1.2)' : 'scaleY(1)',
    transition:   'transform 400ms var(--ease-out), box-shadow 400ms var(--ease-out)',
    // PHASE 1 idle — animation keyframe
    animation:    hovered
      ? 'none'
      : 'marsai-bar-breathe 3s ease-in-out alternate infinite',
    // PHASE 2 hover — halo intensifié
    boxShadow: hovered
      ? `0 0 ${isLg ? '18px' : '14px'} ${glowColor('1.0')},
         0 0 ${isLg ? '40px' : '32px'} ${glowColor('0.60')},
         0 0 ${isLg ? '70px' : '54px'} ${glowColor('0.28')}`
      : undefined, // géré par keyframe en idle
  };

  // ── Styles bouton ─────────────────────────────────────────
  const btnStyle = {
    position:       'relative',
    display:        'inline-flex',
    alignItems:     'center',
    gap:            isLg ? '14px' : '10px',
    padding:        isLg
      ? 'clamp(0.9rem,1.4vw,1.2rem) clamp(1.8rem,2.5vw,2.5rem) clamp(0.9rem,1.4vw,1.2rem) clamp(1.4rem,2vw,2rem)'
      : '0.55rem 1.1rem 0.55rem 0.85rem',
    fontFamily:     'var(--font-sans)',
    fontWeight:     700,
    fontSize:       isLg
      ? 'clamp(0.78rem,1.1vw,0.92rem)'
      : 'clamp(0.60rem,0.82vw,0.70rem)',
    letterSpacing:  '0.18em',
    textTransform:  'uppercase',
    color:          textColor,
    background:     btnBg,
    border:         `1px solid ${borderColor}`,
    borderRadius:   'var(--radius-pill)',
    textDecoration: 'none',
    cursor:         'pointer',
    overflow:       'hidden',
    userSelect:     'none',
    WebkitTapHighlightColor: 'transparent',
    // PHASE 1 idle — souffle autour du bouton
    animation:      hovered
      ? 'none'
      : 'marsai-btn-breathe 3s ease-in-out alternate infinite',
    // PHASE 2 hover — glow extérieur + texte bloom
    boxShadow: hovered
      ? `0 0 ${isLg ? '28px' : '20px'} ${glowColor('0.25')},
         0 0 ${isLg ? '10px' : '6px'}  ${glowColor('0.12')}`
      : undefined,
    textShadow: hovered && isDark
      ? `0 0 12px rgba(226,209,195,0.9), 0 0 24px rgba(226,209,195,0.5)`
      : hovered && !isDark
      ? `0 0 12px rgba(241,245,249,0.8), 0 0 24px rgba(241,245,249,0.4)`
      : 'none',
    transition: `background     400ms var(--ease-out),
                 color          400ms var(--ease-out),
                 border-color   400ms var(--ease-out),
                 box-shadow     400ms var(--ease-out),
                 text-shadow    400ms var(--ease-out)`,
  };

  // ── PHASE 3 — Handler click ────────────────────────────────
  const handleClick = (e) => {
    e.preventDefault();
    if (clicking) return;
    setClicking(true);

    // Position exacte du bouton / de la barre dans la page
    const btn  = buttonRef.current;
    const rect = btn.getBoundingClientRect();

    // Centre de la barre lumineuse (2ème enfant du bouton)
    const barEl  = btn.querySelector('[data-bar]');
    const barRect = barEl ? barEl.getBoundingClientRect() : rect;
    const originX = barRect.left + barRect.width  / 2;
    const originY = barRect.top  + barRect.height / 2;

    const overlay = overlayRef.current;

    // Positionner l'overlay
    gsap.set(overlay, {
      clipPath: `circle(0px at ${originX}px ${originY}px)`,
      opacity:  1,
      display:  'block',
    });

    // Explosion circulaire depuis la barre
    gsap.to(overlay, {
      clipPath:  `circle(200vmax at ${originX}px ${originY}px)`,
      duration:  0.70,
      ease:      'power2.inOut',
      onComplete() {
        // Court flash blanc au sommet — puis navigation
        gsap.to(overlay, {
          opacity:  0,
          duration: 0.18,
          delay:    0.04,
          ease:     'power1.in',
          onComplete() {
            navigate(to);
            // Reset pour le retour éventuel
            setTimeout(() => {
              setClicking(false);
              gsap.set(overlay, { display: 'none', opacity: 1,
                clipPath: 'circle(0px at 50% 50%)' });
            }, 600);
          },
        });
      },
    });
  };

  // ── Overlay de transition — fixé au viewport ─────────────
  const overlayStyle = {
    position:   'fixed',
    inset:      0,
    zIndex:     9999,
    background: isDark
      ? 'radial-gradient(circle, #f1f5f9 0%, #e2d1c3 60%, #c8b49a 100%)'
      : 'radial-gradient(circle, #000000 0%, #0f0f0f 60%, #1a1a1a 100%)',
    display:    'none',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Overlay de transition Phase 3 */}
      <div ref={overlayRef} style={overlayStyle} aria-hidden="true" />

      {/* Le bouton */}
      <a
        ref={buttonRef}
        href={to}
        style={btnStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        aria-label={`${label} — soumettre un film au festival MARSAI`}
      >
        {/* Barre lumineuse signature */}
        <span data-bar aria-hidden="true" style={barStyle} />

        {/* Texte */}
        <span style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
          {label}
        </span>
      </a>
    </>
  );
}