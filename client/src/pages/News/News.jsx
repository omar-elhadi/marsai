import React, { useState } from "react";
import "@/styles/Variables.css";
import "@/styles/Typography.css";
import "@/styles/News.css";

// ─── Données ──────────────────────────────────────────────────────────────────

const newsData = [
  {
    id: 1,
    category: "Ouverture",
    date: "18 mars 2026",
    tag: "À LA UNE",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
    title: "Ouverture du Festival IA 2026",
    content: "Le Festival International du Film IA ouvre ses portes à Cannes pour deux jours dédiés au cinéma génératif, aux nouvelles écritures et aux innovations hybrides.",
    size: "large",
  },
  {
    id: 2,
    category: "Sélection",
    date: "19 mars 2026",
    tag: "OFFICIEL",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    title: "Sélection Officielle",
    content: "40 films internationaux explorent la collaboration entre réalisateurs et intelligences artificielles, du script au montage.",
    size: "medium",
  },
  {
    id: 3,
    category: "Débats",
    date: "20 mars 2026",
    tag: "TABLES RONDES",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    title: "Tables Rondes & Débats",
    content: "Experts IA, producteurs et réalisateurs discutent des enjeux éthiques, des droits d'auteur et de la transparence algorithmique.",
    size: "medium",
  },
  {
    id: 4,
    category: "Cérémonie",
    date: "21 mars 2026",
    tag: "PALMARÈS",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    title: "Prix IA 2026",
    content: "Meilleur Film Génératif, Narration Hybride et Innovation Technique seront récompensés lors de la cérémonie de clôture.",
    size: "small",
  },
  {
    id: 5,
    category: "Expositions",
    date: "19–21 mars 2026",
    tag: "EXPO",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
    title: "Galerie des Œuvres Génératives",
    content: "Une sélection d'installations immersives créées entièrement par des modèles diffusion, exposées sur la Croisette.",
    size: "small",
  },
  {
    id: 6,
    category: "Masterclass",
    date: "20 mars 2026",
    tag: "MASTERCLASS",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    title: "IA & Réalisation : Le futur du cinéma",
    content: "Une session exclusive avec les pionniers du cinéma IA pour explorer les nouvelles frontières de la narration visuelle.",
    size: "wide",
  },
];

// Couleurs par tag — valeurs JS dynamiques, impossibles à mettre en CSS statique
const tagColors = {
  "À LA UNE":      "#e8d5a3",
  "OFFICIEL":      "#a3c4e8",
  "TABLES RONDES": "#a3e8c4",
  "PALMARÈS":      "#e8a3a3",
  "EXPO":          "#c4a3e8",
  "MASTERCLASS":   "#e8c4a3",
};

// Tailles de titre selon textSize — dynamiques selon prop
const titleFontSizes = {
  large:  "clamp(1.4rem, 2.5vw, 2.2rem)",
  medium: "1.1rem",
  small:  "0.9rem",
};

// Tailles de description selon textSize — dynamiques selon prop
const descFontSizes = {
  large:  "0.9rem",
  medium: "0.78rem",
};

// ─── BentoCard ────────────────────────────────────────────────────────────────

