/**
 * LuminousButton.jsx — MARSAI Festival
 * v2 — Filament vivant + Phase 3 fix complet
 */

import { useRef, useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import gsap                 from 'gsap';

const KEYFRAMES_CSS = `
  @keyframes lb-flicker {
    0%,100% { opacity:1;    filter:brightness(1.00); }
    30%      { opacity:0.88; filter:brightness(0.88); }
    32%      { opacity:1;    filter:brightness(1.22); }
    60%      { opacity:0.94; filter:brightness(0.94); }
    62%      { opacity:1;    filter:brightness(1.12); }
  }
  @keyframes lb-ray-breathe {
    0%   { opacity:0.50; transform:translateY(-50%) scaleX(0.65); }
    100% { opacity:0.88; transform:translateY(-50%) scaleX(1.00); }
  }
  @keyframes lb-bloom-breathe {
    0%   { opacity:0.40; transform:translate(-50%,-50%) scale(0.80); }
    100% { opacity:0.72; transform:translate(-50%,-50%) scale(1.20); }
  }
  @keyframes lb-btn-breathe {
    0%   { box-shadow: 0 0  8px rgba(255,190,40,0.05); }
    100% { box-shadow: 0 0 24px rgba(255,190,40,0.13); }
  }
`;

let _injected = false;
function injectKeyframes() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const s = document.createElement('style');
  s.textContent = KEYFRAMES_CSS;
  document.head.appendChild(s);
}

const C = {
  core:  '#ffffff',
  hot:   '#fff5a0',
  gold:  '#ffc830',
  amber: '#ff8c14',
  g1:    'rgba(255,210,60,0.92)',
  g2:    'rgba(255,140,20,0.55)',
  g3:    'rgba(200,70,10,0.18)',
  g4:    'rgba(140,40,0,0.06)',
};

