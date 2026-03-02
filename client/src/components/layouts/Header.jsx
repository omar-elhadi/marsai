/**
 * Header.jsx — MARSAI Festival
 * Phase 7 — Navigation cinématographique
 * Étape 2 — LuminousButton import mis à jour vers @/components/common/LuminousButton
 */

import { useState, useEffect } from 'react';
import { Link, useLocation }   from 'react-router-dom';
import LuminousButton          from '@/components/common/LuminousButton';
import { ROUTES }              from '@/constants/routes';

const NAV_LINKS = [
  { label: 'Le Festival', href: ROUTES.HOME,    isLink: true, index: '01' },
  { label: 'Galerie',     href: ROUTES.GALERIE, isLink: true, index: '02' },
  { label: 'Events',      href: ROUTES.EVENTS,  isLink: true, index: '03' },
  { label: 'Contacter',   href: ROUTES.CONTACT, isLink: true, index: '04' },
];

function NavLink({ link, isActive, onClick }) {
  const baseStyle = {
    position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: '3px',
    fontFamily: 'var(--font-sans)', fontWeight: 700,
    fontSize: 'clamp(0.62rem, 0.85vw, 0.72rem)', letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
    textDecoration: 'none', transition: `color 150ms var(--ease-out)`, padding: '0.25rem 0',
  };
  const underlineStyle = {
    display: 'block', height: '1px', width: '100%', background: 'var(--color-accent)',
    transform: isActive ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left center',
    transition: `transform 280ms var(--ease-out)`,
  };
  const content = (<><span>{link.label}</span><span style={underlineStyle} aria-hidden="true" className="nav-underline" /></>);
  const commonProps = {
    style: baseStyle, onClick, className: 'nav-link-desktop',
    onMouseEnter: e => { e.currentTarget.style.color = 'var(--color-text)'; const bar = e.currentTarget.querySelector('.nav-underline'); if (bar) bar.style.transform = 'scaleX(1)'; },
    onMouseLeave: e => { if (!isActive) { e.currentTarget.style.color = 'var(--color-text-muted)'; const bar = e.currentTarget.querySelector('.nav-underline'); if (bar) bar.style.transform = 'scaleX(0)'; } },
  };
  return link.isLink ? <Link to={link.href} {...commonProps}>{content}</Link> : <a href={link.href} {...commonProps}>{content}</a>;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, background: isScrolled ? 'rgba(0, 0, 0, 0.92)' : 'transparent', backdropFilter: isScrolled ? 'blur(16px)' : 'none', WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none', borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid transparent', transition: `background 400ms var(--ease-out), border-color 400ms var(--ease-out), backdrop-filter 400ms var(--ease-out)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.5rem, 5vw, 6rem)', height: 'clamp(3.5rem, 5vw, 4.5rem)', maxWidth: '1440px', margin: '0 auto' }}>

          <div style={{ position: 'relative', zIndex: 110 }}>
            <Link to={ROUTES.HOME} onClick={close} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--color-text)', textDecoration: 'none', transition: 'color 300ms var(--ease-out)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}>MARSAI</Link>
          </div>

          <nav style={{ display: 'none', alignItems: 'center', gap: 'clamp(1.5rem, 2.5vw, 2.8rem)' }} className="nav-desktop" aria-label="Navigation principale">
            {NAV_LINKS.map(link => (<NavLink key={link.href} link={link} isActive={location.pathname === link.href} onClick={close} />))}
            <span aria-hidden="true" style={{ display: 'block', width: '1px', height: '16px', background: 'var(--color-border)' }} />
            <LuminousButton label="Soumettre" to={ROUTES.SOUMETTRE} variant="dark" size="sm" />
          </nav>

          <button onClick={() => setIsOpen(v => !v)} style={{ position: 'relative', zIndex: 110, width: '2.5rem', height: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }} className="nav-burger" aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={isOpen}>
            <span style={{ display: 'block', height: '2px', background: 'var(--color-text)', borderRadius: '1px', transformOrigin: 'right center', transition: 'transform 320ms var(--ease-out), width 320ms var(--ease-out), opacity 320ms', width: isOpen ? '1.5rem' : '2rem', transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none' }} />
            <span style={{ display: 'block', height: '2px', background: 'var(--color-text)', borderRadius: '1px', transition: 'width 320ms var(--ease-out), opacity 200ms', width: isOpen ? 0 : '1.5rem', opacity: isOpen ? 0 : 1 }} />
            <span style={{ display: 'block', height: '2px', background: 'var(--color-text)', borderRadius: '1px', transformOrigin: 'right center', transition: 'transform 320ms var(--ease-out), width 320ms var(--ease-out)', width: isOpen ? '1.5rem' : '1rem', transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none' }} />
          </button>
        </div>
      </header>

      <div role="dialog" aria-modal="true" aria-label="Menu de navigation" style={{ position: 'fixed', inset: 0, zIndex: 105, background: 'var(--color-bg-pure)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 8vw, 5rem) clamp(1.5rem, 6vw, 4rem)', clipPath: isOpen ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', transition: `clip-path 550ms var(--ease-out)`, pointerEvents: isOpen ? 'auto' : 'none' }} className="nav-mobile-panel">
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(1.8rem, 4vw, 3rem)', left: 'clamp(1.5rem, 6vw, 4rem)', width: isOpen ? 'clamp(2rem, 4vw, 3rem)' : 0, height: '1px', background: 'var(--color-accent)', transition: `width 600ms 200ms var(--ease-out)` }} />

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.8rem, 4vw, 2.8rem)' }} aria-label="Navigation mobile">
          {[...NAV_LINKS, { label: 'Soumettre', href: ROUTES.SOUMETTRE, isLink: true, index: '05' }].map((link, i) => {
            const isSoumettre = link.label === 'Soumettre';
            return (
              <div key={link.href} style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 450ms ${80 + i * 70}ms var(--ease-out), transform 450ms ${80 + i * 70}ms var(--ease-out)` }}>
                {link.isLink
                  ? <Link to={link.href} onClick={close} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', textDecoration: 'none', color: isSoumettre ? 'var(--color-accent)' : 'var(--color-text)' }}><MobileLinkContent link={link} isSoumettre={isSoumettre} /></Link>
                  : <a href={link.href} onClick={close} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', textDecoration: 'none', color: isSoumettre ? 'var(--color-accent)' : 'var(--color-text)' }}><MobileLinkContent link={link} isSoumettre={isSoumettre} /></a>
                }
              </div>
            );
          })}
        </nav>

        <div style={{ position: 'absolute', bottom: 'clamp(1.8rem, 4vw, 3rem)', left: 'clamp(1.5rem, 6vw, 4rem)', right: 'clamp(1.5rem, 6vw, 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: isOpen ? 1 : 0, transition: `opacity 500ms 400ms` }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>20 — 22 Juin 2026</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Marseille</span>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .nav-desktop { display: flex !important; } .nav-burger { display: none !important; } .nav-mobile-panel { display: none !important; } }
        .nav-link-desktop[data-active="true"] .nav-underline { transform: scaleX(1) !important; }
      `}</style>
    </>
  );
}

function MobileLinkContent({ link, isSoumettre }) {
  return (
    <>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '0.18em', color: isSoumettre ? 'var(--color-accent)' : 'var(--color-text-faint)', flexShrink: 0, minWidth: '1.8rem' }}>{link.index}</span>
      {isSoumettre && (<span aria-hidden="true" style={{ display: 'block', width: '2px', height: '1.4rem', borderRadius: '1px', background: 'var(--color-accent)', flexShrink: 0, boxShadow: `0 0 8px rgba(226,209,195,0.9), 0 0 18px rgba(226,209,195,0.4), 0 0 32px rgba(226,209,195,0.15)` }} />)}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: isSoumettre ? 'clamp(1.8rem, 6vw, 2.8rem)' : 'clamp(2.2rem, 7vw, 3.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1, color: 'inherit' }}>{link.label}</span>
    </>
  );
}