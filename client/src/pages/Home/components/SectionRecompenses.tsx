/**
 * SectionRecompenses.jsx — MARSAI Festival
 * Phase 5 — "Les Récompenses"
 * Étape 4.4 — Refactoring CSS → SectionRecompenses.module.css
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : La gravité du chiffre
 * ═══════════════════════════════════════════════════════════════
 *
 * Composition en deux temps :
 *
 *   TEMPS 1 — Grand Prix (héros de section)
 *     Layout 2 colonnes asymétriques (5fr / 3fr)
 *     Gauche  : chiffre "$50 000" + titre + description
 *     Droite  : 3 conditions d'éligibilité — légitimité
 *     Compteur animé GSAP : 0 → 50 000 en 1.8s
 *
 *   TEMPS 2 — Prix secondaires (grille 3 colonnes)
 *     Prix du Jury / Prix Révélation / Certification
 *     Stagger rise+fade 120ms
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉCISIONS D'ARCHITECTURE — Kodawari
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. Classes variantes pour isSpecial :
 *    .prixCard + .prixCardSpecial   — background transparent
 *    .prixValeur + .prixValeurSpecial — couleur text-muted
 *    Appliquées conditionnellement — aucun style{{}} dynamique.
 *
 * 2. Le <style> tag JSX (hover + breakpoints) est intégralement
 *    absorbé dans SectionRecompenses.module.css.
 *
 * 3. clearProps: 'all' sur les cartes secondaires — GSAP nettoie
 *    ses styles inline après l'animation, les :hover CSS prennent
 *    le contrôle (prixBorder scaleY + prixTitre color).
 *
 * 4. willChange sur counterRef reste en style{{}} :
 *    le compteur est animé par GSAP (opacity + y).
 *    Activer willChange en CSS l'activerait en permanence.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionRecompenses.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────────────────────

const GRAND_PRIX = {
  montant: 50000,
  devise: "$",
  separateur: "\u202F",
  titre: "Grand Prix MARSAI",
  description:
    "Décerné au film qui incarne le mieux la vision du festival : " +
    "une émotion vraie portée par une IA. " +
    "Ouvert à tous — premier film ou dixième, l'émotion seule compte. " +
    "Le jury vote à l'unanimité.",
  conditions: [
    { num: "01", label: "Film de 60 secondes" },
    { num: "02", label: "Généré intégralement par IA" },
    { num: "03", label: "Première mondiale obligatoire" },
  ],
};

const PRIX_SECONDAIRES = [
  {
    index: "02",
    titre: "Prix du Jury",
    valeur: "$15 000",
    description:
      "Attribué à l'œuvre la plus audacieuse formellement. " +
      "Celui qui brise les règles de la manière la plus convaincante.",
  },
  {
    index: "03",
    titre: "Prix Révélation",
    valeur: "$8 000",
    description:
      "Pour ceux qui soumettent leur tout premier film. " +
      "Pas de CV requis — juste une histoire à raconter. " +
      "Ce prix existe précisément pour toi.",
  },
  {
    index: "04",
    titre: "Certification MARSAI",
    valeur: "Tous les finalistes",
    description:
      "Remise aux 50 films finalistes, quelle que soit l'expérience. " +
      "Reconnaissance internationale et accès à la communauté MARSAI.",
    isSpecial: true,
  },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function SectionRecompenses() {
  const { t } = useTranslation("common");
  const sectionRef = useRef<any>(null);
  const overlineRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const counterRef = useRef<any>(null);
  const gpTitreRef = useRef<any>(null);
  const gpDescRef = useRef<any>(null);
  const gpColDroite = useRef<any>(null);
  const secondRef = useRef<any>(null);

  useGSAP(
    () => {
      // ── États initiaux ────────────────────────────────────────
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
      gsap.set(counterRef.current, { opacity: 0, y: 40 });
      gsap.set(gpTitreRef.current, { opacity: 0, y: 22 });
      gsap.set(gpDescRef.current, { opacity: 0, y: 18 });
      gsap.set(gpColDroite.current, { opacity: 0, x: 30 });

      const cards = secondRef.current
        ? Array.from(secondRef.current.children)
        : [];
      gsap.set(cards, { opacity: 0, y: 35 });

      // ── ScrollTrigger ─────────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 68%",
        once: true,
        onEnter() {
          const tl = gsap.timeline();

          // Overline + titre
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

          // Chiffre — rise + compteur simultanés
          tl.to(
            counterRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            0.35,
          );

          // Compteur numérique 0 → 50 000
          const counter = { val: 0 };
          tl.to(
            counter,
            {
              val: GRAND_PRIX.montant,
              duration: 1.8,
              ease: "power2.out",
              onUpdate() {
                if (counterRef.current) {
                  const formatted = Math.round(counter.val)
                    .toLocaleString("fr-FR")
                    .replace(/\s/g, "\u202F");
                  counterRef.current.textContent =
                    GRAND_PRIX.devise + "\u202F" + formatted;
                }
              },
            },
            0.45,
          );

          // Titre + description Grand Prix
          tl.to(
            gpTitreRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            0.55,
          );
          tl.to(
            gpDescRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            0.7,
          );

          // Colonne droite — légèrement décalée
          tl.to(
            gpColDroite.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            0.55,
          );

          // Prix secondaires — stagger + clearProps.
          // clearProps: 'all' → GSAP libère les styles inline
          // après l'animation. Les :hover CSS (.prixBorder,
          // .prixTitre) prennent le contrôle sans conflit.
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              clearProps: "all",
            },
            1.0,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="recompenses"
      aria-label="Récompenses du festival MARSAI"
      className={styles.sectionRecompenses}
    >
      <div className={styles.container}>
        {/* ── Overline ──────────────────────────────────────── */}
        <div
          ref={overlineRef}
          className="flex items-center gap-4 mb-10 md:mb-14"
        >
          <span className={styles.overlineLine} />
          <span className="label-overline">Dotations & Reconnaissances</span>
        </div>

        {/* ── Titre ─────────────────────────────────────────── */}
        <h2 ref={titleRef} className={`title-section ${styles.titleMargin}`}>
          Ce que tu peux
          <br />
          <span className={styles.titleAccent}>remporter</span>
        </h2>

        {/* ══════════════════════════════════════════════════
            TEMPS 1 — GRAND PRIX
            ══════════════════════════════════════════════ */}
        <div className={styles.grandPrixGrid}>
          {/* Numéro d'index décoratif */}
          <span aria-hidden="true" className={styles.gpIndexLabel}>
            Grand Prix — 01
          </span>

          {/* Colonne gauche */}
          <div className={styles.gpColGauche}>
            {/* Chiffre animé — willChange en inline car GSAP-driven */}
            <div
              ref={counterRef}
              aria-label={`${GRAND_PRIX.devise} ${GRAND_PRIX.montant.toLocaleString("fr-FR")}`}
              className={styles.gpCounter}
              style={{
                /* willChange maintenu en inline — GSAP anime opacity + y.
                   Voir en-tête du fichier pour la justification. */
                willChange: "transform, opacity",
              }}
            >
              {GRAND_PRIX.devise}&thinsp;0
            </div>

            <h3 ref={gpTitreRef} className={styles.gpTitre}>
              {GRAND_PRIX.titre}
            </h3>

            <p
              ref={gpDescRef}
              className={`body-editorial ${styles.gpDescription}`}
            >
              {GRAND_PRIX.description}
            </p>
          </div>

          {/* Colonne droite — conditions */}
          <div ref={gpColDroite} className={styles.gpColDroite}>
            <span className={`label-overline ${styles.gpConditionsLabel}`}>
              Conditions de remise
            </span>

            <ul className={styles.gpConditionsList}>
              {GRAND_PRIX.conditions.map(({ num, label }) => (
                <li key={num} className={styles.gpConditionItem}>
                  <span className={styles.gpConditionNum}>{num}</span>
                  <span className="body-meta">{label}</span>
                </li>
              ))}
            </ul>

            {/* Filet + note jury */}
            <div className={styles.gpJuryNote}>
              <div className={styles.gpJuryNoteInner}>
                <span className={styles.gpDot} aria-hidden="true" />
                <span className={styles.gpJuryNoteText}>
                  Vote à l'unanimité du jury
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Séparateur décoratif ──────────────────────────── */}
        <div className={styles.separator}>
          <hr className={styles.separatorHr} />
          <span className={`label-overline ${styles.separatorLabel}`}>
            Prix secondaires
          </span>
          <hr className={styles.separatorHr} />
        </div>

        {/* ══════════════════════════════════════════════════
            TEMPS 2 — PRIX SECONDAIRES
            ══════════════════════════════════════════════ */}
        <div ref={secondRef} className={styles.prixGrid}>
          {PRIX_SECONDAIRES.map(
            ({ index, titre, valeur, description, isSpecial }) => (
              <article
                key={index}
                className={`${styles.prixCard} ${isSpecial ? styles.prixCardSpecial : ""}`}
              >
                {/* Bord gauche — révélé au hover via CSS */}
                <span aria-hidden="true" className={styles.prixBorder} />

                <span className={styles.prixIndex}>{index}</span>

                <div
                  className={`${styles.prixValeur} ${isSpecial ? styles.prixValeurSpecial : ""}`}
                >
                  {valeur}
                </div>

                <h3 className={styles.prixTitre}>{titre}</h3>

                <hr className={styles.prixSeparatorHr} />

                <p className={`body-meta ${styles.prixDescription}`}>
                  {description}
                </p>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
