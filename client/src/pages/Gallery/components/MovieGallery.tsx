/**
 * MovieGallery.jsx — MARSAI Festival
 * Galerie · Page complète — défilement horizontal
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE GSAP
 * ═══════════════════════════════════════════════════════════════
 *
 * Une seule timeline ScrollTrigger (scrub 1.2) gère tout :
 *
 *   tl @ 0 : wrapperRef.translateX(0 → -scrollDistance)
 *     Translation horizontale de l'ensemble des cartes.
 *     Pilotée par le scroll vertical via pin:true.
 *
 *   tl @ 0 : chaque img.movie-image.translateX(15vw → -15vw)
 *     Parallaxe interne — l'image glisse dans son cadre opaque.
 *     Même horloge que la translation → synchronisation parfaite.
 *     scale:1.3 en CSS absorbe le déplacement (30% de marge = 15% par côté).
 *
 * DOM (src/pages/Gallery/components/) :
 *   div.galleryRoot   paddingTop = headerH (DOM direct, hors context GSAP)
 *     section         pin:true, height = vh − headerH (DOM direct)
 *       div.progress  barre de progression accent
 *       div.wrapper   translateX scrub
 *         MovieCard × N  .movie-card (global GSAP) / .movie-image (global GSAP)
 *       div.scrollHint
 *
 * ═══════════════════════════════════════════════════════════════
 * ZÉRO ÉCRAN NOIR — EXPLICATION
 * ═══════════════════════════════════════════════════════════════
 *
 * useGSAP({ scope: sectionRef }) crée un gsap.context() en interne.
 * La cleanup React appelle automatiquement context.revert() :
 *   - Tous les tweens et ScrollTriggers sont détruits.
 *   - Tous les styles inline posés par GSAP (x du wrapper, x des images,
 *     position:fixed du pin, pin-spacer) sont restaurés à leur valeur CSS.
 *   - paddingTop et section.height sont posés via DOM direct (hors context)
 *     → non revertés → layout stable entre démontage et remontage (HMR).
 *
 * ═══════════════════════════════════════════════════════════════
 * CONNEXION BACKEND — voir bloc CONTRAT ci-dessous
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MovieCard from "./MovieCard";
import styles from "./MovieGallery.module.css";
import { galleryService } from "@/services/api/gallery.service.js";

gsap.registerPlugin(ScrollTrigger);

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
// ─────────────────────────────────────────────────────────────
// DONNÉES STATIQUES — Déplacées vers /data/mockData.js (GALLERY_MOVIES)
// Les données statiques sont maintenant utilisées uniquement comme fallback
// en cas d'erreur de connexion API (mode développement)
// ─────────────────────────────────────────────────────────────

// FILMS_PER_PAGE sera réintroduit lors de la connexion backend.
// L'API recevra : GET /api/films?page=1&limit=8
// Voir bloc CONTRAT D'INTERFACE BACKEND ci-dessus.

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

// const FILMS_PER_PAGE = 8; Cette constante sera réintroduite lors de la connexion backend. L'API recevra : GET /api/films?page=1&limit=8
// Voir bloc CONTRAT D'INTERFACE BACKEND ci-dessus.

// ─────────────────────────────────────────────────────────────
// DONNÉES STATIQUES DE FALLBACK
// Utilisées quand l'API retourne une liste vide.
// ─────────────────────────────────────────────────────────────
const FALLBACK_FILMS = [
  {
    id: "fallback-1",
    title: "Mémoire Synthétique",
    director: "K. Okafor",
    img: "https://images.unsplash.com/photo-1705249190144-19d7b6d28574?q=80&w=1677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    country: "Nigeria · France",
  },
  {
    id: "fallback-2",
    title: "Éclat de Rien",
    director: "M. Chen",
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=88&w=900&auto=format&fit=crop",
    country: "Taiwan",
  },
  {
    id: "fallback-3",
    title: "La Dernière Fréquence",
    director: "A. Petrov",
    img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=88&w=900&auto=format&fit=crop",
    country: "Russie · Allemagne",
  },
  {
    id: "fallback-4",
    title: "Nuit Synthétique",
    director: "S. Laurent",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=88&w=900&auto=format&fit=crop",
    country: "France",
  },
  {
    id: "fallback-5",
    title: "Horizons Artificiels",
    director: "Y. Tanaka",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=88&w=900&auto=format&fit=crop",
    country: "Japon",
  },
  {
    id: "fallback-6",
    title: "Le Dernier Script",
    director: "M. Johansson",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=88&w=900&auto=format&fit=crop",
    country: "Suède · Danemark",
  },
];

export default function MovieGallery() {
  // galleryRootRef : paddingTop = headerH (DOM direct, hors context GSAP).
  //   Non revert au cleanup → section toujours sous le header.
  const galleryRootRef = useRef(null);

  // sectionRef : cible du pin:true. height = vh − headerH (DOM direct).
  //   scope de useGSAP → toutes les queries GSAP sont scoped ici.
  const sectionRef = useRef(null);

  // wrapperRef  : translateX animé par la timeline.
  // progressRef : scaleX animé par onUpdate (0 → 1).
  // scrollHintRef : disparaît après 3% de progression.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await galleryService.getAll({ page: 1, limit: 100 });
        // N'utiliser le fallback que si l'API échoue ou renvoie 0 film,
        // jamais au montage initial (évite le flash 6→2 images + pin GSAP stale).
        if (response.data && response.data.length > 0) {
          setFilms(response.data);
        } else {
          setFilms(FALLBACK_FILMS);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des films :", err);
        setFilms(FALLBACK_FILMS);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  useGSAP(
    () => {
      if (!galleryRootRef.current || !sectionRef.current || !wrapperRef.current)
        return;

      // Attendre que les films soient chargés avant d'initialiser GSAP
      if (!films || films.length === 0) return;

      // ── Mesures dynamiques ──────────────────────────────────────
      // Posées via DOM direct, hors du context GSAP.
      // context.revert() ne les touche pas → layout stable après cleanup.
      const headerEl = document.querySelector("header");
      const headerH = headerEl ? headerEl.offsetHeight : 64;
      const sectionH = window.innerHeight - headerH;

      const rootEl = galleryRootRef.current as HTMLElement;
      rootEl.style.paddingTop = headerH + "px";
      const secEl = sectionRef.current as HTMLElement;
      secEl.style.height = sectionH + "px";

      const wrapperEl = wrapperRef.current as HTMLElement;
      const scrollDistance = wrapperEl.scrollWidth - window.innerWidth;
      if (scrollDistance <= 0) return;

      if (scrollHintRef.current) {
        gsap.set(scrollHintRef.current, { opacity: 1, display: "" });
      }

      // ── Timeline unifiée ────────────────────────────────────────
      //
      // pin:true + pinSpacing:true :
      //   GSAP applique position:fixed à la section pendant le scroll.
      //   Le scroll vertical est entièrement consommé par la translation H.
      //   Aucun axe parasite. Le pin-spacer maintient la place dans le flux.
      //
      // scrub:1.2 : inertie légère pour une sensation luxueuse.
      // invalidateOnRefresh:true : recalcule scrollDistance au resize.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          start: "top top+=" + headerH,
          end: () => "+=" + (wrapperEl.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true,

          onRefresh() {
            if (!galleryRootRef.current || !sectionRef.current) return;
            const hEl = document.querySelector("header");
            const hH = hEl ? hEl.offsetHeight : 64;
            const sH = window.innerHeight - hH;
            (galleryRootRef.current as HTMLElement).style.paddingTop =
              hH + "px";
            (sectionRef.current as HTMLElement).style.height = sH + "px";
            window.dispatchEvent(new CustomEvent("lenis:resize"));
          },

          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (
              scrollHintRef.current &&
              self.progress > 0.03 &&
              !scrollHintRef.current.dataset.hidden
            ) {
              scrollHintRef.current.dataset.hidden = "true";
              gsap.to(scrollHintRef.current, {
                opacity: 0,
                y: 6,
                duration: 0.4,
                ease: "power2.out",
                onComplete() {
                  if (scrollHintRef.current)
                    (scrollHintRef.current as HTMLElement).style.display =
                      "none";
                },
              });
            }
          },
        },
      });

      // Position 0 : translation du wrapper
      tl.to(wrapperRef.current, { x: -scrollDistance, ease: "none" }, 0);

      // Position 0 : parallaxe interne par image
      //
      // x : 15vw → -15vw — l'image glisse dans son cadre opaque pendant
      //   que la carte traverse le viewport.
      //   scale:1.3 en CSS (hors context) absorbe le déplacement :
      //   30% d'agrandissement = 15% de marge par côté → jamais de bord visible.
      //   Le scale étant en CSS et non dans le fromTo, revert() le laisse intact.
      gsap.utils.toArray(".movie-card").forEach((card: any) => {
        const img = card.querySelector(".movie-image");
        if (img) tl.fromTo(img, { x: "15vw" }, { x: "-15vw", ease: "none" }, 0);
      });

      // Lenis recalcule la hauteur du document (pin-spacer vient d'être créé)
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("lenis:resize"));
      });
    },
    { scope: sectionRef, dependencies: [films] },
  );

  return (
    <div ref={galleryRootRef} className={styles.galleryRoot}>
      {loading ? (
        // On ne montre rien tant que la galerie API n'est pas prête :
        // évite le flash du fallback (6 cartes) puis le swap brutal vers
        // les films réels (2 cartes) qui cassait le pin GSAP.
        <div className={styles.loading} aria-label="Chargement de la galerie">
          <span className={styles.loadingText}>
            Galerie en cours de chargement
          </span>
        </div>
      ) : (
        <section
          ref={sectionRef}
          className={styles.section}
          aria-label="Galerie des films — défilement horizontal"
        >
          <div
            ref={progressRef}
            className={styles.progressBar}
            aria-hidden="true"
          />

          <div ref={wrapperRef} className={styles.wrapper}>
            {films.map((movie: any, i: number) => (
              <MovieCard key={movie.id + "-" + i} movie={movie} index={i} />
            ))}
          </div>

          <div
            ref={scrollHintRef}
            className={styles.scrollHint}
            aria-hidden="true"
          >
            <span className={styles.scrollHintText}>Défiler</span>
            <span className={styles.scrollHintArrow}>→</span>
          </div>
        </section>
      )}
    </div>
  );
}