export default function LuminousButton({
  label   = 'Soumettre',
  to      = '/soumettre',
  variant = 'dark',
  size    = 'sm',
}) {
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const btnRef   = useRef(null);
  const navigate = useNavigate();

  injectKeyframes();

  const isLg    = size === 'lg';
  const isLight = variant === 'light';

  const textIdle  = isLight ? 'rgba(15,15,15,0.82)'   : 'rgba(255,220,140,0.90)';
  const textHov   = isLight ? '#ffffff'                : '#000000';
  const bgHov     = isLight ? '#0f0f0f'                : '#ffc830';
  const bdIdle    = isLight ? 'rgba(15,15,15,0.18)'    : 'rgba(255,180,40,0.22)';
  const bdHov     = isLight ? '#0f0f0f'                : '#ffc830';

  // PHASE 3 — overlay impératif sur document.body
  // Jamais dans React tree → immunisé contre les transform parents GSAP
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
    ov.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'pointer-events:none',
      `background:radial-gradient(circle at center,
        #fffde0 0%,#ffd060 22%,#ff8c14 52%,#3a1200 82%,#000000 100%)`,
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
            opacity:  0,
            duration: 0.20,
            ease:     'power1.in',
            onComplete() {
              navigate(to);
              setTimeout(() => { ov.remove(); setClicking(false); }, 400);
            },
          });
        },
      }
    );
  };

  const BAR_W   = isLg ? '3px'  : '2px';
  const BAR_H   = isLg ? '22px' : '15px';
  const RAY_W   = hovered ? (isLg ? '58px' : '40px') : (isLg ? '30px' : '21px');
  const BLOOM_S = hovered ? (isLg ? '82px' : '58px') : (isLg ? '44px' : '31px');

  return (
    <a
      ref={btnRef}
      href={to}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${label} — festival MARSAI`}
      style={{
        position:        'relative',
        display:         'inline-flex',
        alignItems:      'center',
        gap:             isLg ? '16px' : '10px',
        padding:         isLg
          ? 'clamp(0.85rem,1.3vw,1.15rem) clamp(1.8rem,2.5vw,2.4rem) clamp(0.85rem,1.3vw,1.15rem) clamp(1.3rem,1.8vw,1.8rem)'
          : '0.55rem 1.1rem 0.55rem 0.85rem',
        fontFamily:      'var(--font-sans)',
        fontWeight:      700,
        fontSize:        isLg ? 'clamp(0.78rem,1.1vw,0.92rem)' : 'clamp(0.60rem,0.82vw,0.70rem)',
        letterSpacing:   '0.18em',
        textTransform:   'uppercase',
        textDecoration:  'none',
        cursor:          'pointer',
        userSelect:      'none',
        WebkitTapHighlightColor: 'transparent',
        borderRadius:    'var(--radius-pill)',
        border:          `1px solid ${hovered ? bdHov : bdIdle}`,
        background:      hovered ? bgHov : 'transparent',
        color:           hovered ? textHov : textIdle,
        boxShadow:       hovered
          ? `0 0 ${isLg?'34px':'22px'} rgba(255,180,40,0.20), 0 0 ${isLg?'12px':'7px'} rgba(255,180,40,0.10)`
          : undefined,
        animation:       hovered ? 'none' : 'lb-btn-breathe 3.5s ease-in-out alternate infinite',
        textShadow:      hovered
          ? '0 0 14px rgba(255,220,80,0.85), 0 0 30px rgba(255,160,30,0.45)'
          : 'none',
        transition:      'background 380ms var(--ease-out), color 380ms var(--ease-out), border-color 380ms var(--ease-out), box-shadow 380ms var(--ease-out), text-shadow 380ms var(--ease-out)',
        overflow:        'visible',
      }}
    >
      {/* ── BARRE LUMINEUSE — 4 couches ──────────────────────
          Référence : lumière.jpg — filament incandescent
          Cœur blanc-or + rayons horizontaux + bloom radial
          ────────────────────────────────────────────────── */}
      <span
        data-lb-bar
        aria-hidden="true"
        style={{
          position:       'relative',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          BAR_W,
          height:         BAR_H,
          flexShrink:     0,
          overflow:       'visible',
        }}
      >
        {/* Couche 1 — Corps : gradient vertical chaud */}
        <span style={{
          position:     'absolute',
          inset:        0,
          borderRadius: '2px',
          background:   `linear-gradient(to bottom,
            transparent 0%,
            ${C.amber}  8%,
            ${C.gold}   25%,
            ${C.hot}    44%,
            ${C.core}   50%,
            ${C.hot}    56%,
            ${C.gold}   75%,
            ${C.amber}  92%,
            transparent 100%)`,
          boxShadow:    hovered
            ? `0 0 ${isLg?'18px':'12px'} ${C.g1},
               0 0 ${isLg?'40px':'27px'} ${C.g2},
               0 0 ${isLg?'68px':'46px'} ${C.g3},
               0 0 ${isLg?'100px':'70px'} ${C.g4}`
            : `0 0 ${isLg?'10px':'7px'}  ${C.g1},
               0 0 ${isLg?'22px':'15px'} ${C.g2},
               0 0 ${isLg?'40px':'28px'} ${C.g3},
               0 0 ${isLg?'65px':'45px'} ${C.g4}`,
          animation:    hovered ? 'none' : 'lb-flicker 4s ease-in-out infinite',
          transition:   'box-shadow 400ms var(--ease-out)',
        }} />

        {/* Couche 2 — Cœur 1px blanc absolu */}
        <span style={{
          position:     'absolute',
          top:          '12%',
          bottom:       '12%',
          left:         '50%',
          width:        '1px',
          transform:    'translateX(-50%)',
          borderRadius: '1px',
          background:   `linear-gradient(to bottom,
            transparent, ${C.hot} 15%, ${C.core} 50%, ${C.hot} 85%, transparent)`,
          opacity:      hovered ? 1 : 0.82,
          filter:       `blur(${hovered ? '0.2' : '0.4'}px)`,
          transition:   'opacity 380ms, filter 380ms',
        }} />

        {/* Couche 3a — Rayon horizontal DROIT */}
        <span style={{
          position:        'absolute',
          top:             '50%',
          left:            '100%',
          transformOrigin: 'left center',
          width:           RAY_W,
          height:          hovered ? '2px' : '1.5px',
          marginLeft:      '1px',
          background:      `linear-gradient(to right,
            ${C.g1} 0%,
            rgba(255,150,25,0.40) 45%,
            rgba(200,80,10,0.12) 72%,
            transparent 100%)`,
          borderRadius:    '0 1px 1px 0',
          animation:       hovered ? 'none' : 'lb-ray-breathe 3s ease-in-out alternate infinite',
          transition:      'width 380ms var(--ease-out), height 350ms',
        }} />

        {/* Couche 3b — Rayon horizontal GAUCHE */}
        <span style={{
          position:        'absolute',
          top:             '50%',
          right:           '100%',
          transformOrigin: 'right center',
          width:           RAY_W,
          height:          hovered ? '2px' : '1.5px',
          marginRight:     '1px',
          background:      `linear-gradient(to left,
            ${C.g1} 0%,
            rgba(255,150,25,0.40) 45%,
            rgba(200,80,10,0.12) 72%,
            transparent 100%)`,
          borderRadius:    '1px 0 0 1px',
          animation:       hovered ? 'none' : 'lb-ray-breathe 3s ease-in-out alternate infinite',
          transition:      'width 380ms var(--ease-out), height 350ms',
        }} />

        {/* Couche 4 — Bloom radial ambiant */}
        <span style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          width:        BLOOM_S,
          height:       BLOOM_S,
          borderRadius: '50%',
          background:   `radial-gradient(circle,
            rgba(255,225,90,0.58) 0%,
            rgba(255,140,22,0.22) 50%,
            transparent 100%)`,
          filter:       `blur(${hovered ? '5' : '4'}px)`,
          pointerEvents:'none',
          animation:    hovered ? 'none' : 'lb-bloom-breathe 3s ease-in-out alternate infinite',
          transition:   'width 380ms var(--ease-out), height 380ms var(--ease-out), filter 380ms',
        }} />
      </span>

      {/* Texte */}
      <span style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {label}
      </span>
    </a>
  );
}