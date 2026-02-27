import prisma from "../utils/prisma.js";
import { mailService } from "./mail.service.js";

/**
 * Soumettre un film.
 *
 * Logique :
 * 1. Trouver ou créer le Submitter par email
 * 2. Créer le Film en statut SUBMITTED
 * 3. Envoyer l'email de confirmation au réalisateur
 *
 * @param {object} data - Champs issus du formulaire de soumission
 * @returns {{ film, submissionToken }}
 */
export const submitFilm = async (data) => {
  const {
    // Champs Submitter
    firstName, lastName, email, bio, instagram,
    // Champs Film
    title, description, country, language,
    aiToolsUsed, youtubeUrl,
  } = data;

  // 1. Trouver le réalisateur existant ou le créer
  let submitter = await prisma.submitter.findUnique({
    where: { email },
  });

  if (!submitter) {
    submitter = await prisma.submitter.create({
      data: { email, firstName, lastName, bio: bio || null, instagram: instagram || null },
    });
  }

  // 2. Créer le film (submissionToken généré automatiquement par Prisma — @default(uuid()))
  const film = await prisma.film.create({
    data: {
      submitterId: submitter.id,
      title,
      description,
      country,
      language:    language || null,
      aiToolsUsed,
      youtubeUrl:  youtubeUrl || null,
      status:      "SUBMITTED",
    },
  });

  // 3. Email de confirmation
  await mailService.sendSubmissionConfirmation(
    submitter.email,
    submitter.firstName,
    film.submissionToken,
    film.title,
  );

  return { film, submissionToken: film.submissionToken };
};
