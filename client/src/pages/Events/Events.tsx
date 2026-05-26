/**
 * Events.jsx — MARSAI Festival · Phase 9
 * "Le programme comme une séquence de film"
 *
 * ═══════════════════════════════════════════════════════════════
 * Refonte complète — zéro indigo/cyan/purple.
 * Design system 100% : tokens CSS, Typography.css, animations GSAP.
 *
 * Timeline :
 *   Filet 1px sable — gradient sable/ivoire
 *   Point vivant qui suit la progression
 *   Stagger 280ms entre chaque événement
 *
 * En-tête : rideau 2 lignes GSAP + overline
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import projectionsImg from '@/assets/projections-ia.png';
import conferencesImg from '@/assets/conferences-ia.png';
import awardsImg      from '@/assets/remises-prix-ia.png';

import CategorySection from './components/CategorySection';
import ReservationModal from './components/ReservationModal';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES — titres sans emoji (design system épuré)
// ─────────────────────────────────────────────────────────────
const EVENT_CATEGORIES = [
  {
    key:      'projections',
    title:    'Projections',
    subtitle: 'Festival du film réalisé en IA',
    image:    projectionsImg,
    date:     '20 Juin 2026',
    items: [
      { id: 'p1', title: 'Film IA — Génération narrative',  time: '18:00', place: 'Salle 1' },
      { id: 'p2', title: 'Sélection Courts Métrages IA',   time: '19:30', place: 'Salle 2' },
    ],
  },
  {
    key:      'conferences',
    title:    'Conférences',
    subtitle: 'Rencontres et talks autour de l\'IA et du cinéma',
    image:    conferencesImg,
    date:     '21 Juin 2026',
    items: [
      { id: 'c1', title: 'L\'IA dans le cinéma de demain',      time: '14:00', place: 'Auditorium' },
      { id: 'c2', title: 'Créer un film avec l\'IA : workflow', time: '16:00', place: 'Auditorium' },
    ],
  },
  {
    key:      'awards',
    title:    'Remises de prix',
    subtitle: 'Célébration des meilleures créations IA',
    image:    awardsImg,
    date:     '22 Juin 2026',
    items: [
      { id: 'a1', title: 'Prix du Meilleur Film IA', time: '21:30', place: 'Grande Salle' },
      { id: 'a2', title: 'Prix Innovation IA',       time: '22:00', place: 'Grande Salle' },
    ],
  },
];

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function FestivalEvents() {
  const sectionRef   = useRef<HTMLElement>(null);
  const overlineRef  = useRef<HTMLParagraphElement>(null);
  const line1Ref     = useRef<HTMLSpanElement>(null);
  const line2Ref     = useRef<HTMLSpanElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const timelineRef  = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);

  const [started,      setStarted]      = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [modalState, setModalState] = useState<{isOpen: boolean, event: any, categoryTitle: string}>({ isOpen: false, event: null, categoryTitle: '' });

  const handleReservation = (event: any, categoryTitle: string) => {
    setModalState({ isOpen: true, event, categoryTitle });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, event: null, categoryTitle: '' });
  };

  const flatEvents = useMemo(
    () => EVENT_CATEGORIES.flatMap(c => c.items), []
  );
  const total    = flatEvents.length;
  const progress = total === 0 ? 0 : Math.min(1, visibleCount / total);

  const categoryStartIndex = useMemo(() => {
    const result: Record<string, number> = {};
    let cursor   = 0;
    for (const cat of EVENT_CATEGORIES) {
      result[cat.key] = cursor;
      cursor += cat.items.length;
    }
    return result;
  }, []);

  // ── Animations GSAP en-tête ───────────────────────────────
  useGSAP(() => {
    gsap.set(overlineRef.current, { opacity: 0, y: 12 });
    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });
    gsap.set(subtitleRef.current, { opacity: 0, y: 18 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 75%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();
        tl.to(overlineRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
        tl.to([line1Ref.current, line2Ref.current],
          { yPercent: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, 0.15);
        tl.to(subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.50);
      },
    });
  }, { scope: sectionRef });

  // ── Démarrage timeline ────────────────────────────────────
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion()) { setVisibleCount(total); return; }
    setVisibleCount(0);
    let current = 0;
    const id = setInterval(() => {
      current++;
      setVisibleCount(current);
      if (current >= total) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [started, total]);

  // ── Progression barre + point vivant ─────────────────────
  useEffect(() => {
    if (!progressRef.current || !dotRef.current) return;
    const pct = `${progress * 100}%`;
    gsap.to(progressRef.current, { height: pct, duration: 0.42, ease: 'power2.out' });
    gsap.to(dotRef.current,      { top: `calc(${pct} - 6px)`, duration: 0.42, ease: 'power2.out' });
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      id="events"
      aria-label="Programme du festival MARSAI"
      style={{
        background: 'var(--color-bg-pure)',
        borderTop:  '1px solid var(--color-border)',
        padding:    'clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,6rem)',
        minHeight:  '100vh',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* ── En-tête ───────────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(4rem,8vw,7rem)' }}>

          <div
            ref={overlineRef}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}
          >
            <span style={{
              display:    'block',
              width:      'clamp(2rem,3vw,3rem)',
              height:     '1px',
              background: 'var(--color-accent)',
              flexShrink: 0,
            }} />
            <span className="label-overline">20 — 22 Juin 2026 · Marseille</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {/* Ligne 1 */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span
                ref={line1Ref}
                className="title-section"
                style={{ display: 'block', paddingBottom: '0.06em' }}
              >
                Programme
              </span>
            </div>
            {/* Ligne 2 accent */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span
                ref={line2Ref}
                className="title-section"
                style={{ display: 'block', color: 'var(--color-accent)', paddingBottom: '0.06em' }}
              >
                du festival
              </span>
            </div>
          </div>

          <p
            ref={subtitleRef}
            className="body-editorial"
            style={{ maxWidth: '50ch' }}
          >
            Trois jours de projections, de conférences et de remises de prix
            autour de la création cinématographique par intelligence artificielle.
          </p>
        </div>

        {/* ── Timeline ─────────────────────────────────── */}
        <div
          ref={timelineRef}
          style={{ position: 'relative', paddingLeft: 'clamp(2.5rem,4vw,3.5rem)' }}
        >
          {/* Filet fond */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            left:       '1.5rem',
            top:        0,
            bottom:     0,
            width:      '1px',
            background: 'var(--color-border)',
          }} />

          {/* Filet de progression sable */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            left:     '1.5rem',
            top:      0,
            width:    '1px',
            height:   '0%',
          }}>
            <div
              ref={progressRef}
              style={{
                width:      '1px',
                height:     '0%',
                background: `linear-gradient(to bottom,
                  rgba(226,209,195,0.85) 0%,
                  rgba(226,209,195,0.45) 65%,
                  rgba(226,209,195,0.12) 100%)`,
              }}
            />
          </div>

          {/* Point vivant */}
          <div
            ref={dotRef}
            aria-hidden="true"
            style={{
              position:     'absolute',
              left:         'calc(1.5rem - 6px)',
              top:          '-6px',
              width:        '13px',
              height:       '13px',
              borderRadius: '50%',
              background:   'var(--color-accent)',
              boxShadow:    '0 0 18px rgba(226,209,195,0.90), 0 0 36px rgba(226,209,195,0.32)',
              zIndex:       4,
            }}
          />

          {/* Catégories */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           'clamp(3rem,6vw,5rem)',
          }}>
            {EVENT_CATEGORIES.map(category => (
              <CategorySection
                key={category.key}
                category={category}
                startIndex={categoryStartIndex[category.key]}
                visibleCount={visibleCount}
                onReservation={handleReservation}
              />
            ))}
          </div>
        </div>

        {/* Modal de réservation */}
        <ReservationModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          event={modalState.event}
          categoryTitle={modalState.categoryTitle}
        />

      </div>
    </section>
  );
}