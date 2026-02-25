import React, { useEffect, useRef, useState } from "react";
import Reveal from "../../components/animations/Reveal";
import Parallax from "../../components/animations/Parallax";
import "@/styles/scrollbar.css";
import { galleryMovies } from "@/pages/Gallery/components/MovieGallery";

const newsData = [
  {
    id: 1,
    date: "18 mars 2026",
    image:
      galleryMovies[0]?.img ||
      "https://via.placeholder.com/1200x800.png?text=Festival+Ouverture",
    title: "Ouverture du Festival IA 2026",
    content:
      "Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.",
  },
  {
    id: 2,
    date: "19 mars 2026",
    image:
      galleryMovies[1]?.img ||
      "https://via.placeholder.com/1200x800.png?text=Selection+Officielle",
    title: "Sélection Officielle",
    content:
      "40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.",
  },
  {
    id: 3,
    date: "20 mars 2026",
    image:
      galleryMovies[2]?.img ||
      "https://via.placeholder.com/1200x800.png?text=Tables+Rondes",
    title: "Tables Rondes & Débats",
    content:
      "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d’auteur et de la transparence algorithmique.",
  },
  {
    id: 4,
    date: "21 mars 2026",
    image:
      galleryMovies[3]?.img ||
      "https://via.placeholder.com/1200x800.png?text=Prix+IA+2026",
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

      {/* SPLIT LAYOUT */}
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
                  backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.50), rgba(2,6,23,0.12)), url('${n.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: ratios[i] || 0,
                  transition: "opacity 0.2s linear",
                }}
              />
            ))}
          </div>

          {/* Perfect centered date */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-center drop-shadow-2xl">
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
                  {/* Mobile image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="block md:hidden w-full h-64 object-cover mb-8"
                  />

                  <div className="max-w-xl mx-auto">
                    <Parallax
                      speed={1 + index * 0.06}
                      className="w-full"
                    >
                      <h3 className="text-3xl md:text-4xl font-black mb-6 text-stone-100">
                        {item.title}
                      </h3>
                    </Parallax>

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