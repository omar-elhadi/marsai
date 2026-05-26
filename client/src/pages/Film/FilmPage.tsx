/**
 * FilmPage.jsx — MARSAI Festival
 * Page publique — Fiche détail d'un film
 * Route : /film/:id  (ROUTES.FILM_DETAIL)
 *
 * ═══════════════════════════════════════════════════════════════
 * SÉPARATION DES RESPONSABILITÉS
 * ═══════════════════════════════════════════════════════════════
 *
 * FilmPage.module.css → tous les styles statiques
 * GSAP (useGSAP)      → opacity + y sur pageHeader / body
 *                        clearProps:'all' libère le CSS après
 * Aucun style inline  → zéro style={{}} dans ce fichier
 * Aucune classe Tailwind → un seul système de style par composant
 *
 * ═══════════════════════════════════════════════════════════════
 * ÉTAT ACTUEL — Données statiques
 * ═══════════════════════════════════════════════════════════════
 *
 * La galerie (MovieGallery.jsx) tourne sur GALLERY_MOVIES[] statique.
 * FilmPage lit la même source — cohérence garantie.
 * Quand MovieGallery migre vers l'API, FilmPage suit le même
 * mouvement sans restructuration du JSX.
 *
 * ═══════════════════════════════════════════════════════════════
 * CONTRAT DE MIGRATION BACKEND — À lire avant intégration
 * ═══════════════════════════════════════════════════════════════
 *
 * Endpoint attendu :
 *   GET /api/films/:id/public
 *   → Pas d'auth requise. Champs limités (pas de votes, pas de jury).
 *   → Réponse : { id, title, director, category, img, videoUrl,
 *                 videoSource, description, country, aiToolsUsed }
 *
 * Migration exacte (remplacer le bloc useEffect) :
 *
 *   const API = import.meta.env.VITE_API_URL;
 *
 *   useEffect(() => {
 *     setLoading(true);
 *     fetch(`${API}/films/${id}/public`)
 *       .then(r => {
 *         if (!r.ok) throw new Error('Film introuvable');
 *         return r.json();
 *       })
 *       .then(data => setFilm(data))
 *       .catch(() => setFilm(null))
 *       .finally(() => setLoading(false));
 *   }, [id, API]);
 *
 * NB : Ne pas réutiliser l'endpoint admin (/films/:id sans /public)
 * car il requiert credentials:include et expose les votes jury.
 * Un endpoint public dédié protège les données internes.
 *
 * ═══════════════════════════════════════════════════════════════
 * LECTURE VIDÉO — trois cas
 * ═══════════════════════════════════════════════════════════════
 *
 * videoSource 'youtube' + videoUrl  → iframe embed 16/9
 * videoSource 's3'      + videoUrl  → <video controls>
 * videoUrl null                     → image de couverture + badge
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { galleryService } from "@/services/api/gallery.service.js";
import { ROUTES } from "@/constants/routes";
import styles from "./FilmPage.module.css";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Extrait l'ID YouTube depuis une URL standard ou embed.
// Identique à l'admin FilmDetail — source unique de logique.
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
};

// Chemin retour centralisé — si ROUTES.GALERIE change, un seul endroit.
const BACK_HREF = ROUTES.GALERIE;

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function FilmPage() {
  const { id } = useParams();
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  // ── Source de données ───────────────────────────────────────
  // DONNÉES STATIQUES — actives jusqu'à connexion backend.
  // Voir bloc CONTRAT DE MIGRATION BACKEND ci-dessus.
  // id dans l'URL est une string — comparaison via String() explicite.
  const [film, setFilm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilm = async () => {
      try {
        setLoading(true);
        if (id) {
            const data = await galleryService.getById(id);
            setFilm(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du film:", err);
        setFilm(null);
        // Removed mock fallback
      } finally {
        setLoading(false);
      }
    };

    loadFilm();
  }, [id]);

  // ── Animation d'entrée ─────────────────────────────────────
  // GSAP anime opacity + y sur headerRef et bodyRef.
  // clearProps: 'all' libère le contrôle CSS après l'entrée.
  // Le CSS module ne déclare pas opacity/transform — pas de conflit.
  useGSAP(
    () => {
      if (!film || loading) return;

      const els = [headerRef.current, bodyRef.current].filter(Boolean);
      gsap.set(els, { opacity: 0, y: 24 });
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: pageRef, dependencies: [film, loading] },
  );

  // ── États transitoires ─────────────────────────────────────
  if (loading) {
    return <div className={styles.loadingState}>Chargement…</div>;
  }

  if (!film) {
    return (
      <div className={styles.notFoundState}>
        <span className={styles.notFoundLabel}>Film introuvable</span>
        <Link to={BACK_HREF} className={styles.notFoundLink}>
          ← Retour à la galerie
        </Link>
      </div>
    );
  }

  const youtubeId = getYoutubeId(film.videoUrl);

  return (
    <>
      <SEO
        title={`${film.title} | Marsai Film Festival`}
        description={
          film.synopsis ||
          `Découvrez le film ${film.title} sur la galerie du Marsai Film Festival.`
        }
        image={film.coverUrl || film.thumbnail}
      />
      <div ref={pageRef} className={styles.page}>
        <div className={styles.container}>
          {/* ── En-tête ────────────────────────────────────────── */}
          <header ref={headerRef} className={styles.pageHeader}>
            {/* Navigation retour */}
            <div className={styles.navRow}>
              <Link to={BACK_HREF} className={styles.backLink}>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M13 4H1M4 1L1 4L4 7"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Galerie
              </Link>
              <span className={styles.navSeparator} aria-hidden="true" />
              <span className="label-overline">Sélection officielle</span>
            </div>

            {/* Pill catégorie */}
            {film.category && (
              <span className={styles.categoryBadge}>{film.category}</span>
            )}

            {/* Titre */}
            <h1 className={styles.filmTitle}>{film.title}</h1>

            {/* Réalisateur */}
            <p className={styles.filmDirector}>{film.director}</p>
          </header>

          {/* ── Corps ──────────────────────────────────────────── */}
          <div ref={bodyRef}>
            {/* ── Lecteur vidéo / image ─────────────────────────
              Cas 1 : YouTube  → iframe 16/9
              Cas 2 : S3       → <video controls>
              Cas 3 : pas de vidéo → image de couverture + badge */}
            <div className={styles.mediaWrapper}>
              {youtubeId ? (
                <div className={styles.youtubeWrapper}>
                  <iframe
                    className={styles.youtubeIframe}
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={film.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : film.videoUrl && film.videoSource === "s3" ? (
                <video
                  className={styles.videoS3}
                  src={film.videoUrl}
                  controls
                  aria-label={`Lecture de ${film.title}`}
                />
              ) : (
                <div className={styles.imageFallbackWrapper}>
                  <img
                    className={styles.fallbackImg}
                    src={film.img}
                    alt={`Affiche du film ${film.title}`}
                  />
                  <div className={styles.videoBadge}>
                    Vidéo disponible prochainement
                  </div>
                </div>
              )}
            </div>

            {/* ── Métadonnées ────────────────────────────────────
              Grille auto-fit — extensible au backend (description,
              country, aiToolsUsed viendront dans la migration). */}
            <div className={styles.metaGrid}>
              {[
                { label: "Titre", value: film.title },
                { label: "Réalisateur", value: film.director },
                { label: "Catégorie", value: film.category },
              ]
                .filter(({ value }) => value) // Filtre les valeurs null/undefined
                .map(({ label, value }) => (
                  <div key={label}>
                    <span className={styles.metaLabel}>{label}</span>
                    <span className={styles.metaValue}>{value}</span>
                  </div>
                ))}
            </div>
          </div>
          {/* fin bodyRef */}
        </div>
      </div>
    </>
  );
}
