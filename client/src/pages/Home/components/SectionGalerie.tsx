import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROUTES } from "@/constants/routes";
import styles from "./SectionGalerie.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Film {
  id: string;
  titre: string;
  realisateur: string;
  pays: string;
  genre: string;
  mention: string;
  isFeatured: boolean;
  img: string;
  alt: string;
}

const ANIM_IN = [
  {
    from: { scale: 0.95, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 1.0, ease: "power2.out" },
  },
  {
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
  },
  {
    from: { x: 50, filter: "blur(6px)", opacity: 0 },
    to: {
      x: 0,
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
    },
  },
];

function FilmCard({
  film,
  cardRef,
  offsetTop = 0,
  voirFilmLabel,
}: {
  film: Film;
  cardRef: any;
  offsetTop?: number;
  voirFilmLabel: string;
}) {
  return (
    <Link
      ref={cardRef}
      to={`${ROUTES.GALERIE}#${film.id}`}
      aria-label={`${film.titre} — ${film.realisateur}`}
      className={`${styles.filmCard} ${film.isFeatured ? styles.filmCardFeatured : ""}`}
      style={offsetTop ? { marginTop: `${offsetTop}px` } : undefined}
    >
      <img src={film.img} alt={film.alt} className={styles.filmImg} />

      <div className={styles.filmOverlay} aria-hidden="true" />
      <div className={styles.filmGrain} aria-hidden="true" />

      <div className={styles.mentionWrapper}>
        <span
          className={`${styles.mentionBadge} ${
            film.isFeatured
              ? styles.mentionBadgeFeatured
              : styles.mentionBadgeStandard
          }`}
        >
          {film.mention}
        </span>
      </div>

      <div className={styles.filmTextContent}>
        <span className={`label-overline ${styles.filmGenre}`}>
          {film.genre}
        </span>

        <h3
          className={`${styles.filmTitre} ${
            film.isFeatured ? styles.filmTitreFeatured : ""
          }`}
        >
          {film.titre}
        </h3>

        <div className={styles.filmMeta}>
          <span className={styles.filmRealisateur}>{film.realisateur}</span>
          <span className={styles.filmSeparator} aria-hidden="true">
            ·
          </span>
          <span className={styles.filmPays}>{film.pays}</span>
        </div>

        <div className={styles.filmVoir} aria-hidden="true">
          <span className={styles.filmVoirLabel}>{voirFilmLabel}</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path
              d="M1 4H13M10 1L13 4L10 7"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function SectionGalerie() {
  const { t } = useTranslation("common");
  const sectionRef = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const ctaRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const cardRefs = [card1Ref, card2Ref, card3Ref];

  const getFilms = (): Film[] => [
    {
      id: "film-01",
      titre: t("galerie.films.f1.title"),
      realisateur: t("galerie.films.f1.director"),
      pays: t("galerie.films.f1.origin"),
      genre: t("galerie.films.f1.genre"),
      mention: t("galerie.films.f1.mention"),
      isFeatured: true,
      img: "https://images.unsplash.com/photo-1518893883800-45cd0a9d3101?q=88&w=900&auto=format&fit=crop",
      alt: `${t("galerie.films.f1.title")} — ${t("galerie.films.f1.mention")} MARSAI`,
    },
    {
      id: "film-02",
      titre: t("galerie.films.f2.title"),
      realisateur: t("galerie.films.f2.director"),
      pays: t("galerie.films.f2.origin"),
      genre: t("galerie.films.f2.genre"),
      mention: t("galerie.films.f2.mention"),
      isFeatured: false,
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=88&w=900&auto=format&fit=crop",
      alt: `${t("galerie.films.f2.title")} — ${t("galerie.films.f2.mention")} MARSAI`,
    },
    {
      id: "film-03",
      titre: t("galerie.films.f3.title"),
      realisateur: t("galerie.films.f3.director"),
      pays: t("galerie.films.f3.origin"),
      genre: t("galerie.films.f3.genre"),
      mention: t("galerie.films.f3.mention"),
      isFeatured: false,
      img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=88&w=900&auto=format&fit=crop",
      alt: `${t("galerie.films.f3.title")} — ${t("galerie.films.f3.mention")} MARSAI`,
    },
  ];

  const films = getFilms();

  useGSAP(
    () => {
      gsap.set(overlineRef.current, { opacity: 0, y: 14 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 105 });
      gsap.set(ctaRef.current, { opacity: 0, x: -10 });

      cardRefs.forEach((ref, i) => {
        gsap.set(ref.current, ANIM_IN[i].from);
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
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
            [line1Ref.current, line2Ref.current],
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.13,
              ease: "power3.out",
            },
            0.15,
          );

          cardRefs.forEach((ref, i) => {
            tl.to(
              ref.current,
              {
                ...ANIM_IN[i].to,
                clearProps: "all",
              },
              0.4 + i * 0.15,
            );
          });

          tl.to(
            ctaRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            0.9,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="galerie"
      aria-label={t("galerie.title1")}
      className={styles.sectionGalerie}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div ref={overlineRef} className="flex items-center gap-4">
            <span className={styles.overlineLine} />
            <span className="label-overline">{t("galerie.overline")}</span>
          </div>

          <div>
            <div className={styles.titleLineWrapper}>
              <span
                ref={line1Ref}
                className={`${styles.titleSpan} ${styles.titleSpanMain}`}
              >
                {t("galerie.title1")}
              </span>
            </div>
            <div className={styles.titleLineWrapper}>
              <span
                ref={line2Ref}
                className={`${styles.titleSpan} ${styles.titleSpanAccent}`}
              >
                {t("galerie.title2")}
              </span>
            </div>
          </div>

          <p className={styles.headerTagline}>{t("galerie.tagline")}</p>
        </div>

        <div className={styles.galerieGrid}>
          <div className={styles.featuredWrapper}>
            <FilmCard
              film={films[0]}
              cardRef={card1Ref}
              voirFilmLabel={t("galerie.voirFilm")}
            />
          </div>

          <FilmCard
            film={films[1]}
            cardRef={card2Ref}
            voirFilmLabel={t("galerie.voirFilm")}
          />

          <FilmCard
            film={films[2]}
            cardRef={card3Ref}
            offsetTop={60}
            voirFilmLabel={t("galerie.voirFilm")}
          />
        </div>

        <div ref={ctaRef} className={styles.ctaWrapper}>
          <Link to={ROUTES.GALERIE} className={styles.ctaLink}>
            <span className={styles.ctaTexte}>{t("galerie.cta")}</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <path
                  d="M1 5H21M16 1L21 5L16 9"
                  stroke="var(--color-accent)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
