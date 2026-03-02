import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🎬 [SEED] Lancement du Crash-Test Intégral (Tous cas de figure)...",
  );

  // 1. Nettoyage
  await prisma.reviewComment.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.award.deleteMany({});
  await prisma.filmVersion.deleteMany({});
  await prisma.film.deleteMany({});
  await prisma.submitter.deleteMany({});
  await prisma.user.deleteMany({});

  const pwd = await bcrypt.hash("admin123", 10);

  // 2. USERS (Admin + Jury varié)
  const bruno = await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: pwd,
      firstName: "Bruno",
      lastName: "SMADJA",
      role: "ADMIN",
      bio: "Commissaire Général.",
    },
  });
  const kubrick = await prisma.user.create({
    data: {
      email: "kubrick@jury.ai",
      firstName: "Stanley",
      lastName: "Kubrick",
      role: "JURY",
      bio: "L'exigence technique.",
    },
  });
  const varda = await prisma.user.create({
    data: {
      email: "varda@jury.ai",
      firstName: "Agnès",
      lastName: "Varda",
      role: "JURY",
      bio: "La curiosité glaneuse.",
    },
  });

  // 3. SUBMITTERS (Auteurs différents)
  const amine = await prisma.submitter.create({
    data: {
      email: "amine@dakar.sn",
      firstName: "Amine",
      lastName: "Diop",
      bio: "Futurisme africain.",
    },
  });
  const sarah = await prisma.submitter.create({
    data: {
      email: "sarah@berlin.de",
      firstName: "Sarah",
      lastName: "Muller",
      bio: "Expérimentations minimalistes.",
    },
  });

  // -------------------------------------------------------------------------
  // CAS 1 : LE CHEF-D'OEUVRE (Approuvé + Versions + Award)
  // -------------------------------------------------------------------------
  const chefDoeuvre = await prisma.film.create({
    data: {
      title: "Sahel Digital",
      submitterId: amine.id,
      country: "Sénégal",
      language: "Wolof",
      aiStack: "Flux.1, Runway Gen-3",
      status: "APPROVED",
      averageRating: 10,
    },
  });
  // Deux versions précédentes
  await prisma.filmVersion.createMany({
    data: [
      {
        filmId: chefDoeuvre.id,
        title: "Sahel V1",
        description: "Brouillon",
        aiStack: "SD 1.5",
      },
      {
        filmId: chefDoeuvre.id,
        title: "Sahel V2",
        description: "Amélioration textures",
        aiStack: "SDXL",
      },
    ],
  });
  await prisma.award.create({
    data: { name: "Grand Prix", filmId: chefDoeuvre.id },
  });

  // -------------------------------------------------------------------------
  // CAS 2 : LE CONFLIT (Un Approve / Un Reject) -> Teste l'arbitrage Admin
  // -------------------------------------------------------------------------
  const conflit = await prisma.film.create({
    data: {
      title: "Glitch in Marseille",
      submitterId: sarah.id,
      country: "France",
      aiStack: "Midjourney",
      status: "PENDING",
    },
  });
  const voteK = await prisma.vote.create({
    data: {
      filmId: conflit.id,
      userId: kubrick.id,
      rating: 2,
      decision: "REJECT",
    },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: voteK.id,
      content: "Trop de bruit numérique. Pas assez maîtrisé.",
      isInternal: true,
    },
  });

  const voteV = await prisma.vote.create({
    data: {
      filmId: conflit.id,
      userId: varda.id,
      rating: 8,
      decision: "APPROVE",
    },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: voteV.id,
      content: "Une erreur magnifique, très humain.",
      isInternal: false,
    },
  });

  // -------------------------------------------------------------------------
  // CAS 3 : LE REJETÉ (Pour tester le filtre "Rejected")
  // -------------------------------------------------------------------------
  await prisma.film.create({
    data: {
      title: "Commercial AI Video",
      submitterId: sarah.id,
      country: "USA",
      aiStack: "Pika Labs",
      status: "REJECTED",
    },
  });

  // -------------------------------------------------------------------------
  // CAS 4 : LE "TO MODIFY" (En attente d'action submitter)
  // -------------------------------------------------------------------------
  await prisma.film.create({
    data: {
      title: "Deep Sea",
      submitterId: amine.id,
      country: "Brésil",
      aiStack: "Kling AI",
      status: "TO_MODIFY",
    },
  });

  console.log("🚀 [SEED] Crash-test terminé. Dashboard 100% opérationnel.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
