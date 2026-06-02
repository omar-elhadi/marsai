export interface NewsItem {
  id: string;
  tag: string;
  date: string;
  image: string;
  title: string;
  content: string;
}

export interface NewsSection {
  type: string;
  label?: string;
  title?: string;
  paragraphs?: string[];
  text?: string;
  author?: string;
  items?: Array<{
    value?: string;
    label?: string;
    time?: string;
    title?: string;
    sub?: string;
    meta?: string;
    category?: string;
  }>;
}

export interface NewsDetail {
  id: string;
  tag: string;
  date: string;
  image: string;
  title: string;
  lead: string;
  category: string;
  sections: NewsSection[];
  related: number[];
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    tag: "festival",
    date: "15 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1024&auto=format&fit=crop",
    title: "MARSAI 2026 dévoile sa sélection officielle de films IA",
    content:
      "Le festival MARSAI dévoile les 24 films en compétition pour sa deuxième édition, avec des œuvres venues de 15 pays différents.",
  },
  {
    id: "2",
    tag: "interview",
    date: "10 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1024&auto=format&fit=crop",
    title: "Rencontre avec K. Okafor, réalisateur de Mémoire Synthétique",
    content:
      "Nous avons rencontré le réalisateur nigérian dont le film explore les frontières entre mémoire humaine et mémoire artificielle.",
  },
  {
    id: "3",
    tag: "technic",
    date: "5 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1024&auto=format&fit=crop",
    title:
      "Les coulisses de la création : outils IA utilisés par les cinéastes",
    content:
      "Plongée dans les outils et techniques d'intelligence artificielle qui ont permis de réaliser les films de cette édition.",
  },
  {
    id: "4",
    tag: "edition",
    date: "1 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1024&auto=format&fit=crop",
    title: "Appel à soumissions pour l'édition 2027",
    content:
      "Les inscriptions pour la prochaine édition du festival MARSAI sont ouvertes dès maintenant.",
  },
  {
    id: "5",
    tag: "festival",
    date: "28 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1024&auto=format&fit=crop",
    title: "Soirée d'ouverture : programme et invités",
    content:
      "Découvrez le programme complet de la soirée d'ouverture du MARSAI Festival qui se tiendra le 20 Juin à Marseille.",
  },
  {
    id: "6",
    tag: "interview",
    date: "20 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1024&auto=format&fit=crop",
    title: "Rencontre avec le jury : regards croisés sur l'IA",
    content:
      "Les membres du jury international partagent leur vision de l'impact de l'IA sur la création cinématographique.",
  },
];

export const tagColors: Record<string, string> = {
  festival: "#f0ece4",
  technic: "#e2d1c3",
  interview: "#d4c4b0",
  edition: "#c4b8a8",
};

