import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import projectionsImg from "@/assets/projections-ia.png";
import conferencesImg from "@/assets/conferences-ia.png";
import awardsImg from "@/assets/remises-prix-ia.png";

gsap.registerPlugin(ScrollTrigger);

const CSS = `
  .calendrier-section {
    background:  var(--color-bg-pure);
    border-top:  1px solid var(--color-border);
    min-height:  100vh;
    padding:     clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,6rem);
    padding-top: clamp(4rem,6vw,5rem);
  }
  .calendrier-inner { max-width: 820px; margin: 0 auto; }
  .calendrier-header { margin-bottom: clamp(4rem,8vw,7rem); }
  .calendrier-overline { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
  .calendrier-overline-bar { display: block; width: clamp(2rem,3vw,3rem); height: 1px; background: var(--color-accent); flex-shrink: 0; }
  .calendrier-titles { margin-bottom: 1.5rem; }
  .calendrier-title-line { overflow: hidden; line-height: 1; }
  .calendrier-title-line span { display: block; padding-bottom: 0.06em; }
  .calendrier-title-accent { color: var(--color-accent); }
  .calendrier-timeline { position: relative; padding-left: clamp(2.5rem,4vw,3.5rem); }
  .timeline-track { position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px; background: var(--color-border); }
  .timeline-progress-wrap { position: absolute; left: 1.5rem; top: 0; width: 1px; height: 100%; overflow: hidden; }
  .timeline-progress { width: 1px; height: 0%; background: linear-gradient(to bottom, rgba(226,209,195,0.85) 0%, rgba(226,209,195,0.45) 65%, rgba(226,209,195,0.12) 100%); }
  .timeline-dot { position: absolute; left: calc(1.5rem - 6px); top: -6px; width: 13px; height: 13px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 18px rgba(226,209,195,0.90), 0 0 36px rgba(226,209,195,0.32); z-index: 4; }
  .timeline-categories { display: flex; flex-direction: column; gap: clamp(3rem,6vw,5rem); }
  .category-block { margin-bottom: clamp(3rem,6vw,5rem); }
  .category-header { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; padding-bottom: 0.9rem; border-bottom: 1px solid var(--color-border); }
  .category-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(1.3rem,2.2vw,1.8rem); letter-spacing: -0.02em; text-transform: uppercase; color: var(--color-text); margin: 0; }
  .category-date { flex-shrink: 0; }
  .accordion-row { opacity: 0; border-bottom: 1px solid var(--color-border); }
  .accordion-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.3rem 0; background: none; border: none; cursor: pointer; text-align: left; gap: 1rem; }
  .accordion-btn-left { display: flex; align-items: baseline; gap: 1rem; }
  .accordion-num { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: clamp(0.8rem,1.2vw,1rem); color: var(--color-accent); opacity: 0.45; line-height: 1; flex-shrink: 0; }
  .accordion-title { font-family: var(--font-sans); font-weight: 500; font-size: clamp(0.95rem,1.4vw,1.05rem); color: var(--color-text-muted); transition: color 240ms var(--ease-out); }
  .accordion-title.is-open { color: var(--color-text); }
  .accordion-toggle { font-family: var(--font-sans); font-size: 1.2rem; font-weight: 300; color: var(--color-accent); flex-shrink: 0; opacity: 0.45; transition: opacity 240ms; }
  .accordion-toggle.is-open { opacity: 1; }
  .accordion-body { height: 0; opacity: 0; overflow: hidden; }
  .accordion-details { display: flex; gap: clamp(2rem,4vw,4rem); padding-bottom: 1.6rem; padding-left: 2.2rem; }
  .accordion-detail-label { display: block; margin-bottom: 0.3rem; }
  .accordion-detail-value { font-family: var(--font-sans); font-weight: 600; font-size: clamp(0.85rem,1.1vw,0.95rem); color: var(--color-text); }
`;

const EVENT_CATEGORIES = [
  {
    key: "projections",
    title: "Projections",
    subtitle: "Festival du film réalisé en IA",
    date: "20 Juin 2026",
    image: projectionsImg,
    items: [
      {
        id: "p1",
        title: "Film IA — Génération narrative",
        time: "18:00",
        place: "Salle 1",
      },
      {
        id: "p2",
        title: "Sélection Courts Métrages IA",
        time: "19:30",
        place: "Salle 2",
      },
    ],
  },
  {
    key: "conferences",
    title: "Conférences",
    subtitle: "Rencontres et talks autour de l'IA et du cinéma",
    date: "21 Juin 2026",
    image: conferencesImg,
    items: [
      {
        id: "c1",
        title: "L'IA dans le cinéma de demain",
        time: "14:00",
        place: "Auditorium",
      },
      {
        id: "c2",
        title: "Créer un film avec l'IA\u00a0: workflow",
        time: "16:00",
        place: "Auditorium",
      },
    ],
  },
  {
    key: "awards",
    title: "Remises de prix",
    subtitle: "Célébration des meilleures créations IA",
    date: "22 Juin 2026",
    image: awardsImg,
    items: [
      {
        id: "a1",
        title: "Prix du Meilleur Film IA",
        time: "21:30",
        place: "Grande Salle",
      },
      {
        id: "a2",
        title: "Prix Innovation IA",
        time: "22:00",
        place: "Grande Salle",
      },
    ],
  },
];

