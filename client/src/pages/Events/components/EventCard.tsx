/**
 * EventCard.jsx — MARSAI Festival · Phase 9
 * Zéro Tailwind de couleur. 100% design system.
 */
import EventActionButton from './EventActionButton';

export default function EventCard({ event, isVisible, onReservation }: { event: any, isVisible: boolean, onReservation: () => void }) {
  return (
    <li
      className={[
        'relative transition-[opacity,transform] duration-[480ms] ease-[var(--ease-out)]',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[18px] opacity-0',
      ].join(' ')}
    >

      {/* Point timeline */}
      <span
        aria-hidden="true"
        className="absolute left-[calc(1.5rem-5px)] top-[1.55rem] z-[2] h-[10px] w-[10px] rounded-full transition-[background,box-shadow] duration-[380ms]"
        style={{
          background: isVisible ? 'var(--color-accent)' : 'var(--color-text-faint)',
          boxShadow: isVisible ? '0 0 12px rgba(226,209,195,0.75)' : 'none',
        }}
      />

      {/* Trait horizontal */}
      <span
        aria-hidden="true"
        className="absolute left-[calc(1.5rem+5px)] top-[calc(1.55rem+4px)] h-px w-[1.4rem] transition-[background] duration-[380ms]"
        style={{
          background: isVisible
            ? 'linear-gradient(to right, rgba(226,209,195,0.5), transparent)'
            : 'transparent',
        }}
      />

      {/* Conteneur carte + bouton */}
      <div className="flex items-center gap-4" style={{ marginLeft: 'calc(3.2rem + 20px)' }}>
        {/* Carte */}
        <div
          className="group flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] border-l-2 border-l-transparent bg-[var(--color-surface)] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.85rem,1.5vw,1.1rem)] transition-[border-color,background,transform] duration-300 ease-[var(--ease-out)] hover:translate-x-[3px] hover:border-l-[var(--color-accent)] hover:bg-[var(--color-surface-high)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="title-event mb-[0.3rem]">
                {event.title}
              </h4>
              {event.place && (
                <span className="label-overline tracking-[0.14em]">
                  {event.place}
                </span>
              )}
            </div>

            {/* Badge horaire */}
            <span className="label-overline shrink-0 whitespace-nowrap rounded-[var(--radius-pill)] border border-[rgba(226,209,195,0.18)] bg-[var(--color-accent-dim)] px-[0.8em] py-[0.28em] tracking-[0.14em] text-[var(--color-accent)]">
              {event.time}
            </span>
          </div>
        </div>

        {/* Bouton à l'extérieur */}
        <div className="shrink-0">
          <EventActionButton onClick={onReservation}>Réserver</EventActionButton>
        </div>
      </div>
    </li>
  );
}