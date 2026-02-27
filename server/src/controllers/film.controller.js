import { submitFilm } from "../services/film.service.js";

/**
 * POST /api/films/submit
 * Reçoit le formulaire de soumission, crée le Submitter + Film, envoie l'email.
 */
export const submit = async (req, res) => {
  try {
    const {
      firstName, lastName, email,
      bio, instagram,
      title, description, country, language,
      aiToolsUsed, youtubeUrl,
    } = req.body;

    // Validation des champs obligatoires
    const required = { firstName, lastName, email, title, description, country, aiToolsUsed };
    const missing = Object.entries(required)
      .filter(([, v]) => !v || String(v).trim() === "")
      .map(([k]) => k);

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Champs obligatoires manquants",
        fields: missing,
      });
    }

    const result = await submitFilm({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      bio, instagram,
      title:       title.trim(),
      description: description.trim(),
      country:     country.trim(),
      language,
      aiToolsUsed: aiToolsUsed.trim(),
      youtubeUrl,
    });

    return res.status(201).json({
      message:         "Film soumis avec succès",
      submissionToken: result.submissionToken,
      filmId:          result.film.id,
    });

  } catch (error) {
    console.error("❌ Erreur submit film:", error);
    return res.status(500).json({ error: "Erreur lors de la soumission du film" });
  }
};
