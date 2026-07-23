import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ROUTES } from "@/constants/routes";
import styles from "./Footer.module.css";

const SunRays = () => {
  const raysRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(".ray", {
        rotate: "+=3",
        opacity: () => Math.random() * 0.18 + 0.06,
        duration: () => Math.random() * 5 + 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.7,
      });
    },
    { scope: raysRef },
  );

  return (
    <div
      ref={raysRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-70"
      aria-hidden="true"
    >
      <div className="ray absolute top-[-10%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-b from-amber-500/12 via-amber-400/4 to-transparent origin-top-left -rotate-[35deg] blur-3xl" />
      <div className="ray absolute top-[-20%] left-[20%] w-[100%] h-[150%] bg-gradient-to-b from-amber-300/10 via-amber-200/3 to-transparent origin-top-left -rotate-[42deg] blur-[100px]" />
      <div className="ray absolute top-[-5%] left-[40%] w-[120%] h-[150%] bg-gradient-to-b from-amber-600/8 via-amber-500/3 to-transparent origin-top-left -rotate-[28deg] blur-2xl" />
    </div>
  );
};

const PARTICLE_COUNT = 80;

const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const particles = gsap.utils.toArray<HTMLElement>(".particle");
      if (particles.length === 0) return;

      function initParticles() {
        gsap.killTweensOf(particles);

        particles.forEach((p) => {
          gsap.set(p, {
            x: () => Math.random() * window.innerWidth,
            y: () => Math.random() * 500,
            opacity: 0,
            scale: () => Math.random() * 1.5 + 0.5,
          });

          gsap.to(p, {
            y: "-=280",
            x: "+=random(-50, 50)",
            duration: () => Math.random() * 12 + 8,
            repeat: -1,
            ease: "none",
            delay: () => Math.random() * -15,
          });

          gsap.to(p, {
            opacity: () => Math.random() * 0.75 + 0.15,
            duration: () => Math.random() * 0.4 + 0.1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: () => Math.random() * -5,
          });
        });
      }

      initParticles();

      let resizeTimer: ReturnType<typeof setTimeout>;
      function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initParticles, 400);
      }

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="particle absolute w-[2px] h-[2px] bg-amber-100 rounded-full shadow-[0_0_4px rgba(251,191,36,0.6)]"
        />
      ))}
    </div>
  );
};

type Social = {
  label: string;
  href: string;
  path: string;
  fillRule?: "evenodd" | "nonzero" | "inherit";
  clipRule?: "evenodd" | "nonzero" | "inherit";
};

const SOCIALS: Social[] = [
  {
    label: "X (Twitter)",
    href: "#",
    path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
    fillRule: "evenodd",
    clipRule: "evenodd",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
  },
];

function Footer() {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  const NAV_COLUMNS = [
    {
      num: "01",
      title: t("footerNav.col1Title"),
      links: [
        { label: t("footerNav.submit"), to: ROUTES.SOUMETTRE },
        { label: t("footerNav.rules"), to: "/reglement" },
        { label: t("footerNav.calendar"), to: "/calendrier" },
        { label: t("footerNav.login"), to: "/login" },
      ],
    },
    {
      num: "02",
      title: t("footerNav.col2Title"),
      links: [
        { label: t("footerNav.faq"), to: "/faq" },
        { label: t("footerNav.contact"), to: ROUTES.CONTACT },
      ],
    },
    {
      num: "03",
      title: t("footerNav.col3Title"),
      links: [
        { label: t("footerNav.legal"), to: ROUTES.MENTION },
        { label: t("footerNav.privacy"), to: ROUTES.POLITIQUE_CONFIDENTIALITE },
        { label: t("footerNav.cgu"), to: ROUTES.CONDITIONS_UTILISATIONS },
        { label: t("footerNav.cookies"), to: ROUTES.COOKIES },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTopFade} aria-hidden="true" />

      <div
        className={`absolute inset-0 ${styles.footerBg}`}
        aria-hidden="true"
      />

      <ParticleSystem />
      <SunRays />

      <div className={styles.footerContent}>
        <div className={styles.signature}>
          <h2 className={styles.signatureTitle}>MARSAI</h2>

          <div className={styles.signatureDivider}>
            <span className={styles.signatureLine} />
            <span className={styles.signatureDate}>
              {t("footer.signatureDate")}
            </span>
          </div>

          <p className={styles.signatureTagline}>
            {t("footer.signatureTagline")}
          </p>
        </div>

        <nav className={styles.navGrid} aria-label={t("footerNav.col1Title")}>
          {NAV_COLUMNS.map(({ num, title, links }) => (
            <div key={num}>
              <span className={styles.navColNum}>{num}</span>
              <h3 className={styles.navColTitle}>{title}</h3>
              <ul className={styles.navList}>
                {links.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={styles.navLink}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear}{" "}
            <span className={styles.copyrightBrand}>MARSAI</span> —{" "}
            {t("footer.allRightsReserved")}
          </p>

          <div className={styles.festivalBadge}>
            <span className={styles.festivalDot} aria-hidden="true" />
            <span className={styles.festivalLabel}>
              {t("footer.festivalLabel")}
            </span>
          </div>

          <ul
            className={styles.socialList}
            aria-label={t("footerNav.col2Title")}
          >
            {SOCIALS.map(({ label, href, path, fillRule, clipRule }) => (
              <li key={label}>
                <a
                  href={href}
                  className={styles.socialLink}
                  aria-label={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={path} fillRule={fillRule} clipRule={clipRule} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
