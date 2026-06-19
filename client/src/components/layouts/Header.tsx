import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LuminousButton from "@/components/common/LuminousButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ROUTES } from "@/constants/routes";
import styles from "./Header.module.css";

interface LinkItem {
  label: string;
  href: string;
  isLink?: boolean;
  index: string;
}

function NavLink({
  link,
  isActive,
  onClick,
}: {
  link: LinkItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span>{link.label}</span>
      <span className={styles.navUnderline} aria-hidden="true" />
    </>
  );

  const commonProps = {
    className: styles.navLinkDesktop,
    "data-active": String(isActive),
    "aria-current": (isActive ? "page" : undefined) as "page" | undefined,
    onClick,
  };

  return link.isLink ? (
    <Link to={link.href} {...commonProps}>
      {content}
    </Link>
  ) : (
    <a href={link.href} {...commonProps}>
      {content}
    </a>
  );
}

function MobileLinkContent({
  link,
  isSoumettre,
}: {
  link: LinkItem;
  isSoumettre: boolean;
}) {
  return (
    <>
      <span
        className={`${styles.mobileLinkIndex} ${isSoumettre ? styles.mobileLinkIndexSoumettre : styles.mobileLinkIndexDefault}`}
      >
        {link.index}
      </span>

      {isSoumettre && (
        <span aria-hidden="true" className={styles.mobileLinkGlow} />
      )}

      <span
        className={`${styles.mobileLinkLabel} ${isSoumettre ? styles.mobileLinkLabelSoumettre : styles.mobileLinkLabelDefault}`}
      >
        {link.label}
      </span>
    </>
  );
}

export default function Header() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const NAV_LINKS = [
    { label: t("nav.festival"), href: ROUTES.HOME, isLink: true, index: "01" },
    {
      label: t("nav.gallery"),
      href: ROUTES.GALERIE,
      isLink: true,
      index: "02",
    },
    { label: t("nav.events"), href: ROUTES.EVENTS, isLink: true, index: "03" },
    { label: t("nav.news"), href: ROUTES.NEWS, isLink: true, index: "04" },
    {
      label: t("nav.contact"),
      href: ROUTES.CONTACT,
      isLink: true,
      index: "05",
    },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.headerInner}>
          <div className={styles.logoWrapper}>
            <Link to={ROUTES.HOME} onClick={close} className={styles.logo}>
              MARSAI
            </Link>
          </div>

          <nav className={styles.navDesktop} aria-label={t("nav.festival")}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                link={link}
                isActive={location.pathname === link.href}
                onClick={close}
              />
            ))}
            <span aria-hidden="true" className={styles.navSeparator} />
            <LuminousButton
              label={t("nav.submit")}
              to={ROUTES.SOUMETTRE}
              variant="dark"
              size="sm"
            />
            <LanguageSwitcher />
          </nav>

          <button
            onClick={() => setIsOpen((v) => !v)}
            className={styles.burger}
            aria-label={isOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={isOpen}
          >
            <span
              className={`${styles.burgerLine} ${styles.burgerLine1} ${isOpen ? styles.burgerLine1Open : ""}`}
            />
            <span
              className={`${styles.burgerLine} ${styles.burgerLine2} ${isOpen ? styles.burgerLine2Open : ""}`}
            />
            <span
              className={`${styles.burgerLine} ${styles.burgerLine3} ${isOpen ? styles.burgerLine3Open : ""}`}
            />
          </button>
        </div>
      </header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("header.openMenu")}
        className={`${styles.mobilePanel} ${isOpen ? styles.mobilePanelOpen : ""}`}
      >
        <div
          aria-hidden="true"
          className={`${styles.panelTrait} ${isOpen ? styles.panelTraitOpen : ""}`}
        />

        <button
          onClick={close}
          aria-label={t("header.closeMenu")}
          className={`${styles.closeBtn} ${isOpen ? styles.closeBtnOpen : ""}`}
        >
          <span className={styles.closeLabel}>{t("header.close")}</span>
          <span className={styles.closeIcon} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        <nav className={styles.mobileNav} aria-label={t("header.openMenu")}>
          {[
            ...NAV_LINKS,
            {
              label: t("nav.submit"),
              href: ROUTES.SOUMETTRE,
              isLink: true,
              index: "06",
            },
          ].map((link, i) => {
            const isSoumettre = link.label === t("nav.submit");
            return (
              <div
                key={link.href}
                className={`${styles.mobileNavItem} ${isOpen ? styles.mobileNavItemOpen : ""}`}
                style={
                  { "--stagger": `${80 + i * 70}ms` } as React.CSSProperties
                }
              >
                {link.isLink ? (
                  <Link
                    to={link.href}
                    onClick={close}
                    className={`${styles.mobileLink} ${isSoumettre ? styles.mobileLinkSoumettre : styles.mobileLinkDefault}`}
                    aria-current={
                      location.pathname === link.href ? "page" : undefined
                    }
                  >
                    <MobileLinkContent link={link} isSoumettre={isSoumettre} />
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={close}
                    className={`${styles.mobileLink} ${isSoumettre ? styles.mobileLinkSoumettre : styles.mobileLinkDefault}`}
                    aria-current={
                      location.pathname === link.href ? "page" : undefined
                    }
                  >
                    <MobileLinkContent link={link} isSoumettre={isSoumettre} />
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={`${styles.panelFooter} ${isOpen ? styles.panelFooterVisible : ""}`}
        >
          <span className={styles.panelDate}>{t("header.panelDate")}</span>
          <span className={styles.panelCity}>{t("header.panelCity")}</span>
        </div>
      </div>
    </>
  );
}
