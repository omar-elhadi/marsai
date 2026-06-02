import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SECTIONS_LEFT = [
  {
    id: "01",
    slug: "identite",
    title: "Identité",
    content: [
      {
        type: "paragraph",
        text: "Le présent site est édité par le Festival International du Film IA MARSAI, association à but non lucratif œuvrant pour la promotion du cinéma génératif.",
      },
      {
        type: "list",
        items: [
          "Propriétaire & Directeur de publication : Jean Dupont",
          "Statut : Festival International — association loi 1901",
        ],
      },
    ],
  },
  {
    id: "02",
    slug: "coordonnees",
    title: "Coordonnées",
    content: [
      {
        type: "paragraph",
        text: "Pour toute correspondance administrative ou juridique, vous pouvez contacter le festival aux coordonnées suivantes.",
      },
      {
        type: "deadline",
        label: "SIRET",
        value: "123 456 789",
      },
      {
        type: "list",
        items: [
          "Adresse : 123 Rue des Festivals, 13000 Marseille",
          "Email : contact@marsai-festival.fr",
        ],
      },
    ],
  },
  {
    id: "03",
    slug: "hebergement",
    title: "Hébergement",
    content: [
      {
        type: "paragraph",
        text: "Le site est hébergé par un prestataire technique dont les serveurs sont localisés en France, dans le respect de la réglementation européenne sur les données personnelles.",
      },
      {
        type: "note",
        text: "Hébergeur Web — 456 Avenue du Numérique, Paris, France.",
      },
    ],
  },
];

const SECTIONS_RIGHT = [
  {
    id: "04",
    slug: "propriete",
    title: "Propriété intellectuelle",
    content: [
      {
        type: "paragraph",
        text: "L'ensemble des contenus présents sur ce site — textes, images, vidéos, identité visuelle — est protégé par les lois nationales et internationales relatives à la propriété intellectuelle.",
      },
      {
        type: "list",
        items: [
          "Toute reproduction partielle ou totale est soumise à autorisation préalable.",
          "Les œuvres générées par IA exposées sur le site restent la propriété de leurs auteurs respectifs.",
        ],
      },
    ],
  },
  {
    id: "05",
    slug: "donnees",
    title: "Protection des données",
    content: [
      {
        type: "paragraph",
        text: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
      },
      {
        type: "list",
        items: [
          "Aucune donnée personnelle n'est vendue à des tiers.",
          "Les données collectées sont utilisées uniquement dans le cadre du festival.",
        ],
      },
    ],
  },
  {
    id: "06",
    slug: "contact-juridique",
    title: "Contact juridique",
    content: [
      {
        type: "paragraph",
        text: "Pour toute question relative aux présentes mentions légales ou à la gestion de vos données personnelles, contactez notre délégué à la protection des données.",
      },
      {
        type: "note",
        text: "Protocole de sécurité Marseille-2026 — Mars Ai Terminal v.2.50",
      },
    ],
  },
];

