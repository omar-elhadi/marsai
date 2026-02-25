/**
 * CategorySection.jsx — MARSAI Festival · Phase 9
 * Section de catégorie sur la timeline.
 * Zéro Tailwind de couleur. 100% design system.
 */

import CategoryHeader from './CategoryHeader';
import EventCard      from './EventCard';

export default function CategorySection({ category, startIndex, visibleCount }) {
  const catOn = visibleCount >= startIndex + 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* En-tête avec point de catégorie */}
      <div style={{ position: 'relative' }}>

        {/* Point catégorie — plus grand */}
        <span aria-hidden="true" style={{
          position:     'absolute',
          left:         'calc(-2rem - 6px)',
          top:          '1.35rem',
          width:        '14px',
          height:       '14px',
          borderRadius: '50%',
          background:   catOn ? 'var(--color-accent)' : 'var(--color-text-faint)',
          border:       '2px solid var(--color-bg)',
          boxShadow:    catOn
            ? '0 0 18px rgba(226,209,195,0.80), 0 0 36px rgba(226,209,195,0.28)'
            : 'none',
          transition:   'background 380ms, box-shadow 380ms',
          zIndex:       3,
        }} />

        {/* Trait horizontal catégorie */}
        <span aria-hidden="true" style={{
          position:   'absolute',
          left:       'calc(-2rem + 8px)',
          top:        'calc(1.35rem + 5px)',
          width:      '1.2rem',
          height:     '1px',
          background: catOn
            ? 'linear-gradient(to right, rgba(226,209,195,0.65), transparent)'
            : 'transparent',
          transition: 'background 380ms',
        }} />

        <CategoryHeader
          title={category.title}
          subtitle={category.subtitle}
          image={category.image}
        />
      </div>

      {/* Liste événements */}
      <ul style={{
        position:      'relative',
        listStyle:     'none',
        padding:       0,
        margin:        0,
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.65rem',
      }}>
        {category.items.map((event, index) => {
          const globalIndex = startIndex + index;
          const isVisible   = globalIndex < visibleCount;
          return (
            <EventCard
              key={event.id}
              event={event}
              isVisible={isVisible}
            />
          );
        })}
      </ul>
    </div>
  );
}