function BentoCard({ item, gridClass, hovered, setHovered, textSize, horizontal }) {
  const isHovered = hovered === item.id;
  const tagColor  = tagColors[item.tag] || "#f0ece4";

  const cardClasses = [
    "bento-card",
    gridClass,
    horizontal ? "bento-card--horizontal" : "bento-card--vertical",
    textSize === "large" && !horizontal ? "bento-card--large" : "",
    isHovered ? "bento-card--hovered" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setHovered(item.id)}
      onMouseLeave={() => setHovered(null)}
    >
      {horizontal ? (
        <>
          {/* ── Image gauche (horizontal) ── */}
          <div
            className={[
              "bento-card__img-horizontal",
              isHovered ? "bento-card__img-horizontal--hovered" : "",
            ].filter(Boolean).join(" ")}
            style={{ backgroundImage: `url(${item.image})` }}
          />

          {/* ── Contenu droit (horizontal) ── */}
          <div className="bento-card__content-horizontal">
            <div className="bento-card__meta">
              <span
                className="bento-card__tag"
                style={{ color: tagColor, border: `1px solid ${tagColor}33` }}
              >
                {item.tag}
              </span>
              <span className="bento-card__date">{item.date}</span>
            </div>

            <h2
              className="bento-card__title"
              style={{ fontSize: titleFontSizes[textSize] }}
            >
              {item.title}
            </h2>

            {textSize !== "small" && (
              <p
                className="bento-card__desc"
                style={{
                  fontSize: descFontSizes[textSize],
                  WebkitLineClamp: textSize === "large" ? 3 : 2,
                }}
              >
                {item.content}
              </p>
            )}

            <div
              className="bento-card__read-more"
              style={{
                opacity:   isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              <span className="bento-card__read-more-label" style={{ color: tagColor }}>
                LIRE →
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Image de fond (vertical) ── */}
          <div
            className={[
              "bento-card__bg",
              isHovered ? "bento-card__bg--hovered" : "",
            ].filter(Boolean).join(" ")}
            style={{ backgroundImage: `url(${item.image})` }}
          />

          {/* ── Overlay gradient (vertical) ── */}
          <div
            className={[
              "bento-card__overlay",
              isHovered ? "bento-card__overlay--hovered" : "",
            ].filter(Boolean).join(" ")}
          />

          {/* ── Contenu (vertical) ── */}
          <div className={[
            "bento-card__content",
            textSize === "large" ? "bento-card__content--large" : "",
          ].filter(Boolean).join(" ")}>

            <div className="bento-card__meta">
              <span
                className="bento-card__tag"
                style={{ color: tagColor, border: `1px solid ${tagColor}33` }}
              >
                {item.tag}
              </span>
              <span className="bento-card__date">{item.date}</span>
            </div>

            <h2
              className="bento-card__title"
              style={{ fontSize: titleFontSizes[textSize] }}
            >
              {item.title}
            </h2>

            {textSize !== "small" && (
              <p
                className="bento-card__desc"
                style={{
                  fontSize: descFontSizes[textSize],
                  WebkitLineClamp: textSize === "large" ? 3 : 2,
                }}
              >
                {item.content}
              </p>
            )}

            <div
              className="bento-card__read-more"
              style={{
                opacity:   isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              <span className="bento-card__read-more-label" style={{ color: tagColor }}>
                LIRE →
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function NewsBento() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="news-root">

      {/* HEADER */}
      <header className="news-header">
        <div>
          <div className="news-header__eyebrow">
            FESTIVAL INTERNATIONAL DU FILM IA — CANNES
          </div>
          <h1 className="news-header__title">Actualités</h1>
        </div>
        <div className="news-header__meta">
          <div>18 – 21 MARS 2026</div>
          <div>CANNES, FRANCE</div>
          <div className="news-header__meta-articles">6 ARTICLES</div>
        </div>
      </header>

      {/* BENTO GRID */}
      <main className="news-grid">

        {/* CARD 1 — Large hero, 7 cols × 2 rows */}
        <BentoCard
          item={newsData[0]}
          gridClass="news-grid__card--hero"
          hovered={hovered}
          setHovered={setHovered}
          textSize="large"
        />

        {/* CARD 2 — Medium, 5 cols × 1 row */}
        <BentoCard
          item={newsData[1]}
          gridClass="news-grid__card--med1"
          hovered={hovered}
          setHovered={setHovered}
          textSize="medium"
        />

        {/* CARD 3 — Medium, 5 cols × 1 row */}
        <BentoCard
          item={newsData[2]}
          gridClass="news-grid__card--med2"
          hovered={hovered}
          setHovered={setHovered}
          textSize="medium"
        />

        {/* CARD 6 — Wide horizontal, 8 cols × 1 row */}
        <BentoCard
          item={newsData[5]}
          gridClass="news-grid__card--wide"
          hovered={hovered}
          setHovered={setHovered}
          textSize="medium"
          horizontal
        />

        {/* CARD 4 — Small, 2 cols × 1 row */}
        <BentoCard
          item={newsData[3]}
          gridClass="news-grid__card--small1"
          hovered={hovered}
          setHovered={setHovered}
          textSize="small"
        />

        {/* CARD 5 — Small, 2 cols × 1 row */}
        <BentoCard
          item={newsData[4]}
          gridClass="news-grid__card--small2"
          hovered={hovered}
          setHovered={setHovered}
          textSize="small"
        />

      </main>

      {/* Grain overlay */}
      <div className="news-grain" />
    </div>
  );
}