function MentionSection({
  section,
  isLast,
}: {
  section: any;
  isLast?: boolean;
}) {
  const { id, title, content } = section;

  return (
    <article
      id={section.slug}
      style={{
        paddingBottom: isLast ? 0 : "3.5rem",
        marginBottom: isLast ? 0 : "3.5rem",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div
        className="flex items-baseline gap-3"
        style={{ marginBottom: "1.2rem" }}
      >
        <span
          className="font-black italic text-xl text-[#d1c7a3] leading-none shrink-0"
          style={{ opacity: 0.55 }}
        >
          {id}
        </span>
        <h2
          className="font-bold uppercase text-white/80 m-0"
          style={{ fontSize: "0.60rem", letterSpacing: "0.22em" }}
        >
          {title}
        </h2>
      </div>

      <div className="flex flex-col" style={{ gap: "1rem" }}>
        {content.map((block: any, i: number) => {
          if (block.type === "paragraph")
            return (
              <p
                key={i}
                className="text-white/60 font-light leading-relaxed m-0"
                style={{ fontSize: "1rem" }}
              >
                {block.text}
              </p>
            );
          if (block.type === "list")
            return (
              <ul
                key={i}
                className="m-0 p-0 list-none flex flex-col"
                style={{ gap: "0.75rem" }}
              >
                {block.items.map((item: any, j: number) => (
                  <li
                    key={j}
                    className="flex items-start"
                    style={{ gap: "0.75rem" }}
                  >
                    <span
                      className="text-[#d1c7a3] shrink-0 leading-none"
                      style={{ marginTop: "0.15em" }}
                    >
                      —
                    </span>
                    <span
                      className="text-white/60 font-light leading-relaxed"
                      style={{ fontSize: "1rem" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            );
          if (block.type === "note")
            return (
              <p
                key={i}
                className="text-white/30 italic uppercase m-0"
                style={{ fontSize: "0.72rem", letterSpacing: "0.15em" }}
              >
                {block.text}
              </p>
            );
          if (block.type === "deadline")
            return (
              <div
                key={i}
                className="inline-flex flex-col self-start rounded-sm"
                style={{
                  gap: "0.3rem",
                  padding: "0.85rem 1.2rem",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderLeft: "2px solid #d1c7a3",
                }}
              >
                <span
                  className="font-semibold uppercase text-white/40"
                  style={{
                    fontSize: "0.56rem",
                    letterSpacing: "0.22em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {block.label}
                </span>
                <span
                  className="font-black uppercase text-[#d1c7a3] leading-none"
                  style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}
                >
                  {block.value}
                </span>
              </div>
            );
          return null;
        })}
      </div>
    </article>
  );
}

export default function Mention() {
  const pageRef = useRef(null);
  const topRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(topRef.current, { opacity: 0, y: -20 });
      gsap.set(leftRef.current, { opacity: 0, x: -22 });
      gsap.set(rightRef.current, { opacity: 0, x: 22 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(
        topRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        0.0,
      );
      tl.to(
        leftRef.current,
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.25,
      );
      tl.to(
        rightRef.current,
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        0.35,
      );
    },
    { scope: pageRef },
  );

  return (
    <div
      ref={pageRef}
      className="flex flex-col"
      style={{
        paddingTop: "clamp(4rem,6vw,5rem)",
        background: "#0a0a0a",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* ── Image de fond ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, #0a0a0a 0%, transparent 25%, transparent 75%, #0a0a0a 100%)",
          }}
        />
      </div>

      {/* ── Contenu ── */}
      <div
        className="flex flex-col flex-1"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* ── Header ── */}
        <div
          ref={topRef}
          style={{ padding: "clamp(2rem,3.5vw,3rem) clamp(2rem,5vw,5rem)" }}
        >
          <div
            className="flex items-center gap-4"
            style={{ marginBottom: "1.2rem" }}
          >
            <span
              className="block h-px bg-[#d1c7a3] shrink-0"
              style={{ width: "clamp(2rem,3vw,3rem)" }}
            />
            <span
              className="font-semibold uppercase text-white/40"
              style={{ fontSize: "0.60rem", letterSpacing: "0.22em" }}
            >
              Marsai Festival — Édition 2026
            </span>
          </div>
          <h1
            className="text-center font-black uppercase text-white mx-auto leading-none"
            style={{
              fontSize: "clamp(2rem,6vw,4.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Mentions Légales
          </h1>
        </div>

        {/* ── Grille 2 colonnes ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
          <div
            ref={leftRef}
            className="border-b md:border-b-0 md:border-r border-white/10"
            style={{ padding: "clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)" }}
          >
            <div
              className="w-full bg-gradient-to-r from-[#d1c7a3] to-transparent"
              style={{ height: "1px", marginBottom: "3rem" }}
            />
            {SECTIONS_LEFT.map((section, i) => (
              <MentionSection
                key={section.id}
                section={section}
                isLast={i === SECTIONS_LEFT.length - 1}
              />
            ))}
          </div>

          <div
            ref={rightRef}
            className="flex flex-col"
            style={{ padding: "clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)" }}
          >
            <div
              className="w-full bg-gradient-to-r from-[#d1c7a3] to-transparent"
              style={{ height: "1px", marginBottom: "3rem" }}
            />
            {SECTIONS_RIGHT.map((section, i) => (
              <MentionSection
                key={section.id}
                section={section}
                isLast={i === SECTIONS_RIGHT.length - 1}
              />
            ))}
            <p
              className="mt-auto uppercase italic text-white/20"
              style={{
                paddingTop: "2rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                fontSize: "0.55rem",
                letterSpacing: "0.4em",
              }}
            >
              MARSAI Festival — Marseille MMXXVI. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
