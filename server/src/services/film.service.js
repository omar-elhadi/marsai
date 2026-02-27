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
  APPROVED:   ["SELECTION", "REJECTED", "TO_MODIFY"],
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
export const getFilms = async ({ status, search, hasSuggestions } = {}) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  // Sous-filtre "Suggestions" : films IN_REVIEW avec ≥1 jury qui suggère une modif
  if (hasSuggestions === "true" || hasSuggestions === true) {
    where.status = "IN_REVIEW";
    where.votes  = { some: { suggestModification: true } };
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
  const [total, byStatus, suggestions] = await Promise.all([
    prisma.film.count(),
    prisma.film.groupBy({ by: ["status"], _count: { id: true } }),
    // Films IN_REVIEW avec ≥1 jury suggérant une modification
    prisma.film.count({
      where: { status: "IN_REVIEW", votes: { some: { suggestModification: true } } },
    }),
  ]);

  const counts = Object.fromEntries(
    byStatus.map(({ status, _count }) => [status, _count.id])
  );

  return { total, byStatus: counts, suggestions };
};

/**
 * Assigner une liste de jurys à un film (remplacement complet).
 * Prisma many-to-many via relation _FilmAssignments.
 *
 * @param {number}   filmId
 * @param {number[]} userIds - tableau d'IDs (vide = tout désassigner)
 */
export const assignUsersToFilm = async (filmId, userIds) => {
  const film = await prisma.film.findUnique({
    where:   { id: filmId },
    include: { _count: { select: { votes: true } } },
  });
  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  // Blocage si des votes ont déjà été déposés (règle business R-ASSIGN-003)
  if (film._count.votes > 0 && userIds.length > 0) {
    throw Object.assign(
      new Error("Impossible de modifier les jurys : des votes ont déjà été déposés."),
      { statusCode: 409 }
    );
  }

  // Transition automatique SUBMITTED → IN_REVIEW dès qu'un jury est assigné
  const newStatus =
    film.status === "SUBMITTED" && userIds.length > 0 ? "IN_REVIEW" : film.status;

  return prisma.film.update({
    where: { id: filmId },
    data:  {
      assignedUsers: { set: userIds.map(id => ({ id })) },
      status: newStatus,
    },
    include: {
      assignedUsers: { select: { id: true, firstName: true, lastName: true } },
    },
  });
};

/**
 * Récupérer le détail complet d'un film (admin).
 * Inclut le réalisateur, les jurys assignés et tous les votes avec commentaires.
 *
 * @param {number} filmId
 * @returns {Film} film avec relations complètes
 */
export const getFilmById = async (filmId) => {
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: {
      submitter:     true,
      assignedUsers: { select: { id: true, firstName: true, lastName: true, email: true } },
      votes: {
        include: {
          user:     { select: { id: true, firstName: true, lastName: true } },
          comments: true,
        },
        orderBy: { votedAt: "desc" },
      },
    },
  });

  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  return film;
};

// Transitions réservées à l'ADMIN uniquement (doc business-rules §WORKFLOW)
const ADMIN_ONLY_TARGETS = new Set(["SELECTION", "FINALIST", "AWARD"]);

/**
 * Changer le statut d'un film avec validation des transitions.
 *
 * @param {number} filmId
 * @param {string} newStatus
 * @param {string} [role] - Rôle de l'acteur (ADMIN | MODERATOR) — requis pour SELECTION+
 * @returns {Film} film mis à jour
 * @throws {Error} si la transition est invalide ou rôle insuffisant
 */
export const changeFilmStatus = async (filmId, newStatus, role) => {
  const film = await prisma.film.findUnique({ where: { id: filmId } });

  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  // Transitions SELECTION / FINALIST / AWARD : ADMIN uniquement
  if (ADMIN_ONLY_TARGETS.has(newStatus) && role !== "ADMIN") {
    throw Object.assign(
      new Error(`La transition vers ${newStatus} est réservée aux administrateurs.`),
      { statusCode: 403 }
    );
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
