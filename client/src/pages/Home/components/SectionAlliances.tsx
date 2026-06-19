import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionAlliances.module.css";

gsap.registerPlugin(ScrollTrigger);

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

interface Partner {
  index: string;
  nom: string;
  secteur: string;
  Logo: React.FC;
  desc: string;
  descLongue: string;
  href: string;
}

function LogoSlider({ partners }: { partners: Partner[] }) {
  const SliderItems = () => (
    <>
      {partners.map(({ index, nom, secteur, Logo }) => (
        <div key={index} className={styles.sliderItem} aria-hidden="true">
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
      <div className={styles.sliderTrack}>
        <SliderItems />
        <SliderItems />
      </div>
    </div>
  );
}

export default function SectionAlliances() {
  const { t } = useTranslation("common");
  const sectionRef = useRef<any>(null);
  const overlineRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const sliderRef = useRef<any>(null);
  const gridRef = useRef<any>(null);

  const [activeCard, setActiveCard] = useState<string | null>(null);

  const LOGOS: Record<string, React.FC> = {
    "01": LogoSoraStudio,
    "02": LogoAnthropicLabs,
    "03": LogoCNC,
    "04": LogoEDFPulse,
  };

  const PARTENAIRES: Partner[] = ["01", "02", "03", "04"].map((key) => ({
    index: key,
    nom: t(`alliances.partners.${key}.name`),
    secteur: t(`alliances.partners.${key}.sector`),
    Logo: LOGOS[key],
    desc: t(`alliances.partners.${key}.desc`),
    descLongue: t(`alliances.partners.${key}.descLong`),
    href:
      key === "01"
        ? "https://sora.com"
        : key === "02"
          ? "https://anthropic.com"
          : key === "03"
            ? "https://cnc.fr"
            : "https://edf.fr/pulse",
  }));

  useGSAP(
    () => {
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      gsap.set(titleRef.current, { opacity: 0, y: 28 });
      gsap.set(sliderRef.current, { opacity: 0 });

      const cols = gridRef.current ? Array.from(gridRef.current.children) : [];
      gsap.set(cols, { opacity: 0, y: 35 });

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
      aria-label={t("alliances.overline")}
      className={styles.section}
    >
      <div className={styles.container}>
        <div ref={overlineRef} className={styles.overlineRow}>
          <span className={styles.overlineLine} aria-hidden="true" />
          <span className="label-overline">{t("alliances.overline")}</span>
        </div>

        <h2 ref={titleRef} className={`title-section ${styles.title}`}>
          {t("alliances.title1")}
          <br />
          <span className={styles.titleAccent}>{t("alliances.title2")}</span>
        </h2>
      </div>

      <div ref={sliderRef}>
        <LogoSlider partners={PARTENAIRES} />
      </div>

      <div className={styles.container}>
        <div ref={gridRef} className={styles.grid}>
          {PARTENAIRES.map(
            ({ index, nom, secteur, desc, descLongue, href }, i) => {
              const isOpen = activeCard === index;

              return (
                <div
                  key={index}
                  className={styles.card}
                  aria-label={`${t("alliances.overline")} ${nom} — ${secteur}`}
                  style={{
                    borderLeft:
                      i > 0 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <span className={styles.cardIndex} aria-hidden="true">
                    {index}
                  </span>
                  <span className={styles.cardNum} aria-hidden="true">
                    {index}
                  </span>
                  <h3 className={styles.cardName}>{nom}</h3>
                  <span className="label-category">{secteur}</span>
                  <hr className={styles.cardHr} />
                  <p className={`body-meta ${styles.cardDesc}`}>{desc}</p>

                  <div className={styles.cardExpand}>
                    <button
                      className={`${styles.cardBtn} ${isOpen ? styles.cardBtnOpen : ""}`}
                      onClick={() => setActiveCard(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`alliance-desc-${index}`}
                    >
                      <span>
                        {isOpen
                          ? t("alliances.cardHideLabel")
                          : t("alliances.cardShowLabel")}
                      </span>
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
                        <span>{t("alliances.cardVisitLabel")}</span>
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
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
