/**
 * MovieGallery.jsx — MARSAI Festival
 * Galerie · Page complète
 * Refactoring Étape 4 — Galerie
 *
 * ═══════════════════════════════════════════════════════════════
 * CONCEPT : Le programme du festival
 * ═══════════════════════════════════════════════════════════════
 *
 * Architecture :
 *   Hero de page → Filtres par catégorie → Grille éditoriale
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. pin: true SUPPRIMÉ — incompatible avec Lenis.
 *    Réintroduirait structurellement le bug de hauteur corrigé
 *    dans PublicLayout. Décision non négociable.
 *    Alternative : grille verticale cinématographique.
 *
 * 2. IDs dupliqués corrigés (1,2,3,4 répétés dans l'original).
 *    Chaque film a un id unique — clé React stable.
 *
 * 3. Filtres : état React useState → classe .filterActive CSS.
 *    Zéro style inline pour l'état actif.
 *
 * 4. Clip-path reveal au scroll — chaque carte entre depuis
 *    le bas : inset(0 0 100% 0) → inset(0 0 0% 0).
 *    clearProps: 'clipPath,opacity' — CSS Module reprend.
 *
 * 5. Grille asymétrique — paires de cartes (grande + petite)
 *    en pattern A/B alterné. Hauteurs passées via --card-height.
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import gsap                          from 'gsap';
import { useGSAP }                   from '@gsap/react';
import { ScrollTrigger }             from 'gsap/ScrollTrigger';
import { Link }                      from 'react-router-dom';
import { ROUTES }                    from '@/constants/routes';
import MovieCard                     from './MovieCard';
import styles                        from './MovieGallery.module.css';

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
  {
    id:          9,
    title:       "L'Aube Synthétique",
    director:    'Elena Rostova',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,   // À remplacer par URL S3 ou ID YouTube
    videoSource: 's3',
  },
  {
    id:          10,
    title:       'Mémoire Latente',
    director:    'Kaelen & I.A. Core',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          11,
    title:       'Racines de Silicium',
    director:    'Studio Horizon',
    category:    'Documentaire',
    img:         'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          12,
    title:       'Écho Humain',
    director:    'Collectif 2026',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          13,
    title:       'Fragments du Futur',
    director:    'Nadia Volkov',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 'youtube',
  },
  {
    id:          14,
    title:       'La Dernière Image',
    director:    'Marc Tessier',
    category:    'Documentaire',
    img:         'https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
  {
    id:          15,
    title:       'Protocole Lumière',
    director:    'Amara Diallo',
    category:    'Fiction',
    img:         'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 'youtube',
  },
  {
    id:          16,
    title:       'Signal Perdu',
    director:    'Yuki Tanaka',
    category:    'Expérimental',
    img:         'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    videoUrl:    null,
    videoSource: 's3',
  },
];

// Films par page — calibré pour la production.
// 12 films = 25 pages pour 300 films, 50 pages pour 600.
// La pagination se crée et s'étend automatiquement.
// Ajuster ici uniquement — aucune autre modification requise.
const FILMS_PER_PAGE = 12;

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

// Catégories extraites dynamiquement
const ALL_LABEL = 'Tous';

// ─────────────────────────────────────────────────────────────
// UTILITAIRE — découpage en paires pour le layout asymétrique
// ─────────────────────────────────────────────────────────────
function chunkPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  return pairs;
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function MovieGallery() {
  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);
  const [currentPage, setCurrentPage]   = useState(1);

  const heroRef       = useRef(null);
  const galleryTopRef = useRef(null);  // Ancre pour le scroll en haut au changement de page
  // Refs pour l'animation de comptage des métas
  const countFilmsRef = useRef(null);
  const countYearRef  = useRef(null);
  const titleRef   = useRef(null);
  const metaRef    = useRef(null);
  const gridRef    = useRef(null);

  // Catégories uniques extraites des données
  const categories = useMemo(() => {
    const cats = [...new Set(galleryMovies.map(m => m.category))];
    return [ALL_LABEL, ...cats];
  }, []);

  // Films filtrés selon la catégorie active
  const filtered = useMemo(() => {
    if (activeFilter === ALL_LABEL) return galleryMovies;
    return galleryMovies.filter(m => m.category === activeFilter);
  }, [activeFilter]);

  // Reset page à 1 quand le filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Pagination — tranche du tableau filtré pour la page courante.
  // totalPages se recalcule automatiquement quand filtered change —
  // ajouter un film au tableau galleryMovies suffit.
  const totalPages   = Math.max(1, Math.ceil(filtered.length / FILMS_PER_PAGE));
  const startIndex   = (currentPage - 1) * FILMS_PER_PAGE;
  const paginated    = useMemo(
    () => filtered.slice(startIndex, startIndex + FILMS_PER_PAGE),
    [filtered, startIndex]
  );

  // Films en paires pour la grille asymétrique
  const pairs = useMemo(() => chunkPairs(paginated), [paginated]);

  // Navigation entre pages + scroll vers le haut de la grille
  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll vers le haut de la section galerie après changement de page
    requestAnimationFrame(() => {
      galleryTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [totalPages]);

  // Construction des numéros de pages à afficher —
  // ellipse si plus de 5 pages au total.
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // Fenêtre glissante : toujours afficher 1, ..., courant-1, courant, courant+1, ..., total
    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1)         pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, currentPage]);

  // ── GSAP — Animations d'entrée ───────────────────────────
  useGSAP(() => {
    // Hero — titre blur→net + meta fade
    // Même geste cinématographique que HeroImpact
    gsap.set(titleRef.current, {
      opacity: 0,
      filter:  'blur(24px)',
      y:       20,
    });
    gsap.set(metaRef.current, { opacity: 0, y: 18 });

    const heroTl = gsap.timeline({ delay: 0.15 });

    heroTl.to(titleRef.current, {
      opacity:    1,
      filter:     'blur(0px)',
      y:          0,
      duration:   1.0,
      ease:       'power3.out',
      clearProps: 'filter',
    });

    heroTl.to(metaRef.current, {
      opacity:    1,
      y:          0,
      duration:   0.7,
      ease:       'power2.out',
      clearProps: 'opacity,y',
    }, 0.35);

    // Compteur animé — les chiffres montent depuis 0.
    // Effet plaisant pour les 18-30, impressionnant pour les 40+.
    // Le chiffre final est lu depuis data-target pour rester
    // synchronisé avec les données réelles.
    [countFilmsRef, countYearRef].forEach((ref) => {
      if (!ref.current) return;
      const target = parseInt(ref.current.dataset.target, 10);
      gsap.fromTo(
        ref.current,
        { innerText: 0 },
        {
          innerText: target,
          duration:  1.4,
          delay:     0.5,
          ease:      'power2.out',
          snap:      { innerText: 1 },  // Nombres entiers uniquement
          onUpdate() {
            // Formatage pendant le comptage
            ref.current.innerText = Math.round(
              parseFloat(ref.current.innerText)
            ).toLocaleString('fr-FR');
          },
        }
      );
    });

  }, { scope: heroRef });

  // ── GSAP — Révélation des cartes au scroll ───────────────
  useGSAP(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('[data-gallery-card]');

    cards.forEach((card) => {
      // État initial : caché par clip-path depuis le bas
      gsap.set(card, {
        clipPath: 'inset(0 0 100% 0)',
        opacity:  0,
      });

      ScrollTrigger.create({
        trigger: card,
        start:   'top 85%',
        once:    true,
        onEnter() {
          gsap.to(card, {
            clipPath:   'inset(0 0 0% 0)',
            opacity:    1,
            duration:   0.85,
            ease:       'power3.out',
            // clearProps restitue le contrôle au CSS Module
            // — les hover transitions CSS peuvent fonctionner.
            clearProps: 'clipPath,opacity',
          });
        },
      });
    });

    // Nettoyage ScrollTrigger au changement de filtre
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };

  }, { scope: gridRef, dependencies: [paginated] });

  return (
    <>
      {/* ════════════════════════════════════════════════════
          §A — HERO DE PAGE
          ════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-label="Galerie de la sélection officielle MARSAI 2026"
        className={styles.hero}
      >
        {/* Image de fond — audience dans une salle obscure.
            Des gens qui regardent, pas des techniciens.
            Message visuel : ce festival est pour tout le monde. */}
        <div className={styles.heroBgImage} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroGrain}   aria-hidden="true" />

        <div className={styles.heroContainer}>

          {/* Overline */}
          <div className={styles.heroOverline}>
            <span className={styles.heroOverlineLine} aria-hidden="true" />
            <span className="label-overline">Sélection Officielle · 2026</span>
          </div>

          {/* Titre — blur→net au montage */}
          <h1 ref={titleRef} className={styles.heroTitle}>
            Galerie<br />
            <span className={styles.heroTitleAccent}>des Œuvres</span>
          </h1>

          {/* Sous-titre — ligne d'invitation inclusive.
              "Toutes les histoires méritent d'être racontées."
              Le 22 ans se reconnaît. Le 45 ans acquiesce. */}
          <p className={styles.heroSubtitle}>
            Toutes les histoires méritent d'être racontées.
          </p>

          {/* Métas — comptage animé au montage */}
          <div ref={metaRef} className={styles.heroMeta}>

            <div className={styles.heroMetaItem}>
              {/* data-target : valeur cible pour GSAP countTo */}
              <span
                ref={countFilmsRef}
                className={styles.heroMetaValue}
                data-target={galleryMovies.length}
                aria-label={`${galleryMovies.length} films sélectionnés`}
              >
                0
              </span>
              <span className={styles.heroMetaLabel}>Films sélectionnés</span>
            </div>

            <div className={styles.heroMetaDivider} aria-hidden="true" />

            <div className={styles.heroMetaItem}>
              <span
                ref={countYearRef}
                className={styles.heroMetaValue}
                data-target={2026}
                aria-label="Édition 2026"
              >
                0
              </span>
              <span className={styles.heroMetaLabel}>Édition</span>
            </div>

            <div className={styles.heroMetaDivider} aria-hidden="true" />

            <div className={styles.heroMetaItem}>
              {/* Durée — statique, pas de comptage (unité mixte) */}
              <span className={styles.heroMetaValue}>1 min</span>
              <span className={styles.heroMetaLabel}>Format imposé</span>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §B — BANDE D'INVITATION
          Passerelle discrète vers la soumission.
          Parle directement au cinéaste en devenir.
          ════════════════════════════════════════════════ */}
      <div className={styles.inviteStrip} role="complementary">
        <div className={styles.inviteStripInner}>
          <p className={styles.inviteStripText}>
            Tu as réalisé un court-métrage d'une minute avec l'I.A. ?
            Cette galerie peut être la tienne.
          </p>
          <Link
            to={ROUTES.SOUMETTRE}
            className={styles.inviteStripLink}
            aria-label="Soumettre votre film au festival MARSAI"
          >
            Soumettre mon film
            <span className={styles.inviteStripArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          §C — FILTRES
          ════════════════════════════════════════════════ */}
      <nav
        className={styles.filtersSection}
        aria-label="Filtrer les films par catégorie"
      >
        <div className={styles.filtersContainer}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          §C — GRILLE ÉDITORIALE ASYMÉTRIQUE
          ════════════════════════════════════════════════ */}
      <section
        ref={galleryTopRef}
        className={styles.gallerySection}
        aria-label="Films de la sélection"
      >
        <div className={styles.galleryContainer} ref={gridRef}>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                Aucun film dans cette catégorie.
              </p>
            </div>
          ) : (
            pairs.map((pair, rowIndex) => {
              // Pattern A (pair) : grande → petite
              // Pattern B (impair) : petite → grande
              const isPatternA = rowIndex % 2 === 0;

              return (
                <div
                  key={rowIndex}
                  className={`${styles.galleryRow} ${isPatternA ? styles.galleryRowA : styles.galleryRowB}`}
                >
                  {pair.map((movie, posInRow) => {
                    // Hauteur selon la position dans le layout :
                    // Pattern A : pos 0 = grande, pos 1 = petite
                    // Pattern B : pos 0 = petite, pos 1 = grande
                    const isLarge = isPatternA
                      ? posInRow === 0
                      : posInRow === 1;

                    // Hauteur via CSS custom property — définie
                    // dans MovieGallery.module.css .gallerySection
                    const height = isLarge
                      ? 'var(--height-large)'
                      : 'var(--height-small)';

                    return (
                      <div
                        key={movie.id}
                        data-gallery-card
                      >
                        <MovieCard
                          movie={movie}
                          index={galleryMovies.indexOf(movie)}
                          height={height}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}

        </div>

        {/* ── Pagination — dynamique, zéro backend ─────────────
            totalPages recalculé automatiquement depuis
            filtered.length / FILMS_PER_PAGE.
            Ajouter un film à galleryMovies suffit. */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Navigation entre les pages de la galerie">

            {/* Précédent */}
            <button
              className={styles.pageNav}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              ←
            </button>

            {/* Numéros avec ellipse */}
            {pageNumbers.map((page, i) => {
              // Ellipse avant ce numéro si gap avec le précédent
              const prevPage = pageNumbers[i - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <span key={page} style={{ display: 'contents' }}>
                  {showEllipsis && (
                    <span className={styles.pageEllipsis} aria-hidden="true">…</span>
                  )}
                  <button
                    className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

            {/* Suivant */}
            <button
              className={styles.pageNav}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              →
            </button>

            {/* Compteur textuel */}
            <span className={styles.pageCount} aria-live="polite">
              {currentPage} / {totalPages}
            </span>

          </nav>
        )}

      </section>
    </>
  );
}