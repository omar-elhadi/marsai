/**
 * CursorManager.jsx — MARSAI Festival
 * Phase 11 — Curseur cinématographique
 *
 * ═══════════════════════════════════════════════════════════════
 * ANATOMIE — 3 couches superposées
 * ═══════════════════════════════════════════════════════════════
 *
 *  A — Point central  (6px)
 *      Délai zéro. Précision absolue. Couleur sable.
 *
 *  B — Anneau extérieur (30px idle → morphe selon contexte)
 *      Suit la souris via lerp 12% sur gsap.ticker.
 *      Retard élastique — fluidité organique.
 *
 *  C — Label SVG rotatif
 *      textPath sur cercle SVG — "VOIR · " ou "PLAY · "
 *      Visible uniquement sur data-cursor="card-view/play"
 *
 * ═══════════════════════════════════════════════════════════════
 * 6 ÉTATS CONTEXTUELS — détection via data-cursor + closest()
 * ═══════════════════════════════════════════════════════════════
 *
 *  default   → idle pur
 *  hover     → liens, nav (anneau élargi, point disparu)
 *  button    → LuminousButton (anneau pulse + halo sable)
 *  card-view → cartes jury/galerie (label VOIR rotatif)
 *  card-play → cartes film vidéo (label PLAY inversé)
 *  text      → inputs/textarea (caret vertical fin)
 *
 * ═══════════════════════════════════════════════════════════════
 * INTÉGRATION
 * ═══════════════════════════════════════════════════════════════
 *
 *  Dans PublicLayout.jsx :
 *    import CursorManager from '@/components/CursorManager';
 *    // Dans le JSX, avant </> :
 *    <CursorManager />
 *
 *  Attributs data-cursor à poser sur les éléments :
 *    LuminousButton   → data-cursor="button"     (déjà dans ce fichier)
 *    Cartes jury      → data-cursor="card-view"
 *    Cartes galerie   → data-cursor="card-view"
 *    SectionGalerie   → data-cursor="card-view"
 *    Inputs/textarea  → data-cursor="text"
 *    Liens nav        → data-cursor="hover"      (auto-détecté aussi)
 *
 *  cursor.css doit être importé dans App.css :
 *    @import './styles/cursor.css';
 *
 * ═══════════════════════════════════════════════════════════════
 * DÉSACTIVATION AUTOMATIQUE
 * ═══════════════════════════════════════════════════════════════
 *  Mobile (pointer:coarse) → retourne null, zéro rendu
 *  prefers-reduced-motion  → lerp instantané, animations off
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const LERP_FACTOR    = 0.12;   // Retard élastique de l'anneau (12% par frame)
const LERP_FAST      = 0.28;   // Lerp rapide pour états actifs
const ACCENT         = 'rgba(226,209,195,1)';
const ACCENT_55      = 'rgba(226,209,195,0.55)';
const ACCENT_30      = 'rgba(226,209,195,0.30)';
const ACCENT_08      = 'rgba(226,209,195,0.08)';
const ACCENT_05      = 'rgba(226,209,195,0.05)';

// Sélecteurs auto-hover (sans data-cursor explicite)
const AUTO_HOVER_SEL = 'a, button, [role="button"], [tabindex]:not([tabindex="-1"]), label[for], summary';

// Rayon SVG pour le label rotatif
const LABEL_R = 30;
const LABEL_CIRCUMFERENCE = Math.round(2 * Math.PI * LABEL_R);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function isTouch() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}
function reducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Remonte l'arbre DOM depuis target, retourne le data-cursor le plus proche */
function getCursorState(target) {
  if (!target || target === document.body) return 'default';

  // data-cursor explicite prioritaire
  const explicit = target.closest('[data-cursor]');
  if (explicit) return explicit.dataset.cursor;

  // Éléments interactifs natifs → hover automatique
  if (target.closest(AUTO_HOVER_SEL)) return 'hover';

  return 'default';
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function CursorManager() {
  // ── Désactivation immédiate sur touch ──────────────────────
  if (isTouch()) return null;

  return <CursorInner />;
}

function CursorInner() {
  const dotRef    = useRef(null);   // A — point central
  const ringRef   = useRef(null);   // B — anneau
  const labelRef  = useRef(null);   // C — label SVG rotatif
  const stateRef  = useRef('default');
  const posRef    = useRef({ x: -200, y: -200 }); // position souris
  const ringPos   = useRef({ x: -200, y: -200 }); // position anneau (lerp)
  const isVisible = useRef(false);
  const reduced   = reducedMotion();

  // ── Styles morphiques selon l'état ─────────────────────────
  function applyState(state) {
    if (stateRef.current === state) return;
    stateRef.current = state;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const lbl  = labelRef.current;
    if (!dot || !ring || !lbl) return;

    // Reset label
    lbl.style.opacity   = '0';
    lbl.style.transform = 'translate(-50%,-50%) scale(0) rotate(0deg)';

    switch (state) {

      // ── DEFAULT ─────────────────────────────────────────────
      case 'default':
        gsap.to(dot, {
          opacity: 1, scale: 1,
          width: '6px', height: '6px',
          borderRadius: '50%',
          duration: 0.30, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '30px', height: '30px',
          borderWidth: '1px',
          borderColor: ACCENT_55,
          background: 'transparent',
          boxShadow: 'none',
          borderRadius: '50%',
          duration: 0.35, ease: 'power2.out',
        });
        break;

      // ── HOVER ───────────────────────────────────────────────
      case 'hover':
        gsap.to(dot, {
          opacity: 0, scale: 0,
          duration: 0.22, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '44px', height: '44px',
          borderWidth: '1px',
          borderColor: ACCENT,
          background: ACCENT_05,
          boxShadow: 'none',
          borderRadius: '50%',
          duration: 0.30, ease: 'power2.out',
        });
        break;

      // ── BUTTON — LuminousButton ─────────────────────────────
      case 'button':
        gsap.to(dot, {
          opacity: 0, scale: 0,
          duration: 0.20, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '52px', height: '52px',
          borderWidth: '1px',
          borderColor: ACCENT,
          background: ACCENT_08,
          boxShadow: `0 0 14px ${ACCENT_30}, 0 0 28px rgba(226,209,195,0.12)`,
          borderRadius: '50%',
          duration: 0.35, ease: 'power2.out',
        });
        break;

      // ── CARD-VIEW — cartes jury / galerie ───────────────────
      case 'card-view':
        gsap.to(dot, {
          opacity: 0, scale: 0,
          duration: 0.22, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '78px', height: '78px',
          borderWidth: '1px',
          borderColor: ACCENT_30,
          background: ACCENT_05,
          boxShadow: 'none',
          borderRadius: '50%',
          duration: 0.40, ease: 'power2.out',
        });
        // Apparition label
        lbl.querySelector('.cursor-label-text').textContent = 'VOIR  ·  VOIR  ·  VOIR  ·  ';
        lbl.style.animationDirection = 'normal';
        gsap.to(lbl, {
          opacity: 1, scale: 1,
          duration: 0.35, ease: 'back.out(1.4)',
        });
        break;

      // ── CARD-PLAY — cartes film ─────────────────────────────
      case 'card-play':
        gsap.to(dot, {
          opacity: 0, scale: 0,
          duration: 0.22, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '78px', height: '78px',
          borderWidth: '1px',
          borderColor: ACCENT_30,
          background: ACCENT_05,
          boxShadow: 'none',
          borderRadius: '50%',
          duration: 0.40, ease: 'power2.out',
        });
        lbl.querySelector('.cursor-label-text').textContent = 'PLAY  ·  PLAY  ·  PLAY  ·  ';
        lbl.style.animationDirection = 'reverse';
        gsap.to(lbl, {
          opacity: 1, scale: 1,
          duration: 0.35, ease: 'back.out(1.4)',
        });
        break;

      // ── TEXT — inputs, textarea ─────────────────────────────
      case 'text':
        gsap.to(dot, {
          opacity: 0, scale: 0,
          duration: 0.18, ease: 'power2.out',
        });
        gsap.to(ring, {
          width: '1.5px', height: '22px',
          borderWidth: '0px',
          borderColor: 'transparent',
          background: ACCENT,
          boxShadow: 'none',
          borderRadius: '1px',
          duration: 0.22, ease: 'power2.out',
        });
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // ── Masquer jusqu'au premier mouvement ──────────────────
    gsap.set([dot, ring], { opacity: 0 });

    // ── Listener souris ─────────────────────────────────────
    function onMouseMove(e) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      // Affichage au premier mouvement
      if (!isVisible.current) {
        isVisible.current = true;
        gsap.to(dot,  { opacity: 1, duration: 0.3 });
        gsap.to(ring, { opacity: 1, duration: 0.5 });
      }

      // Déplacement point — immédiat
      gsap.set(dot, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
      });

      // Détection état contextuel
      const state = getCursorState(e.target);
      applyState(state);
    }

    // ── Masquage en quittant la fenêtre ─────────────────────
    function onMouseLeave() {
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    }
    function onMouseEnter() {
      if (isVisible.current) {
        gsap.to(dot,  { opacity: 1, duration: 0.25 });
        gsap.to(ring, { opacity: 1, duration: 0.35 });
      }
    }

    document.addEventListener('mousemove',  onMouseMove,  { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // ── GSAP ticker — lerp anneau ──────────────────────────
    function tick() {
      const lf = reduced ? 1 : LERP_FACTOR;
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * lf;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * lf;
      gsap.set(ring, {
        x: ringPos.current.x,
        y: ringPos.current.y,
        xPercent: -50,
        yPercent: -50,
      });
    }
    gsap.ticker.add(tick);

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      gsap.ticker.remove(tick);
    };
  }, []);

  // ── Styles inline — position fixed, z-index maximal ───────
  const BASE = {
    position:      'fixed',
    pointerEvents: 'none',
    zIndex:        99999,
    willChange:    'transform',
  };

  return (
    <>
      {/* A — Point central */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...BASE,
          top:          0,
          left:         0,
          width:        '6px',
          height:       '6px',
          borderRadius: '50%',
          background:   ACCENT,
        }}
      />

      {/* B — Anneau */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...BASE,
          top:          0,
          left:         0,
          width:        '30px',
          height:       '30px',
          borderRadius: '50%',
          border:       `1px solid ${ACCENT_55}`,
          background:   'transparent',
          mixBlendMode: 'normal',
          // Transitions CSS sur les propriétés morphiques
          transition:   `width 0.35s cubic-bezier(0.22,1,0.36,1),
                         height 0.35s cubic-bezier(0.22,1,0.36,1),
                         border-color 0.30s ease,
                         background 0.30s ease,
                         box-shadow 0.30s ease,
                         border-radius 0.22s ease,
                         border-width 0.22s ease`,
        }}
      >
        {/* C — Label rotatif SVG */}
        <div
          ref={labelRef}
          aria-hidden="true"
          style={{
            position:  'absolute',
            top:       '50%',
            left:      '50%',
            width:     '78px',
            height:    '78px',
            transform: 'translate(-50%,-50%) scale(0)',
            opacity:   0,
            // Animation rotation — définie dans cursor.css
            animation: 'cursor-spin 9s linear infinite',
          }}
        >
          <svg
            viewBox="0 0 78 78"
            width="78"
            height="78"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <path
                id="cursor-circle-path"
                d={`M 39,39 m -${LABEL_R},0 a ${LABEL_R},${LABEL_R} 0 1,1 ${LABEL_R * 2},0 a ${LABEL_R},${LABEL_R} 0 1,1 -${LABEL_R * 2},0`}
              />
            </defs>
            <text
              fontFamily  = "var(--font-sans)"
              fontWeight  = "700"
              fontSize    = "7.5"
              letterSpacing="0.22em"
              fill        = {ACCENT}
              opacity     = "0.85"
            >
              <textPath
                href         = "#cursor-circle-path"
                startOffset  = "0%"
              >
                <tspan className="cursor-label-text">
                  VOIR  ·  VOIR  ·  VOIR  ·  
                </tspan>
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}