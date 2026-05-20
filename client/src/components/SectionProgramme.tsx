/**
 * SectionProgramme.jsx — MARSAI Festival
 * Phase 3 — "Le Protocole Temporel"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Grille éditoriale sombre, typographie pure
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Après la vision (Thème), la réalité concrète.
 *   Chaque événement est une entrée dans un registre —
 *   sobre, informative, élégante.
 *   Aucune image : la typographie porte tout le poids.
 *   Le bord gauche accent au hover révèle la profondeur.
 *
 * Composition :
 *   Fond bg-bg-pure — section sur fond pur comme le Manifeste
 *   Overline "Festival des Cinéastes I.A." + filet
 *   Titre massif "Le Protocole Temporel"
 *   Grille 2×2 desktop, 1 col mobile
 *   Chaque carte :
 *     - Index sable en haut gauche
 *     - Tag catégorie
 *     - Titre événement (title-card)
 *     - Ligne date + heure
 *     - Description body-meta
 *     - Bord gauche accent au hover (scaleY 0→1)
 *
 * Animation GSAP ScrollTrigger :
 *   Cartes : opacity:0 + y:40 → opacity:1 + y:0
 *   Stagger : 120ms entre chaque carte
 *   Hover bord gauche : CSS transition (pas GSAP — performance)
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES — Les événements du festival
// Remplacer par un appel API en production
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Champs image ajoutés — Kodawari :
//   img         → URL Unsplash q=88, w=1200 (ratio 16/7 en CSS)
//   imgAlt      → description accessible précise
//   imgPosition → object-position fine-tunée par image
// Chaque image choisie pour sa correspondance sémantique
// avec le contenu de l'événement, pas son esthétique seule.
// ─────────────────────────────────────────────────────────────
const EVENTS = [
  {
    index: "01",
    categorie: "Atelier",
    titre: "Masterclass Sora",
    date: "20 Juin 2026",
    heure: "10h00 — 13h00",
    description:
      "Exploration approfondie de Sora et des modèles de génération vidéo de nouvelle génération. Techniques avancées de prompting cinématographique.",
    lien: "/events#masterclass-sora",
    // Salle d'atelier, participants autour d'écrans — création collective
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=88&w=1200&auto=format&fit=crop",
    imgAlt: "Participants en atelier Masterclass Sora — MARSAI Festival",
    imgPosition: "center 40%",
  },
  {
    index: "02",
    categorie: "Démo",
    titre: "Prompt Engineering",
    date: "20 Juin 2026",
    heure: "15h00 — 17h30",
    description:
      "Démonstration en direct des meilleures pratiques de prompt engineering appliquées à la narration visuelle et à la direction artistique IA.",
    lien: "/events#prompt-engineering",
    // Laptop ouvert dans l'obscurité, lumière d'écran — précision technique et intimité créative
    img: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=88&w=1200&auto=format&fit=crop",
    imgAlt:
      "Interface créative sur écran — démonstration Prompt Engineering MARSAI",
    imgPosition: "center 50%",
  },
  {
    index: "03",
    categorie: "Exposition",
    titre: "Galerie des Émotions",
    date: "21 Juin 2026",
    heure: "Accès libre — 9h00 à 20h00",
    description:
      "Parcours immersif à travers les 50 films finalistes. Chaque œuvre est présentée avec la chaîne de prompts ayant conduit à sa création.",
    lien: "/galerie",
    // Couloir de musée/galerie avec éclairage d'accrochage — espace contemplatif
    img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=88&w=1200&auto=format&fit=crop",
    imgAlt: "Espace d'exposition immersif — Galerie des Émotions MARSAI",
    imgPosition: "center 35%",
  },
  {
    index: "04",
    categorie: "Concert",
    titre: "Concert Suno AI",
    date: "22 Juin 2026",
    heure: "21h00 — 23h30",
    description:
      "Clôture du festival par une performance musicale entièrement composée et arrangée par intelligence artificielle. Une expérience sensorielle inédite.",
    lien: "/events#concert-suno",
    // Scène de concert, lumières dramatiques, foule dans le noir — émotion collective
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=88&w=1200&auto=format&fit=crop",
    imgAlt:
      "Performance musicale IA sous les lumières — Concert Suno AI MARSAI",
    imgPosition: "center 45%",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function SectionProgramme() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── États initiaux ──────────────────────────────────────
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      gsap.set(titleRef.current, { opacity: 0, y: 30 });

      const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
      gsap.set(cards, { opacity: 0, y: 40 });

      // ── ScrollTrigger ───────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter() {
          const tl = gsap.timeline();

          tl.to(overlineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          });

          tl.to(
            titleRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
            },
            0.15,
          );

          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
            },
            0.4,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="programme"
      aria-label="Programme du festival MARSAI"
      style={{
        background: "var(--color-bg-pure)",
        borderTop: "1px solid var(--color-border)",
        padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Overline ──────────────────────────────────── */}
        <div
          ref={overlineRef}
          className="flex items-center gap-4 mb-10 md:mb-14"
        >
          <span
            style={{
              display: "block",
              width: "clamp(2rem, 3vw, 3rem)",
              height: "1px",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          />
          <span className="label-overline">Festival des Cinéastes I.A.</span>
        </div>

        {/* ── Titre ─────────────────────────────────────── */}
        <h2
          ref={titleRef}
          className="title-section"
          style={{ marginBottom: "clamp(3.5rem, 7vw, 6rem)" }}
        >
          Le Protocole
          <br />
          <span style={{ color: "var(--color-accent)" }}>Temporel</span>
        </h2>

        {/* ── Grille des événements ─────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(1px, 0.2vw, 2px)" }}
        >
          {EVENTS.map(
            ({
              index,
              categorie,
              titre,
              date,
              heure,
              description,
              lien,
              img,
              imgAlt,
              imgPosition,
            }) => (
              <a
                key={index}
                href={lien}
                className="event-card group"
                style={{
                  display: "block",
                  position: "relative",
                  /* padding retiré du <a> — l'image est pleine largeur en tête
                   de carte. Le padding vit sur .eventCardContent ci-dessous. */
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                  textDecoration: "none",
                  transition: "background var(--duration-base) var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-surface-high)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                }}
              >
                {/* Bord gauche accent — révélé au hover via CSS transform.
                  Position absolute sur la <a> entière — couvre l'image et le contenu. */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "2px",
                    height: "100%",
                    background: "var(--color-accent)",
                    transform: "scaleY(0)",
                    transformOrigin: "bottom center",
                    transition: "transform 0.25s var(--ease-out)",
                    zIndex: 10,
                  }}
                  className="card-border-left"
                />

                {/* ── Image de l'événement ─────────────────────────────
                  Ratio 16/7 — présence visuelle sans dominer le texte.
                  object-fit:cover + objectPosition fine-tunée par image.
                  Gradient de fondu bas — l'image se dissout doucement
                  dans la couleur de fond de la carte, sans coupure.
                  scale + transition : zoom subtil au hover de la carte.
                  overflow:hidden sur le wrapper capture ce zoom.       */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 7",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt={imgAlt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: imgPosition,
                      display: "block",
                      transition: "transform 700ms var(--ease-out)",
                    }}
                    className="event-card-img"
                  />
                  {/* Fondu bas — dissout l'image dans la surface de la carte */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "55%",
                      /* Gradient vers --color-bg-pure (fond absolu) plutôt que --color-surface :
                       sur hover, la carte passe à --color-surface-high. Pointer le gradient vers
                       le fond de la page garantit une transition imperceptible quelle que soit
                       la couleur de la carte. L'image se dissout toujours proprement. */
                      background:
                        "linear-gradient(to bottom, transparent 0%, var(--color-bg-pure) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* ── Contenu textuel — padded, sous l'image ──────── */}
                <div style={{ padding: "clamp(1.5rem, 2.8vw, 2.5rem)" }}>
                  {/* En-tête : index + catégorie ─────────────── */}
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: "clamp(1.5rem, 2.5vw, 2rem)" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 900,
                        fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)",
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      {index}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "clamp(0.6rem, 0.85vw, 0.68rem)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                        padding: "0.25em 0.7em",
                        borderRadius: "var(--radius-pill)",
                      }}
                    >
                      {categorie}
                    </span>
                  </div>

                  {/* Titre événement ─────────────────────────── */}
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 800,
                      fontSize: "clamp(1.2rem, 2.2vw, 1.75rem)",
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      lineHeight: 1.1,
                      color: "var(--color-text)",
                      marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
                      transition: "color var(--duration-base) var(--ease-out)",
                    }}
                  >
                    {titre}
                  </h3>

                  {/* Séparateur fin ─────────────────────────── */}
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid var(--color-border)",
                      marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
                    }}
                  />

                  {/* Date + heure ────────────────────────────── */}
                  <div
                    className="flex items-center gap-3"
                    style={{ marginBottom: "clamp(0.75rem, 1.5vw, 1rem)" }}
                  >
                    {/* Icône horloge minimaliste SVG */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      style={{ flexShrink: 0, opacity: 0.45 }}
                    >
                      <circle
                        cx="6"
                        cy="6"
                        r="5"
                        stroke="var(--color-accent)"
                        strokeWidth="1"
                      />
                      <path
                        d="M6 3.5V6L7.5 7.5"
                        stroke="var(--color-accent)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        fontSize: "clamp(0.68rem, 1vw, 0.75rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {date} — {heure}
                    </span>
                  </div>

                  {/* Description ─────────────────────────────── */}
                  <p className="body-meta" style={{ lineHeight: 1.65 }}>
                    {description}
                  </p>

                  {/* Flèche de navigation ────────────────────── */}
                  <div
                    style={{
                      marginTop: "clamp(1.5rem, 2.5vw, 2rem)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: 0.5,
                      transition:
                        "opacity var(--duration-base) var(--ease-out)",
                    }}
                    className="card-arrow"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      Voir l'événement
                    </span>
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 4H13M10 1L13 4L10 7"
                        stroke="var(--color-accent)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                {/* fin .eventCardContent */}
              </a>
            ),
          )}
        </div>
      </div>

      {/* ── Styles CSS hover — bord gauche + flèche ──────────────
          Isolés ici pour ne pas polluer les fichiers globaux.
          Propres à ce composant uniquement.
          ────────────────────────────────────────────────────── */}
      <style>{`
        .event-card:hover .card-border-left {
          transform: scaleY(1);
        }
        .event-card:hover .card-arrow {
          opacity: 1;
        }
        .event-card:hover h3 {
          color: var(--color-accent);
        }
        /* Zoom subtil sur l'image au hover de la carte.
           Capturé par overflow:hidden du wrapper image.
           700ms ease-out — même timing que les autres transitions. */
        .event-card:hover .event-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
}
