import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🎬 [SEED] Initialisation du protocole Master Festival...");

  // 1. Nettoyage total (Ordre respectant les contraintes)
  await prisma.reviewComment.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.award.deleteMany({});
  await prisma.filmVersion.deleteMany({});
  await prisma.film.deleteMany({});
  await prisma.submitter.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash("admin123", 10);

  // 2. Bruno Smadja & Jury
  const bruno = await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: adminPassword,
      firstName: "Bruno",
      lastName: "SMADJA",
      role: "ADMIN",
      bio: "Fondateur et Commissaire Général de Marseille AI.",
    },
  });

  const kubrick = await prisma.user.create({
    data: {
      email: "s.kubrick@jury.ai",
      firstName: "Stanley",
      lastName: "Kubrick",
      role: "JURY",
      bio: "Recherche la perfection géométrique dans le pixel.",
    },
  });

  const bela = await prisma.user.create({
    data: {
      email: "b.tarr@jury.ai",
      firstName: "Béla",
      lastName: "Tarr",
      role: "JURY",
      bio: "Observateur de la mélancolie et des plans séquences infinis.",
    },
  });

  // 3. Les Auteurs
  const amine = await prisma.submitter.create({
    data: {
      email: "amine@dakar.sn",
      firstName: "Amine",
      lastName: "Diop",
      bio: "Pionnier du futurisme sénégalais.",
    },
  });
  const yuki = await prisma.submitter.create({
    data: {
      email: "yuki@tokyo.jp",
      firstName: "Yuki",
      lastName: "Tanaka",
      bio: "Artiste fusionnant GAN et Estampes.",
    },
  });

  // 4. FILM 1 : "Les Échos" (LE GAGNANT - Cycle Complet)
  const film1 = await prisma.film.create({
    data: {
      title: "Les Échos du Sahel (V2)",
      description: "Une épopée visuelle sur la mémoire du sable.",
      country: "Sénégal",
      language: "Wolof",
      aiStack: "Flux.1, Runway Gen-3",
      status: "SELECTION", // Déjà en sélection officielle
      submitterId: amine.id,
      averageRating: 9.5,
      totalVotes: 2,
    },
  });

  // Archive de la V1 du Film 1
  await prisma.filmVersion.create({
    data: {
      filmId: film1.id,
      title: "Échos - Premier Jet",
      description: "Version courte sans étalonnage.",
      aiStack: "Stable Diffusion v1.5",
    },
  });

  // Votes & Commentaires pour Film 1
  const vote1 = await prisma.vote.create({
    data: {
      filmId: film1.id,
      userId: kubrick.id,
      rating: 10,
      decision: "APPROVE",
    },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: vote1.id,
      content: "Une symétrie parfaite. L'IA au service du cadre.",
      isInternal: false,
    },
  });

  const vote2 = await prisma.vote.create({
    data: { filmId: film1.id, userId: bela.id, rating: 9, decision: "APPROVE" },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: vote2.id,
      content: "Le temps est ici magnifiquement dilaté.",
      isInternal: false,
    },
  });

  // AWARD pour Film 1
  await prisma.award.create({
    data: {
      name: "Grand Prix de l'Innovation",
      description:
        "Récompensant l'équilibre parfait entre technique et poésie.",
      filmId: film1.id,
    },
  });

  // 5. FILM 2 : "Ukiyo-e" (EN MODIFICATION)
  const film2 = await prisma.film.create({
    data: {
      title: "Ukiyo-e Dreams",
      description: "Animation style estampe japonaise.",
      country: "Japon",
      language: "Japonais",
      aiStack: "AnimateDiff",
      status: "TO_MODIFY",
      submitterId: yuki.id,
    },
  });

  const voteYuki = await prisma.vote.create({
    data: {
      filmId: film2.id,
      userId: kubrick.id,
      rating: 6,
      decision: "TO_MODIFY",
    },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: voteYuki.id,
      content:
        "Trop de scintillement (flickering). Doit stabiliser les frames.",
      isInternal: false,
    },
  });
  await prisma.reviewComment.create({
    data: {
      voteId: voteYuki.id,
      content: "Potentiel technique élevé, mais manque de rigueur.",
      isInternal: true,
    },
  });

  // 6. FILM 3 : "Cyber-Marseille" (PENDING - Pour Bruno)
  await prisma.film.create({
    data: {
      title: "Marseille 2045",
      description: "Le Vieux-Port sous les eaux numériques.",
      country: "France",
      language: "Français",
      aiStack: "Midjourney, Luma Dream Machine",
      status: "PENDING",
      submitterId: amine.id, // Deuxième film pour cet auteur
    },
  });

  console.log("🚀 [SEED] Protocole Master terminé. Prêt pour la démo !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
