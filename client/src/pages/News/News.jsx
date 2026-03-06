/**
 * News.jsx — MARSAI Festival
 * Page Actualités — Bento Grid
 *
 * ═══════════════════════════════════════════════════════════════
 * SÉPARATION DES RESPONSABILITÉS
 * ═══════════════════════════════════════════════════════════════
 *
 * News.module.css → tous les styles statiques + responsive
 *
 * Ce qui reste en JS :
 *   tagColors lookup  → CSS variable --tag-color posée sur .card
 *   backgroundImage   → style={{}} sur divs image (par carte)
 *
 * Supprimés :
 *   useState(hovered) + onMouseEnter/Leave → :hover CSS pur
 *   titleFontSizes + descFontSizes → data-text-size selectors
 *   import News.css global → remplacé par News.module.css
 *   bento-card--hovered → .card:hover en CSS module
 *
 * ═══════════════════════════════════════════════════════════════
 * INLINE STYLES RESTANTS — justification
 * ═══════════════════════════════════════════════════════════════
 *
 * style={{ '--tag-color': tagColor }} — sur chaque .card
 *   Valeur calculée depuis tagColors[item.tag] par carte.
 *   CSS module lit var(--tag-color) pour .tag et .readMoreLabel.
 *   color-mix() dans le CSS gère l'alpha du border (remplace ${hex}33).
 *
 * style={{ backgroundImage: `url(${item.image})` }} — sur .bg / .imgHorizontal
 *   URL par carte, donnée runtime — non extractible en classe statique.
 * ═══════════════════════════════════════════════════════════════
 */

import styles from './News.module.css';

// ─── Données ──────────────────────────────────────────────────

const newsData = [
  {
    id: 1,
    category: 'Ouverture',
    date:     '18 mars 2026',
    tag:      'À LA UNE',
    image:    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    title:    'Ouverture du Festival IA 2026',
    content:  'Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.',
    size:     'large',
  },
  {
    id: 2,
    category: 'Sélection',
    date:     '19 mars 2026',
    tag:      'OFFICIEL',
    image:    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    title:    'Sélection Officielle',
    content:  '40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.',
    size:     'medium',
  },
  {
    id: 3,
    category: 'Débats',
    date:     '20 mars 2026',
    tag:      'TABLES RONDES',
    image:    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    title:    'Tables Rondes & Débats',
    content:  "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d'auteur et de la transparence algorithmique.",
    size:     'medium',
  },
  {
    id: 4,
    category: 'Cérémonie',
    date:     '21 mars 2026',
    tag:      'PALMARÈS',
    image:    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop',
    title:    'Prix IA 2026',
    content:  'Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture.',
    size:     'small',
  },
  {
    id: 5,
    category: 'Expositions',
    date:     '19–21 mars 2026',
    tag:      'EXPO',
    image:    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop',
    title:    'Galerie des Œuvres Génératives',
    content:  "Une sélection d'installations immersives créées entièrement par des modèles diffusion, exposées sur la Croisette.",
    size:     'small',
  },
  {
    id: 6,
    category: 'Masterclass',
    date:     '20 mars 2026',
    tag:      'MASTERCLASS',
    image:    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
    title:    'IA & Réalisation : Le futur du cinéma',
    content:  'Une session exclusive avec les pionniers du cinéma IA pour explorer les nouvelles frontières de la narration visuelle.',
    size:     'wide',
  },
];

// Couleurs par tag — lookup JS nécessaire (valeur par item, runtime).
// Injecté en CSS variable --tag-color sur chaque carte.
// CSS module lit var(--tag-color) pour .tag et .readMoreLabel.
// color-mix(in srgb, var(--tag-color) 20%, transparent) gère l'alpha du border.
const tagColors = {
  'À LA UNE':      '#e8d5a3',
  'OFFICIEL':      '#a3c4e8',
  'TABLES RONDES': '#a3e8c4',
  'PALMARÈS':      '#e8a3a3',
  'EXPO':          '#c4a3e8',
  'MASTERCLASS':   '#e8c4a3',
};


// ─── BentoCard ────────────────────────────────────────────────
//
// Props :
//   item       — données de l'article
//   gridClass  — clé CSS module : "cardHero" | "cardMed1" | ...
//   textSize   — "large" | "medium" | "small"
//   horizontal — true pour la carte wide (layout côte à côte)
//
// Supprimés vs version originale :
//   hovered + setHovered → CSS :hover (wrapped @media hover:hover)
//   onMouseEnter/Leave   → idem
//   isHovered conditionnels sur les classes → .card:hover .child

