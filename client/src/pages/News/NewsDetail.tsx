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

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ROUTES } from "@/constants/routes";
import { tagColors, newsDetailData } from "@/data/newsData";
import styles from "./NewsDetail.module.css";

// ─── Rendu conditionnel des sections ─────────────────────────

function SectionBlock({
  section,
  tagColor,
}: {
  section: any;
  tagColor: string;
}) {
  switch (section.type) {
    case "text":
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          {section.title && (
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          )}
          {section.paragraphs.map((p: string, i: number) => (
            <p
              key={i}
              className={i === 0 ? styles.paragraphAccent : styles.paragraph}
            >
              {p}
            </p>
          ))}
        </div>
      );

    case "quote":
      return (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{section.text}</p>
          <cite className={styles.quoteAuthor}>{section.author}</cite>
        </blockquote>
      );

    case "list":
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <ul className={styles.list}>
            {section.items.map((item: any, i: number) => (
              <li key={i} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "stats":
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div className={styles.statsGrid}>
            {section.items.map((item: any, i: number) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "program":
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div className={styles.programGrid}>
            {section.items.map((item: any, i: number) => (
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

    case "films":
      return (
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.sectionLine} />
            <span className={styles.sectionLabel}>{section.label}</span>
          </div>
          <div
            className={styles.filmsGrid}
            style={{ "--tag-color": tagColor } as React.CSSProperties}
          >
            {section.items.map((item: any, i: number) => (
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
  const { id } = useParams();
  const article = newsDetailData[Number(id) as keyof typeof newsDetailData];
  const heroRef = useRef(null);
  const bodyRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Entrée GSAP — opacity + y sur hero et body
  useEffect(() => {
    if (!article) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
        },
      );
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
          clearProps: "all",
        },
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

  const tagColor =
    tagColors[article.tag as keyof typeof tagColors] || "#f0ece4";
  const relatedArticles = (article.related || [])
    .map((rid: number) => newsDetailData[rid as keyof typeof newsDetailData])
    .filter(Boolean);

  return (
    <div
      className={styles.page}
      style={{ "--tag-color": tagColor } as React.CSSProperties}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div ref={heroRef} className={styles.hero}>
        {/* Image de fond — backgroundImage inline (URL runtime) */}
        <div
          className={`${styles.heroBg} ${imgLoaded ? styles.heroBgLoaded : ""}`}
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
          {article.sections.map((section: any, i: number) => (
            <SectionBlock key={i} section={section} tagColor={tagColor} />
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
              <span className={styles.infoValue}>
                MARSAI — Marseille, 20–22 Juin 2026
              </span>
            </div>
          </div>

          {/* Articles liés */}
          {relatedArticles.length > 0 && (
            <div className={styles.sidebarBlock}>
              <span className={styles.sidebarTitle}>Articles liés</span>
              <nav className={styles.relatedList} aria-label="Articles liés">
                {relatedArticles.map((related: any) => (
                  <Link
                    key={related.id}
                    to={ROUTES.NEWS_DETAIL.replace(":id", related.id)}
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
              Les soumissions pour l'édition 2026 sont ouvertes jusqu'au 28
              février.
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
