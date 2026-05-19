/**
 * SectionManifeste.jsx — MARSAI Festival
 * Phase 2.1 — "{t('manifeste.title1')} {t('manifeste.title2')} {t('manifeste.title3')}"
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : Rupture typographique éditoriale
 * ═══════════════════════════════════════════════════════════════
 *
 * Concept :
 *   Le manifeste du festival. Avant de voir le jury ou les prix,
 *   l'utilisateur comprend la règle du jeu.
 *   Le titre s'impose — massif, découpé en 3 lignes — révélé
 *   ligne par ligne comme un rideau qui monte.
 *   3 piliers répondent en grille : les contraintes concrètes.
 *
 * Composition :
 *   Overline "{t('manifeste.overline')}" + filet sable
 *   Titre 3 lignes (clip-path reveal GSAP)
 *   Paragraphe philosophique
 *   Séparateur horizontal
 *   Grille 3 piliers : 01 / 02 / 03
 *
 * Animation GSAP ScrollTrigger :
 *   Chaque ligne du titre : clip-path inset(100%→0%) de bas en haut
 *   stagger 140ms — effet rideau de théâtre
 *   Piliers : rise + fade stagger 100ms
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// DONNÉES — Les trois contraintes du festival
// ─────────────────────────────────────────────
const CONTRAINTES = [
  {
    num: "01",
    titre: "Une minute",
    corps:
      "Chaque œuvre est limitée à 60 secondes. La contrainte de temps est la première des libertés créatives.",
  },
  {
    num: "02",
    titre: "IA seule",
    corps:
      "Aucun tournage réel. L'intégralité du film — images, son, narration — est générée par intelligence artificielle.",
  },
  {
    num: "03",
    titre: "Cinéma authentique",
    corps:
      "Malgré les outils, l'émotion doit être vraie. L'IA est le pinceau. L'humanité reste le sujet.",
  },
];

// ─────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────
export default function SectionManifeste() {
  const { t } = useTranslation("common");
  const sectionRef = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const paraRef = useRef(null);
  const separatorRef = useRef(null);
  const pilaersRef = useRef(null);

  useGSAP(
    () => {
      const lines = [line1Ref.current, line2Ref.current, line3Ref.current];

      // ── États initiaux ────────────────────────────────────────
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      // Chaque ligne wrappée dans un overflow:hidden — le span glisse
      lines.forEach((line) => gsap.set(line, { yPercent: 105 }));
      gsap.set(paraRef.current, { opacity: 0, y: 24 });
      gsap.set(separatorRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(pilaersRef.current.children, { opacity: 0, y: 30 });

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
            duration: 0.6,
            ease: "power2.out",
          });

          // Rideau de théâtre — chaque ligne monte dans son overflow:hidden
          tl.to(
            lines,
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.14,
              ease: "power3.out",
            },
            0.2,
          );

          tl.to(
            paraRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            0.7,
          );

          tl.to(
            separatorRef.current,
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power2.inOut",
            },
            0.85,
          );

          tl.to(
            pilaersRef.current.children,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: "power2.out",
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
      id="manifeste"
      style={{
        background: "var(--color-bg-pure)",
        padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Overline ──────────────────────────────────────── */}
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
          <span className="label-overline">Manifeste</span>
        </div>

        {/* ── Titre 3 lignes — effet rideau ─────────────────────
            Chaque .line-mask est overflow:hidden.
            Le span enfant glisse de yPercent:105 → 0.
            ──────────────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Ligne 1 */}
          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line1Ref}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(3rem, 8.5vw, 8rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "var(--color-text)",
                paddingBottom: "0.08em",
              }}
            >
              L'Art
            </span>
          </div>

          {/* Ligne 2 */}
          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line2Ref}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(3rem, 8.5vw, 8rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "var(--color-text)",
                paddingBottom: "0.08em",
              }}
            >
              de la
            </span>
          </div>

          {/* Ligne 3 — accent sable */}
          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line3Ref}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(3rem, 8.5vw, 8rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                paddingBottom: "0.08em",
              }}
            >
              Contrainte
            </span>
          </div>
        </div>

        {/* ── Paragraphe philosophique ─────────────────────── */}
        <p
          ref={paraRef}
          className="body-editorial"
          style={{
            maxWidth: "52ch",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          {t("manifeste.desc1")}
          {t("manifeste.desc2")}
          {t("manifeste.desc3")}
        </p>

        {/* ── Séparateur ──────────────────────────────────── */}
        <hr
          ref={separatorRef}
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border)",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        />

        {/* ── Grille des 3 contraintes ─────────────────────── */}
        <div
          ref={pilaersRef}
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "clamp(2rem, 4vw, 3rem)" }}
        >
          {CONTRAINTES.map(({ num, titre, corps }) => (
            <article
              key={num}
              style={{
                paddingTop: "clamp(1.5rem, 2.5vw, 2rem)",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {/* Numéro + titre sur la même ligne */}
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 900,
                    fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    flexShrink: 0,
                  }}
                >
                  {num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 800,
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "var(--color-text)",
                    lineHeight: 1.1,
                  }}
                >
                  {titre}
                </h3>
              </div>
              <p className="body-meta">{corps}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
