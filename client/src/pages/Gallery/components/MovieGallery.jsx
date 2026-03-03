/**
 * MovieGallery.jsx — MARSAI Festival
 * Galerie · Page complète — défilement horizontal
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE — pin:true GSAP (sans trackOuter)
 * ═══════════════════════════════════════════════════════════════
 *
 *   Filtres → Section épinglée (GSAP pin:true) → Pagination
 *
 * L'architecture "sticky + trackOuter" a été abandonnée.
 * Cause racine du fond noir : le trackOuter (background sombre)
 * était visible sous la section sticky pendant les transitions
 * in/out du stick — une zone de viewport que la section ne
 * couvrait pas entièrement.
 *
 * Avec pin:true :
 *   • GSAP rend l'élément position:fixed pendant le scroll
 *   • La section couvre exactement le viewport du bord header
 *     au bord bas — aucune fuite de fond
 *   • Le spacer GSAP crée l'espace de scroll sans trackOuter
 *   • Compatibilité Lenis via le bridge lenis:resize (PublicLayout)
 *
 * ═══════════════════════════════════════════════════════════════
 * COMPATIBILITÉ LENIS
 * ═══════════════════════════════════════════════════════════════
 *
 * pin:true + Lenis fonctionne via deux bridges dans PublicLayout :
 *
 *   lenis:resize  — GSAP notifie Lenis après tout onRefresh
 *                   pour que Lenis recalcule la hauteur scrollable
 *
 *   lenis:scrollTo — goToPage scrolle instantanément (immediate:true)
 *                    AVANT le changement d'état React, pour éviter
 *                    que GSAP re-mesure sur un DOM en mouvement
 *
 * ═══════════════════════════════════════════════════════════════
 * SOPHISTICATION DU SCROLL
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Pin:true — section fixe le temps du défilement horizontal
 * 2. Scale + opacité par carte (containerAnimation)
 * 3. Parallaxe interne image vs cadre (±11%)
 * 4. Barre de progression accent
 * 5. Indicateur scroll initial qui disparaît
 * 6. Première carte élargie (52vw vs 40vw)
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import gsap                from "gsap";
import { useGSAP }         from "@gsap/react";
import { ScrollTrigger }   from "gsap/ScrollTrigger";
import MovieCard           from "./MovieCard";
import styles              from "./MovieGallery.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// CONTRAT D'INTERFACE BACKEND — À lire avant toute intégration
// ─────────────────────────────────────────────────────────────
//
// Stack backend : Node.js + Prisma + S3 + YouTube API
//
// Quand le backend sera connecté, remplacer les données statiques
// ci-dessous par un appel API. Le frontend n'a PAS besoin d'être
// restructuré — seule la source de données change.
//
// ═══════════════════════════════════════════════════════════════
// MODÈLE PRISMA ATTENDU (schema.prisma)
// ═══════════════════════════════════════════════════════════════
//
//   model Film {
//     id           Int      @id @default(autoincrement())
//     title        String
//     director     String
//     category     String   // 'Fiction' | 'Documentaire' | 'Expérimental'
//     status       String   @default("pending")
//                           // 'pending' | 'selected' | 'rejected'
//     thumbnailUrl String   // URL S3 — image de couverture
//     videoUrl     String   // URL S3 (raw) OU YouTube embed ID
//     videoSource  String   @default("s3")
//                           // 's3' | 'youtube'
//     duration     Int      // en secondes — imposé 60s max
//     createdAt    DateTime @default(now())
//     updatedAt    DateTime @updatedAt
//   }
//
// ═══════════════════════════════════════════════════════════════
// ENDPOINT BACKEND ATTENDU
// ═══════════════════════════════════════════════════════════════
//
//   GET /api/films
//   Query params :
//     page     : number  (défaut 1)
//     limit    : number  (défaut 12 — FILMS_PER_PAGE)
//     category : string  (optionnel — filtre côté serveur)
//     status   : string  (défaut 'selected' — ne jamais exposer 'pending')
//
//   Réponse attendue :
//   {
//     films: [
//       {
//         id:           number,
//         title:        string,
//         director:     string,
//         category:     string,
//         img:          string,  // thumbnailUrl S3
//         videoUrl:     string,  // URL S3 ou ID YouTube
//         videoSource:  string,  // 's3' | 'youtube'
//       }
//     ],
//     total:       number,  // total films (pour calculer totalPages)
//     page:        number,
//     totalPages:  number,
//   }
//
// ═══════════════════════════════════════════════════════════════
// ACTIVATION — remplacer galleryMovies + pagination par :
// ═══════════════════════════════════════════════════════════════
//
//   // Dans le composant :
//   const [films, setFilms]           = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading]       = useState(false);
//
//   useEffect(() => {
//     setLoading(true);
//     const params = new URLSearchParams({
//       page:     currentPage,
//       limit:    FILMS_PER_PAGE,
//       status:   'selected',
//       ...(activeFilter !== 'Tous' && { category: activeFilter }),
//     });
//
//     fetch(`/api/films?${params}`)
//       .then(r => r.json())
//       .then(data => {
//         setFilms(data.films);
//         setTotalPages(data.totalPages);
//       })
//       .finally(() => setLoading(false));
//
//   }, [currentPage, activeFilter]);
//
//   // La pagination reste identique — elle lit totalPages
//   // qui vient maintenant du backend au lieu du calcul local.
//
// ═══════════════════════════════════════════════════════════════
// NOTE S3 vs YOUTUBE
// ═══════════════════════════════════════════════════════════════
//
//   S3 : stocker la vidéo brute + générer une thumbnailUrl avec
//   Sharp ou ffmpeg côté Node. Player : <video src={videoUrl} />.
//   Avantage : contrôle total, pas de dépendance externe.
//   Inconvénient : coût de bande passante S3 à grande échelle.
//
//   YouTube API : upload via googleapis/youtube_v3, stocker
//   l'ID YouTube (ex: "dQw4w9WgXcQ"). Embed frontend :
//   <iframe src={`https://youtube.com/embed/${videoUrl}`} />
//   Avantage : CDN mondial gratuit, player universel.
//   Inconvénient : dépendance Google, risque de suppression.
//
//   Recommandation : S3 pour la vidéo source (archive pérenne) +
//   YouTube pour la diffusion publique (performance + accessibilité).
//   Les deux URLs stockées dans Prisma — le frontend choisit
//   selon videoSource.
//
// ─────────────────────────────────────────────────────────────
// DONNÉES STATIQUES — actives jusqu'à connexion backend
// ─────────────────────────────────────────────────────────────
export const galleryMovies = [
  {
    id:          1,
    title:       "L'Aube Synthétique",
    director:    'Elena Rostova',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,   // À remplacer par URL S3 ou ID YouTube
    videoSource: 's3',
  },
  {
    id:          2,
    title:       'Mémoire Latente',
    director:    'Kaelen & I.A. Core',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          3,
    title:       'Racines de Silicium',
    director:    'Studio Horizon',
    category:    'Documentaire',
    img:         'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          4,
    title:       'Écho Humain',
    director:    'Collectif 2026',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          5,
    title:       'Fragments du Futur',
    director:    'Nadia Volkov',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 'youtube',
  },
  {
    id:          6,
    title:       'La Dernière Image',
    director:    'Marc Tessier',
    category:    'Documentaire',
    img:         'https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          7,
    title:       'Protocole Lumière',
    director:    'Amara Diallo',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 'youtube',
  },
  {
    id:          8,
    title:       'Signal Perdu',
    director:    'Yuki Tanaka',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
];

// Films par page — 8 cartes = environ 3 viewports de defilement H.
const FILMS_PER_PAGE = 8;

// ─────────────────────────────────────────────────────────────
// STRUCTURE API — prête à activer quand le backend est connecté
// ─────────────────────────────────────────────────────────────
//
// ÉTAPE 1 — Remplacer le tableau statique par un appel API.
//
// Actuellement : galleryMovies est hardcodé dans ce fichier.
// À terme : les films viennent de la base de données via l'API.
//
// Quand le backend est prêt, voici la migration exacte :
//
// ┌─────────────────────────────────────────────────────────┐
// │ AVANT (actuel) :                                        │
// │   const filtered = galleryMovies.filter(...)            │
// │   → données statiques, ne grandit pas automatiquement   │
// │                                                         │
// │ APRÈS (production) :                                    │
// │   const [films, setFilms] = useState([]);               │
// │   const [loading, setLoading] = useState(true);         │
// │   const [error, setError] = useState(null);             │
// │                                                         │
// │   useEffect(() => {                                     │
// │     fetch(`/api/films?page=${currentPage}               │
// │            &limit=${FILMS_PER_PAGE}                     │
// │            &category=${activeFilter}`)                  │
// │       .then(r => r.json())                              │
// │       .then(data => {                                   │
// │         setFilms(data.films);       // tableau films     │
// │         setTotalFilms(data.total);  // total pour pages  │
// │         setLoading(false);                              │
// │       })                                                │
// │       .catch(err => {                                   │
// │         setError(err);                                  │
// │         setLoading(false);                              │
// │       });                                               │
// │   }, [currentPage, activeFilter]);                      │
// │                                                         │
// │ La pagination côté serveur est plus performante :       │
// │ au lieu de charger 300 films d'un coup, l'API ne        │
// │ renvoie que les 12 films de la page demandée.           │
// └─────────────────────────────────────────────────────────┘
//
// ÉTAPE 2 — Adapter totalPages.
//
// Actuellement :
//   const totalPages = Math.ceil(filtered.length / FILMS_PER_PAGE);
//   → basé sur les données locales filtrées
//
// Après migration API :
//   const [totalFilms, setTotalFilms] = useState(0);
//   const totalPages = Math.ceil(totalFilms / FILMS_PER_PAGE);
//   → basé sur le total renvoyé par le backend (ex: { total: 347 })
//
// ÉTAPE 3 — Supprimer le filtrage et la pagination frontend.
//
// Le filtrage et la tranche (slice) actuels deviennent inutiles
// car l'API s'en charge côté serveur :
//   GET /api/films?page=2&limit=12&category=Fiction
//   → { films: [...], total: 87, page: 2, totalPages: 8 }
//
// Les states React (currentPage, activeFilter) restent identiques
// — seule la source de données change. Le JSX de pagination et
// de filtres n'a pas à être retouché.
//
// ÉTAPE 4 — Format attendu de l'API (à communiquer au backend).
//
//   Requête  : GET /api/films?page=1&limit=12&category=Fiction
//   Réponse  : {
//     films: [
//       {
//         id:       "uuid-ou-entier",
//         title:    "Titre du film",
//         director: "Nom du réalisateur",
//         category: "Fiction | Expérimental | Documentaire",
//         img:      "https://cdn.marsai.fr/films/affiche-id.jpg",
//       },
//       ...
//     ],
//     total:      87,   // total de films pour ce filtre
//     page:        1,
//     totalPages:  8,
//   }
//
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STRUCTURE API — PRÊTE À ACTIVER (Prisma + Node + JS)
// ─────────────────────────────────────────────────────────────
//
// Quand le backend sera connecté, remplacer galleryMovies par
// un appel fetch() vers votre route Node. Voici la structure
// exacte à implémenter — frontend et backend séparément.
//
// ── CÔTÉ BACKEND (Node + Express + Prisma) ─────────────────
//
//   // routes/films.js
//   router.get('/api/films', async (req, res) => {
//     const page     = parseInt(req.query.page)     || 1;
//     const limit    = parseInt(req.query.limit)    || 12;
//     const category = req.query.category           || undefined;
//     const skip     = (page - 1) * limit;
//
//     // Prisma pagine nativement avec skip/take —
//     // jamais besoin de charger tous les films pour paginer.
//     const [films, total] = await Promise.all([
//       prisma.film.findMany({
//         where:   category ? { category } : undefined,
//         skip,
//         take:    limit,
//         orderBy: { createdAt: 'desc' },
//         select: {
//           id:       true,
//           title:    true,
//           director: true,
//           category: true,
//           imageUrl: true,   // ← adapter au nom du champ Prisma
//         },
//       }),
//       prisma.film.count({
//         where: category ? { category } : undefined,
//       }),
//     ]);
//
//     res.json({ films, total, page, totalPages: Math.ceil(total / limit) });
//   });
//
// ── CÔTÉ FRONTEND — remplacer la logique statique par : ─────
//
//   // Dans MovieGallery.jsx, remplacer :
//   //   const [activeFilter, setActiveFilter] = useState(ALL_LABEL);
//   //   const [currentPage, setCurrentPage]   = useState(1);
//   //
//   // Ajouter :
//   //   const [films, setFilms]           = useState([]);
//   //   const [totalPages, setTotalPages] = useState(1);
//   //   const [loading, setLoading]       = useState(false);
//   //
//   // Remplacer le useMemo filtered/paginated par :
//   //
//   //   useEffect(() => {
//   //     const cat = activeFilter === ALL_LABEL ? '' : activeFilter;
//   //     setLoading(true);
//   //     fetch(`/api/films?page=${currentPage}&limit=${FILMS_PER_PAGE}&category=${cat}`)
//   //       .then(r => r.json())
//   //       .then(data => {
//   //         setFilms(data.films);
//   //         setTotalPages(data.totalPages);
//   //         setLoading(false);
//   //       });
//   //   }, [currentPage, activeFilter]);
//   //
//   // La pagination, les filtres, le layout asymétrique, les
//   // animations GSAP — RIEN d'autre ne change.
//   // Seule la source de données est remplacée.
//
// ─────────────────────────────────────────────────────────────


const ALL_LABEL = "Tous";

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function MovieGallery() {
  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);
  const [currentPage, setCurrentPage]   = useState(1);

  const sectionRef    = useRef(null); // section épinglée par GSAP
  const wrapperRef    = useRef(null); // translateX animé
  const progressRef   = useRef(null); // barre de progression
  const scrollHintRef = useRef(null); // indicateur scroll initial
  const galleryTopRef = useRef(null); // ancre pour lenis:scrollTo

  const categories = useMemo(() => {
    const cats = [...new Set(galleryMovies.map(m => m.category))];
    return [ALL_LABEL, ...cats];
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === ALL_LABEL) return galleryMovies;
    return galleryMovies.filter(m => m.category === activeFilter);
  }, [activeFilter]);

  // handleFilterChange - meme sequence que goToPage.
  // Sans ca : setActiveFilter direct -> React re-rend -> cleanup
  // GSAP retire spacer -> doc retrecit -> Lenis en animation sur
  // ancienne hauteur -> ecran noir.
  // L ancien useEffect(setCurrentPage,[activeFilter]) causait un
  // DEUXIEME cycle cleanup+init. Ici : un seul RAF, tout groupe.
  const handleFilterChange = useCallback((cat) => {
    if (activeFilter === cat) return;
    if (galleryTopRef.current) {
      window.dispatchEvent(new CustomEvent("lenis:scrollTo", {
        detail: { target: galleryTopRef.current },
      }));
    }
    requestAnimationFrame(() => {
      setActiveFilter(cat);
      setCurrentPage(1);
    });
  }, [activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FILMS_PER_PAGE));
  const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
  const paginated  = useMemo(
    () => filtered.slice(startIndex, startIndex + FILMS_PER_PAGE),
    [filtered, startIndex]
  );

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;

    // Saut instantané via Lenis AVANT tout changement d'état.
    //
    // Ordre critique :
    //   1. lenis:scrollTo → Lenis positionne le viewport en haut
    //   2. RAF → setCurrentPage → React re-rend → useGSAP cleanup
    //   3. Cleanup : kill ScrollTriggers → ScrollTrigger.refresh()
    //                → lenis:resize → GSAP retire le spacer pin
    //   4. Double RAF → init() → GSAP mesure + re-crée le pin
    //
    // Si 2 précède 1 : GSAP retire le spacer → document rétrécit
    // → Lenis était en animation sur l'ancienne hauteur → collision
    // → re-mesure sur DOM instable → spacer corrompu → bug noir.
    if (galleryTopRef.current) {
      window.dispatchEvent(new CustomEvent("lenis:scrollTo", {
        detail: { target: galleryTopRef.current },
      }));
    }

    requestAnimationFrame(() => {
      setCurrentPage(page);
    });
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1)          pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, currentPage]);

  // ── GSAP — pin:true + scroll horizontal ──────────────────
  useGSAP(() => {
    if (!wrapperRef.current || !sectionRef.current) return;
    if (paginated.length === 0) return;

    // Reset indicateur scroll
    if (scrollHintRef.current) {
      scrollHintRef.current.style.display = "";
      gsap.set(scrollHintRef.current, { opacity: 1, y: 0 });
    }

    const init = () => {
      if (!wrapperRef.current || !sectionRef.current) return;

      // Mesures dynamiques — jamais de valeur codée en dur.
      //
      // topOffset = hauteur cumulée des zones fixes au-dessus de la section :
      //   header (position:fixed)  +  filtersSection (position:sticky)
      //
      // C'est l'offset exact que GSAP doit utiliser pour :
      //   1. start "top top+=topOffset" → pin déclenche quand la section
      //      atteint exactement le bas du filtre sticky dans le viewport.
      //   2. sectionRef.height = vh - topOffset → quand GSAP pin la section
      //      (position:fixed; top:topOffset), elle couvre exactement
      //      le reste du viewport. Aucun fond parasite au-dessus (header/filtre)
      //      ni en-dessous (footer). Zéro zone noire.
      const headerEl  = document.querySelector("header");
      const headerH   = headerEl ? headerEl.offsetHeight : 64;
      const filterH   = galleryTopRef.current ? galleryTopRef.current.offsetHeight : 56;
      const topOffset = headerH + filterH;

      sectionRef.current.style.height = (window.innerHeight - topOffset) + "px";

      const scrollDist = wrapperRef.current.scrollWidth - window.innerWidth;
      if (scrollDist <= 0) return;

      const mainTween = gsap.to(wrapperRef.current, {
        x:    -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger:             sectionRef.current,
          pin:                 true,
          scrub:               1.5,
          // start : pin quand section.top = topOffset (sous header + filtre).
          start:               "top top+=" + topOffset,
          // end : calcul frais à chaque invalidation — évite la capture stale.
          end:                 () => "+=" + (wrapperRef.current.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true,

          onRefresh() {
            // Recalculer la hauteur section après tout resize GSAP
            if (!sectionRef.current || !galleryTopRef.current) return;
            const hEl = document.querySelector("header");
            const hH  = hEl ? hEl.offsetHeight : 64;
            const fH  = galleryTopRef.current.offsetHeight;
            sectionRef.current.style.height = (window.innerHeight - hH - fH) + "px";
            window.dispatchEvent(new CustomEvent("lenis:resize"));
          },

          onUpdate(self) {
            // Barre de progression
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
            // Indicateur scroll — disparaît au premier mouvement
            if (scrollHintRef.current && self.progress > 0.03) {
              gsap.to(scrollHintRef.current, {
                opacity: 0, y: 8, duration: 0.35, ease: "power2.out",
                onComplete() {
                  if (scrollHintRef.current) {
                    scrollHintRef.current.style.display = "none";
                  }
                },
              });
            }
          },
        },
      });

      const mainST = mainTween.scrollTrigger;

      // ── Par carte — parallaxe + scale/opacité ────────────
      const cards = wrapperRef.current.querySelectorAll(".hscroll-card");

      cards.forEach((card) => {
        const img = card.querySelector(".movie-card-img");

        // Parallaxe : image ±11% dans son cadre
        if (img) {
          gsap.fromTo(img,
            { x: "11%" },
            {
              x: "-11%", ease: "none",
              scrollTrigger: {
                trigger: card, containerAnimation: mainST,
                start: "left right", end: "right left", scrub: true,
              },
            }
          );
        }

        // Carte : scale + opacité — émergence au scroll
        gsap.fromTo(card,
          { scale: 0.88, opacity: 0.48 },
          {
            scale: 1.0, opacity: 1.0, ease: "none",
            scrollTrigger: {
              trigger: card, containerAnimation: mainST,
              start: "left 92%", end: "left 18%", scrub: true,
            },
          }
        );
      });

      // Notifier Lenis de la hauteur ajoutée par le spacer pin
      window.dispatchEvent(new CustomEvent("lenis:resize"));
    };

    // Double RAF — deux frames garantissent que :
    //   Frame 1 : React a terminé de peindre les nouvelles cartes
    //   Frame 2 : le navigateur a calculé scrollWidth / offsetHeight
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    // ── CLEANUP ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);

      // kill() retire le pin, le spacer, et tous les tweens proprement.
      ScrollTrigger.getAll().forEach(st => st.kill());

      // NE PAS appeler ScrollTrigger.refresh() ici.
      // Avec l'intégration gsap.ticker + lenis.on('scroll', ST.update),
      // refresh() déclenche une recalculation qui entre en collision
      // avec le lenis:resize dispatché juste après → double recalcul
      // sur DOM instable → état corrompu → écran noir.

      if (wrapperRef.current)  gsap.set(wrapperRef.current,  { x: 0 });
      if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 });
      // Réinitialiser la hauteur — la prochaine init la recalculera
      if (sectionRef.current)  sectionRef.current.style.height = "";

      // Lenis recalcule après que GSAP a retiré le spacer pin
      window.dispatchEvent(new CustomEvent("lenis:resize"));
    };

  }, { dependencies: [paginated] });

  return (
    <div className={styles.galleryRoot}>
      <nav
        ref={galleryTopRef}
        className={styles.filtersSection}
        aria-label="Filtrer les films par catégorie"
      >
        <div className={styles.filtersContainer}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={[
                styles.filterBtn,
                activeFilter === cat ? styles.filterActive : "",
              ].join(" ")}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* §B — SECTION ÉPINGLÉE
          GSAP pin:true — la section est rendue position:fixed pendant
          le scroll. Elle couvre exactement le viewport sous le header.
          Zéro trackOuter, zéro fond parasite, zéro zone noire. */}
      <section
        ref={sectionRef}
        className={styles.section}
        aria-label="Galerie des films — défilement horizontal"
      >
        <div ref={progressRef} className={styles.progressBar} aria-hidden="true" />

        {paginated.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>Aucun film dans cette catégorie.</p>
          </div>
        ) : (
          <>
            <div ref={wrapperRef} className={styles.wrapper}>
              {paginated.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={startIndex + i}
                  width={i === 0 ? "52vw" : "40vw"}
                  height="68vh"
                  className="hscroll-card"
                />
              ))}
            </div>

            <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
              <span className={styles.scrollHintText}>Défiler</span>
              <span className={styles.scrollHintArrow}>→</span>
            </div>
          </>
        )}
      </section>

      {/* §C — PAGINATION */}
      {totalPages > 1 && (
        <nav
          className={styles.pagination}
          aria-label="Navigation entre les pages de la galerie"
        >
          <button
            className={styles.pageNav}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >←</button>

          {pageNumbers.map((page, i) => {
            const prevPage     = pageNumbers[i - 1];
            const showEllipsis = prevPage && page - prevPage > 1;
            return (
              <span key={page} style={{ display: "contents" }}>
                {showEllipsis && (
                  <span className={styles.pageEllipsis} aria-hidden="true">…</span>
                )}
                <button
                  className={[
                    styles.pageBtn,
                    currentPage === page ? styles.pageBtnActive : "",
                  ].join(" ")}
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >{page}</button>
              </span>
            );
          })}

          <button
            className={styles.pageNav}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >→</button>

          <span className={styles.pageCount} aria-live="polite">
            {currentPage} / {totalPages}
          </span>
        </nav>
      )}
    </div>
  );
}