/**
 * Gallery.jsx — MARSAI Festival
 * Page Galerie — wrapper minimal
 *
 * Toute la logique (GSAP, données, layout) est dans MovieGallery.
 * Ce fichier n'a qu'un seul rôle : monter la page dans le routeur.
 */

import MovieGallery from "@/pages/Gallery/components/MovieGallery";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";

export default function GalleryPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={`${t("nav.gallery")} | Marsai Film Festival`}
        description="Découvrez la sélection officielle du Marsai Film Festival."
      />
      <MovieGallery />
    </>
  );
}