export const newsDetailData: Record<number, NewsDetail> = {
  1: {
    id: "1",
    tag: "festival",
    date: "15 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1024&auto=format&fit=crop",
    title: "MARSAI 2026 dévoile sa sélection officielle de films IA",
    lead: "24 films en compétition venus de 15 pays témoignent de l'effervescence créative autour de l'intelligence artificielle appliquée au cinéma.",
    category: "Festival",
    sections: [
      {
        type: "text",
        label: "Sélection",
        title: "Une édition record",
        paragraphs: [
          "Le comité de sélection du MARSAI Festival a reçu plus de 300 candidatures venues du monde entier pour cette deuxième édition. Après plusieurs semaines de délibération, 24 films ont été retenus pour la compétition officielle.",
          "Les œuvres sélectionnées explorent une grande diversité de genres : fiction, documentaire, expérimental, animation. Chaque film a été réalisé avec le concours de technologies d'intelligence artificielle, que ce soit pour la génération d'images, l'écriture scénaristique, ou la composition musicale.",
          "Le jury, présidé par une figure emblématique du cinéma international, remettra ses prix lors de la cérémonie de clôture le 22 Juin.",
        ],
      },
      {
        type: "stats",
        label: "Chiffres clés",
        items: [
          { value: "300+", label: "Candidatures reçues" },
          { value: "24", label: "Films sélectionnés" },
          { value: "15", label: "Pays représentés" },
          { value: "60s", label: "Durée maximale" },
        ],
      },
      {
        type: "quote",
        text: "Cette sélection démontre que l'IA n'est pas une menace pour la créativité, mais un nouvel outil au service des cinéastes du monde entier.",
        author: "Direction artistique du MARSAI Festival",
      },
      {
        type: "text",
        label: "Programme",
        title: "Une semaine de découvertes",
        paragraphs: [
          "Les 24 films sélectionnés seront projetés tout au long du festival dans les différentes salles du Palais des Festivals de Marseille. Des sessions de questions-réponses avec les réalisateurs seront organisées après chaque projection.",
          "Le programme complet sera dévoilé prochainement sur cette page et sur nos réseaux sociaux.",
        ],
      },
    ],
    related: [2, 5],
  },
  2: {
    id: "2",
    tag: "interview",
    date: "10 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1024&auto=format&fit=crop",
    title: "Rencontre avec K. Okafor, réalisateur de Mémoire Synthétique",
    lead: "Le cinéaste nigérian nous parle de son processus créatif et de la place de l'IA dans son travail.",
    category: "Interview",
    sections: [
      {
        type: "text",
        label: "Entretien",
        title: "De Lagos à Marseille",
        paragraphs: [
          "K. Okafor est un jeune réalisateur nigérian dont le premier court-métrage, Mémoire Synthétique, a été sélectionné pour la compétition officielle du MARSAI Festival 2026. Nous l'avons rencontré pour parler de son parcours et de sa vision du cinéma augmenté par l'IA.",
          "Son film explore les souvenirs d'un personnage dont la mémoire a été partiellement numérisée, brouillant les frontières entre le vécu et le généré.",
        ],
      },
      {
        type: "quote",
        text: "L'IA me permet de visualiser ce que mon imagination seule ne pourrait pas produire. C'est un collaborateur, pas un remplaçant.",
        author: "K. Okafor, réalisateur",
      },
      {
        type: "text",
        label: "Processus",
        title: "Une création hybride",
        paragraphs: [
          "Pour Mémoire Synthétique, Okafor a utilisé une combinaison de prises de vue réelles et de séquences générées par IA. Le scénario a été écrit en collaboration avec un modèle de langage, puis retravaillé manuellement pour lui donner sa sensibilité unique.",
          "Le résultat est une œuvre visuellement saisissante qui interroge notre rapport à la technologie et à la mémoire.",
        ],
      },
    ],
    related: [1, 6],
  },
  3: {
    id: "3",
    tag: "technic",
    date: "5 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1024&auto=format&fit=crop",
    title:
      "Les coulisses de la création : outils IA utilisés par les cinéastes",
    lead: "Découvrez les technologies qui ont permis aux réalisateurs de donner vie à leurs visions créatives.",
    category: "Technique",
    sections: [
      {
        type: "text",
        label: "Technologies",
        title: "Une palette d'outils variée",
        paragraphs: [
          "Les films sélectionnés au MARSAI Festival 2026 utilisent une grande variété d'outils d'intelligence artificielle. De la génération d'images par diffusion aux modèles de langage pour l'écriture, en passant par la composition musicale assistée par IA, chaque réalisateur a su tirer parti des technologies disponibles.",
          "Certains ont utilisé des outils grand public comme Midjourney ou Runway, tandis que d'autres ont développé leurs propres modèles sur mesure.",
        ],
      },
      {
        type: "program",
        label: "Ateliers techniques",
        items: [
          {
            time: "14:00",
            title: "Introduction à la génération vidéo par IA",
            sub: "Session pratique avec Runway",
          },
          {
            time: "15:30",
            title: "Composer une bande originale avec l'IA",
            sub: "Démonstration par un compositeur",
          },
          {
            time: "17:00",
            title: "Du scénario à l'écran : workflow IA",
            sub: "Masterclass par un réalisateur sélectionné",
          },
        ],
      },
    ],
    related: [1],
  },
  4: {
    id: "4",
    tag: "edition",
    date: "1 Juin 2026",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1024&auto=format&fit=crop",
    title: "Appel à soumissions pour l'édition 2027",
    lead: "Les inscriptions pour la prochaine édition du festival MARSAI sont ouvertes dès maintenant.",
    category: "Édition",
    sections: [
      {
        type: "text",
        label: "Soumettre",
        title: "Comment participer ?",
        paragraphs: [
          "Vous êtes un créateur utilisant l'IA dans votre processus de réalisation ? Le MARSAI Festival vous ouvre ses portes pour l'édition 2027. Les soumissions sont ouvertes jusqu'au 28 février 2027.",
          "Les films doivent avoir une durée maximale de 60 secondes et intégrer l'IA de manière significative dans leur processus de création. La participation est gratuite et ouverte à tous, professionnels comme amateurs.",
        ],
      },
      {
        type: "list",
        label: "Critères d'éligibilité",
        items: [
          "Film d'une durée maximale de 60 secondes",
          "Utilisation notable de l'IA dans le processus créatif",
          "Aucune restriction de genre ou de format",
          "Les films peuvent être en toute langue (sous-titres français requis)",
          "Date limite de soumission : 28 février 2027",
        ],
      },
    ],
    related: [1, 5],
  },
  5: {
    id: "5",
    tag: "festival",
    date: "28 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1024&auto=format&fit=crop",
    title: "Soirée d'ouverture : programme et invités",
    lead: "Le MARSAI Festival 2026 débutera en grande pompe le 20 Juin à Marseille.",
    category: "Festival",
    sections: [
      {
        type: "text",
        label: "Ouverture",
        title: "Une soirée inaugurale",
        paragraphs: [
          "La soirée d'ouverture du MARSAI Festival se tiendra le 20 Juin 2026 à partir de 19h au Palais des Festivals de Marseille. Cet événement rassemblera les cinéastes, les membres du jury, les partenaires et le public pour célébrer le début de cette deuxième édition.",
          "La soirée sera animée par une personnalité du monde du cinéma et comprendra une projection spéciale, des performances live et un cocktail de réseautage.",
        ],
      },
      {
        type: "films",
        label: "Au programme",
        items: [
          {
            title: "Film d'ouverture",
            meta: "Inédit · Avant-première",
            category: "Projection spéciale",
          },
          {
            title: "Performance IA live",
            meta: "Artiste invité",
            category: "Performance",
          },
        ],
      },
    ],
    related: [1, 2],
  },
  6: {
    id: "6",
    tag: "interview",
    date: "20 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1024&auto=format&fit=crop",
    title: "Rencontre avec le jury : regards croisés sur l'IA",
    lead: "Les cinq membres du jury international partagent leur vision de l'IA dans le cinéma.",
    category: "Interview",
    sections: [
      {
        type: "text",
        label: "Jury",
        title: "Un panel d'experts",
        paragraphs: [
          "Le jury du MARSAI Festival 2026 réunit cinq personnalités aux parcours complémentaires : réalisateurs, chercheurs en IA, critiques de cinéma et artistes numériques. Nous avons recueilli leurs impressions sur l'état de l'art et les perspectives offertes par l'IA dans le domaine cinématographique.",
          "Tous s'accordent sur un point : l'IA ouvre des possibilités créatives inédites, mais le regard humain reste indispensable pour donner du sens à l'œuvre.",
        ],
      },
      {
        type: "quote",
        text: "Ce qui m'impressionne le plus, c'est la diversité des approches. Chaque film utilise l'IA d'une manière différente, révélant la personnalité de son créateur.",
        author: "Membre du jury MARSAI 2026",
      },
      {
        type: "text",
        label: "Délibérations",
        title: "Des critères exigeants",
        paragraphs: [
          "Le jury évaluera les films selon plusieurs critères : la qualité artistique, la maîtrise technique, l'originalité du propos, et la pertinence de l'utilisation de l'IA. Les prix seront remis lors de la cérémonie de clôture le 22 Juin.",
        ],
      },
    ],
    related: [1, 2],
  },
};
