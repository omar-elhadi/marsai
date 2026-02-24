/**
 * LuminousButton.jsx — MARSAI Festival
 * v3 — Visuel sable/ivoire (v1) + Phase 3 overlay document.body (fix)
 *
 * PHASE 1 IDLE  : barre ivoire sable, halo triple couche, keyframe 3s
 * PHASE 2 HOVER : halo × 2.5, bloom texte, barre scale(1.15)
 * PHASE 3 CLICK : explosion radiale crème depuis document.body
 *                 (jamais dans l'arbre React → immunisé stacking context)
 */

import { useRef, useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import gsap                 from 'gsap';

// ── Keyframes sable/ivoire ────────────────────────────────────
const KF = `
  @keyframes lb-bar-breathe {
    0%   { opacity:.78; box-shadow:
             0 0  6px rgba(226,209,195,.82),
             0 0 14px rgba(226,209,195,.36),
             0 0 28px rgba(226,209,195,.13); }
    100% { opacity:1;   box-shadow:
             0 0 10px rgba(226,209,195,.98),
             0 0 22px rgba(226,209,195,.52),
             0 0 44px rgba(226,209,195,.22); }
  }
  @keyframes lb-btn-breathe {
    0%   { box-shadow: 0 0  8px rgba(226,209,195,.07); }
    100% { box-shadow: 0 0 20px rgba(226,209,195,.15); }
  }
`;
let _kf = false;
function injectKF() {
  if (_kf || typeof document === 'undefined') return;
  _kf = true;
  const s = document.createElement('style');
  s.textContent = KF;
  document.head.appendChild(s);
}

export default function LuminousButton({
  label   = 'Soumettre',
  to      = '/soumettre',
  variant = 'dark',   // 'dark' | 'light'
  size    = 'sm',     // 'sm' | 'lg'
}) {
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const btnRef   = useRef(null);
  const navigate = useNavigate();
  injectKF();

  const isLg    = size === 'lg';
  const isLight = variant === 'light';

  // Palette sable/ivoire — identique à la vision d'origine
  const accentColor = 'rgba(226,209,195,1)';
  const accentDim   = 'rgba(226,209,195,0.30)';

  const textIdle  = isLight ? 'rgba(15,15,15,.82)'  : accentColor;
  const textHov   = isLight ? '#ffffff'              : '#000000';
  const bgHov     = isLight ? '#0f0f0f'              : accentColor;
  const bdIdle    = isLight ? 'rgba(15,15,15,.20)'   : accentDim;
  const bdHov     = isLight ? '#0f0f0f'              : accentColor;

  // PHASE 3 — overlay impératif sur document.body
  const handleClick = (e) => {
    e.preventDefault();
    if (clicking) return;
    setClicking(true);

    const barEl = btnRef.current?.querySelector('[data-lb-bar]');
    const rect  = (barEl ?? btnRef.current).getBoundingClientRect();
    const ox    = rect.left + rect.width  / 2;
    const oy    = rect.top  + rect.height / 2;

    const ov = document.createElement('div');
    ov.setAttribute('aria-hidden', 'true');
    // Gradient crème/sable vers noir — cohérence visuelle du site
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'pointer-events:none',
      `background:radial-gradient(circle at center,
        #fffdf5 0%, #f1e8d8 20%, #e2d1c3 45%, #9a7a60 75%, #000000 100%)`,
    ].join(';');
    document.body.appendChild(ov);

    gsap.fromTo(ov,
      { clipPath: `circle(0px at ${ox}px ${oy}px)` },
      {
        clipPath:  `circle(200vmax at ${ox}px ${oy}px)`,
        duration:  0.72,
        ease:      'power2.inOut',
        onComplete() {
          gsap.to(ov, {
            opacity:  0, duration: 0.22, ease: 'power1.in',
            onComplete() {
              navigate(to);
              setTimeout(() => { ov.remove(); setClicking(false); }, 400);
            },
          });
        },
      }
    );
  };

  // Halo selon état
  const barShadowIdle = `
    0 0 ${isLg?'9px':'6px'}   rgba(226,209,195,.82),
    0 0 ${isLg?'20px':'14px'} rgba(226,209,195,.36),
    0 0 ${isLg?'38px':'26px'} rgba(226,209,195,.13)`;
  const barShadowHover = `
    0 0 ${isLg?'16px':'12px'} rgba(226,209,195,1.00),
    0 0 ${isLg?'36px':'26px'} rgba(226,209,195,.65),
    0 0 ${isLg?'62px':'46px'} rgba(226,209,195,.30)`;

  return (
    <a
      ref={btnRef}
      href={to}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${label} — festival MARSAI`}
      style={{
        position:                'relative',
        display:                 'inline-flex',
        alignItems:              'center',
        gap:                     isLg ? '14px' : '10px',
        padding:                 isLg
          ? 'clamp(.85rem,1.3vw,1.15rem) clamp(1.8rem,2.5vw,2.4rem) clamp(.85rem,1.3vw,1.15rem) clamp(1.3rem,1.8vw,1.8rem)'
          : '.55rem 1.1rem .55rem .85rem',
        fontFamily:              'var(--font-sans)',
        fontWeight:              700,
        fontSize:                isLg ? 'clamp(.78rem,1.1vw,.92rem)' : 'clamp(.60rem,.82vw,.70rem)',
        letterSpacing:           '.18em',
        textTransform:           'uppercase',
        textDecoration:          'none',
        cursor:                  'pointer',
        userSelect:              'none',
        WebkitTapHighlightColor: 'transparent',
        borderRadius:            'var(--radius-pill)',
        border:                  `1px solid ${hovered ? bdHov : bdIdle}`,
        background:              hovered ? bgHov : 'transparent',
        color:                   hovered ? textHov : textIdle,
        // Souffle extérieur idle
        animation:               hovered ? 'none' : 'lb-btn-breathe 3s ease-in-out alternate infinite',
        // Halo bouton hover
        boxShadow:               hovered
          ? `0 0 ${isLg?'28px':'20px'} rgba(226,209,195,.22),
             0 0 ${isLg?'10px':'6px'}  rgba(226,209,195,.10)`
          : undefined,
        // Bloom texte hover
        textShadow:              hovered
          ? '0 0 12px rgba(226,209,195,.90), 0 0 24px rgba(226,209,195,.48)'
          : 'none',
        transition:              `background 350ms var(--ease-out),
                                  color      350ms var(--ease-out),
                                  border-color 350ms var(--ease-out),
                                  box-shadow 350ms var(--ease-out),
                                  text-shadow 350ms var(--ease-out)`,
        overflow:                'visible',
      }}
    >
      {/* Barre lumineuse sable/ivoire */}
      <span
        data-lb-bar
        aria-hidden="true"
        style={{
          display:      'block',
          width:        '2px',
          height:       isLg ? '20px' : '14px',
          borderRadius: '1px',
          background:   hovered ? (isLight ? '#000' : accentColor) : accentColor,
          flexShrink:   0,
          transform:    hovered ? 'scaleY(1.15)' : 'scaleY(1)',
          // PHASE 1 : respiration sable
          animation:    hovered ? 'none' : 'lb-bar-breathe 3s ease-in-out alternate infinite',
          // PHASE 2 : halo intensifié
          boxShadow:    hovered ? barShadowHover : undefined,
          transition:   'transform 350ms var(--ease-out), box-shadow 350ms var(--ease-out)',
        }}
      />

      <span style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {label}
      </span>
    </a>
  );
}