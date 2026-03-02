/**
 * Gallery.jsx — MARSAI Festival
 * Page Galerie — wrapper
 * Refactoring Étape 4
 *
 * Wrapper minimal — MovieGallery contient toute la logique.
 * La div inutile est supprimée.
 */

import MovieGallery from '@/pages/Gallery/components/MovieGallery';

export default function GalleryPage() {
  return <MovieGallery />;
}