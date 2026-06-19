import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const style = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontWeight: 900,
  fontSize: "clamp(3rem, 8.5vw, 8rem)",
  letterSpacing: "-0.03em",
  textTransform: "uppercase",
  paddingBottom: "0.08em",
} as const;

export default function SectionManifeste() {
  const { t } = useTranslation("common");
  const sectionRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const separatorRef = useRef<HTMLHRElement>(null);
  const pilaersRef = useRef<HTMLDivElement>(null);

  const CONTRAINTES = [
    {
      num: "01",
      titre: t("manifeste.c1_title"),
      corps: t("manifeste.c1_desc"),
    },
    {
      num: "02",
      titre: t("manifeste.c2_title"),
      corps: t("manifeste.c2_desc"),
    },
    {
      num: "03",
      titre: t("manifeste.c3_title"),
      corps: t("manifeste.c3_desc"),
    },
  ];

  useGSAP(
    () => {
      const lines = [line1Ref.current, line2Ref.current, line3Ref.current];

      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      lines.forEach((line) => gsap.set(line, { yPercent: 105 }));
      gsap.set(paraRef.current, { opacity: 0, y: 24 });
      gsap.set(separatorRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(pilaersRef.current!.children, { opacity: 0, y: 30 });

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
            pilaersRef.current!.children,
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
          <span className="label-overline">{t("manifeste.overline")}</span>
        </div>

        <div
          style={{
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line1Ref}
              style={{ ...style, color: "var(--color-text)" }}
            >
              {t("manifeste.title1")}
            </span>
          </div>

          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line2Ref}
              style={{ ...style, color: "var(--color-text)" }}
            >
              {t("manifeste.title2")}
            </span>
          </div>

          <div
            className="line-mask"
            style={{ overflow: "hidden", lineHeight: 1 }}
          >
            <span
              ref={line3Ref}
              style={{ ...style, color: "var(--color-accent)" }}
            >
              {t("manifeste.title3")}
            </span>
          </div>
        </div>

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

        <hr
          ref={separatorRef}
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border)",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        />

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
