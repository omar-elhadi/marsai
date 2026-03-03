/**
 * Gallery.jsx — MARSAI Festival
 * Page Galerie — wrapper minimal
 *
 * Toute la logique (GSAP, données, layout) est dans MovieGallery.
 * Ce fichier n'a qu'un seul rôle : monter la page dans le routeur.
 */

import MovieGallery from '@/pages/Gallery/components/MovieGallery';

export default function GalleryPage() {
  return <MovieGallery />;
}