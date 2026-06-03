import crypto from "crypto";
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
export const submitFilm = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  instagram?: string;
  title: string;
  description: string;
  country: string;
  language?: string;
  aiToolsUsed: string;
  youtubeUrl?: string;
}) => {
  const {
    // Champs Submitter
    firstName,
    lastName,
    email,
    bio,
    instagram,
    // Champs Film
    title,
    description,
    country,
    language,
    aiToolsUsed,
    youtubeUrl,
  } = data;

  // 1. Trouver le réalisateur existant ou le créer
  let submitter = await prisma.submitter.findUnique({
    where: { email },
  });

  if (!submitter) {
    submitter = await prisma.submitter.create({
      data: {
        email,
        firstName,
        lastName,
        bio: bio || null,
        instagram: instagram || null,
      },
    });
  }

  // 2. Créer le film (submissionToken généré automatiquement par Prisma — @default(uuid()))
  const film = await prisma.film.create({
    data: {
      submitterId: submitter.id,
      title,
      description,
      country,
      language: language || null,
      aiToolsUsed,
      youtubeUrl: youtubeUrl || null,
      status: "SUBMITTED",
    },
  });

  // 3. Email de confirmation
  await mailService.sendSubmissionConfirmation(
    submitter.email,
    submitter.firstName || "",
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
  SUBMITTED: ["IN_REVIEW", "APPROVED", "REJECTED", "TO_MODIFY"],
  IN_REVIEW: ["APPROVED", "REJECTED", "TO_MODIFY"],
  TO_MODIFY: ["IN_REVIEW", "APPROVED", "REJECTED"],
  APPROVED: ["SELECTION", "REJECTED", "TO_MODIFY"],
  SELECTION: ["FINALIST", "APPROVED"],
  FINALIST: ["AWARD", "SELECTION"],
  REJECTED: [], // statut final
  AWARD: [], // statut final
};

/**
 * Récupérer la liste des films pour le dashboard admin.
 * Inclut le Submitter pour afficher nom/email du réalisateur.
 *
 * @param {{ status?: string, search?: string }} filters
 */
export const getFilms = async ({
  status,
  search,
  hasSuggestions,
  page = 1,
  limit = 50,
}: any = {}) => {
  const where: any = {};

  if (status) {
    where.status = status;
  }

  // Sous-filtre "Suggestions" : films IN_REVIEW avec ≥1 jury qui suggère une modif
  if (hasSuggestions === "true" || hasSuggestions === true) {
    where.status = "IN_REVIEW";
    where.votes = { some: { suggestModification: true } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { country: { contains: search } },
      { submitter: { email: { contains: search } } },
      { submitter: { firstName: { contains: search } } },
      { submitter: { lastName: { contains: search } } },
    ];
  }

  const take = parseInt(limit, 10) || 50;
  const skip = (parseInt(page, 10) - 1) * take;

  const [films, total] = await Promise.all([
    prisma.film.findMany({
      skip,
      take,
      where,
      include: {
        submitter: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        assignedUsers: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: { select: { votes: true } },
      },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.film.count({ where }),
  ]);

  return {
    data: films,
    meta: {
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
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
      where: {
        status: "IN_REVIEW",
        votes: { some: { suggestModification: true } },
      },
    }),
  ]);

  const counts = Object.fromEntries(
    byStatus.map(({ status, _count }: { status: string; _count: { id: number } }) => [status, _count.id]),
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
export const assignUsersToFilm = async (filmId: number, userIds: number[]) => {
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: { _count: { select: { votes: true } } },
  });
  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  // Blocage si des votes ont déjà été déposés (règle business R-ASSIGN-003)
  if (film._count.votes > 0 && userIds.length > 0) {
    throw Object.assign(
      new Error(
        "Impossible de modifier les jurys : des votes ont déjà été déposés.",
      ),
      { statusCode: 409 },
    );
  }

  // Transitions automatiques liées à l'assignation de jurys :
  // - SUBMITTED + ≥1 jury assigné → IN_REVIEW
  // - IN_REVIEW + 0 jury restant  → SUBMITTED (remis en file d'attente)
  // - Tout autre statut           → inchangé (APPROVED, REJECTED, etc.)
  let newStatus = film.status;
  if (film.status === "SUBMITTED" && userIds.length > 0) {
    newStatus = "IN_REVIEW";
  } else if (film.status === "IN_REVIEW" && userIds.length === 0) {
    newStatus = "SUBMITTED";
  }

  return prisma.film.update({
    where: { id: filmId },
    data: {
      assignedUsers: { set: userIds.map((id: number) => ({ id })) },
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
export const getFilmById = async (filmId: number) => {
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: {
      submitter: true,
      assignedUsers: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      votes: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
          comments: true,
        },
        orderBy: { votedAt: "desc" },
      },
      // Historique des versions — nécessaire pour afficher le diff TO_MODIFY
      versions: { orderBy: { archivedAt: "desc" }, take: 3 },
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
export const changeFilmStatus = async (
  filmId: number,
  newStatus: string,
  role?: string,
) => {
  const film = await prisma.film.findUnique({ where: { id: filmId } });

  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }

  // Transitions SELECTION / FINALIST / AWARD : ADMIN uniquement
  if (ADMIN_ONLY_TARGETS.has(newStatus) && role !== "ADMIN") {
    throw Object.assign(
      new Error(
        `La transition vers ${newStatus} est réservée aux administrateurs.`,
      ),
      { statusCode: 403 },
    );
  }

  const allowed: string[] =
    VALID_TRANSITIONS[film.status as keyof typeof VALID_TRANSITIONS] ?? [];
  if (!allowed.includes(newStatus)) {
    throw Object.assign(
      new Error(`Transition invalide : ${film.status} → ${newStatus}`),
      { statusCode: 400 },
    );
  }

  return prisma.film.update({
    where: { id: filmId },
    data: { status: newStatus as any },
  });
};

/**
 * Demander des modifications à un réalisateur (workflow TO_MODIFY).
 *
 * - Crée un snapshot FilmVersion (traçabilité avant édition)
 * - Génère un token d'édition 7j sur le Submitter
 * - Met le film en TO_MODIFY avec le message admin
 * - Envoie l'email au réalisateur
 *
 * @param {number} filmId
 * @param {string} message     - Message de l'admin expliquant les modifications
 * @param {number} adminUserId - ID de l'admin/moderator qui fait la demande
 */
export const requestModification = async (
  filmId: number,
  message: string,
  adminUserId: number,
) => {
  const film = await prisma.film.findUnique({
    where: { id: filmId },
    include: { submitter: true },
  });

  if (!film) {
    throw Object.assign(new Error("Film introuvable"), { statusCode: 404 });
  }
  if (!film.submitter) {
    throw Object.assign(new Error("Réalisateur introuvable"), {
      statusCode: 404,
    });
  }

  // Snapshot de la version actuelle avant modification
  await prisma.filmVersion.create({
    data: {
      filmId: film.id,
      title: film.title,
      description: film.description,
      aiToolsUsed: film.aiToolsUsed,
      youtubeUrl: film.youtubeUrl ?? null,
      posterUrl: film.posterUrl ?? null,
    },
  });

  // Token d'édition 7 jours sur le compte Submitter
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.submitter.update({
    where: { id: film.submitter.id },
    data: { loginToken: token, tokenExpires: expires },
  });

  // Mise à jour du film
  const updated = await prisma.film.update({
    where: { id: filmId },
    data: {
      status: "TO_MODIFY",
      modificationRequest: message,
      modificationRequestedAt: new Date(),
      modificationRequestedBy: adminUserId,
    },
  });

  // Email au réalisateur (non bloquant)
  await mailService.sendModificationRequest(
    film.submitter.email,
    film.submitter.firstName || "",
    film.title,
    token,
    message,
  );

  return updated;
};

/**
 * Récupérer un film via le token d'édition du réalisateur.
 * Vérifie que le token est valide (non expiré) et que le film est TO_MODIFY.
 *
 * @param {string} token - Submitter.loginToken
 */
export const getFilmByEditToken = async (token: string) => {
  const submitter = await prisma.submitter.findUnique({
    where: { loginToken: token },
  });

  if (
    !submitter ||
    !submitter.tokenExpires ||
    submitter.tokenExpires < new Date()
  ) {
    throw Object.assign(new Error("Lien invalide ou expiré"), {
      statusCode: 404,
    });
  }

  const film = await prisma.film.findFirst({
    where: { submitterId: submitter.id, status: "TO_MODIFY" },
    include: { submitter: true },
  });

  if (!film) {
    throw Object.assign(new Error("Aucun film en attente de modification"), {
      statusCode: 404,
    });
  }

  return film;
};

/**
 * Suivi public d'un film via le submissionToken (reçu par email à la soumission).
 * Retourne uniquement les infos non-sensibles : pas de votes, pas de jurys.
 *
 * @param {string} submissionToken - UUID unique du film (Film.submissionToken)
 */
export const trackFilmByToken = async (submissionToken: string) => {
  const film = await prisma.film.findUnique({
    where: { submissionToken },
    select: {
      title: true,
      description: true,
      country: true,
      language: true,
      aiToolsUsed: true,
      youtubeUrl: true,
      status: true,
      submittedAt: true,
      modificationRequest: true,
      modificationRequestedAt: true,
      submitter: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  if (!film) {
    throw Object.assign(new Error("Film introuvable ou lien invalide"), {
      statusCode: 404,
    });
  }

  return film;
};

/**
 * Appliquer les corrections du réalisateur sur son film.
 * Crée un snapshot avant modification — le film reste TO_MODIFY.
 *
 * Champs éditables : title, description, youtubeUrl, aiToolsUsed
 * Champ bloqué : country (règle business — non modifiable)
 *
 * @param {string} token - Submitter.loginToken
 * @param {{ title, description, youtubeUrl, aiToolsUsed }} data
 */
export const applyFilmEdit = async (
  token: string,
  {
    title,
    description,
    youtubeUrl,
    aiToolsUsed,
  }: {
    title?: string;
    description?: string;
    youtubeUrl?: string;
    aiToolsUsed?: string;
  },
) => {
  // Vérification token + récupération film
  const film = await getFilmByEditToken(token);

  // Snapshot avant modification (traçabilité)
  await prisma.filmVersion.create({
    data: {
      filmId: film.id,
      title: film.title,
      description: film.description,
      aiToolsUsed: film.aiToolsUsed,
      youtubeUrl: film.youtubeUrl ?? null,
      posterUrl: film.posterUrl ?? null,
    },
  });

  // Mise à jour des champs éditables uniquement
  return prisma.film.update({
    where: { id: film.id },
    data: {
      title: title?.trim() ?? film.title,
      description: description?.trim() ?? film.description,
      youtubeUrl: youtubeUrl?.trim() ?? film.youtubeUrl,
      aiToolsUsed: aiToolsUsed?.trim() ?? film.aiToolsUsed,
      // status reste TO_MODIFY — c'est l'admin qui décide ensuite
    },
  });
};
