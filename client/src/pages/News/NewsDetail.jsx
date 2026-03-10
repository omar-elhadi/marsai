/**
 * NewsDetail.jsx — MARSAI Festival
 * Page Détail Article — Actualités
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════
 *
 * Données statiques locales — source unique : newsDetailData[].
 * Chaque article contient : métadonnées + sections[] éditorielles.
 * Migration backend : remplacer le lookup par useEffect + fetch.
 *
 * ═══════════════════════════════════════════════════════════════
 * INLINE STYLES RESTANTS — justification
 * ═══════════════════════════════════════════════════════════════
 *
 * style={{ backgroundImage }}   → hero, URL par article (runtime)
 * style={{ '--tag-color' }}     → CSS variable par article
 * GSAP refs heroRef + bodyRef   → opacity/y à l'entrée, clearProps:'all'
 *
 * ═══════════════════════════════════════════════════════════════
 * CONTRAT MIGRATION BACKEND
 * ═══════════════════════════════════════════════════════════════
 *
 * GET /api/news/:id/public
 * → Pas d'auth. Champs: { id, tag, date, image, title, lead,
 *                         sections[], relatedIds[] }
 * Remplacer newsDetailData[id] par useEffect + fetch.
 * JSX inchangé si le contrat de données est respecté.
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useParams }             from 'react-router-dom';
import gsap                            from 'gsap';
import { ROUTES }                      from '@/constants/routes';
import styles                          from './NewsDetail.module.css';

// ─── Couleurs par tag ─────────────────────────────────────────
// Identiques à News.jsx — source future : token partagé.
const tagColors = {
  'À LA UNE':      '#e8d5a3',
  'OFFICIEL':      '#a3c4e8',
  'TABLES RONDES': '#a3e8c4',
  'PALMARÈS':      '#e8a3a3',
  'EXPO':          '#c4a3e8',
  'MASTERCLASS':   '#e8c4a3',
};

// ─── Données éditoriales complètes ───────────────────────────
const newsDetailData = {

  // ── Article 1 — Ouverture du Festival ──────────────────────
  1: {
    id:       1,
    tag:      'À LA UNE',
    date:     '18 mars 2026',
    category: 'Ouverture',
    image:    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2400&auto=format&fit=crop',
    title:    'Ouverture du Festival IA 2026',
    lead:     'Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides. Une édition marquée par l\'entrée en compétition officielle de 40 œuvres venues de 22 pays.',
    sections: [
      {
        type:  'text',
        label: 'Édition 2026',
        title: 'Un tournant pour le cinéma génératif',
        paragraphs: [
          'Cette troisième édition du MARSAI marque un seuil. Pour la première fois, des œuvres entièrement produites par des modèles de diffusion latente — sans intervention humaine dans la chaîne de rendu — entrent en compétition officielle. Une décision du comité artistique qui a suscité autant d\'enthousiasme que de débats dans les mois précédant le festival.',
          'La cérémonie d\'ouverture, présidée par la réalisatrice Lena Voss et l\'artiste pluridisciplinaire Karim Aït-Taleb, a réuni plus de 1 200 professionnels du secteur sous le Grand Palais réaménagé pour l\'occasion. Le discours inaugural a posé le cadre : MARSAI ne célèbre pas l\'IA comme outil, mais comme co-auteure.',
        ],
      },
      {
        type: 'quote',
        text: '« Nous ne sommes plus dans l\'ère de l\'outil. Nous sommes dans l\'ère du dialogue. Chaque film présenté ici est le résultat d\'une conversation — parfois conflictuelle, toujours féconde — entre un humain et une machine. »',
        author: 'Lena Voss — Présidente du jury 2026',
      },
      {
        type:  'stats',
        label: 'Festival en chiffres',
        items: [
          { value: '40',   label: 'Films en compétition' },
          { value: '22',   label: 'Pays représentés' },
          { value: '3',    label: 'Jours de festival' },
          { value: '12',   label: 'Tables rondes' },
          { value: '1200', label: 'Professionnels accrédités' },
          { value: '6',    label: 'Prix décernés' },
        ],
      },
      {
        type:  'text',
        label: 'Programme',
        title: 'Trois jours, six dimensions',
        paragraphs: [
          'L\'édition 2026 s\'articule autour de six axes thématiques : Narration Algorithmique, Corps et Représentation, Mémoire et Archive, Dystopies Consenties, Cinéma Documentaire Génératif, et Installations Immersives. Chaque axe bénéficie d\'une programmation parallèle — projections, tables rondes, ateliers praticiens.',
          'Les séances se tiennent dans quatre espaces distincts : la Grande Salle (1 000 places), la Salle Expérimentale (180 places, projection à 360°), l\'Espace Industries (200 places, focus professionnel) et la Galerie des Œuvres — espace d\'exposition permanent ouvert tout au long du festival.',
        ],
      },
      {
        type:  'program',
        label: 'Jour 1 — Ouverture',
        items: [
          { time: '09h30', title: 'Accueil des accrédités & presse', sub: 'Hall principal — Grand Palais' },
          { time: '11h00', title: 'Conférence inaugurale : "L\'IA comme co-auteure"', sub: 'Lena Voss & Karim Aït-Taleb' },
          { time: '14h00', title: 'Première projection officielle', sub: 'Grande Salle — Film d\'ouverture en avant-première mondiale' },
          { time: '16h30', title: 'Ouverture de la Galerie des Œuvres Génératives', sub: 'Vernissage — Accès libre sur invitation' },
          { time: '20h00', title: 'Cérémonie d\'ouverture & cocktail de gala', sub: 'Sur invitation — tenue de soirée requise' },
        ],
      },
    ],
    related: [2, 3, 6],
  },

  // ── Article 2 — Sélection Officielle ───────────────────────
  2: {
    id:       2,
    tag:      'OFFICIEL',
    date:     '19 mars 2026',
    category: 'Sélection',
    image:    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop',
    title:    'Sélection Officielle',
    lead:     '40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage. La sélection 2026 témoigne d\'une maturité artistique inédite : les œuvres ne se contentent plus de montrer l\'IA, elles pensent avec elle.',
    sections: [
      {
        type:  'text',
        label: 'Sélection 2026',
        title: 'Une géographie nouvelle du cinéma',
        paragraphs: [
          'Le comité de sélection a reçu 847 candidatures issues de 58 pays — un record. Après six mois de visionnage, 40 films ont été retenus pour la compétition officielle. Parmi eux, 14 premières œuvres, 9 films documentaires génératifs et 3 installations longue durée pensées exclusivement pour la Salle Expérimentale.',
          'La sélection révèle une géographie inédite du cinéma IA. Si les États-Unis, le Japon et la France restent dominants, l\'émergence de cinéastes nigérians, brésiliens et coréens marque un tournant : le cinéma génératif devient un langage mondial, non plus réservé aux pays disposant d\'infrastructures techniques massives.',
        ],
      },
      {
        type:  'films',
        label: 'Films en compétition — extrait',
        items: [
          { title: 'LATENT BODIES',        meta: 'Yuna Park — Corée du Sud, 2025 — 84 min',    category: 'Narration Algorithmique' },
          { title: 'THE LAST PROTOCOL',    meta: 'Marcus Webb — États-Unis, 2025 — 112 min',   category: 'Dystopies Consenties' },
          { title: 'MÉMOIRES DIFFUSES',    meta: 'Amara Diallo — France / Sénégal, 2025 — 67 min', category: 'Mémoire et Archive' },
          { title: 'CORPO GENERATIVO',     meta: 'Valentina Greco — Italie, 2025 — 91 min',    category: 'Corps et Représentation' },
          { title: 'SIGNAL / NOISE',       meta: 'Kenji Ota — Japon, 2025 — 78 min',           category: 'Installations Immersives' },
          { title: 'O ARQUIVO VIVO',       meta: 'Rafael Mendes — Brésil, 2025 — 103 min',     category: 'Cinéma Documentaire Génératif' },
          { title: 'ECHO CHAMBER',         meta: 'Priya Nair — Inde / Royaume-Uni, 2025 — 88 min', category: 'Narration Algorithmique' },
          { title: 'NUIT SYNTHÉTIQUE',     meta: 'Théo Blanchard — France, 2025 — 94 min',     category: 'Dystopies Consenties' },
        ],
      },
      {
        type: 'quote',
        text: '« Ce qui nous a frappés cette année, c\'est la disparition du "regard IA" comme esthétique reconnaissable. Les films ne ressemblent plus à de l\'IA — ils pensent autrement. C\'est une différence fondamentale. »',
        author: 'Sofía Ramos — Présidente du comité de sélection',
      },
      {
        type:  'text',
        label: 'Catégories',
        title: 'Six axes thématiques',
        paragraphs: [
          'La sélection 2026 est organisée en six axes thématiques, chacun bénéficiant d\'un jury spécialisé et d\'un prix dédié. Les films peuvent être soumis à plusieurs axes — la décision finale d\'attribution appartient au comité artistique après délibération.',
        ],
      },
      {
        type:  'list',
        label: 'Axes thématiques 2026',
        items: [
          'Narration Algorithmique — récits dont la structure même est générée par IA',
          'Corps et Représentation — exploration des identités corporelles dans l\'espace latent',
          'Mémoire et Archive — reconstitution et réinterprétation par modèles génératifs',
          'Dystopies Consenties — fictions spéculatives co-écrites avec des LLM',
          'Cinéma Documentaire Génératif — le réel augmenté et ses limites éthiques',
          'Installations Immersives — œuvres conçues pour la Salle Expérimentale 360°',
        ],
      },
    ],
    related: [1, 3, 4],
  },

  // ── Article 3 — Tables Rondes & Débats ─────────────────────
  3: {
    id:       3,
    tag:      'TABLES RONDES',
    date:     '20 mars 2026',
    category: 'Débats',
    image:    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2400&auto=format&fit=crop',
    title:    'Tables Rondes & Débats',
    lead:     'Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d\'auteur et de la transparence algorithmique. Douze sessions réparties sur trois jours, avec des intervenants venus de 14 pays et de disciplines radicalement différentes.',
    sections: [
      {
        type:  'text',
        label: 'Programme intellectuel',
        title: 'Les questions qui redéfinissent le cinéma',
        paragraphs: [
          'Le volet débats du MARSAI 2026 n\'est pas un programme parallèle — c\'est le cœur intellectuel du festival. Chaque table ronde est conçue comme une confrontation de points de vue antagonistes, modérée par des journalistes spécialisés. Pas de consensus forcé, pas de conclusion préemballée : l\'objectif est d\'exposer la complexité, pas de la résoudre.',
          'Trois grands thèmes structurent l\'ensemble des sessions : la question de l\'autorialité (qui est l\'auteur d\'une œuvre co-créée avec une IA ?), la question de la représentation (comment les modèles génératifs encodent-ils — et potentiellement renforcent-ils — des biais culturels ?), et la question de la transparence (les spectateurs ont-ils le droit de savoir qu\'un film est génératif ?).',
        ],
      },
      {
        type:  'program',
        label: 'Programme des tables rondes',
        items: [
          { time: 'Jour 1 — 14h00', title: 'Autorialité et co-création : qui signe le film ?', sub: 'Avocats, réalisateurs, philosophes du droit' },
          { time: 'Jour 1 — 16h30', title: 'Droits d\'auteur dans l\'ère des modèles de fondation', sub: 'Juristes, représentants SACD, chercheurs Harvard Law' },
          { time: 'Jour 2 — 10h00', title: 'Biais, représentation et espace latent', sub: 'Chercheurs en fairness ML, cinéastes, sociologues' },
          { time: 'Jour 2 — 14h00', title: 'Transparence algorithmique : label ou obligation ?', sub: 'Commissaires européens, diffuseurs, réalisateurs' },
          { time: 'Jour 2 — 17h00', title: 'Économie de la production IA : disruption ou opportunité ?', sub: 'Producteurs, distributeurs, studios indépendants' },
          { time: 'Jour 3 — 11h00', title: 'L\'archive génératif : mémoire ou falsification ?', sub: 'Archivistes, historiens, artistes de la mémoire' },
          { time: 'Jour 3 — 15h00', title: 'Clôture : le cinéma IA en 2030 — quatre scénarios', sub: 'Prospectivistes, grand public invité' },
        ],
      },
      {
        type: 'quote',
        text: '« La question n\'est pas "l\'IA peut-elle créer ?" — elle crée, c\'est établi. La question est "pourquoi créons-nous ?" et ce que la réponse implique pour la place de l\'humain dans le processus. »',
        author: 'Dr. Mei Lin — Chercheuse en éthique de l\'IA, MIT Media Lab',
      },
      {
        type:  'text',
        label: 'Intervenants',
        title: 'Architectes du débat',
        paragraphs: [
          'Le MARSAI a constitué pour cette édition un panel de 47 intervenants issus de 14 pays. Chercheurs en machine learning, réalisateurs confirmés, juristes spécialisés en propriété intellectuelle, philosophes de la technique, représentants d\'organisations de défense des auteurs et acteurs de l\'industrie du streaming se côtoient dans des configurations délibérément déséquilibrées — pour éviter les effets de chambre d\'écho.',
        ],
      },
      {
        type:  'list',
        label: 'Intervenants confirmés',
        items: [
          'Dr. Mei Lin — Éthique de l\'IA, MIT Media Lab (États-Unis)',
          'Aleksander Nowak — Droits d\'auteur & IA, Université de Varsovie (Pologne)',
          'Fatoumata Keïta — Cinéaste, membre du comité de sélection FESPACO (Burkina Faso)',
          'James Harlow — Directeur technique, Stability AI (Royaume-Uni)',
          'Chloé Mercier — Avocate, SACD — Société des auteurs et compositeurs dramatiques (France)',
          'Prof. Hiroshi Yamada — Philosophie de la technique, Université de Tokyo (Japon)',
          'Nadia Al-Rashid — Productrice indépendante, co-fondatrice Cairo AI Films (Égypte)',
        ],
      },
    ],
    related: [1, 2, 6],
  },

  // ── Article 4 — Prix IA 2026 ────────────────────────────────
  4: {
    id:       4,
    tag:      'PALMARÈS',
    date:     '21 mars 2026',
    category: 'Cérémonie',
    image:    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2400&auto=format&fit=crop',
    title:    'Prix IA 2026',
    lead:     'Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture. Six prix, six jurys distincts, trois jours de délibération. Le palmarès 2026 récompensera les œuvres qui ont repoussé les limites du possible.',
    sections: [
      {
        type:  'text',
        label: 'Palmarès 2026',
        title: 'Six prix, six visions',
        paragraphs: [
          'La cérémonie de clôture du MARSAI 2026 décernera six prix distincts, chacun évalué par un jury spécialisé et indépendant. Contrairement à d\'autres festivals, le MARSAI ne propose pas de "Grand Prix" unique — le refus de hiérarchiser les formes d\'excellence est une position artistique délibérée depuis la première édition.',
          'Les jurys se composent chacun de cinq membres issus de disciplines complémentaires. Aucun membre d\'un jury ne peut siéger dans un autre. Les délibérations sont confidentielles jusqu\'à la cérémonie. Les résultats sont sous embargo presse jusqu\'au 21 mars, 20h00.',
        ],
      },
      {
        type:  'stats',
        label: 'Palmarès en chiffres',
        items: [
          { value: '6',   label: 'Prix décernés' },
          { value: '30',  label: 'Membres de jury' },
          { value: '40',  label: 'Films en lice' },
          { value: '72h', label: 'Délibérations' },
        ],
      },
      {
        type:  'program',
        label: 'Les six prix',
        items: [
          { time: 'Grand Prix',         title: 'Meilleur Film Génératif',       sub: 'Récompense l\'œuvre la plus accomplie sur l\'ensemble des critères' },
          { time: 'Prix Narration',     title: 'Meilleure Narration Hybride',   sub: 'Scénario ou structure narrative co-créée avec un modèle de langage' },
          { time: 'Prix Technique',     title: 'Innovation Technique',          sub: 'Avancée méthodologique ou technologique inédite dans la production' },
          { time: 'Prix du Jury',       title: 'Mention Spéciale',              sub: 'Œuvre singulière hors des catégories établies' },
          { time: 'Prix Émergence',     title: 'Premier Film IA',               sub: 'Meilleure première œuvre — réservé aux cinéastes n\'ayant pas encore de long métrage' },
          { time: 'Prix du Public',     title: 'Choix du Public',               sub: 'Vote ouvert à tous les accrédités — résultats annoncés en clôture' },
        ],
      },
      {
        type: 'quote',
        text: '« Un prix MARSAI ne récompense pas la maîtrise technique — il récompense la nécessité artistique. La question que nous posons à chaque film : avait-il besoin d\'exister ? »',
        author: 'Thomas Girard — Directeur artistique, MARSAI Festival',
      },
      {
        type:  'text',
        label: 'Cérémonie',
        title: 'Le soir du 21 mars',
        paragraphs: [
          'La cérémonie de remise des prix se tiendra dans la Grande Salle du Grand Palais à partir de 20h00. Elle sera précédée d\'un cocktail de gala à 18h30, réservé aux accrédités presse, industrie et jury. La cérémonie est diffusée en direct sur le site officiel du festival et les réseaux partenaires.',
          'Chaque lauréat recevra le Prisme — sculpture en verre soufflé conçue par l\'artiste Margot Leleu, dont la forme évoque un tenseur à quatre dimensions, symbole de la transformation des représentations dans l\'espace latent. Une pièce unique pour chaque prix.',
        ],
      },
    ],
    related: [1, 2, 5],
  },

  // ── Article 5 — Galerie des Œuvres Génératives ─────────────
  5: {
    id:       5,
    tag:      'EXPO',
    date:     '19–21 mars 2026',
    category: 'Expositions',
    image:    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2400&auto=format&fit=crop',
    title:    'Galerie des Œuvres Génératives',
    lead:     'Une sélection d\'installations immersives créées entièrement par des modèles de diffusion, exposées sur la Croisette. Dix œuvres, dix artistes, dix façons de repenser la relation entre espace, temps et génération algorithmique.',
    sections: [
      {
        type:  'text',
        label: 'Exposition',
        title: 'L\'espace comme œuvre',
        paragraphs: [
          'La Galerie des Œuvres Génératives occupe cette année l\'intégralité du Pavillon des Arts de la Croisette — 2 400 m² répartis sur deux niveaux. Chaque installation a été conçue spécifiquement pour l\'espace qui lui est attribué : pas de pièces transportées d\'une exposition à l\'autre, mais des œuvres nées de la contrainte architecturale.',
          'L\'accès est libre sur présentation de l\'accréditation festival. Des visites guidées par les artistes sont programmées chaque jour à 11h00 et 16h00. Des médiateurs spécialisés sont présents en permanence pour contextualiser les choix techniques et artistiques de chaque installation.',
        ],
      },
      {
        type:  'films',
        label: 'Installations — sélection',
        items: [
          { title: 'FLUX PERPÉTUEL',        meta: 'Ana Lima — Brésil',       category: 'Diffusion latente / temps réel' },
          { title: 'PORTRAIT INSTABLE',     meta: 'Jin Soo Park — Corée',    category: 'GAN — identité et dissolution' },
          { title: 'L\'ARCHIVE RÊVÉE',      meta: 'Clara Fontaine — France', category: 'Reconstitution mémorielle' },
          { title: 'NOISE GARDEN',          meta: 'Oliver Marsh — UK',       category: 'Génération sonore et visuelle' },
          { title: 'TERRITOIRE FANTÔME',    meta: 'Yuki Noda — Japon',       category: 'Cartographie algorithmique' },
          { title: 'CORPS SANS ORGANES v2', meta: 'Sofia Vega — Mexique',    category: 'Corporéité et espace latent' },
        ],
      },
      {
        type: 'quote',
        text: '« Je ne dirige pas le modèle. Je l\'interroge. Chaque rendu est une réponse que je dois apprendre à lire — comme un rêve dont on cherche le sens au réveil. »',
        author: 'Clara Fontaine — Artiste, L\'Archive Rêvée',
      },
      {
        type:  'text',
        label: 'Médiation',
        title: 'Comprendre pour ressentir',
        paragraphs: [
          'La Galerie propose un parcours de médiation en trois niveaux : une entrée sensorielle libre (aucun cartel technique visible à l\'entrée des salles), un niveau intermédiaire avec carnets de visite expliquant les processus, et un niveau technique avec documentation complète des architectures utilisées.',
          'Ce dispositif répond à une conviction centrale du festival : le public ne doit pas avoir besoin de comprendre le machine learning pour être ému. Mais ceux qui veulent comprendre doivent avoir les moyens de le faire. Les deux niveaux coexistent sans que l\'un condescende envers l\'autre.',
        ],
      },
      {
        type:  'list',
        label: 'Informations pratiques',
        items: [
          'Pavillon des Arts — Croisette, Cannes — 2 400 m² sur 2 niveaux',
          'Ouverture : 19, 20, 21 mars — 10h00 à 22h00',
          'Accès libre sur présentation de l\'accréditation festival',
          'Visites guidées par les artistes : 11h00 et 16h00 chaque jour',
          'Médiateurs présents en permanence — français, anglais, espagnol',
          'Documentation technique disponible à l\'accueil ou en téléchargement',
        ],
      },
    ],
    related: [1, 6, 3],
  },

  // ── Article 6 — Masterclass ─────────────────────────────────
  6: {
    id:       6,
    tag:      'MASTERCLASS',
    date:     '20 mars 2026',
    category: 'Masterclass',
    image:    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2400&auto=format&fit=crop',
    title:    'IA & Réalisation : Le futur du cinéma',
    lead:     'Une session exclusive avec les pionniers du cinéma IA pour explorer les nouvelles frontières de la narration visuelle. Quatre heures, quatre intervenants, quatre visions radicalement différentes de ce que le cinéma peut devenir.',
    sections: [
      {
        type:  'text',
        label: 'Masterclass',
        title: 'Quatre heures pour changer de regard',
        paragraphs: [
          'La masterclass annuelle du MARSAI est l\'événement le plus couru du festival — les 200 places disponibles ont été attribuées par tirage au sort parmi 1 847 demandes. Elle réunit quatre praticiens à des stades différents de leur relation avec l\'IA : un réalisateur qui vient d\'achever son premier film entièrement génératif, une chercheuse en vision computationnelle, un directeur artistique de studio AAA qui expérimente les outils IA dans la publicité, et une philosophe qui ne connaît rien au code mais qui pense l\'image mieux que quiconque.',
          'Ce mélange délibéré de profils est la signature des masterclasses MARSAI : pas une conférence de sachants, mais une conversation entre des gens qui ne se comprennent pas encore — et qui doivent y arriver en direct, devant 200 personnes.',
        ],
      },
      {
        type:  'program',
        label: 'Programme — 20 mars, 14h00–18h00',
        items: [
          { time: '14h00', title: 'Introduction : "Pourquoi maintenant ?"',        sub: 'Thomas Girard — Directeur artistique MARSAI' },
          { time: '14h20', title: 'Session 1 : "Du prompt au plan — le workflow génératif"', sub: 'Yuna Park — Réalisatrice, Latent Bodies (Corée)' },
          { time: '15h10', title: 'Session 2 : "Ce que les modèles ne voient pas"',  sub: 'Dr. Amelia Ross — Vision computationnelle, Stanford' },
          { time: '16h00', title: 'Pause & networking',                              sub: 'Espace Industrie — accès libre' },
          { time: '16h30', title: 'Session 3 : "IA et production commerciale — retour d\'expérience"', sub: 'Marco Delgado — DArt, Studio Forma (Espagne)' },
          { time: '17h15', title: 'Session 4 : "L\'image sans auteur — une catastrophe ?"', sub: 'Prof. Hélène Dumont — Philosophie de l\'art, EHESS' },
          { time: '17h55', title: 'Questions & dialogue ouvert',                     sub: 'Modération : Isabelle Cheng — Rédactrice en chef, Sight & Sound' },
        ],
      },
      {
        type: 'quote',
        text: '« Je ne sais pas coder. Je ne sais pas ce qu\'est un tenseur. Ce que je sais, c\'est qu\'une image nous regarde en retour — et que cette image, générée par une machine, nous regarde d\'une façon que nous n\'avons pas encore appris à recevoir. »',
        author: 'Prof. Hélène Dumont — Philosophe de l\'art, EHESS',
      },
      {
        type:  'text',
        label: 'Format',
        title: 'Une pédagogie par le désaccord',
        paragraphs: [
          'Chaque session dure 45 minutes : 20 minutes de présentation, 15 minutes de dialogue entre intervenants, 10 minutes de questions du public. Les intervenants ont reçu les présentations des autres en amont — ils ont l\'obligation de préparer au moins une objection substantielle à chacune.',
          'Les masterclasses MARSAI ne sont pas enregistrées pour diffusion publique. Ce choix délibéré crée un espace de parole protégé : les intervenants peuvent avancer des hypothèses non abouties, changer d\'avis en direct, reconnaître leurs ignorances. L\'intelligence du direct contre la performance du post-produit.',
        ],
      },
      {
        type:  'list',
        label: 'Informations pratiques',
        items: [
          'Date : 20 mars 2026 — 14h00 à 18h00',
          'Lieu : Espace Industrie — Grand Palais, Cannes',
          'Capacité : 200 places — attribution par tirage au sort',
          'Accréditation professionnelle obligatoire (presse, industrie, académique)',
          'Langue : français avec traduction simultanée anglais/espagnol',
          'Non enregistrée — aucune diffusion prévue',
        ],
      },
    ],
    related: [1, 3, 2],
  },
};

// ─── Rendu conditionnel des sections ─────────────────────────

function SectionBlock({ section, tagColor }) {
  switch (section.type) {

    case 'text':
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          {section.title && (
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          )}
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? styles.paragraphAccent : styles.paragraph}
            >
              {p}
            </p>
          ))}
        </div>
      );

    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{section.text}</p>
          <cite className={styles.quoteAuthor}>{section.author}</cite>
        </blockquote>
      );

    case 'list':
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <ul className={styles.list}>
            {section.items.map((item, i) => (
              <li key={i} className={styles.listItem}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'stats':
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div className={styles.statsGrid}>
            {section.items.map((item, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'program':
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div className={styles.programGrid}>
            {section.items.map((item, i) => (
              <div key={i} className={styles.programItem}>
                <span className={styles.programTime}>{item.time}</span>
                <div>
                  <div className={styles.programTitle}>{item.title}</div>
                  {item.sub && (
                    <div className={styles.programSub}>{item.sub}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'films':
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div className={styles.filmsGrid} style={{ '--tag-color': tagColor }}>
            {section.items.map((item, i) => (
              <div key={i} className={styles.filmCard}>
                <span className={styles.filmTitle}>{item.title}</span>
                <span className={styles.filmMeta}>{item.meta}</span>
                <span className={styles.filmCategory}>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}


// ─── Composant principal ──────────────────────────────────────

export default function NewsDetail() {
  const { id }       = useParams();
  const article      = newsDetailData[Number(id)];
  const heroRef      = useRef(null);
  const bodyRef      = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Entrée GSAP — opacity + y sur hero et body
  useEffect(() => {
    if (!article) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      );
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power2.out', clearProps: 'all' }
      );
    });
    return () => ctx.revert();
  }, [article]);

  // Preload image hero pour déclencher l'animation de zoom
  useEffect(() => {
    if (!article) return;
    const img = new Image();
    img.src = article.image;
    img.onload = () => setImgLoaded(true);
  }, [article]);

  // ── 404 article ──────────────────────────────────────────────
  if (!article) {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          <div className={styles.main}>
            <Link to={ROUTES.NEWS} className={styles.backLink}>
              <span className={styles.backArrow}>←</span>
              Retour aux actualités
            </Link>
            <p className={styles.paragraphAccent}>Article introuvable.</p>
          </div>
        </div>
      </div>
    );
  }

  const tagColor  = tagColors[article.tag] || '#f0ece4';
  const relatedArticles = (article.related || [])
    .map(rid => newsDetailData[rid])
    .filter(Boolean);

  return (
    <div
      className={styles.page}
      style={{ '--tag-color': tagColor }}
    >

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div ref={heroRef} className={styles.hero}>

        {/* Image de fond — backgroundImage inline (URL runtime) */}
        <div
          className={`${styles.heroBg} ${imgLoaded ? styles.heroBgLoaded : ''}`}
          style={{ backgroundImage: `url(${article.image})` }}
        />

        {/* Overlay gradient */}
        <div className={styles.heroOverlay} />

        {/* Navigation retour */}
        <div className={styles.heroNav}>
          <Link to={ROUTES.NEWS} className={styles.backLink}>
            <span className={styles.backArrow}>←</span>
            Actualités
          </Link>
        </div>

        {/* Contenu hero */}
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <span className={styles.heroTag}>{article.tag}</span>
            <span className={styles.heroDate}>{article.date}</span>
          </div>
          <h1 className={styles.heroTitle}>{article.title}</h1>
          <p className={styles.heroLead}>{article.lead}</p>
        </div>
      </div>

      {/* ── CORPS ────────────────────────────────────────────── */}
      <div ref={bodyRef} className={styles.body}>

        {/* Colonne principale */}
        <main className={styles.main}>
          {article.sections.map((section, i) => (
            <SectionBlock
              key={i}
              section={section}
              tagColor={tagColor}
            />
          ))}
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>

          {/* Infos article */}
          <div className={styles.sidebarBlock}>
            <span className={styles.sidebarTitle}>À propos</span>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Catégorie</span>
              <span className={styles.infoValue}>{article.category}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Date</span>
              <span className={styles.infoValue}>{article.date}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Type</span>
              <span className={styles.infoTag}>{article.tag}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Festival</span>
              <span className={styles.infoValue}>MARSAI — Marseille, 20–22 Juin 2026</span>
            </div>
          </div>

          {/* Articles liés */}
          {relatedArticles.length > 0 && (
            <div className={styles.sidebarBlock}>
              <span className={styles.sidebarTitle}>Articles liés</span>
              <nav className={styles.relatedList} aria-label="Articles liés">
                {relatedArticles.map(related => (
                  <Link
                    key={related.id}
                    to={ROUTES.NEWS_DETAIL.replace(':id', related.id)}
                    className={styles.relatedItem}
                  >
                    <span className={styles.relatedTitle}>{related.title}</span>
                    <span className={styles.relatedDate}>{related.date}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* CTA Soumettre */}
          <div className={styles.sidebarBlock}>
            <span className={styles.sidebarTitle}>Participer</span>
            <p className={styles.paragraph}>
              Les soumissions pour l'édition 2026 sont ouvertes jusqu'au 28 février.
            </p>
            <Link to={ROUTES.SOUMETTRE} className={styles.ctaButton}>
              Soumettre un film →
            </Link>
          </div>

        </aside>
      </div>

    </div>
  );
}