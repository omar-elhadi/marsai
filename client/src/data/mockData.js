// Ce fichier simule la réponse de ton futur Backend
export const MOCK_FILMS = [
  {
    id: 1,
    title: "Les Ombres du Passé",
    director: "Sarah Connor",
    email: "sarah@skynet.com",
    country: "France",
    status: "PENDING", // ENUM: PENDING, APPROVED, REJECTED, TO_MODIFY
    submittedAt: "2023-10-24T10:00:00Z",
    youtubeUrl: "https://youtu.be/xyz123",
    rating: null, // Pas encore noté
    aiTools: "Midjourney, Runway Gen-2",
  },
  {
    id: 2,
    title: "Neon Dreams",
    director: "John Doe",
    email: "john@doe.com",
    country: "USA",
    status: "APPROVED",
    submittedAt: "2023-10-23T14:30:00Z",
    youtubeUrl: "https://youtu.be/abc456",
    rating: 8.5, // Note moyenne
    aiTools: "DALL-E 3, Pika Labs",
  },
  {
    id: 3,
    title: "Echoes of Silence",
    director: "Maria Garcia",
    email: "maria@cine.es",
    country: "Spain",
    status: "REJECTED",
    submittedAt: "2023-10-20T09:15:00Z",
    youtubeUrl: "https://youtu.be/def789",
    rating: 2.0,
    aiTools: "Stable Diffusion",
  },
  {
    id: 4,
    title: "Cyber Apero",
    director: "Antoine Daniel",
    email: "antoine@lool.fr",
    country: "France",
    status: "TO_MODIFY", // Demande de modif
    submittedAt: "2023-10-25T16:45:00Z",
    youtubeUrl: "https://youtu.be/ghi012",
    rating: null,
    aiTools: "Kaiber",
  },
];

export const KPI_STATS = {
  total: 42,
  pending: 12,
  approved: 8,
  rejected: 5,
};

// DONNÉES STATIQUES GALERIE — Fallback pour développement
// ─────────────────────────────────────────────────────────────
export const GALLERY_MOVIES = [
  {
    id: 1,
    title: "L'Aube Synthétique",
    director: "Elena Rostova",
    category: "Fiction",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
  {
    id: 2,
    title: "Mémoire Latente",
    director: "Kaelen & I.A. Core",
    category: "Expérimental",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
  {
    id: 3,
    title: "Racines de Silicium",
    director: "Studio Horizon",
    category: "Documentaire",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
  {
    id: 4,
    title: "Écho Humain",
    director: "Collectif 2026",
    category: "Fiction",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
  {
    id: 5,
    title: "Fragments du Futur",
    director: "Nadia Volkov",
    category: "Expérimental",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "youtube",
  },
  {
    id: 6,
    title: "La Dernière Image",
    director: "Marc Tessier",
    category: "Documentaire",
    img: "https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
  {
    id: 7,
    title: "Protocole Lumière",
    director: "Amara Diallo",
    category: "Fiction",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "youtube",
  },
  {
    id: 8,
    title: "Signal Perdu",
    director: "Yuki Tanaka",
    category: "Expérimental",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    videoUrl: null,
    videoSource: "s3",
  },
];
