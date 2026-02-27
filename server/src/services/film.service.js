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

/**
 * Transitions de statuts autorisées (règles métier).
 * Admin = décideur final — peut faire toutes les transitions listées.
 */
const VALID_TRANSITIONS = {
  SUBMITTED:  ["IN_REVIEW", "APPROVED", "REJECTED", "TO_MODIFY"],
  IN_REVIEW:  ["APPROVED", "REJECTED", "TO_MODIFY"],
  TO_MODIFY:  ["IN_REVIEW", "APPROVED", "REJECTED"],
  APPROVED:   ["SELECTION", "REJECTED"],
  SELECTION:  ["FINALIST", "APPROVED"],
  FINALIST:   ["AWARD", "SELECTION"],
  REJECTED:   [], // statut final
  AWARD:      [], // statut final
};

/**
 * Récupérer la liste des films pour le dashboard admin.
 * Inclut le Submitter pour afficher nom/email du réalisateur.
 *
 * @param {{ status?: string, search?: string }} filters
 */
export const getFilms = async ({ status, search } = {}) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title:     { contains: search } },
      { country:   { contains: search } },
      { submitter: { email:     { contains: search } } },
      { submitter: { firstName: { contains: search } } },
      { submitter: { lastName:  { contains: search } } },
    ];
  }

  return prisma.film.findMany({
    where,
    include: {
      submitter:     { select: { id: true, firstName: true, lastName: true, email: true } },
      assignedUsers: { select: { id: true, firstName: true, lastName: true } },
      _count:        { select: { votes: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
};

/**
 * KPIs pour le dashboard home : total + comptage par statut.
 */
export const getFilmsStats = async () => {
  const [total, byStatus] = await Promise.all([
    prisma.film.count(),
    prisma.film.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  // Transformer le tableau en objet { SUBMITTED: 5, APPROVED: 3, ... }
  const counts = Object.fromEntries(
    byStatus.map(({ status, _count }) => [status, _count.id])
  );

  return { total, byStatus: counts };
};

/**
 * Changer le statut d'un film avec validation des transitions.
 *
 * @param {number} filmId
 * @param {string} newStatus
 * @returns {Film} film mis à jour
 * @throws {Error} si la transition est invalide
 */
export const changeFilmStatus = async (filmId, newStatus) => {
  const film = await prisma.film.findUnique({ where: { id: filmId } });

  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  const allowed = VALID_TRANSITIONS[film.status] ?? [];
  if (!allowed.includes(newStatus)) {
    throw Object.assign(
      new Error(`Transition invalide : ${film.status} → ${newStatus}`),
      { statusCode: 400 }
    );
  }

  return prisma.film.update({
    where: { id: filmId },
    data:  { status: newStatus },
  });
};
