import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionRecompenses.module.css";

gsap.registerPlugin(ScrollTrigger);

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

  const GRAND_PRIX_MONTANT = 50000;

  const PRIX_SECONDAIRES = [
    {
      index: t("recompenses.awards.jury.index"),
      titre: t("recompenses.awards.jury.title"),
      valeur: t("recompenses.awards.jury.value"),
      description: t("recompenses.awards.jury.desc"),
    },
    {
      index: t("recompenses.awards.revelation.index"),
      titre: t("recompenses.awards.revelation.title"),
      valeur: t("recompenses.awards.revelation.value"),
      description: t("recompenses.awards.revelation.desc"),
    },
    {
      index: t("recompenses.awards.certification.index"),
      titre: t("recompenses.awards.certification.title"),
      valeur: t("recompenses.awards.certification.value"),
      description: t("recompenses.awards.certification.desc"),
      isSpecial: true,
    },
  ];

  useGSAP(
    () => {
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

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 68%",
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
            counterRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            0.35,
          );

          const counter = { val: 0 };
          tl.to(
            counter,
            {
              val: GRAND_PRIX_MONTANT,
              duration: 1.8,
              ease: "power2.out",
              onUpdate() {
                if (counterRef.current) {
                  const formatted = Math.round(counter.val)
                    .toLocaleString("fr-FR")
                    .replace(/\s/g, "\u202F");
                  counterRef.current.textContent = "$\u202F" + formatted;
                }
              },
            },
            0.45,
          );

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
      aria-label={t("recompenses.title1")}
      className={styles.sectionRecompenses}
    >
      <div className={styles.container}>
        <div
          ref={overlineRef}
          className="flex items-center gap-4 mb-10 md:mb-14"
        >
          <span className={styles.overlineLine} />
          <span className="label-overline">{t("recompenses.overline")}</span>
        </div>

        <h2 ref={titleRef} className={`title-section ${styles.titleMargin}`}>
          {t("recompenses.title1")}
          <br />
          <span className={styles.titleAccent}>{t("recompenses.title2")}</span>
        </h2>

        <div className={styles.grandPrixGrid}>
          <span aria-hidden="true" className={styles.gpIndexLabel}>
            {t("recompenses.gpIndex")}
          </span>

          <div className={styles.gpColGauche}>
            <div
              ref={counterRef}
              aria-label={`$ ${GRAND_PRIX_MONTANT.toLocaleString("fr-FR")}`}
              className={styles.gpCounter}
              style={{ willChange: "transform, opacity" }}
            >
              $&thinsp;0
            </div>

            <h3 ref={gpTitreRef} className={styles.gpTitre}>
              {t("recompenses.gpTitle")}
            </h3>

            <p
              ref={gpDescRef}
              className={`body-editorial ${styles.gpDescription}`}
            >
              {t("recompenses.gpDesc")}
            </p>
          </div>

          <div ref={gpColDroite} className={styles.gpColDroite}>
            <span className={`label-overline ${styles.gpConditionsLabel}`}>
              {t("recompenses.gpConditionLabel")}
            </span>

            <ul className={styles.gpConditionsList}>
              {["01", "02", "03"].map((num) => (
                <li key={num} className={styles.gpConditionItem}>
                  <span className={styles.gpConditionNum}>{num}</span>
                  <span className="body-meta">
                    {t(`recompenses.conditions.${num}`)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.gpJuryNote}>
              <div className={styles.gpJuryNoteInner}>
                <span className={styles.gpDot} aria-hidden="true" />
                <span className={styles.gpJuryNoteText}>
                  {t("recompenses.gpJuryNote")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.separator}>
          <hr className={styles.separatorHr} />
          <span className={`label-overline ${styles.separatorLabel}`}>
            {t("recompenses.separatorLabel")}
          </span>
          <hr className={styles.separatorHr} />
        </div>

        <div ref={secondRef} className={styles.prixGrid}>
          {PRIX_SECONDAIRES.map(
            ({ index, titre, valeur, description, isSpecial }) => (
              <article
                key={index}
                className={`${styles.prixCard} ${isSpecial ? styles.prixCardSpecial : ""}`}
              >
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
