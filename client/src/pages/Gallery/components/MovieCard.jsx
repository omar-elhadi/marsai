/**
 * MovieCard.jsx — MARSAI Festival
 * Galerie · Carte film — défilement horizontal
 *
 * ═══════════════════════════════════════════════════════════════
 * CONVENTION DE CLASSES
 * ═══════════════════════════════════════════════════════════════
 *
 *   Classes CSS module  → tout le styling (MovieCard.module.css)
 *   Classes globales    → ciblage GSAP uniquement, aucun style
 *
 *     .movie-card    article racine   gsap.utils.toArray('.movie-card')
 *     .movie-image   img              card.querySelector('.movie-image')
 *
 * ═══════════════════════════════════════════════════════════════
 * STRUCTURE DOM
 * ═══════════════════════════════════════════════════════════════
 *
 *   a.card.movie-card                Link — cible GSAP
 *     div.cardMask                   Masque overflow:hidden
 *       img.cardImage.movie-image    Image — scale:1.3 absorbe parallaxe ±15vw
 *       div.cardVeil                 Voile d'obscurité hover
 *     div.cardPanel                  Panneau asymétrique éditorial
 *       div.cardPanelHeader          Numéro + catégorie
 *         span.cardNum               Numéro de la carte
 *         span.cardCategory          Catégorie du film
 *       h3.cardTitle                 Titre du film
 *       p.cardDirector               Réalisateur
 *
 * ═══════════════════════════════════════════════════════════════
 * DESIGN — PANNEAU ASYMÉTRIQUE
 * ═══════════════════════════════════════════════════════════════
 *
 * Le panneau est en position absolute avec bottom et right négatifs.
 * Il déborde volontairement de la carte — signature éditoriale.
 * width > 100% sur desktop → le panneau chevauche la carte suivante.
 * L'article n'a pas overflow:hidden → le panneau reste visible.
 * Le masque (cardMask) a overflow:hidden → l'image reste clippée.
 *
 * ═══════════════════════════════════════════════════════════════
 * PROPS
 * ═══════════════════════════════════════════════════════════════
 *
 *   movie   { id, title, director, category, img }
 *   index   position 0-based dans galleryMovies
 */

import { Link }   from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import styles     from './MovieCard.module.css';

export default function MovieCard({ movie, index }) {
  const filmRoute = ROUTES.FILM_DETAIL
    ? ROUTES.FILM_DETAIL.replace(':id', movie.id)
    : `/film/${movie.id}`;

  const num = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={filmRoute}
      className={`${styles.card} movie-card`}
      aria-label={`Voir le film : ${movie.title}, dirigé par ${movie.director}`}
    >

      {/* ── Masque image ──────────────────────────────────── */}
      {/* overflow:hidden — clippe l'image animée par GSAP */}
      <div className={styles.cardMask}>

        {/* .movie-image : classe globale ciblée par GSAP (parallaxe x) */}
        <img
          src={movie.img}
          alt={`Affiche du film ${movie.title}`}
          className={`${styles.cardImage} movie-image`}
          loading="lazy"
          draggable="false"
        />

        {/* Voile d'obscurité — assure le contraste du panneau */}
        <div className={styles.cardVeil} aria-hidden="true" />

      </div>

      {/* ── Panneau éditorial asymétrique ─────────────────── */}
      {/* Position absolute avec overflow négatif — cf. design notes */}
      <div className={styles.cardPanel}>

        <div className={styles.cardPanelHeader}>
          <span className={styles.cardNum}>{num}</span>
          {movie.category && (
            <span className={styles.cardCategory}>{movie.category}</span>
          )}
        </div>

        <h3 className={styles.cardTitle}>{movie.title}</h3>

        <p className={styles.cardDirector}>
          Dirigé par {movie.director}
        </p>

      </div>

    </Link>
  );
}