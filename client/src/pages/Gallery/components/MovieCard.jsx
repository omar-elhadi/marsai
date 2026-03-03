/**
 * MovieCard.jsx — MARSAI Festival
 * Galerie · Carte film — défilement horizontal
 *
 * STRUCTURE
 *   .card  (Link racine — reçoit className externe "hscroll-card")
 *     .cardImageWrap
 *       img.cardImage.movie-card-img   ← parallaxe GSAP translateX
 *       .cardBadge                     ← catégorie sur l'image
 *     .cardPanel                       ← encart éditorial crème
 *       .cardPanelNum                  ← watermark numéro (absolu)
 *       .cardTitle                     ← titre display uppercase
 *       .cardDivider                   ← trait séparateur
 *       .cardBottom
 *         .cardDirector                ← réalisateur italic
 *         .cardArrow                   ← flèche cerclée hover
 *
 * PROPS
 *   movie     { id, title, director, category, img }
 *   index     position 0-based dans la page courante
 *   width     CSS string — "52vw", "40vw"
 *   height    CSS string — "68vh"
 *   className classe externe — "hscroll-card" passée par MovieGallery
 *             → querySelector(".hscroll-card") pour les anims GSAP
 */

import { Link }   from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import styles     from "./MovieCard.module.css";

export default function MovieCard({ movie, index, width, height, className }) {
  const filmRoute = ROUTES.FILM_DETAIL
    ? ROUTES.FILM_DETAIL.replace(":id", movie.id)
    : `/film/${movie.id}`;

  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={filmRoute}
      className={[styles.card, className].filter(Boolean).join(" ")}
      aria-label={`Voir le film : ${movie.title}, dirigé par ${movie.director}`}
      style={{
        "--card-width":  width  || "42vw",
        "--card-height": height || "72vh",
      }}
    >
      {/* ── Zone image ──────────────────────────────────── */}
      <div className={styles.cardImageWrap}>
        {/* movie-card-img : ancre querySelector GSAP pour la parallaxe */}
        <img
          src={movie.img}
          alt={`Affiche du film ${movie.title}`}
          className={`movie-card-img ${styles.cardImage}`}
          loading="lazy"
          draggable="false"
        />

        {movie.category && (
          <div className={styles.cardBadge}>
            <span className={styles.cardBadgeDot}  aria-hidden="true" />
            <span className={styles.cardBadgeLabel}>{movie.category}</span>
          </div>
        )}
      </div>

      {/* ── Panel éditorial ─────────────────────────────── */}
      <div className={styles.cardPanel}>

        {/* Numéro watermark — position absolute, derrière le texte */}
        <span className={styles.cardPanelNum} aria-hidden="true">
          {num}
        </span>

        {/* Titre — élément principal */}
        <h3 className={styles.cardTitle}>{movie.title}</h3>

        {/* Trait séparateur */}
        <span className={styles.cardDivider} aria-hidden="true" />

        {/* Rangée bas */}
        <div className={styles.cardBottom}>
          <p className={styles.cardDirector}>{movie.director}</p>
          <div className={styles.cardArrow} aria-hidden="true">→</div>
        </div>

      </div>
    </Link>
  );
}