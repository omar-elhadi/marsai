/**
 * SectionAlliances.jsx — MARSAI Festival
 * "Les Architectes du Possible"
 * Refactoring Étape 4 + Logo Slider infini + Cartes expandables
 *
 * ═══════════════════════════════════════════════════════════════
 * MODIFICATIONS — session image/interactivité
 * ═══════════════════════════════════════════════════════════════
 *
 * §A — LOGO SLIDER (enrichi)
 *   Logos SVG monochromes ajoutés au-dessus du nom dans chaque
 *   sliderItem. stroke="currentColor" → hérité de .sliderLogo.
 *   La mécanique d'animation (allianceScroll, translateX(-50%),
 *   piste doublée) est intégralement préservée — zéro touche.
 *
 * §B — CARTES ÉDITORIALES (restructurées)
 *   <a> → <div> : un <button> imbriqué dans un <a> est du HTML
 *   invalide (interactive dans interactive). La conversion est
 *   la seule voie correcte. Le lien "Visiter" est déplacé dans
 *   le panel expandé — il reste accessible et logique.
 *
 *   descLongue dans PARTENAIRES : description étendue révélée
 *   par le bouton Découvrir / Fermer.
 *   max-height: 0 → 20rem — CSS pur, pas de GSAP.
 *   activeCard state : une seule carte ouverte à la fois.
 *   .cardExpand (margin-top: auto) colle le bloc bouton+panel
 *   en bas de carte quelle que soit la hauteur du contenu.
 *
 * §C — LOGOS SVG
 *   Composants fonctionnels React au-dessus des données.
 *   stroke="currentColor" → hérité de .sliderLogo dans le CSS.
 *   Chaque logo représente sémantiquement le domaine du partenaire.
 *
 * ═══════════════════════════════════════════════════════════════
 * RÈGLES MAINTENUES — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Animation slider : CSS pur, jamais GSAP. Préservée intacte.
 * 2. borderLeft carte (i > 0) : dynamique, reste inline. Documenté.
 * 3. GSAP : entrées au scroll uniquement. clearProps: 'all' intact.
 * 4. Accessibilité : aria-expanded, aria-controls, aria-hidden,
 *    tabIndex={-1} sur le lien quand le panel est fermé.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionAlliances.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// §C — LOGOS SVG MONOCHROMES
// stroke="currentColor" — hérité de .sliderLogo (color + opacity).
// Chaque logo représente sémantiquement le domaine du partenaire.
// ─────────────────────────────────────────────────────────────

/* Sora Studio — cadre vidéo + objectif caméra */
function LogoSoraStudio() {
  return (
    <svg
      width="42"
      height="26"
      viewBox="0 0 42 26"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="24"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M25 6L41 2V24L25 20V6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* Anthropic Labs — triangle constitutionnel + ligne de seuil */
function LogoAnthropicLabs() {
  return (
    <svg
      width="28"
      height="26"
      viewBox="0 0 28 26"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 3L26 23H2L14 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9 17H19"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* CNC — bobine de film : cercle + moyeu + rayons */
function LogoCNC() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.8" />
      <path
        d="M14 2V6M14 22V26M2 14H6M22 14H26M5.5 5.5L8.2 8.2M19.8 19.8L22.5 22.5M22.5 5.5L19.8 8.2M8.2 19.8L5.5 22.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* EDF Pulse — onde vitale, ligne d'énergie */
function LogoEDFPulse() {
  return (
    <svg
      width="48"
      height="22"
      viewBox="0 0 48 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 11H9L13 3L19 21L25 7L30 15L34 11H46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DONNÉES PARTENAIRES
// Champs ajoutés :
//   Logo       → composant SVG monochrome du partenaire
//   descLongue → texte étendu révélé dans le panel expandé
// ─────────────────────────────────────────────────────────────
const PARTENAIRES = [
  {
    index: "01",
    nom: "Sora Studio",
    secteur: "Génération Vidéo",
    Logo: LogoSoraStudio,
    desc: "Pionnier de la génération vidéo haute fidélité. Partenaire technologique officiel pour les ateliers du festival.",
    descLongue:
      "Sora Studio repousse les limites de la génération vidéo depuis 2022. Leur moteur de diffusion temporelle permet de créer des séquences cinématographiques cohérentes sur plusieurs minutes — une révolution pour les réalisateurs indépendants. Pour MARSAI, Sora Studio met à disposition ses API en accès anticipé pour les 600 participants du concours.",
    href: "https://sora.com",
  },
  {
    index: "02",
    nom: "Anthropic Labs",
    secteur: "Intelligence Artificielle",
    Logo: LogoAnthropicLabs,
    desc: "Recherche fondamentale en IA responsable. Soutien à la création d'outils narratifs de nouvelle génération.",
    descLongue:
      "Anthropic Labs est à la pointe de la recherche en IA constitutionnelle. Leur travail sur la narrativité générée ouvre de nouveaux territoires pour les créateurs. Pour MARSAI, Anthropic contribue aux outils de direction artistique accessibles à tous les participants, quel que soit leur niveau technique.",
    href: "https://anthropic.com",
  },
  {
    index: "03",
    nom: "CNC",
    secteur: "Soutien au Cinéma",
    Logo: LogoCNC,
    desc: "Centre National du Cinéma et de l'image animée. Reconnaissance officielle du festival dans le paysage culturel français.",
    descLongue:
      "Le CNC apporte sa légitimité institutionnelle à MARSAI. Cette reconnaissance officielle permet aux œuvres primées d'accéder aux dispositifs de soutien du CNC pour leur développement en long-métrage — une passerelle concrète entre la création expérimentale et l'industrie cinématographique française.",
    href: "https://cnc.fr",
  },
  {
    index: "04",
    nom: "EDF Pulse",
    secteur: "Innovation & Énergie",
    Logo: LogoEDFPulse,
    desc: "Programme d'accélération pour les projets culturels innovants. Dotation en infrastructure pour les finalistes.",
    descLongue:
      "EDF Pulse accompagne les projets à l'intersection de la technologie et de la culture depuis 2015. Leur programme dédié à la création numérique offre aux finalistes de MARSAI un accès à des infrastructures de calcul haute performance — indispensables pour les rendus vidéo exigeants de la génération IA.",
    href: "https://edf.fr/pulse",
  },
];

// ─────────────────────────────────────────────────────────────
// §A — LOGO SLIDER — COMPOSANT INTERNE
// ─────────────────────────────────────────────────────────────
// Mécanique inchangée : piste doublée, translateX(-50%), seamless.
// Ajout : logo SVG .sliderLogo au-dessus du nom dans chaque item.
// ─────────────────────────────────────────────────────────────
function LogoSlider() {
  /* SliderItems rendu deux fois pour la boucle seamless CSS. */
  const SliderItems = () => (
    <>
      {PARTENAIRES.map(({ index, nom, secteur, Logo }) => (
        <div key={index} className={styles.sliderItem} aria-hidden="true">
          {/* Logo SVG monochrome — color hérité de .sliderLogo */}
          <span className={styles.sliderLogo}>
            <Logo />
          </span>
          <span className={styles.sliderName}>{nom}</span>
          <span className={styles.sliderSector}>{secteur}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className={styles.sliderWrapper} aria-hidden="true">
      {/*
        .sliderTrack contient les items deux fois.
        @keyframes allianceScroll : translateX(0 → -50%).
        Quand la piste a parcouru 50% de sa largeur totale,
        elle est revenue exactement à son point de départ.
        Boucle invisible — aucun saut.
      */}
      <div className={styles.sliderTrack}>
        <SliderItems /> {/* Piste originale */}
        <SliderItems /> {/* Duplicata — boucle seamless */}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function SectionAlliances() {
  const { t } = useTranslation("common");
  const sectionRef = useRef<any>(null);
  const overlineRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const sliderRef = useRef<any>(null);
  const gridRef = useRef<any>(null);

  // ── activeCard : index string du partenaire dont le panel
  // est ouvert. null = toutes les cartes fermées.
  // Une seule ouverte à la fois — clarté éditoriale.
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useGSAP(
    () => {
      // ── États initiaux ─────────────────────────────────────────
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      gsap.set(titleRef.current, { opacity: 0, y: 28 });
      gsap.set(sliderRef.current, { opacity: 0 });

      const cols = gridRef.current ? Array.from(gridRef.current.children) : [];
      gsap.set(cols, { opacity: 0, y: 35 });

      // ── ScrollTrigger ─────────────────────────────────────────
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
            0.12,
          );

          // clearProps: 'opacity' — l'animation CSS reprend le contrôle
          tl.to(
            sliderRef.current,
            {
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              clearProps: "opacity",
            },
            0.3,
          );

          // clearProps: 'all' — hover CSS du module reprend le contrôle
          tl.to(
            cols,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              clearProps: "all",
            },
            0.45,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="partenaires"
      aria-label="Partenaires et alliances du festival MARSAI"
      className={styles.section}
    >
      <div className={styles.container}>
        {/* ── Overline ───────────────────────────────────────── */}
        <div ref={overlineRef} className={styles.overlineRow}>
          <span className={styles.overlineLine} aria-hidden="true" />
          <span className="label-overline">Partenaires Officiels</span>
        </div>

        {/* ── Titre ──────────────────────────────────────────── */}
        <h2 ref={titleRef} className={`title-section ${styles.title}`}>
          Les Architectes
          <br />
          <span className={styles.titleAccent}>du Possible</span>
        </h2>
      </div>

      {/* ── §A : Logo Slider ─────────────────────────────────────
          Hors du container — bord à bord.
          aria-hidden : décoratif, contenu lu dans les cartes §B. */}
      <div ref={sliderRef}>
        <LogoSlider />
      </div>

      {/* ── §B : Cartes éditoriales ───────────────────────────────
          Dans le container pour l'alignement.
          Converties de <a> en <div> :
          un <button> dans un <a> = HTML invalide. */}
      <div className={styles.container}>
        <div ref={gridRef} className={styles.grid}>
          {PARTENAIRES.map(
            ({ index, nom, secteur, desc, descLongue, href }, i) => {
              const isOpen = activeCard === index;

              return (
                <div
                  key={index}
                  className={styles.card}
                  aria-label={`Partenaire ${nom} — ${secteur}`}
                  style={{
                    /* borderLeft calculé depuis l'index i.
                     Dynamique — inline documenté. */
                    borderLeft:
                      i > 0 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  {/* Numéro décoratif — arrière-plan profond */}
                  <span className={styles.cardIndex} aria-hidden="true">
                    {index}
                  </span>

                  {/* Index small */}
                  <span className={styles.cardNum} aria-hidden="true">
                    {index}
                  </span>

                  {/* Nom */}
                  <h3 className={styles.cardName}>{nom}</h3>

                  {/* Secteur */}
                  <span className="label-category">{secteur}</span>

                  {/* Filet */}
                  <hr className={styles.cardHr} />

                  {/* Description courte — toujours visible */}
                  <p className={`body-meta ${styles.cardDesc}`}>{desc}</p>

                  {/* ── Expand block ───────────────────────────────
                    .cardExpand : margin-top:auto → colle en bas
                    de carte quelle que soit la hauteur du contenu.
                    Bouton et panel ensemble dans un seul wrapper
                    → un seul gap appliqué par le flex parent. */}
                  <div className={styles.cardExpand}>
                    {/* Bouton Découvrir / Fermer */}
                    <button
                      className={`${styles.cardBtn} ${isOpen ? styles.cardBtnOpen : ""}`}
                      onClick={() => setActiveCard(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`alliance-desc-${index}`}
                    >
                      <span>{isOpen ? "Fermer" : "Découvrir"}</span>
                      {/* Chevron — pivoté 180° à l'ouverture via CSS */}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                        className={`${styles.cardBtnChevron} ${isOpen ? styles.cardBtnChevronOpen : ""}`}
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    {/* Panel description étendue ──────────────────
                      max-height: 0 → 20rem via classe CSS.
                      CSS ne peut pas animer vers height:auto —
                      max-height est la seule solution sans JS.
                      tabIndex={-1} sur le lien quand panel fermé :
                      empêche la navigation clavier sur un élément
                      invisible. */}
                    <div
                      id={`alliance-desc-${index}`}
                      className={`${styles.cardDescPanel} ${isOpen ? styles.cardDescPanelOpen : ""}`}
                      aria-hidden={!isOpen}
                    >
                      <p className={`body-meta ${styles.cardDescLongue}`}>
                        {descLongue}
                      </p>
                      <a
                        href={href}
                        className={styles.cardDescLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <span>Visiter le site</span>
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 4H11M8 1L11 4L8 7"
                            stroke="currentColor"
                            strokeWidth="1.1"
                            strokeLinecap="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  {/* fin .cardExpand */}
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
