// @ts-nocheck
/**
 * Header.jsx — MARSAI Festival
 * Phase 7 — Navigation cinématographique
 * Refactoring CSS Module — session séparation des responsabilités
 *
 * ═══════════════════════════════════════════════════════════════
 * SÉPARATION DES RESPONSABILITÉS
 * ═══════════════════════════════════════════════════════════════
 *
 * Header.module.css → tous les styles statiques
 *
 * Ce qui reste en JS :
 *   isScrolled  → className conditionnel styles.headerScrolled
 *   isOpen      → classNames conditionnels .*Open / .*Visible
 *   isActive    → attribut data-active="true" (sélecteur CSS)
 *   --stagger   → style={{ '--stagger': `${80 + i * 70}ms` }}
 *                 Seule prop inline restante — délai calculé
 *                 non extractible en classe statique.
 *
 * Supprimés :
 *   Tous les style={{}} → remplacés par className={styles.*}
 *   onMouseEnter / onMouseLeave → remplacés par :hover CSS
 *   <style> tag globale → intégrée dans le module @media
 *
 * ═══════════════════════════════════════════════════════════════
 * LuminousButton import mis à jour vers @/components/common/LuminousButton
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LuminousButton from "@/components/common/LuminousButton";
import { ROUTES } from "@/constants/routes";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Le Festival", href: ROUTES.HOME, isLink: true, index: "01" },
  { label: "Galerie", href: ROUTES.GALERIE, isLink: true, index: "02" },
  { label: "Events", href: ROUTES.EVENTS, isLink: true, index: "03" },
  { label: "Actualités", href: ROUTES.NEWS, isLink: true, index: "04" },
  { label: "Contacter", href: ROUTES.CONTACT, isLink: true, index: "05" },
];

// ─────────────────────────────────────────────────────────────
// NavLink — lien desktop avec état actif
// ─────────────────────────────────────────────────────────────
// data-active posé sur l'élément — CSS module gère
// [data-active='true'] et :hover sans JS handler.
// ─────────────────────────────────────────────────────────────
function NavLink({ link, isActive, onClick }) {
  const content = (
    <>
      <span>{link.label}</span>
      {/* scaleX piloté par :hover et [data-active] dans le CSS module */}
      <span className={styles.navUnderline} aria-hidden="true" />
    </>
  );

  const commonProps = {
    className: styles.navLinkDesktop,
    "data-active": String(isActive),
    "aria-current": isActive ? "page" : undefined,
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

// ─────────────────────────────────────────────────────────────
// MobileLinkContent — index + glow + label
// ─────────────────────────────────────────────────────────────
// Classes conditionnelles selon isSoumettre. Zéro style inline.
// ─────────────────────────────────────────────────────────────
function MobileLinkContent({ link, isSoumettre }) {
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

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Détection scroll — classe .headerScrolled
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blocage scroll body quand panel ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermeture automatique au changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* ── HEADER FIXE ──────────────────────────────────────── */}
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.headerInner}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <Link to={ROUTES.HOME} onClick={close} className={styles.logo}>
              MARSAI
            </Link>
          </div>

          {/* Navigation desktop — cachée sous 768px via @media module */}
          <nav className={styles.navDesktop} aria-label="Navigation principale">
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
              label="Soumettre"
              to={ROUTES.SOUMETTRE}
              variant="dark"
              size="sm"
            />
          </nav>

          {/* Burger — visible sous 768px via @media module */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className={styles.burger}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {/* Trait 1 — rotation -45° à l'ouverture */}
            <span
              className={`${styles.burgerLine} ${styles.burgerLine1} ${isOpen ? styles.burgerLine1Open : ""}`}
            />
            {/* Trait 2 — disparaît à l'ouverture */}
            <span
              className={`${styles.burgerLine} ${styles.burgerLine2} ${isOpen ? styles.burgerLine2Open : ""}`}
            />
            {/* Trait 3 — rotation +45° à l'ouverture */}
            <span
              className={`${styles.burgerLine} ${styles.burgerLine3} ${isOpen ? styles.burgerLine3Open : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ── PANEL MOBILE ─────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={`${styles.mobilePanel} ${isOpen ? styles.mobilePanelOpen : ""}`}
      >
        {/* Trait décoratif — haut gauche, s'étend à l'ouverture */}
        <div
          aria-hidden="true"
          className={`${styles.panelTrait} ${isOpen ? styles.panelTraitOpen : ""}`}
        />

        {/* Bouton fermer — haut droite, miroir symétrique du trait */}
        <button
          onClick={close}
          aria-label="Fermer le menu"
          className={`${styles.closeBtn} ${isOpen ? styles.closeBtnOpen : ""}`}
        >
          <span className={styles.closeLabel}>Fermer</span>
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

        {/* Navigation mobile — stagger par CSS variable */}
        <nav className={styles.mobileNav} aria-label="Navigation mobile">
          {[
            ...NAV_LINKS,
            {
              label: "Soumettre",
              href: ROUTES.SOUMETTRE,
              isLink: true,
              index: "06",
            },
          ].map((link, i) => {
            const isSoumettre = link.label === "Soumettre";
            return (
              <div
                key={link.href}
                className={`${styles.mobileNavItem} ${isOpen ? styles.mobileNavItemOpen : ""}`}
                style={{ "--stagger": `${80 + i * 70}ms` }}
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

        {/* Pied du panel — date + ville */}
        <div
          className={`${styles.panelFooter} ${isOpen ? styles.panelFooterVisible : ""}`}
        >
          <span className={styles.panelDate}>20 — 22 Juin 2026</span>
          <span className={styles.panelCity}>Marseille</span>
        </div>
      </div>
    </>
  );
}
