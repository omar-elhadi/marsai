import React, { useEffect, useRef, useState } from "react";
import Reveal from '../../components/animations/Reveal';
import Parallax from '../../components/animations/Parallax';
import "@/styles/scrollbar.css"; // custom scrollbar utilities (hide, chapters styling)

const newsData = [
  {
    id: 1,
    date: "1er juin 2026",
    image: "https://via.placeholder.com/1200x800.png?text=Festival+Ouverture", // placeholder image
    title: "Ouverture du Festival IA 2026",
    content:
      "Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.",
  },
  {
    id: 2,
    date: "3 juin 2026",
    image: "https://via.placeholder.com/1200x800.png?text=Selection+Officielle",
    title: "Sélection Officielle",
    content:
      "40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.",
  },
  {
    id: 3,
    date: "5 juin 2026",
    image: "https://via.placeholder.com/1200x800.png?text=Tables+Rondes",
    title: "Tables Rondes & Débats",
    content:
      "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d’auteur et de la transparence algorithmique.",
  },
  {
    id: 4,
    date: "7 juin 2026",
    image: "https://via.placeholder.com/1200x800.png?text=Prix+IA+2026",
    title: "Prix IA 2026",
    content:
      "Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture.",
  },
];

export default function News() {
  const [activeDate, setActiveDate] = useState(newsData[0].date);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target);
            if (index !== -1) {
              setActiveDate(newsData[index].date);
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen">

      {/* HERO / PAGE TITLE */}
      <header className="w-full border-b border-stone-800 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] uppercase">
              Actualités
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-stone-400">Les temps forts du festival</p>
          </Reveal>
        </div>
      </header>

      {/* utility styles moved to global or tailwind config if needed */}

      {/* SPLIT LAYOUT */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">

        {/* LEFT - STICKY TITLE (desktop only) */}
        <aside className="hidden md:flex w-1/2 h-screen md:sticky md:top-0 p-0 border-r border-stone-800 bg-stone-900 z-10 overflow-hidden relative">
          {/* Image stack (absolute layers) */}
          <div aria-hidden className="absolute inset-0 z-0">
            {newsData.map((n, i) => (
              <div
                key={n.id}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.50), rgba(2,6,23,0.12)), url('${n.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'right center',
                  opacity: i === activeIndex ? 1 : 0,
                  transition: 'opacity 640ms ease',
                  willChange: 'opacity, transform',
                }}
              />
            ))}
          </div>

          {/* Foreground content - centered vertically over image stack */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="px-6 py-4 text-center">
              <Reveal>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-center transition-all duration-500 ease-out drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
                  {activeDate}
                </h2>
              </Reveal>
            </div>
          </div>
        </aside>

        {/* RIGHT - SCROLL CONTENT */}
        {/* the scrollbar is visually hidden with .hide-scrollbar while the content still scrolls */}
        <main className="md:w-1/2 overflow-y-auto hide-scrollbar">
          <Parallax speed={1.02} className="w-full">
            {newsData.map((item, index) => (
              <Reveal key={item.id} delay={0.08 * index}>
                <section
                  ref={(el) => (sectionsRef.current[index] = el)}
                  className="min-h-screen flex flex-col md:flex-row items-center md:items-start p-12 border-b border-stone-800"
                >
                      {/* mobile image above text */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="block md:hidden w-full h-64 object-cover mb-8"
                      />

                      <div className="max-w-xl">
                        <Parallax speed={1 + index * 0.06} className="w-full">
                          <h3 className="text-3xl md:text-4xl font-black mb-3 text-stone-100">{item.date}</h3>
                        </Parallax>
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-stone-200">{item.title}</h4>
                        </div>
                        <p className="text-stone-200 text-lg leading-relaxed">{item.content}</p>
                      </div>
                </section>
              </Reveal>
            ))}
          </Parallax>
        </main>

      </div>
    </div>
  );
}