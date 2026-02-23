import React, { useEffect, useRef, useState } from "react";
import Reveal from '../../components/animations/Reveal';
import Parallax from '../../components/animations/Parallax';

const newsData = [
  {
    id: 1,
    title: "Ouverture du Festival IA 2026",
    content:
      "Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.",
  },
  {
    id: 2,
    title: "Sélection Officielle",
    content:
      "40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.",
  },
  {
    id: 3,
    title: "Tables Rondes & Débats",
    content:
      "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d’auteur et de la transparence algorithmique.",
  },
  {
    id: 4,
    title: "Prix IA 2026",
    content:
      "Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture.",
  },
];

export default function News() {
  const [activeTitle, setActiveTitle] = useState(newsData[0].title);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target);
            if (index !== -1) {
              setActiveTitle(newsData[index].title);
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
    <div className="bg-black text-white min-h-screen">

      {/* HERO / PAGE TITLE */}
      <header className="w-full border-b border-zinc-800 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] uppercase">
              Actualités
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-zinc-400">Les temps forts du festival</p>
          </Reveal>
        </div>
      </header>

      {/* SPLIT LAYOUT */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">

        {/* LEFT - STICKY TITLE (large) */}
        <aside className="md:w-1/2 md:h-screen md:sticky md:top-0 flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 z-10">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-center transition-all duration-500 ease-out">
              {activeTitle}
            </h2>
          </Reveal>
        </aside>

        {/* RIGHT - SCROLL CONTENT */}
        <main className="md:w-1/2 overflow-y-auto">
          <Parallax speed={1.02} className="w-full">
            {newsData.map((item, index) => (
              <Reveal key={item.id} delay={0.08 * index}>
                <section
                  ref={(el) => (sectionsRef.current[index] = el)}
                  className="min-h-screen flex items-center p-12 border-b border-zinc-800"
                >
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-semibold mb-6 text-zinc-200">{item.title}</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">{item.content}</p>
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