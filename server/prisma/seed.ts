import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const VIDEO_URL = "https://www.youtube.com/watch?v=oCMKHAsD_F4";
const VIDEO_ID = "oCMKHAsD_F4";

const poster = (id: number) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=900&fit=crop&q=80`;

async function main() {
  console.log("🌱 Seed marsAI Festival 2026 — Couverture complète système\n");

  console.log("🧹 Nettoyage base de données...");
  await prisma.filmNomination.deleteMany();
  await prisma.awardCategory.deleteMany();
  await prisma.reviewComment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.filmVersion.deleteMany();
  await prisma.film.deleteMany();
  await prisma.user.deleteMany();
  await prisma.submitter.deleteMany();
  await prisma.juryMember.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  console.log("  ✅ Base de données réinitialisée\n");

  console.log("👥 Création utilisateurs (2 ADMIN · 1 MODERATOR · 3 JURY)...");

  const hashedPassword = await argon2.hash("admin123");

  const alexandre = await prisma.user.create({
    data: {
      email: "alexandre.moreau@marsai.com",
      password: hashedPassword,
      firstName: "Alexandre",
      lastName: "Moreau",
      role: "ADMIN",
      bio: "Fondateur marsAI Festival. Passionné par l'intersection entre intelligence artificielle et cinéma expérimental.",
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
  });
  console.log(
    `  ✅ ADMIN     : ${alexandre.firstName} ${alexandre.lastName} — alexandre.moreau@marsai.com / admin123`,
  );

  const jules = await prisma.user.create({
    data: {
      email: "jules.fournier@marsai.com",
      password: hashedPassword,
      firstName: "Jules",
      lastName: "Fournier",
      role: "ADMIN",
      bio: "Co-fondateur. Expert intelligence artificielle générative et ingénierie logicielle.",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
  });
  console.log(
    `  ✅ ADMIN     : ${jules.firstName} ${jules.lastName} — jules.fournier@marsai.com / admin123`,
  );

  const sophie = await prisma.user.create({
    data: {
      email: "sophie.martin@marsai.com",
      password: hashedPassword,
      firstName: "Sophie",
      lastName: "Martin",
      role: "MODERATOR",
      bio: "Responsable pré-sélection. Coordinatrice relations réalisateurs.",
    },
  });
  console.log(
    `  ✅ MODERATOR : ${sophie.firstName} ${sophie.lastName} — sophie.martin@marsai.com / admin123`,
  );

  const agnes = await prisma.user.create({
    data: {
      email: "agnes.varda@marsai.com",
      firstName: "Agnès",
      lastName: "Varda",
      role: "JURY",
      bio: "Cinéaste française pionnière Nouvelle Vague. Regard poétique et documentaire humaniste.",
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
  });
  console.log(`  ✅ JURY      : ${agnes.firstName} ${agnes.lastName} (France)`);

  const mati = await prisma.user.create({
    data: {
      email: "mati.diop@marsai.com",
      firstName: "Mati",
      lastName: "Diop",
      role: "JURY",
      bio: "Cinéaste franco-sénégalaise. Palme d'Or Cannes 2019. Perspective afro-diasporique singulière.",
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
  });
  console.log(
    `  ✅ JURY      : ${mati.firstName} ${mati.lastName} (Sénégal/France)`,
  );

  const bela = await prisma.user.create({
    data: {
      email: "bela.tarr@marsai.com",
      firstName: "Béla",
      lastName: "Tarr",
      role: "JURY",
      bio: "Cinéaste hongrois. Maître des plans-séquences contemplatifs. Esthétique radicale et austère.",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    },
  });
  console.log(
    `  ✅ JURY      : ${bela.firstName} ${bela.lastName} (Hongrie)\n`,
  );

  console.log("🎬 Création réalisateurs (14 pays)...");

  const [
    yuki,
    chioma,
    thomas,
    ana,
    priya,
    diego,
    minji,
    yasmine,
    alex,
    nour,
    lena,
    carlos,
    amara,
    erik,
  ] = await Promise.all([
    prisma.submitter.create({
      data: {
        email: "yuki.tanaka@example.jp",
        firstName: "Yuki",
        lastName: "Tanaka",
        bio: "Réalisatrice expérimentale Tokyo. Mémoire collective et IA générative.",
        website: "https://yukitanaka.art",
        instagram: "@yuki_films",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "chioma.okonkwo@example.ng",
        firstName: "Chioma",
        lastName: "Okonkwo",
        bio: "Cinéaste nigériane. Afrofuturisme et intelligence artificielle décoloniale.",
        website: "https://chiomaokonkwo.com",
        instagram: "@chioma_creates",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "thomas.werner@example.de",
        firstName: "Thomas",
        lastName: "Werner",
        bio: "Artiste berlinois. Critique du posthumanisme via algorithmes génératifs.",
        website: "https://thomas-werner.de",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "ana.silva@example.br",
        firstName: "Ana",
        lastName: "Silva",
        bio: "Réalisatrice São Paulo. Cinéma documentaire augmenté par IA.",
        instagram: "@ana_silva_films",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "priya.sharma@example.in",
        firstName: "Priya",
        lastName: "Sharma",
        bio: "Cinéaste Mumbai. Récits mythologiques indiens réinventés par machine learning.",
        website: "https://priyasharma.in",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "diego.martinez@example.ar",
        firstName: "Diego",
        lastName: "Martínez",
        bio: "Réalisateur Buenos Aires. Poésie visuelle générée par réseaux neuronaux.",
        instagram: "@diego_cine",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "minji.park@example.kr",
        firstName: "Min-Ji",
        lastName: "Park",
        bio: "Artiste Séoul. Installations vidéo IA questionnant la surveillance algorithmique.",
        website: "https://minjip.art",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "yasmine.alaoui@example.ma",
        firstName: "Yasmine",
        lastName: "Alaoui",
        bio: "Cinéaste Casablanca. Mémoires diasporiques via deep learning.",
        instagram: "@yasmine_films",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "alex.tremblay@example.ca",
        firstName: "Alex",
        lastName: "Tremblay",
        bio: "Réalisateur Montréal. Documentaire interactif IA sur crise climatique.",
        website: "https://alextremblay.ca",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "nour.khalil@example.eg",
        firstName: "Nour",
        lastName: "Khalil",
        bio: "Cinéaste Caire. Espoirs révolutionnaires reconstruits par GAN.",
        instagram: "@nour_khalil_films",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "lena.kovac@example.hr",
        firstName: "Léna",
        lastName: "Kovač",
        bio: "Artiste Zagreb. Corps et machine — exploration danse algorithmique.",
        website: "https://lenakovac.hr",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "carlos.mendez@example.mx",
        firstName: "Carlos",
        lastName: "Mendez",
        bio: "Réalisateur Mexico City. Muralisme mexicain réinterprété par diffusion models.",
        instagram: "@carlos_mendez_art",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "amara.diallo@example.sn",
        firstName: "Amara",
        lastName: "Diallo",
        bio: "Cinéaste Dakar. Griot numérique — tradition orale transmise par IA.",
        website: "https://amaradiallo.sn",
      },
    }),
    prisma.submitter.create({
      data: {
        email: "erik.lindqvist@example.se",
        firstName: "Erik",
        lastName: "Lindqvist",
        bio: "Réalisateur Stockholm. Nature nordique et algorithmes génératifs contemplatifs.",
        website: "https://eriklindqvist.se",
      },
    }),
  ]);

  console.log(
    "  ✅ 14 réalisateurs — JP · NG · DE · BR · IN · AR · KR · MA · CA · EG · HR · MX · SN · SE\n",
  );

  console.log("🎥 Création films — tous les statuts et cas métier...\n");

  const film01 = await prisma.film.create({
    data: {
      submitterId: yuki.id,
      submissionToken: "sub-f01-tokyo-pixel-dreams",
      title: "Tokyo Pixel Dreams",
      description:
        "Exploration onirique de Tokyo nocturne générée par diffusion models. Mémoires urbaines fragmentées, identité visuelle à l'ère de l'image synthétique.",
      country: "Japon",
      language: "Japonais",
      aiToolsUsed: "Stable Diffusion XL, Runway Gen-3, ElevenLabs",
      posterUrl: poster(1540959733332),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "SUBMITTED",
      submittedAt: new Date("2026-03-01"),
    },
  });
  console.log(`  ✅ SUBMITTED  : "${film01.title}" (Japon) — soumis récemment`);

  const film02 = await prisma.film.create({
    data: {
      submitterId: thomas.id,
      submissionToken: "sub-f02-neural-requiem",
      title: "Neural Requiem",
      description:
        "Méditation visuelle sur l'obsolescence humaine. Des réseaux neuronaux génèrent une liturgie post-humaniste entre beauté et angoisse.",
      country: "Allemagne",
      language: "Allemand",
      aiToolsUsed: "DALL-E 3, Suno AI, ControlNet, Deforum",
      posterUrl: poster(1518709268805),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "SUBMITTED",
      submittedAt: new Date("2026-02-10"),
    },
  });
  console.log(
    `  ✅ SUBMITTED  : "${film02.title}" (Allemagne) — en attente depuis 3 semaines`,
  );

  const film03 = await prisma.film.create({
    data: {
      submitterId: priya.id,
      submissionToken: "sub-f03-mumbai-mythologies",
      title: "Mumbai Mythologies",
      description:
        "Épopée mythologique indienne réinventée par machine learning. Ganesh, Kali et Vishnu rencontrent les GAN dans une fresque visuelle envoûtante.",
      country: "Inde",
      language: "Hindi",
      aiToolsUsed: "MidJourney v6, Adobe Firefly, MuseNet, Sora",
      posterUrl: poster(1524492412937),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "IN_REVIEW",
      submittedAt: new Date("2026-02-18"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(
    `  ✅ IN_REVIEW  : "${film03.title}" (Inde) — 0/3 votes, jurys assignés`,
  );

  const film04 = await prisma.film.create({
    data: {
      submitterId: chioma.id,
      submissionToken: "sub-f04-ancestral-code",
      title: "Ancestral Code",
      description:
        "Algorithmes inspirés de l'art yoruba traditionnel. IA décoloniale questionnant l'hégémonie occidentale dans la tech. Manifeste visionnaire.",
      country: "Nigeria",
      language: "Yoruba / Anglais",
      aiToolsUsed: "StyleGAN3, TouchDesigner, Custom ML models, Processing",
      posterUrl: poster(1547036967),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "IN_REVIEW",
      submittedAt: new Date("2026-02-22"),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }] },
    },
  });
  console.log(`  ✅ IN_REVIEW  : "${film04.title}" (Nigeria) — 1/2 votes`);
  await prisma.vote.create({
    data: {
      filmId: film04.id,
      userId: agnes.id,
      sentiment: "LIKE",
      rating: 9,
      comments: {
        create: {
          content:
            "Démarche radicale et nécessaire. L'esthétique yoruba magnifiquement traduite en langage algorithmique. À sélectionner absolument.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.film.update({
    where: { id: film04.id },
    data: { avgRating: 9.0, totalVotes: 1, totalLikes: 1 },
  });

  const film05 = await prisma.film.create({
    data: {
      submitterId: diego.id,
      submissionToken: "sub-f05-tango-algorithms",
      title: "Tango Algorithms",
      description:
        "Chorégraphie tango de Buenos Aires réinterprétée par ML. Poésie du mouvement synthétique — entre mémoire corporelle et génération artificielle.",
      country: "Argentine",
      language: "Espagnol",
      aiToolsUsed: "Runway Gen-3, MuseNet, DeepMotion, Stable Video Diffusion",
      posterUrl: poster(1504609773096),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "IN_REVIEW",
      submittedAt: new Date("2026-02-25"),
      assignedUsers: { connect: [{ id: agnes.id }, { id: bela.id }] },
    },
  });
  console.log(
    `  ✅ IN_REVIEW  : "${film05.title}" (Argentine) — 2/2 votes, DISLIKE + suggestModification ⚠️`,
  );
  await prisma.vote.create({
    data: {
      filmId: film05.id,
      userId: agnes.id,
      sentiment: "LIKE",
      rating: 8,
      comments: {
        create: {
          content:
            "Concept superbe. Quelques imperfections techniques mineures, mais l'émotion est là.",
          isInternal: true,
        },
      },
    },
  });
  await prisma.vote.create({
    data: {
      filmId: film05.id,
      userId: bela.id,
      sentiment: "DISLIKE",
      rating: 5,
      suggestModification: true,
      comments: {
        create: [
          {
            content:
              "Audio trop faible. Synchronisation labiale insuffisante. Dialogues synthétiques inaudibles par moments.",
            isInternal: false,
          },
          {
            content:
              "Note admin : TO_MODIFY recommandé — corrections techniques audio réalisables en quelques heures.",
            isInternal: true,
          },
        ],
      },
    },
  });
  await prisma.film.update({
    where: { id: film05.id },
    data: { avgRating: 6.5, totalVotes: 2, totalLikes: 1, totalDislikes: 1 },
  });

  const film06 = await prisma.film.create({
    data: {
      submitterId: ana.id,
      submissionToken: "sub-f06-amazonia-synthetic",
      title: "Amazônia Synthetic",
      description:
        "Forêt amazonienne régénérée par IA après déforestation virtuelle. Poésie documentaire écologique — un futur souhaitable rendu visible par la machine.",
      country: "Brésil",
      language: "Portugais",
      aiToolsUsed: "MidJourney v6, Pika Labs, Adobe Firefly, World Models",
      posterUrl: poster(1516026672322),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "APPROVED",
      submittedAt: new Date("2026-02-12"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(
    `  ✅ APPROVED   : "${film06.title}" (Brésil) — 3/3 LIKE unanime`,
  );
  await prisma.vote.create({
    data: {
      filmId: film06.id,
      userId: agnes.id,
      sentiment: "LIKE",
      rating: 8,
      comments: {
        create: {
          content:
            "Message écologique puissant. Imagerie d'une beauté renversante.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.vote.create({
    data: {
      filmId: film06.id,
      userId: mati.id,
      sentiment: "LIKE",
      rating: 9,
      comments: {
        create: {
          content:
            "Ce film dit quelque chose d'urgent. L'IA au service du vivant.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.vote.create({
    data: { filmId: film06.id, userId: bela.id, sentiment: "LIKE", rating: 8 },
  });
  await prisma.film.update({
    where: { id: film06.id },
    data: { avgRating: 8.3, totalVotes: 3, totalLikes: 3 },
  });

  const film07 = await prisma.film.create({
    data: {
      submitterId: nour.id,
      submissionToken: "sub-f07-cairo-echo",
      title: "Cairo Echo",
      description:
        "Le Caire révolutionnaire de 2011 reconstruit par GAN à partir d'archives photographiques. Mémoire collective et résilience algorithmique.",
      country: "Égypte",
      language: "Arabe",
      aiToolsUsed: "DALL-E 3, GPT-4 Vision, Custom GAN, CLIP",
      posterUrl: poster(1553913861),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "APPROVED",
      submittedAt: new Date("2026-02-08"),
      assignedUsers: { connect: [{ id: agnes.id }, { id: bela.id }] },
    },
  });
  console.log(`  ✅ APPROVED   : "${film07.title}" (Égypte) — 2/2 LIKE`);
  await prisma.vote.create({
    data: { filmId: film07.id, userId: agnes.id, sentiment: "LIKE", rating: 8 },
  });
  await prisma.vote.create({
    data: {
      filmId: film07.id,
      userId: bela.id,
      sentiment: "LIKE",
      rating: 7,
      comments: {
        create: {
          content:
            "Plan d'ouverture saisissant. Montage parfois décousu mais intention forte.",
          isInternal: true,
        },
      },
    },
  });
  await prisma.film.update({
    where: { id: film07.id },
    data: { avgRating: 7.5, totalVotes: 2, totalLikes: 2 },
  });

  const film08 = await prisma.film.create({
    data: {
      submitterId: carlos.id,
      submissionToken: "sub-f08-neon-murales",
      title: "Neon Murales",
      description:
        "Tentative de réinterprétation du muralisme mexicain par IA. Résultat trop décoratif, sans profondeur narrative ni point de vue artistique.",
      country: "Mexique",
      language: "Espagnol",
      aiToolsUsed: "DALL-E 2, Canva IA, Synthesia",
      posterUrl: poster(1545486332),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "REJECTED",
      submittedAt: new Date("2026-02-05"),
      assignedUsers: { connect: [{ id: mati.id }, { id: bela.id }] },
    },
  });
  console.log(`  ✅ REJECTED   : "${film08.title}" (Mexique) — 2/2 DISLIKE`);
  await prisma.vote.create({
    data: {
      filmId: film08.id,
      userId: mati.id,
      sentiment: "DISLIKE",
      rating: 3,
      comments: {
        create: {
          content:
            "Pas de point de vue artistique. L'IA utilisée comme filtre décoratif seulement. Hors sujet festival.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.vote.create({
    data: {
      filmId: film08.id,
      userId: bela.id,
      sentiment: "DISLIKE",
      rating: 2,
      comments: {
        create: {
          content: "Aucune tension dramatique. Refus ferme.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.film.update({
    where: { id: film08.id },
    data: { avgRating: 2.5, totalVotes: 2, totalDislikes: 2 },
  });

  const film09 = await prisma.film.create({
    data: {
      submitterId: lena.id,
      submissionToken: "sub-f09-body-algorithms",
      title: "Body Algorithms",
      description:
        "Corps humain et machine — exploration danse algorithmique entre présence et absence. Mouvement synthétique, émotion réelle.",
      country: "Croatie",
      language: "Anglais",
      aiToolsUsed: "DeepMotion, Runway Gen-3, Suno AI",
      posterUrl: poster(1535183655428),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "TO_MODIFY",
      modificationRequest:
        "Bonjour Léna,\n\nVotre film présente un potentiel artistique remarquable. Pour poursuivre le processus de sélection, nous vous demandons d'apporter les corrections suivantes :\n\n• Synchronisation audio/vidéo — décalage d'environ 0.4s perceptible à partir de la 2e minute\n• Résolution export final insuffisante (720p → minimum 1080p requis)\n• Crédits finaux incomplets — ajouter la mention de chaque outil IA utilisé\n\nVous disposez de 7 jours pour soumettre une version corrigée via votre lien personnel.\n\nL'équipe marsAI Festival",
      modificationRequestedAt: new Date("2026-02-28"),
      modificationRequestedBy: alexandre.id,
      submittedAt: new Date("2026-02-20"),
      assignedUsers: { connect: [{ id: bela.id }] },
    },
  });
  console.log(
    `  ✅ TO_MODIFY  : "${film09.title}" (Croatie) — corrections demandées + snapshot archivé`,
  );
  await prisma.vote.create({
    data: {
      filmId: film09.id,
      userId: bela.id,
      sentiment: "LIKE",
      rating: 7,
      suggestModification: true,
      comments: {
        create: {
          content:
            "Très beau travail esthétique. Problèmes techniques mineurs mais bloquants pour la projection.",
          isInternal: false,
        },
      },
    },
  });
  await prisma.filmVersion.create({
    data: {
      filmId: film09.id,
      title: film09.title,
      description: film09.description,
      aiToolsUsed: film09.aiToolsUsed,
      posterUrl: film09.posterUrl,
      youtubeUrl: film09.youtubeUrl,
      archivedAt: new Date("2026-02-28"),
    },
  });
  await prisma.film.update({
    where: { id: film09.id },
    data: { avgRating: 7.0, totalVotes: 1, totalLikes: 1 },
  });

  const film10 = await prisma.film.create({
    data: {
      submitterId: minji.id,
      submissionToken: "sub-f10-seoul-surveillance",
      title: "Seoul Surveillance",
      description:
        "Critique de la société de surveillance algorithmique en Corée du Sud. Dystopie documentaire en temps réel — chaque pixel devient données.",
      country: "Corée du Sud",
      language: "Coréen",
      aiToolsUsed: "YOLOv8, OpenCV, Stable Diffusion, Custom dataset",
      posterUrl: poster(1517154421773),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "SELECTION",
      avgRating: 8.7,
      totalVotes: 3,
      totalLikes: 3,
      submittedAt: new Date("2026-02-01"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(`  ✅ SELECTION  : "${film10.title}" (Corée du Sud) — top 50`);
  await prisma.vote.createMany({
    data: [
      { filmId: film10.id, userId: agnes.id, sentiment: "LIKE", rating: 9 },
      { filmId: film10.id, userId: mati.id, sentiment: "LIKE", rating: 9 },
      { filmId: film10.id, userId: bela.id, sentiment: "LIKE", rating: 8 },
    ],
  });

  const film11 = await prisma.film.create({
    data: {
      submitterId: amara.id,
      submissionToken: "sub-f11-griot-numerique",
      title: "Griot Numérique",
      description:
        "La tradition orale africaine du griot transmise par IA. Mémoire ancestrale encodée en données — l'intelligence artificielle comme passeur de mémoire.",
      country: "Sénégal",
      language: "Wolof / Français",
      aiToolsUsed: "GPT-4, ElevenLabs, DALL-E 3, LoRA fine-tuning",
      posterUrl: poster(1489749798305),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "SELECTION",
      avgRating: 8.3,
      totalVotes: 3,
      totalLikes: 3,
      submittedAt: new Date("2026-01-28"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(`  ✅ SELECTION  : "${film11.title}" (Sénégal) — top 50`);
  await prisma.vote.createMany({
    data: [
      { filmId: film11.id, userId: agnes.id, sentiment: "LIKE", rating: 9 },
      { filmId: film11.id, userId: mati.id, sentiment: "LIKE", rating: 9 },
      { filmId: film11.id, userId: bela.id, sentiment: "LIKE", rating: 7 },
    ],
  });

  const film12 = await prisma.film.create({
    data: {
      submitterId: yasmine.id,
      submissionToken: "sub-f12-casablanca-memories",
      title: "Casablanca Digital Memories",
      description:
        "Mémoires de la diaspora marocaine reconstruites par IA. Archives familiales augmentées par machine learning — l'identité entre deux rives.",
      country: "Maroc",
      language: "Arabe / Français",
      aiToolsUsed: "GPT-4 Vision, CLIP, LoRA fine-tuning, Stable Diffusion",
      posterUrl: poster(1558618666),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "FINALIST",
      avgRating: 9.0,
      totalVotes: 3,
      totalLikes: 3,
      submittedAt: new Date("2026-01-20"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(
    `  ✅ FINALIST   : "${film12.title}" (Maroc) — nominé 2 catégories`,
  );
  await prisma.vote.createMany({
    data: [
      { filmId: film12.id, userId: agnes.id, sentiment: "LIKE", rating: 9 },
      { filmId: film12.id, userId: mati.id, sentiment: "LIKE", rating: 9 },
      { filmId: film12.id, userId: bela.id, sentiment: "LIKE", rating: 9 },
    ],
  });

  const film13 = await prisma.film.create({
    data: {
      submitterId: erik.id,
      submissionToken: "sub-f13-nordic-silence",
      title: "Nordic Silence",
      description:
        "Nature nordique et algorithmes génératifs contemplatifs. Aurores boréales synthétisées, sons ambiants générés — un futur souhaitable dans le grand silence.",
      country: "Suède",
      language: "Suédois",
      aiToolsUsed:
        "Stable Diffusion XL, Suno AI, Luma Dream Machine, AudioCraft",
      posterUrl: poster(1470252649427),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "AWARD",
      avgRating: 9.7,
      totalVotes: 3,
      totalLikes: 3,
      submittedAt: new Date("2026-01-15"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(
    `  ✅ AWARD      : "${film13.title}" (Suède) — 🏆 Grand Prix marsAI`,
  );
  await prisma.vote.createMany({
    data: [
      { filmId: film13.id, userId: agnes.id, sentiment: "LIKE", rating: 10 },
      { filmId: film13.id, userId: mati.id, sentiment: "LIKE", rating: 10 },
      { filmId: film13.id, userId: bela.id, sentiment: "LIKE", rating: 9 },
    ],
  });

  const film14 = await prisma.film.create({
    data: {
      submitterId: alex.id,
      submissionToken: "sub-f14-climate-oracle",
      title: "Climate Oracle",
      description:
        "L'IA prédit les futurs climatiques 2050-2100. Documentaire d'anticipation généré par simulations machine learning — beauté terrifiante des mondes à venir.",
      country: "Canada",
      language: "Anglais / Français",
      aiToolsUsed:
        "Climate ML models, Stable Diffusion XL, ElevenLabs, World Models",
      posterUrl: poster(1464822759023),
      youtubeUrl: VIDEO_URL,
      youtubeVideoId: VIDEO_ID,
      status: "AWARD",
      avgRating: 9.3,
      totalVotes: 3,
      totalLikes: 3,
      submittedAt: new Date("2026-01-18"),
      assignedUsers: {
        connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }],
      },
    },
  });
  console.log(
    `  ✅ AWARD      : "${film14.title}" (Canada) — 🏆 Prix Futur Souhaitable\n`,
  );
  await prisma.vote.createMany({
    data: [
      { filmId: film14.id, userId: agnes.id, sentiment: "LIKE", rating: 10 },
      { filmId: film14.id, userId: mati.id, sentiment: "LIKE", rating: 9 },
      { filmId: film14.id, userId: bela.id, sentiment: "LIKE", rating: 9 },
    ],
  });

  console.log("🏆 Création palmarès édition 2026...");

  const cat1 = await prisma.awardCategory.create({
    data: {
      edition: 2026,
      displayOrder: 1,
      name: "Grand Prix marsAI",
      description:
        "Récompense le film le plus abouti artistiquement et techniquement — toutes catégories confondues.",
    },
  });

  const cat2 = await prisma.awardCategory.create({
    data: {
      edition: 2026,
      displayOrder: 2,
      name: "Prix Futur Souhaitable",
      description:
        "Décerné au film qui incarne le mieux le thème 2026 : imaginer des futurs souhaitables grâce à l'IA.",
    },
  });

  const cat3 = await prisma.awardCategory.create({
    data: {
      edition: 2026,
      displayOrder: 3,
      name: "Prix Innovation Technique",
      description:
        "Usage le plus innovant et maîtrisé de l'intelligence artificielle dans le processus de création.",
    },
  });

  const cat4 = await prisma.awardCategory.create({
    data: {
      edition: 2026,
      displayOrder: 4,
      name: "Mention Spéciale",
      description:
        "Coup de cœur du jury — film remarquable n'entrant pas dans les catégories principales.",
    },
  });

  await prisma.filmNomination.create({
    data: { filmId: film12.id, categoryId: cat1.id, isWinner: false },
  });
  await prisma.filmNomination.create({
    data: { filmId: film13.id, categoryId: cat1.id, isWinner: true },
  });
  await prisma.filmNomination.create({
    data: { filmId: film12.id, categoryId: cat2.id, isWinner: false },
  });
  await prisma.filmNomination.create({
    data: { filmId: film14.id, categoryId: cat2.id, isWinner: true },
  });
  await prisma.filmNomination.create({
    data: { filmId: film10.id, categoryId: cat3.id, isWinner: false },
  });
  await prisma.filmNomination.create({
    data: { filmId: film13.id, categoryId: cat3.id, isWinner: true },
  });
  await prisma.filmNomination.create({
    data: { filmId: film11.id, categoryId: cat4.id, isWinner: false },
  });

  console.log("  ✅ 4 catégories · 7 nominations · 3 lauréats\n");

  console.log("🎭 Création membres jury publics...");

  await prisma.juryMember.create({
    data: {
      firstName: "Agnès",
      lastName: "Varda",
      title: "Présidente du Jury",
      bio: "Pionnière de la Nouvelle Vague française, Agnès Varda a consacré sa vie à explorer les frontières du cinéma documentaire et de fiction. Son regard humaniste et poétique en fait la présidente idéale pour un festival célébrant l'IA créatrice.",
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      displayOrder: 1,
      twitter: "@agnes_varda_films",
    },
  });

  await prisma.juryMember.create({
    data: {
      firstName: "Mati",
      lastName: "Diop",
      title: "Membre du Jury",
      bio: "Cinéaste franco-sénégalaise, Palme d'Or à Cannes 2019 pour « Atlantique ». Sa sensibilité afro-diasporique et son engagement envers les récits invisibilisés apportent une perspective critique et nécessaire sur l'usage de l'IA dans la création.",
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      displayOrder: 2,
      instagram: "@matidiop_official",
    },
  });

  await prisma.juryMember.create({
    data: {
      firstName: "Béla",
      lastName: "Tarr",
      title: "Membre du Jury",
      bio: "Cinéaste hongrois, auteur de chefs-d'œuvre comme « Sátántangó » et « Le Cheval de Turin ». Maître incontesté des plans-séquences contemplatifs, son œil exigeant garantit un palmarès d'une intégrité artistique absolue.",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      displayOrder: 3,
      website: "https://belatar.com",
    },
  });

  await prisma.juryMember.create({
    data: {
      firstName: "Sofia",
      lastName: "Al-Amin",
      title: "Membre du Jury",
      bio: "Directrice artistique de l'AI Art Institute de Dubai. Curatrice internationale spécialisée dans les intersections entre intelligence artificielle et pratiques artistiques émergentes. Sa vision prospective enrichit le jury d'une expertise technique rare.",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      displayOrder: 4,
      instagram: "@sofia_alamin_art",
      twitter: "@sofiaamin",
    },
  });

  console.log("  ✅ 4 membres jury publics (avec photos et réseaux sociaux)\n");

  console.log("⚙️  Configuration site...");

  await prisma.siteSettings.create({
    data: {
      currentYear: 2026,
      festivalTheme: "Imaginez des futurs souhaitables",
      festivalDates: "12-13 juin 2026, Marseille",
      trailerUrl: VIDEO_URL,
      heroImageUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
      aboutText:
        "marsAI Festival célèbre la rencontre entre l'intelligence artificielle et le cinéma. Films d'1 minute, 120 pays, 3 000 visiteurs — Marseille devient capitale mondiale du cinéma IA.",
      rulesText:
        "Films d'exactement 1 minute. Usage d'outils IA obligatoire dans le processus créatif. Toutes nationalités bienvenues. Thème 2026 : imaginer des futurs souhaitables.",
    },
  });

  console.log("  ✅ Site settings configuré\n");

  console.log("📧 Création abonnés newsletter...");

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "marie.dupont@example.fr" },
      { email: "john.smith@example.co.uk" },
      { email: "hiroshi.yamamoto@example.jp" },
      { email: "fatou.ndiaye@example.sn" },
      { email: "marco.rossi@example.it" },
      { email: "elena.petrov@example.ru" },
      { email: "layla.hassan@example.eg" },
    ],
  });

  console.log("  ✅ 7 abonnés newsletter\n");

  const sep = "─".repeat(62);
  console.log(sep);
  console.log("📊 SEED TERMINÉ — RÉCAPITULATIF COMPLET\n");
  console.log("  👥 Users         : 2 ADMIN · 1 MODERATOR · 3 JURY");
  console.log("  🎬 Submitters    : 14 réalisateurs (14 pays)");
  console.log("  🎥 Films         : 14 films — tous les statuts couverts");
  console.log("     SUBMITTED(2) · IN_REVIEW(3) · APPROVED(2) · REJECTED(1)");
  console.log("     TO_MODIFY(1) · SELECTION(2) · FINALIST(1) · AWARD(2)");
  console.log(
    "  🖼️  Posters       : portrait 600×900 Unsplash sur chaque film",
  );
  console.log(
    "  🗳️  Votes         : ~26 votes · LIKE + DISLIKE · suggestModification",
  );
  console.log(
    "  💬 Commentaires  : internes (admin) + externes (transmis réalisateur)",
  );
  console.log("  📁 FilmVersions  : 1 snapshot TO_MODIFY archivé");
  console.log("  🏆 AwardCategory : 4 catégories édition 2026");
  console.log("  📋 Nominations   : 7 nominations · 3 lauréats");
  console.log("  🎭 JuryMembers   : 4 membres publics avec photos + réseaux");
  console.log("  ⚙️  SiteSettings  : 1 configuration complète");
  console.log("  📧 Newsletter    : 7 abonnés");
  console.log("");
  console.log("  🔑 Admin     : alexandre.moreau@marsai.com  / admin123");
  console.log("  🔑 Admin     : jules.fournier@marsai.com / admin123");
  console.log("  🔑 Modérat.  : sophie.martin@marsai.com / admin123");
  console.log(sep);
  console.log("\n✅ Prêt pour la démo !\n");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
