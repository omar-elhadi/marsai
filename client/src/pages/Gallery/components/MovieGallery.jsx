import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Reveal from '@/components/animations/Reveal';

gsap.registerPlugin(ScrollTrigger);

// Données de test (Exigez des images haute résolution)
export const galleryMovies = [
  { id: 1, title: "L'Aube Synthétique", director: "Elena Rostova", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, title: "Mémoire Latente", director: "Kaelen & I.A. Core", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, title: "Racines de Silicium", director: "Studio Horizon", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, title: "Écho Humain", director: "Collectif 2026", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop" },
  { id: 5, title: "L'Aube Synthétique", director: "Elena Rostova", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop" },
  { id: 6, title: "Mémoire Latente", director: "Kaelen & I.A. Core", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop" },
  { id: 7, title: "Racines de Silicium", director: "Studio Horizon", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: 8, title: "Écho Humain", director: "Collectif 2026", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop" },
];

// keep local alias for component
const movies = galleryMovies;

export default function MovieGallery() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  useGSAP(() => {
    // 1. Calcul de l'espace de défilement (rigoureux et dynamique)
    const cards = gsap.utils.toArray('.movie-card');
    const totalWidth = wrapperRef.current.scrollWidth;
    const scrollDistance = totalWidth - window.innerWidth;

    // Création d'une timeline pour synchroniser le déplacement et le parallaxe
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1.2, // Inertie lourde pour une sensation luxueuse
        end: () => `+=${scrollDistance}`, // La hauteur du scroll équivaut à la largeur à parcourir
        invalidateOnRefresh: true, // Recalcule les dimensions si l'utilisateur redimensionne la fenêtre
      }
    });

    // 2. Le Mouvement Principal (Translation du conteneur)
    tl.to(wrapperRef.current, {
      x: -scrollDistance,
      ease: "none"
    }, 0);

    // 3. Le Parallaxe Interne (Le secret des sites d'excellence)
    cards.forEach((card) => {
      const image = card.querySelector('.movie-image');
      
      // L'image commence décalée vers la droite, et glisse vers la gauche à l'intérieur de son propre cadre
      tl.fromTo(image, {
        x: "15vw", 
        scale: 1.2 // On agrandit l'image pour qu'elle puisse bouger sans laisser de vide
      }, {
        x: "-15vw",
        ease: "none"
      }, 0);
    });

  }, { scope: sectionRef });

return (
    <section ref={sectionRef} className="h-screen w-full bg-stone-900 text-stone-100 overflow-hidden relative">
      
      {/* LE NOUVEAU TITRE : Architecture Typographique
        1. top-28 md:top-36 : On esquive l'attraction de la nouvelle Navbar.
        2. mix-blend-difference : Le texte s'inversera optiquement si une image passe derrière lui.
        3. z-30 : Il règne en maître sur les images qui défilent.
      */}
      <div className="absolute top-28 md:top-36 left-6 md:left-12 z-30 pointer-events-none mix-blend-difference">
        <Reveal>
          {/* Typographie fluide : text-5xl (mobile) -> text-[8vw] (desktop) */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7vw] font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
            Sélection<br />Officielle
          </h1>
        </Reveal>
        
        <Reveal delay={0.2}>
          <div className="flex items-center gap-4 mt-6">
            <span className="w-12 h-[2px] bg-amber-500"></span>
            <span className="text-sm md:text-base font-bold tracking-widest uppercase text-amber-500">
              Galerie des Œuvres — 2026
            </span>
          </div>
        </Reveal>
      </div>

      {/* Le conteneur en mouvement */}
      <div 
        ref={wrapperRef} 
        className="flex h-full w-max items-center pl-[10vw] pr-[20vw] gap-12 md:gap-20 pt-20 md:pt-0" 
      >
        {movies.map((movie, index) => (
          <article 
            key={movie.id} 
            className="movie-card relative h-[65vh] w-[75vw] md:w-[45vw] shrink-0 group perspective-1000"
          >
            {/* Le masque (Le cadre physique) */}
            <div className="w-full h-full overflow-hidden rounded-sm shadow-2xl relative">
              {/* L'image animée indépendamment par GSAP */}
              <img 
                src={movie.img} 
                alt={movie.title} 
                className="movie-image absolute top-0 left-0 w-full h-full object-cover origin-center"
              />
              {/* Le voile d'obscurité pour préserver le contraste */}
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-700"></div>
            </div>

            {/* Informations textuelles : Placement asymétrique inspiré de l'éditorial */}
            <div className="absolute -bottom-12 -right-12 md:-right-24 z-10 p-8 w-[90%] md:w-[120%] bg-stone-100 text-stone-950 shadow-2xl origin-bottom-left transition-transform duration-700 hover:-translate-y-4">
              <div className="flex justify-between items-end border-b border-stone-300 pb-4 mb-4">
                <span className="text-5xl font-black tracking-tighter">0{index + 1}</span>
                <span className="text-sm font-bold uppercase tracking-widest opacity-50">I.A. Core</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-2 uppercase leading-none">
                {movie.title}
              </h3>
              <p className="text-stone-600 text-lg md:text-xl font-light">
                Dirigé par {movie.director}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}