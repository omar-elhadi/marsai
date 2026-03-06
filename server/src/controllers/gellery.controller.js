import { fetchGallery } from "../services/gallery.service.js";

export const getGallery = async (req, res) => {
  try {
    const galleryData = await fetchGallery();
    return res.json(galleryData);
  } catch (error) {
    console.error("❌ Erreur getGallery:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération de la galerie." });
  }
};
