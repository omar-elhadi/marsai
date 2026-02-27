// server/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed marsAI Festival - Exploration complète système\n');

  // =============================================================================
  // 1️⃣ USERS - Hiérarchie ADMIN/MODERATOR/JURY
  // =============================================================================

  console.log('👥 Création users (3 niveaux permissions)...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const bruno = await prisma.user.create({
    data: {
      email: 'bruno.smadja@marsai.com',
      password: hashedPassword,
      firstName: 'Bruno',
      lastName: 'Smadja',
      role: 'ADMIN',
      bio: 'Fondateur marsAI Festival. Passionné par intersection IA et cinéma expérimental.'
    }
  });
  console.log(`  ✅ ADMIN: ${bruno.firstName} ${bruno.lastName}`);

  const jules = await prisma.user.create({
    data: {
      email: 'jules.fournier@marsai.com',
      password: hashedPassword,
      firstName: 'Jules',
      lastName: 'Fournier',
      role: 'ADMIN',
      bio: 'Co-fondateur marsAI Festival. Expert intelligence artificielle générative.'
    }
  });
  console.log(`  ✅ ADMIN: ${jules.firstName} ${jules.lastName}`);

  const moderator = await prisma.user.create({
    data: {
      email: 'admin.test@marsai.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Test',
      role: 'MODERATOR',
      bio: 'Gestionnaire pré-sélection films. Droits limités films uniquement.'
    }
  });
  console.log(`  ✅ MODERATOR: ${moderator.firstName} ${moderator.lastName}`);

  const agnes = await prisma.user.create({
    data: {
      email: 'agnes.varda@marsai.com',
      firstName: 'Agnès',
      lastName: 'Varda',
      role: 'JURY',
      bio: 'Cinéaste française pionnière Nouvelle Vague. Regard poétique et expérimental.'
    }
  });
  console.log(`  ✅ JURY: ${agnes.firstName} ${agnes.lastName} (France)`);

  const mati = await prisma.user.create({
    data: {
      email: 'mati.diop@marsai.com',
      firstName: 'Mati',
      lastName: 'Diop',
      role: 'JURY',
      bio: "Cinéaste franco-sénégalaise. Palme d'Or Cannes 2019. Perspective afro-diasporique."
    }
  });
  console.log(`  ✅ JURY: ${mati.firstName} ${mati.lastName} (Sénégal/France)`);

  const bela = await prisma.user.create({
    data: {
      email: 'bela.tarr@marsai.com',
      firstName: 'Béla',
      lastName: 'Tarr',
      role: 'JURY',
      bio: 'Cinéaste hongrois. Maître plans-séquences contemplatifs. Esthétique radicale.'
    }
  });
  console.log(`  ✅ JURY: ${bela.firstName} ${bela.lastName} (Hongrie)\n`);

  // =============================================================================
  // 2️⃣ SUBMITTERS - Diversité internationale
  // =============================================================================

  console.log('🎬 Création submitters (réalisateurs mondiaux)...');

  const submitters = await Promise.all([
    prisma.submitter.create({ data: { email: 'yuki.tanaka@example.jp', firstName: 'Yuki', lastName: 'Tanaka', bio: 'Réalisatrice expérimentale Tokyo. Explore mémoire collective via IA générative.', website: 'https://yukitanaka.art', instagram: '@yuki_films' } }),
    prisma.submitter.create({ data: { email: 'chioma.okonkwo@example.ng', firstName: 'Chioma', lastName: 'Okonkwo', bio: 'Cinéaste nigériane. Afrofuturisme et intelligence artificielle décoloniale.', website: 'https://chiomaokonkwo.com', instagram: '@chioma_creates' } }),
    prisma.submitter.create({ data: { email: 'thomas.werner@example.de', firstName: 'Thomas', lastName: 'Werner', bio: 'Artiste berlinois. Critique posthumanisme via algorithmes génératifs.', website: 'https://thomas-werner.de' } }),
    prisma.submitter.create({ data: { email: 'ana.silva@example.br', firstName: 'Ana', lastName: 'Silva', bio: 'Réalisatrice São Paulo. Cinéma documentaire augmenté par IA.', instagram: '@ana_silva_films' } }),
    prisma.submitter.create({ data: { email: 'priya.sharma@example.in', firstName: 'Priya', lastName: 'Sharma', bio: 'Cinéaste Mumbai. Récits mythologiques indiens réinventés par machine learning.', website: 'https://priyasharma.in' } }),
    prisma.submitter.create({ data: { email: 'diego.martinez@example.ar', firstName: 'Diego', lastName: 'Martínez', bio: 'Réalisateur Buenos Aires. Poésie visuelle générée par réseaux neuronaux.', instagram: '@diego_cine' } }),
    prisma.submitter.create({ data: { email: 'min-ji.park@example.kr', firstName: 'Min-Ji', lastName: 'Park', bio: 'Artiste Séoul. Installations vidéo IA questionnant surveillance algorithmique.', website: 'https://minjip.art' } }),
    prisma.submitter.create({ data: { email: 'yasmine.alaoui@example.ma', firstName: 'Yasmine', lastName: 'Alaoui', bio: 'Cinéaste Casablanca. Mémoires diasporiques via deep learning.', instagram: '@yasmine_films' } }),
    prisma.submitter.create({ data: { email: 'alex.tremblay@example.ca', firstName: 'Alex', lastName: 'Tremblay', bio: 'Réalisateur Montréal. Documentaire interactif IA sur crise climatique.', website: 'https://alextremblay.ca' } })
  ]);

  submitters.forEach(s => console.log(`  ✅ ${s.firstName} ${s.lastName}`));
  console.log('');

  // =============================================================================
  // 3️⃣ FILMS - 9 films couvrant TOUS les statuts workflow
  // =============================================================================

  console.log('🎥 Création films (tous statuts workflow)...\n');

  // FILM 1 — SUBMITTED
  const film1 = await prisma.film.create({
    data: {
      submitterId: submitters[0].id,
      submissionToken: 'sub-f1-tokyo-dreams',
      title: 'Tokyo Pixel Dreams',
      description: 'Exploration onirique Tokyo nocturne générée par diffusion models. Mémoires urbaines fragmentées.',
      country: 'Japon',
      language: 'Japonais',
      aiToolsUsed: 'Stable Diffusion, Runway Gen-2, ElevenLabs',
      posterUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'SUBMITTED',
      submittedAt: new Date('2026-01-15')
    }
  });
  console.log(`  ✅ ${film1.status}: "${film1.title}"`);

  // FILM 2 — IN_REVIEW (2/3 jurys votés)
  const film2 = await prisma.film.create({
    data: {
      submitterId: submitters[1].id,
      submissionToken: 'sub-f2-ancestral-code',
      title: 'Ancestral Code',
      description: "Algorithmes inspirés art yoruba traditionnel. IA décoloniale questionnant hégémonie occidentale tech.",
      country: 'Nigeria',
      language: 'Anglais',
      aiToolsUsed: 'StyleGAN, TouchDesigner, Custom ML models',
      posterUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'IN_REVIEW',
      submittedAt: new Date('2026-01-20'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film2.status}: "${film2.title}" — 3 jurys assignés`);

  await prisma.vote.create({ data: { filmId: film2.id, userId: agnes.id, sentiment: 'LIKE', rating: 9, comments: { create: { content: 'Démarche radicale et nécessaire. Esthétique yoruba magnifiquement traduite en langage algorithmique.', isInternal: false } } } });
  await prisma.vote.create({ data: { filmId: film2.id, userId: mati.id, sentiment: 'LIKE', rating: 10, comments: { create: { content: "Perspective afro-diasporique puissante. Enfin une IA qui ne reproduit pas seulement canons occidentaux.", isInternal: false } } } });
  // Béla pas encore voté (2/3)
  await prisma.film.update({ where: { id: film2.id }, data: { avgRating: 9.5, totalVotes: 2, totalLikes: 2, totalDislikes: 0 } });

  // FILM 3 — IN_REVIEW avec suggestion ⚠️
  const film3 = await prisma.film.create({
    data: {
      submitterId: submitters[2].id,
      submissionToken: 'sub-f3-neural-requiem',
      title: 'Neural Requiem',
      description: 'Méditation visuelle sur obsolescence humaine. Réseaux neuronaux génèrent liturgie post-humaniste.',
      country: 'Allemagne',
      language: 'Allemand',
      aiToolsUsed: 'DALL-E 3, Suno AI, ControlNet',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'IN_REVIEW',
      submittedAt: new Date('2026-01-22'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film3.status}: "${film3.title}" — avec suggestion ⚠️`);

  await prisma.vote.create({ data: { filmId: film3.id, userId: agnes.id, sentiment: 'LIKE', rating: 7, comments: { create: { content: 'Concept philosophique intéressant mais narration parfois hermétique.', isInternal: true } } } });
  await prisma.vote.create({ data: { filmId: film3.id, userId: bela.id, sentiment: 'DISLIKE', rating: 5, suggestModification: true, comments: { create: [{ content: 'Audio trop faible. Mixage insuffisant. Dialogues synthétiques inaudibles par moments.', isInternal: false }, { content: 'Admin : considérer TO_MODIFY pour corrections techniques audio.', isInternal: true }] } } });
  await prisma.film.update({ where: { id: film3.id }, data: { avgRating: 6.0, totalVotes: 2, totalLikes: 1, totalDislikes: 1 } });

  // FILM 4 — APPROVED (unanime)
  const film4 = await prisma.film.create({
    data: {
      submitterId: submitters[3].id,
      submissionToken: 'sub-f4-amazonia-synthetic',
      title: 'Amazônia Synthetic',
      description: 'Forêt amazonienne régénérée par IA après déforestation. Poésie documentaire écologique.',
      country: 'Brésil',
      language: 'Portugais',
      aiToolsUsed: 'Midjourney v6, Pika Labs, Adobe Firefly',
      posterUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'APPROVED',
      submittedAt: new Date('2026-01-25'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film4.status}: "${film4.title}" — unanime`);

  for (const { jury, rating } of [{ jury: agnes, rating: 8 }, { jury: mati, rating: 9 }, { jury: bela, rating: 8 }]) {
    await prisma.vote.create({ data: { filmId: film4.id, userId: jury.id, sentiment: 'LIKE', rating, comments: { create: { content: `Magnifique travail visuel. Message écologique puissant. (${jury.firstName})`, isInternal: false } } } });
  }
  await prisma.film.update({ where: { id: film4.id }, data: { avgRating: 8.3, totalVotes: 3, totalLikes: 3, totalDislikes: 0 } });

  // FILM 5 — REJECTED
  const film5 = await prisma.film.create({
    data: {
      submitterId: submitters[4].id,
      submissionToken: 'sub-f5-bollywood-ai',
      title: 'Bollywood AI Dreams',
      description: 'Tentative mélange Bollywood classique et IA générative. Résultat expérimental.',
      country: 'Inde',
      language: 'Hindi',
      aiToolsUsed: 'ChatGPT, DALL-E, Synthesia',
      posterUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'REJECTED',
      submittedAt: new Date('2026-01-28'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }] }
    }
  });
  console.log(`  ✅ ${film5.status}: "${film5.title}"`);

  await prisma.vote.createMany({ data: [{ filmId: film5.id, userId: agnes.id, sentiment: 'DISLIKE', rating: 3 }, { filmId: film5.id, userId: mati.id, sentiment: 'DISLIKE', rating: 4 }] });
  await prisma.film.update({ where: { id: film5.id }, data: { avgRating: 3.5, totalVotes: 2, totalLikes: 0, totalDislikes: 2 } });

  // FILM 6 — TO_MODIFY
  const film6 = await prisma.film.create({
    data: {
      submitterId: submitters[5].id,
      submissionToken: 'sub-f6-tango-algorithms',
      title: 'Tango Algorithms',
      description: 'Chorégraphie tango Buenos Aires réinterprétée par ML. Poésie mouvement synthétique.',
      country: 'Argentine',
      language: 'Espagnol',
      aiToolsUsed: 'Runway Gen-2, MuseNet, DeepMotion',
      posterUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'TO_MODIFY',
      modificationRequest: "Bonjour Diego,\n\nVotre film présente un potentiel artistique remarquable. Nous vous demandons d'améliorer :\n\n- Synchronisation audio/vidéo (décalage ~0.5s en intro)\n- Résolution finale trop basse (720p → minimum 1080p)\n- Crédits finaux : ajouter mention outils IA\n\nMerci de soumettre une version corrigée.\n\nÉquipe marsAI Festival",
      modificationRequestedAt: new Date('2026-02-01'),
      modificationRequestedBy: bruno.id,
      submittedAt: new Date('2026-01-30'),
      assignedUsers: { connect: [{ id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film6.status}: "${film6.title}" — corrections demandées`);

  await prisma.vote.create({ data: { filmId: film6.id, userId: bela.id, sentiment: 'LIKE', rating: 7, suggestModification: true, comments: { create: { content: 'Très beau travail esthétique. Problèmes techniques mineurs à corriger.', isInternal: false } } } });
  await prisma.filmVersion.create({ data: { filmId: film6.id, title: film6.title, description: film6.description, aiToolsUsed: film6.aiToolsUsed, posterUrl: film6.posterUrl, youtubeUrl: film6.youtubeUrl, archivedAt: new Date('2026-02-01') } });
  await prisma.film.update({ where: { id: film6.id }, data: { avgRating: 7.0, totalVotes: 1, totalLikes: 1, totalDislikes: 0 } });

  // FILM 7 — SELECTION
  const film7 = await prisma.film.create({
    data: {
      submitterId: submitters[6].id,
      submissionToken: 'sub-f7-seoul-surveillance',
      title: 'Seoul Surveillance',
      description: 'Critique société surveillance algorithmique Corée Sud. Dystopie documentaire temps réel.',
      country: 'Corée du Sud',
      language: 'Coréen',
      aiToolsUsed: 'YOLOv8, OpenCV, Stable Diffusion',
      posterUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'SELECTION',
      avgRating: 8.7, totalVotes: 3, totalLikes: 3, totalDislikes: 0,
      submittedAt: new Date('2026-02-02'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film7.status}: "${film7.title}" — sélection officielle`);
  await prisma.vote.createMany({ data: [{ filmId: film7.id, userId: agnes.id, sentiment: 'LIKE', rating: 9 }, { filmId: film7.id, userId: mati.id, sentiment: 'LIKE', rating: 9 }, { filmId: film7.id, userId: bela.id, sentiment: 'LIKE', rating: 8 }] });

  // FILM 8 — FINALIST
  const film8 = await prisma.film.create({
    data: {
      submitterId: submitters[7].id,
      submissionToken: 'sub-f8-casablanca-memories',
      title: 'Casablanca Digital Memories',
      description: 'Mémoires diaspora marocaine reconstruites par IA. Archives familiales augmentées machine learning.',
      country: 'Maroc',
      language: 'Arabe',
      aiToolsUsed: 'GPT-4 Vision, CLIP, LoRA fine-tuning',
      posterUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'FINALIST',
      avgRating: 9.0, totalVotes: 3, totalLikes: 3, totalDislikes: 0,
      submittedAt: new Date('2026-02-05'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film8.status}: "${film8.title}" — nominé`);
  await prisma.vote.createMany({ data: [{ filmId: film8.id, userId: agnes.id, sentiment: 'LIKE', rating: 9 }, { filmId: film8.id, userId: mati.id, sentiment: 'LIKE', rating: 9 }, { filmId: film8.id, userId: bela.id, sentiment: 'LIKE', rating: 9 }] });

  // FILM 9 — AWARD
  const film9 = await prisma.film.create({
    data: {
      submitterId: submitters[8].id,
      submissionToken: 'sub-f9-climate-oracle',
      title: 'Climate Oracle',
      description: "IA prédit futurs climatiques 2050-2100. Documentaire anticipation généré par simulations ML.",
      country: 'Canada',
      language: 'Anglais',
      aiToolsUsed: 'Climate ML models, Stable Diffusion, ElevenLabs',
      posterUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'AWARD',
      avgRating: 9.7, totalVotes: 3, totalLikes: 3, totalDislikes: 0,
      submittedAt: new Date('2026-02-08'),
      assignedUsers: { connect: [{ id: agnes.id }, { id: mati.id }, { id: bela.id }] }
    }
  });
  console.log(`  ✅ ${film9.status}: "${film9.title}" — 🏆 GAGNANT\n`);
  await prisma.vote.createMany({ data: [{ filmId: film9.id, userId: agnes.id, sentiment: 'LIKE', rating: 10 }, { filmId: film9.id, userId: mati.id, sentiment: 'LIKE', rating: 10 }, { filmId: film9.id, userId: bela.id, sentiment: 'LIKE', rating: 9 }] });

  // =============================================================================
  // 4️⃣ AWARDS
  // =============================================================================

  console.log('🏆 Création Awards (palmarès)...');

  await prisma.award.create({ data: { name: 'Meilleur Film', description: 'Prix du meilleur film toutes catégories confondues', displayOrder: 1, filmId: film9.id } });
  await prisma.award.create({ data: { name: "Prix Innovation IA", description: "Usage le plus innovant de l'intelligence artificielle", displayOrder: 2, filmId: film8.id } });
  await prisma.award.create({ data: { name: 'Meilleur Documentaire', description: 'Documentaire IA le plus impactant', displayOrder: 3, filmId: film7.id } });
  console.log('  ✅ 3 catégories créées\n');

  // =============================================================================
  // 5️⃣ JURY MEMBERS - Page publique
  // =============================================================================

  console.log('🎭 Création jury officiel public...');

  await prisma.juryMember.create({ data: { firstName: 'Agnès', lastName: 'Varda', title: 'Présidente Jury', bio: 'Légende Nouvelle Vague française. Pionnière documentaire poétique.', displayOrder: 1 } });
  await prisma.juryMember.create({ data: { firstName: 'Mati', lastName: 'Diop', title: 'Membre Jury', bio: "Cinéaste franco-sénégalaise. Palme d'Or Cannes.", displayOrder: 2 } });
  await prisma.juryMember.create({ data: { firstName: 'Béla', lastName: 'Tarr', title: 'Membre Jury', bio: 'Maître hongrois plans-séquences contemplatifs.', displayOrder: 3 } });
  console.log('  ✅ 3 membres jury publics\n');

  // =============================================================================
  // 6️⃣ SITE SETTINGS
  // =============================================================================

  console.log('⚙️  Configuration site...');

  await prisma.siteSettings.create({
    data: {
      currentYear: 2026,
      festivalTheme: 'IA & Cinéma : Vers de Nouvelles Frontières',
      festivalDates: '12-13 juin 2026',
      trailerUrl: 'https://www.youtube.com/watch?v=example',
      aboutText: 'marsAI Festival célèbre intersection intelligence artificielle et cinéma expérimental. Première édition 2026 Marseille.',
      rulesText: 'Films 3-15 min. Outils IA obligatoires. Toutes nationalités bienvenues.'
    }
  });
  console.log('  ✅ Site settings configuré\n');

  // =============================================================================
  // 📊 STATS
  // =============================================================================

  console.log('📊 STATISTIQUES SEED:\n');
  console.log('  Users (6) : 2 ADMIN · 1 MODERATOR · 3 JURY');
  console.log('  Submitters (9) : JP · NG · DE · BR · IN · AR · KR · MA · CA');
  console.log('  Films (9) : SUBMITTED·IN_REVIEW(×2)·APPROVED·REJECTED·TO_MODIFY·SELECTION·FINALIST·AWARD');
  console.log('  Votes (~18) : LIKE/DISLIKE + suggestions');
  console.log('  FilmVersions (1) · Awards (3) · JuryMembers (3) · SiteSettings (1)');
  console.log('\n✅ Seed complet terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
