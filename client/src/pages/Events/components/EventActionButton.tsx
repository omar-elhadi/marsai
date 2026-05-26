import { useState } from 'react';

// Keyframes pour l'animation pulsante de la barre
const BREATHE_KEYFRAMES = `
  @keyframes event-btn-bar-breathe {
    0%   { opacity:.78; box-shadow:
             0 0  6px rgba(226,209,195,.82),
             0 0 14px rgba(226,209,195,.36),
             0 0 28px rgba(226,209,195,.13); }
    100% { opacity:1;   box-shadow:
             0 0 10px rgba(226,209,195,.98),
             0 0 22px rgba(226,209,195,.52),
             0 0 44px rgba(226,209,195,.22); }
  }
  @keyframes event-btn-breathe {
    0%   { box-shadow: 0 0  8px rgba(226,209,195,.07); }
    100% { box-shadow: 0 0 20px rgba(226,209,195,.15); }
  }
`;

let _injected = false;
function injectKeyframes() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const style = document.createElement('style');
  style.textContent = BREATHE_KEYFRAMES;
  document.head.appendChild(style);
}

export default function EventActionButton({
  children = 'Réserver',
  type = 'button',
  onClick,
  className = '',
}: { children?: React.ReactNode, type?: "button" | "submit" | "reset", onClick?: (e: React.MouseEvent) => void, className?: string }) {
  const [hovered, setHovered] = useState(false);
  injectKeyframes();

  const barShadowIdle = '0 0 6px rgba(226,209,195,.82), 0 0 14px rgba(226,209,195,.36), 0 0 26px rgba(226,209,195,.13)';
  const barShadowHover = '0 0 12px rgba(226,209,195,1.00), 0 0 26px rgba(226,209,195,.65), 0 0 46px rgba(226,209,195,.30)';

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: hovered ? 'none' : 'event-btn-breathe 3s ease-in-out alternate infinite',
        boxShadow: hovered
          ? '0 0 20px rgba(226,209,195,.22), 0 0 6px rgba(226,209,195,.10)'
          : undefined,
        textShadow: hovered
          ? '0 0 12px rgba(226,209,195,.90), 0 0 24px rgba(226,209,195,.48)'
          : 'none',
      }}
      className={[
        'label-overline relative inline-flex items-center gap-[10px] whitespace-nowrap',
        'rounded-[var(--radius-pill)] border px-[1.8rem] py-[.55rem] pl-[.85rem] leading-none',
        'transition-all duration-[350ms] ease-[var(--ease-out)]',
        hovered
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg-pure)]'
          : 'border-[rgba(226,209,195,0.30)] bg-transparent text-[var(--color-accent)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-pure)]',
        className,
      ].join(' ')}
    >
      {/* Barre lumineuse verticale à gauche */}
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: '2px',
          height: '14px',
          borderRadius: '1px',
          background: hovered ? 'var(--color-bg-pure)' : 'var(--color-accent)',
          flexShrink: 0,
          transform: hovered ? 'scaleY(1.15)' : 'scaleY(1)',
          animation: hovered ? 'none' : 'event-btn-bar-breathe 3s ease-in-out alternate infinite',
          boxShadow: hovered ? barShadowHover : undefined,
          transition: 'transform 350ms var(--ease-out), box-shadow 350ms var(--ease-out)',
        }}
      />
      
      <span style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {children}
      </span>
    </button>
  );
}