const flatEvents = EVENT_CATEGORIES.flatMap((c) => c.items);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface EventItem {
  id: string;
  title: string;
  time: string;
  place: string;
}

interface EventCategory {
  key: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  items: EventItem[];
}

interface AccordionItemProps {
  item: EventItem;
  globalIndex: number;
  isVisible: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({
  item,
  globalIndex,
  isVisible,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  const rowRef = useRef(null);
  const bodyRef = useRef(null);

  useGSAP(() => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current, {
      opacity: isVisible ? 1 : 0,
      x: isVisible ? 0 : 18,
      duration: 0.45,
      ease: "power2.out",
    });
  }, [isVisible]);

  useGSAP(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      gsap.to(bodyRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.38,
        ease: "power2.out",
      });
    } else {
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <div ref={rowRef} className="accordion-row">
      <button onClick={onToggle} className="accordion-btn">
        <div className="accordion-btn-left">
          <span className="accordion-num">
            {String(globalIndex + 1).padStart(2, "0")}
          </span>
          <span className={"accordion-title" + (isOpen ? " is-open" : "")}>
            {item.title}
          </span>
        </div>
        <span className={"accordion-toggle" + (isOpen ? " is-open" : "")}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div ref={bodyRef} className="accordion-body">
        <div className="accordion-details">
          <div>
            <span className="label-overline accordion-detail-label">
              Horaire
            </span>
            <span className="accordion-detail-value">{item.time}</span>
          </div>
          <div>
            <span className="label-overline accordion-detail-label">Lieu</span>
            <span className="accordion-detail-value">{item.place}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryBlockProps {
  category: EventCategory;
  startIndex: number;
  visibleCount: number;
}

function CategoryBlock({
  category,
  startIndex,
  visibleCount,
}: CategoryBlockProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="category-block">
      <div className="category-header">
        <h2 className="category-title">{category.title}</h2>
        <span className="label-overline category-date">{category.date}</span>
      </div>
      {category.items.map((item, i) => (
        <AccordionItem
          key={item.id}
          item={item}
          globalIndex={startIndex + i}
          isVisible={visibleCount > startIndex + i}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

export default function Calendrier() {
  const sectionRef = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const total = flatEvents.length;

  const categoryStartIndex = EVENT_CATEGORIES.reduce(
    (acc: Record<string, number>, cat, i) => {
      acc[cat.key] = EVENT_CATEGORIES.slice(0, i).reduce(
        (s, c) => s + c.items.length,
        0,
      );
      return acc;
    },
    {},
  );

  useGSAP(
    () => {
      gsap.set(overlineRef.current, { opacity: 0, y: 12 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter() {
          const tl = gsap.timeline();
          tl.to(overlineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          });
          tl.to(
            [line1Ref.current, line2Ref.current],
            { yPercent: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" },
            0.15,
          );
          tl.to(
            subtitleRef.current,
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            0.5,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion()) {
      setVisibleCount(total);
      return;
    }
    setVisibleCount(0);
    let current = 0;
    const id = setInterval(() => {
      current++;
      setVisibleCount(current);
      if (current >= total) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [started, total]);

  useGSAP(
    () => {
      if (!timelineRef.current || !progressRef.current || !dotRef.current)
        return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.4,
        },
      });
      tl.to(progressRef.current, { height: "100%", ease: "none" }, 0);
      tl.to(dotRef.current, { top: "calc(100% - 6px)", ease: "none" }, 0);
    },
    { scope: sectionRef },
  );

  return (
    <>
      <style>{CSS}</style>

      <section ref={sectionRef} id="calendrier" className="calendrier-section">
        <div className="calendrier-inner">
          <div className="calendrier-header">
            <div ref={overlineRef} className="calendrier-overline">
              <span className="calendrier-overline-bar" />
              <span className="label-overline">
                20 — 22 Juin 2026 · Marseille
              </span>
            </div>

            <div className="calendrier-titles">
              <div className="calendrier-title-line">
                <span ref={line1Ref} className="title-section">
                  Calendrier
                </span>
              </div>
              <div className="calendrier-title-line">
                <span
                  ref={line2Ref}
                  className="title-section calendrier-title-accent"
                >
                  du festival
                </span>
              </div>
            </div>

            <p ref={subtitleRef} className="body-editorial">
              Trois jours de projections, de conférences et de remises de prix
              autour de la création cinématographique par intelligence
              artificielle.
            </p>
          </div>

          <div ref={timelineRef} className="calendrier-timeline">
            <div aria-hidden="true" className="timeline-track" />
            <div aria-hidden="true" className="timeline-progress-wrap">
              <div ref={progressRef} className="timeline-progress" />
            </div>
            <div ref={dotRef} aria-hidden="true" className="timeline-dot" />
            <div className="timeline-categories">
              {EVENT_CATEGORIES.map((category) => (
                <CategoryBlock
                  key={category.key}
                  category={category}
                  startIndex={categoryStartIndex[category.key]}
                  visibleCount={visibleCount}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
