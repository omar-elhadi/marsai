/**
 * CategoryHeader.jsx — MARSAI Festival · Phase 9
 * En-tête visuelle d'une catégorie d'événements.
 * Zéro Tailwind de couleur. 100% design system.
 */

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function CategoryHeader({ title, subtitle, image, date }) {
  return (
    <>
      <div style={{
      position:     'relative',
      overflow:     'hidden',
      borderRadius: 'var(--radius-sm)',
      aspectRatio:  '21 / 7',
      minHeight:    '140px',
      background:   'var(--color-bg-pure)',
      border:       '1px solid var(--color-border)',
    }}>
      {/* Image plein-cadre */}
      {image && (
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            position:       'absolute',
            inset:          0,
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: 'center',
            filter:         'grayscale(15%) brightness(0.50)',
          }}
        />
      )}

      {/* Gradient bas */}
      <div aria-hidden="true" style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
      }} />

      {/* Grain filmique */}
      <div aria-hidden="true" style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: GRAIN,
        backgroundSize:  '180px 180px',
        opacity:         0.04,
        mixBlendMode:    'overlay',
        pointerEvents:   'none',
      }} />

      {/* Texte */}
      <div style={{
        position: 'absolute',
        bottom:   0,
        left:     0,
        right:    0,
        padding:  'clamp(0.8rem,1.5vw,1.2rem)',
      }}>
        <h3 className="title-card" style={{ marginBottom: subtitle ? '0.25rem' : 0 }}>
          {/* Supprimer les emojis du titre original */}
          {title.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[\u2600-\u26FF]/g, '').trim()}
        </h3>
        {subtitle && (
          <p className="body-meta" style={{ opacity: 0.72 }}>{subtitle}</p>
        )}
      </div>
    </div>
    
    {/* Date sous l'image */}
    {date && (
      <div className="mt-3 flex items-center gap-2">
        <span className="h-px w-8 bg-[var(--color-accent)]" aria-hidden="true" />
        <span className="label-overline tracking-[0.18em] text-[var(--color-accent)]">
          {date}
        </span>
      </div>
    )}
    </>
  );
}