function BentoCard({ item, gridClass, textSize, horizontal }) {
  const tagColor = tagColors[item.tag] || '#f0ece4';

  const cardClass = [
    styles.card,
    styles[gridClass],
    horizontal ? styles.cardHorizontal : styles.cardVertical,
    textSize === 'large' && !horizontal ? styles.cardLarge : '',
  ].filter(Boolean).join(' ');

  return (
    // --tag-color : seule CSS variable inline sur la carte.
    // backgroundImage appliqué uniquement sur les divs image ci-dessous.
    <div className={cardClass} style={{ '--tag-color': tagColor }}>

      {horizontal ? (
        /* ── Layout horizontal (carte wide / masterclass) ─────
           Comportement responsive géré entièrement par le CSS module :
             < 640px  → flex-direction: column (image au-dessus)
             ≥ 640px  → flex-direction: row (image à gauche)
           Transition fluide sans media query JS. */
        <>
          {/* Image gauche — backgroundImage seul inline */}
          <div
            className={styles.imgHorizontal}
            style={{ backgroundImage: `url(${item.image})` }}
          />

          {/* Contenu droit (ou bas sur mobile) */}
          <div className={styles.contentHorizontal}>
            <div className={styles.meta}>
              <span className={styles.tag}>{item.tag}</span>
              <span className={styles.date}>{item.date}</span>
            </div>

            {/* data-text-size → CSS module gère font-size via sélecteur attribut */}
            <h2 className={styles.title} data-text-size={textSize}>
              {item.title}
            </h2>

            {/* La condition textSize !== 'small' est logique (pas de style) — reste en JSX */}
            {textSize !== 'small' && (
              <p className={styles.desc} data-text-size={textSize}>
                {item.content}
              </p>
            )}

            {/* readMore — révélé par .card:hover .readMore dans le CSS module */}
            <div className={styles.readMore}>
              <span className={styles.readMoreLabel}>LIRE →</span>
            </div>
          </div>
        </>

      ) : (
        /* ── Layout vertical (hero, medium, small) ────────────
           Image en fond absolu, overlay gradient, contenu ancré en bas. */
        <>
          {/* Image de fond — backgroundImage seul inline */}
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${item.image})` }}
          />

          {/* Overlay gradient — assombrit le bas pour la lisibilité du texte */}
          <div className={styles.overlay} />

          {/* Contenu texte */}
          <div className={`${styles.content} ${textSize === 'large' ? styles.contentLarge : ''}`}>
            <div className={styles.meta}>
              <span className={styles.tag}>{item.tag}</span>
              <span className={styles.date}>{item.date}</span>
            </div>

            <h2 className={styles.title} data-text-size={textSize}>
              {item.title}
            </h2>

            {textSize !== 'small' && (
              <p className={styles.desc} data-text-size={textSize}>
                {item.content}
              </p>
            )}

            <div className={styles.readMore}>
              <span className={styles.readMoreLabel}>LIRE →</span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}


// ─── Page principale ──────────────────────────────────────────

export default function NewsBento() {
  return (
    <div className={styles.root}>

      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Actualités</h1>
        </div>
      </header>

      {/* BENTO GRID
          Responsive mobile-first — transitions fluides entre formats :
            320px  → 1 colonne, stack vertical
            640px  → 2 colonnes
            768px  → 4 colonnes, bento commence
            1024px → 12 colonnes, bento complet
            1440px → padding élargi
            2560px → max-width 2800px, typographie++ */}
      <main className={styles.grid}>

        {/* CARD 1 — Hero large : 7 cols × 2 rangées (lg) */}
        <BentoCard
          item={newsData[0]}
          gridClass="cardHero"
          textSize="large"
        />

        {/* CARD 2 — Medium : 5 cols × 1 rangée (lg) */}
        <BentoCard
          item={newsData[1]}
          gridClass="cardMed1"
          textSize="medium"
        />

        {/* CARD 3 — Medium : 5 cols × 1 rangée (lg) */}
        <BentoCard
          item={newsData[2]}
          gridClass="cardMed2"
          textSize="medium"
        />

        {/* CARD 6 — Wide horizontal : 8 cols × 1 rangée (lg) */}
        <BentoCard
          item={newsData[5]}
          gridClass="cardWide"
          textSize="medium"
          horizontal
        />

        {/* CARD 4 — Small : 2 cols × 1 rangée (lg) */}
        <BentoCard
          item={newsData[3]}
          gridClass="cardSmall1"
          textSize="small"
        />

        {/* CARD 5 — Small : 2 cols × 1 rangée (lg) */}
        <BentoCard
          item={newsData[4]}
          gridClass="cardSmall2"
          textSize="small"
        />

      </main>

      {/* Grain overlay — texture de surface globale, fixed */}
      <div className={styles.grain} />

    </div>
  );
}