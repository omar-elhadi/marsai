import React, { useEffect, useRef, useState } from "react";

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
      {
        threshold: 0.6,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        
        {/* LEFT - STICKY TITLE */}
        <div className="md:w-1/2 md:h-screen md:sticky md:top-0 flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center transition-all duration-500 ease-out">
            {activeTitle}
          </h1>
        </div>

        {/* RIGHT - SCROLL CONTENT */}
        <div className="md:w-1/2">
          {newsData.map((item, index) => (
            <section
              key={item.id}
              ref={(el) => (sectionsRef.current[index] = el)}
              className="min-h-screen flex items-center p-12 border-b border-neutral-800"
            >
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold mb-6 text-neutral-300">
                  {item.title}
                </h2>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}