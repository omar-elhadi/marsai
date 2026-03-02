/**
 * EventCard.jsx — MARSAI Festival · Phase 9
 * Zéro Tailwind de couleur. 100% design system.
 */
export default function EventCard({ event, isVisible }) {
  return (
    <li style={{
      position:   'relative',
      opacity:    isVisible ? 1 : 0,
      transform:  isVisible ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 480ms var(--ease-out), transform 480ms var(--ease-out)',
    }}>

      {/* Point timeline */}
      <span aria-hidden="true" style={{
        position:     'absolute',
        left:         'calc(1.5rem - 5px)',
        top:          '1.55rem',
        width:        '10px',
        height:       '10px',
        borderRadius: '50%',
        background:   isVisible ? 'var(--color-accent)' : 'var(--color-text-faint)',
        boxShadow:    isVisible ? '0 0 12px rgba(226,209,195,0.75)' : 'none',
        transition:   'background 380ms, box-shadow 380ms',
        zIndex:       2,
      }} />

      {/* Trait horizontal */}
      <span aria-hidden="true" style={{
        position:   'absolute',
        left:       'calc(1.5rem + 5px)',
        top:        'calc(1.55rem + 4px)',
        width:      '1.4rem',
        height:     '1px',
        background: isVisible
          ? 'linear-gradient(to right, rgba(226,209,195,0.5), transparent)'
          : 'transparent',
        transition: 'background 380ms',
      }} />

      {/* Carte */}
      <div
        className="marsai-event-card-inner"
        style={{
          marginLeft:   '3.2rem',
          padding:      'clamp(0.85rem,1.5vw,1.1rem) clamp(1rem,2vw,1.5rem)',
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderLeft:   '2px solid transparent',
          borderRadius: 'var(--radius-sm)',
          transition:   `border-color 280ms var(--ease-out),
                         background   280ms var(--ease-out),
                         transform    280ms var(--ease-out)`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderLeftColor = 'var(--color-accent)';
          e.currentTarget.style.background      = 'var(--color-surface-high)';
          e.currentTarget.style.transform       = 'translateX(3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderLeftColor = 'transparent';
          e.currentTarget.style.background      = 'var(--color-surface)';
          e.currentTarget.style.transform       = 'translateX(0)';
        }}
      >
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '1rem',
        }}>
          <div>
            <h4 style={{
              fontFamily:    'var(--font-sans)',
              fontWeight:    700,
              fontSize:      'clamp(0.88rem,1.2vw,1rem)',
              letterSpacing: '-0.01em',
              color:         'var(--color-text)',
              lineHeight:    1.3,
              marginBottom:  event.place ? '0.3rem' : 0,
            }}>
              {event.title}
            </h4>
            {event.place && (
              <span className="label-overline" style={{ letterSpacing: '0.14em' }}>
                {event.place}
              </span>
            )}
          </div>

          {/* Badge horaire */}
          <span style={{
            flexShrink:    0,
            fontFamily:    'var(--font-sans)',
            fontWeight:    700,
            fontSize:      '0.64rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'var(--color-accent)',
            background:    'var(--color-accent-dim)',
            border:        '1px solid rgba(226,209,195,0.18)',
            borderRadius:  'var(--radius-pill)',
            padding:       '0.28em 0.8em',
            whiteSpace:    'nowrap',
          }}>
            {event.time}
          </span>
        </div>
      </div>
    </li>
  );
}