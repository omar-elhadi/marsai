import React, { useEffect, useRef, useState } from "react";
import Reveal from "../../components/animations/Reveal";
import Parallax from "../../components/animations/Parallax";
import "@/styles/scrollbar.css";

const newsData = [
  {
    id: 1,
    date: "18 mars 2026",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
    title: "Ouverture du Festival IA 2026",
    content:
      "Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.",
  },
  {
    id: 2,
    date: "19 mars 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    title: "Sélection Officielle",
    content:
      "40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.",
  },
  {
    id: 3,
    date: "20 mars 2026",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    title: "Tables Rondes & Débats",
    content:
      "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d’auteur et de la transparence algorithmique.",
  },
  {
    id: 4,
    date: "21 mars 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    title: "Prix IA 2026",
    content:
      "Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture.",
  },
];

export default function News() {
  const [activeDate, setActiveDate] = useState(newsData[0].date);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ratios, setRatios] = useState(newsData.map(() => 0));
  const sectionsRef = useRef([]);

  useEffect(() => {
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionsRef.current.indexOf(entry.target);
          if (index === -1) return;

          setRatios((prev) => {
            const copy = [...prev];
            copy[index] = entry.intersectionRatio;
            return copy;
          });

          if (entry.isIntersecting) {
            setActiveDate(newsData[index].date);
            setActiveIndex(index);
          }
        });
      },
      { threshold: thresholds }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen">
      
      {/* HERO */}
      <header className="w-full border-b border-stone-800 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] uppercase">
              Actualités
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-stone-400">
              Les temps forts du festival
            </p>
          </Reveal>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        
        {/* LEFT SIDE */}
        <aside className="hidden md:flex w-1/2 h-screen sticky top-0 border-r border-stone-800 bg-stone-900 overflow-hidden relative">
          
          {/* Background image stack */}
          <div aria-hidden className="absolute inset-0 z-0">
            {newsData.map((n, i) => (
              <div
                key={n.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.60), rgba(2,6,23,0.30)), url(${n.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: ratios[i] || 0,
                  transition: "opacity 0.4s ease",
                }}
              />
            ))}
          </div>

          {/* Centered date */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-bold text-center drop-shadow-2xl">
                {activeDate}
              </h2>
            </Reveal>
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <main className="md:w-1/2 overflow-y-auto hide-scrollbar">
          <Parallax speed={1.02} className="w-full">
            {newsData.map((item, index) => (
              <Reveal key={item.id} delay={0.08 * index}>
                <section
                  ref={(el) => (sectionsRef.current[index] = el)}
                  className="min-h-screen flex flex-col justify-center items-center p-12 border-b border-stone-800 text-center"
                >
                  {/* Image mobile */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="block md:hidden w-full h-64 object-cover mb-8"
                  />

                  <div className="max-w-xl mx-auto">
                    <h3 className="text-3xl md:text-4xl font-black mb-6 text-stone-100">
                      {item.title}
                    </h3>

                    <p className="text-stone-200 text-lg leading-relaxed">
                      {item.content}
                    </p>
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