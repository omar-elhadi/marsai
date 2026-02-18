import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Reveal from '@/components/animations/Reveal';

gsap.registerPlugin(ScrollTrigger);

// Données de test (Exigez des images haute résolution)
const movies = [
  { id: 1, title: "L'Aube Synthétique", director: "Elena Rostova", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, title: "Mémoire Latente", director: "Kaelen & I.A. Core", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, title: "Racines de Silicium", director: "Studio Horizon", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, title: "Écho Humain", director: "Collectif 2026", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop" },
  { id: 1, title: "L'Aube Synthétique", director: "Elena Rostova", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, title: "Mémoire Latente", director: "Kaelen & I.A. Core", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, title: "Racines de Silicium", director: "Studio Horizon", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, title: "Écho Humain", director: "Collectif 2026", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop" },
];

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
      
      {/* Interface utilisateur superposée */}
      <div className="absolute top-10 left-10 right-10 z-20 flex justify-between items-start pointer-events-none mix-blend-difference">
        <div>
          <h2 className="text-2xl md:text-4xl font-light tracking-widest uppercase">Galerie</h2>
          <p className="text-sm tracking-widest opacity-60 mt-2">FESTIVAL 2026 // VISIONS</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold tracking-widest uppercase border border-stone-100/30 rounded-full px-4 py-2 backdrop-blur-sm">
            Faites défiler
          </span>
        </div>
      </div>

      {/* Le conteneur en mouvement */}
      <div 
        ref={wrapperRef} 
        className="flex h-full w-max items-center pl-[10vw] pr-[20vw] gap-20"
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