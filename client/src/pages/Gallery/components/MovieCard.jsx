/**
 * MovieCard.jsx — MARSAI Festival
 * Galerie · Carte film individuelle
 * Refactoring Étape 4 — Galerie
 *
 * ═══════════════════════════════════════════════════════════════
 * CONCEPT : La pellicule avant la projection
 * ═══════════════════════════════════════════════════════════════
 *
 * Au repos : image désaturée — pellicule non développée.
 * Au hover : couleur révélée + filet qui s'étire + titre monte.
 * Cohérence absolue avec SectionJury — même logique N&B→couleur.
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Link React Router — navigation vers /film/:id.
 *    Jamais de href brut — ScrollToTop + PageTransitionLayer
 *    s'activent automatiquement sur les Link internes.
 *
 * 2. --card-height CSS custom property — définie par la grille
 *    parente (MovieGallery). Chaque position a sa propre hauteur
 *    pour le rythme éditorial asymétrique.
 *
 * 3. Hover entièrement CSS — zéro onMouseEnter/Leave.
 * ═══════════════════════════════════════════════════════════════
 */

import { Link }  from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import styles    from './MovieCard.module.css';

export default function MovieCard({ movie, index, height }) {
  // Construction de la route film — ROUTES.FILM_DETAIL remplace
  // toute string brute. Pattern : /film/:id
  const filmRoute = ROUTES.FILM_DETAIL
    ? ROUTES.FILM_DETAIL.replace(':id', movie.id)
    : `/film/${movie.id}`;

  // Numéro formaté sur 2 digits
  const num = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={filmRoute}
      className={styles.card}
      aria-label={`Voir le film : ${movie.title}, dirigé par ${movie.director}`}
      style={height ? { '--card-height': height } : undefined}
    >
      {/* Image — N&B désaturé → couleur au hover */}
      <img
        src={movie.img}
        alt={`Affiche du film ${movie.title}`}
        className={styles.cardImage}
        loading="lazy"
      />

      {/* Overlay — gradient permanent pour la lisibilité */}
      <div className={styles.cardOverlay} aria-hidden="true" />

      {/* Numéro décoratif — arrière-plan profond */}
      <span className={styles.cardNum} aria-hidden="true">{num}</span>

      {/* Badge catégorie — coin supérieur gauche */}
      {movie.category && (
        <div className={styles.cardBadge}>
          <span className={styles.cardBadgeDot} aria-hidden="true" />
          <span className={styles.cardBadgeLabel}>{movie.category}</span>
        </div>
      )}

      {/* Infos — titre + réalisateur */}
      <div className={styles.cardInfo}>
        <span className={styles.cardInfoLine} aria-hidden="true" />
        <h3 className={styles.cardTitle}>{movie.title}</h3>
        <p className={styles.cardDirector}>{movie.director}</p>
      </div>

      {/* Flèche de navigation — apparaît au hover */}
      <div className={styles.cardArrow} aria-hidden="true">
        <span className={styles.cardArrowIcon}>→</span>
      </div>

    </Link>
  );
}