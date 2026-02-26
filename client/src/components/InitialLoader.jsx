/**
 * InitialLoader.jsx — MARSAI Festival · Phase 12
 * "L'Ouverture"
 *
 * ═══════════════════════════════════════════════════════════════
 * CONCEPT : Entrer dans le cinéma
 * ═══════════════════════════════════════════════════════════════
 *
 * Le visiteur arrive. La salle est dans le noir.
 * Le nom du festival s'embrase comme un carton titre de film.
 * Puis le rideau — 8 lés de velours noir aux largeurs irrégulières —
 * se lève en vague, révélant le hero qui s'éveille simultanément.
 *
 * ═══════════════════════════════════════════════════════════════
 * SÉQUENCE TEMPORELLE
 * ═══════════════════════════════════════════════════════════════
 *
 *  0.00s — Noir absolu. Grain de pellicule actif.
 *           Filet horizontal central (splice de film).
 *  0.45s — "MARSAI" s'embrase depuis le flou (blur 28px → 0)
 *           letterSpacing se détend (-0.04em → -0.02em)
 *  1.55s — Sous-titre : "FESTIVAL DU CINÉMA PAR I.A."
 *           rise+fade label-overline
 *  2.05s — Localisation + date : "MARSEILLE · 20—22 JUIN 2026"
 *  2.65s — HOLD — le carton titre complet respire 0.45s
 *  3.00s — Textes effacés (0.18s fade rapide)
 *  3.10s — onReady() — HeroImpact reçoit le signal, commence
 *           son animation (delay:0.2 → démarre à 3.30s)
 *  3.10s — 8 lés commencent à se lever (stagger 48ms)
 *           Dernier lé : 3.10 + 7×0.048 + 0.65 = 4.086s
 *           À ce moment : Hero est à 0.79s → titre MARSAI
 *           est exactement en train de cristalliser. ✦
 *  4.20s — Loader unmount + sessionStorage flag
 *
 * ═══════════════════════════════════════════════════════════════
 * ARCHITECTURE DES LÉS — RIDEAU ORGANIQUE
 * ═══════════════════════════════════════════════════════════════
 *
 *  8 lés aux largeurs délibérément inégales (11.5 à 14.0%)
 *  Chaque lé :
 *    — Fond var(--color-bg-pure)
 *    — Grain SVG (opacités alternées)
 *    — Bord inférieur sable lumineux (traîne du rideau)
 *    — Soulèvement translateY(0) → translateY(-105%)
 *    — power3.inOut — 650ms — élan et decélération velours
 *
 * ═══════════════════════════════════════════════════════════════
 * ACTIVATION
 * ═══════════════════════════════════════════════════════════════
 *
 *  Une seule fois par session (sessionStorage).
 *  Retours → composant retourne null → HeroImpact loaderReady:true
 *  → anime normalement avec son delay:0.2 natif.
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────
// GRAIN SVG
// ─────────────────────────────────────────────────────────────
const GRAIN_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.90' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─────────────────────────────────────────────────────────────
// LÉS DU RIDEAU — largeurs organiques (somme = 100%)
// ─────────────────────────────────────────────────────────────
//   11.5 + 13.0 + 11.0 + 13.5 + 12.5 + 11.0 + 13.5 + 14.0 = 100%
const STRIPS = [
  { id: 0, left: '0%',     width: '11.5%', grainOpacity: 0.042 },
  { id: 1, left: '11.5%',  width: '13.0%', grainOpacity: 0.055 },
  { id: 2, left: '24.5%',  width: '11.0%', grainOpacity: 0.038 },
  { id: 3, left: '35.5%',  width: '13.5%', grainOpacity: 0.060 },
  { id: 4, left: '49.0%',  width: '12.5%', grainOpacity: 0.045 },
  { id: 5, left: '61.5%',  width: '11.0%', grainOpacity: 0.052 },
  { id: 6, left: '72.5%',  width: '13.5%', grainOpacity: 0.040 },
  { id: 7, left: '86.0%',  width: '14.0%', grainOpacity: 0.058 },
];

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function InitialLoader({ onComplete }) {
  const overlayRef  = useRef(null);   // Fond noir global
  const titleRef    = useRef(null);   // "MARSAI"
  const subtitleRef = useRef(null);   // Sous-titre festival
  const locationRef = useRef(null);   // Localisation + date
  const spliceRef   = useRef(null);   // Filet central
  const textsRef    = useRef(null);   // Wrapper tous les textes
  const stripsRef   = useRef([]);     // Les 8 lés du rideau

  useEffect(() => {
    const overlay  = overlayRef.current;
    const title    = titleRef.current;
    const subtitle = subtitleRef.current;
    const location = locationRef.current;
    const splice   = spliceRef.current;
    const texts    = textsRef.current;
    const strips   = stripsRef.current;

    if (!overlay || !title || strips.some(s => !s)) return;

    // ── États initiaux ──────────────────────────────────────
    gsap.set(title,    { opacity: 0, filter: 'blur(28px)', letterSpacing: '-0.06em' });
    gsap.set(subtitle, { opacity: 0, y: 12 });
    gsap.set(location, { opacity: 0, y: 8 });
    gsap.set(splice,   { scaleX: 0 });
    gsap.set(strips,   { y: '0%' });

    const tl = gsap.timeline();

    // ── Phase 1 : Grain + filet de splice ──────────────────
    // 0.00s — Noir absolu, le filet pulse doucement
    tl.to(splice, {
      scaleX:   1,
      opacity:  0.22,
      duration: 0.40,
      ease:     'power2.out',
    }, 0.15);

    // ── Phase 2 : Embrasement du titre ─────────────────────
    // 0.45s — MARSAI cristallise depuis le flou
    tl.to(title, {
      opacity:       1,
      filter:        'blur(0px)',
      letterSpacing: '-0.03em',
      duration:      1.10,
      ease:          'power2.out',
    }, 0.45);

    // ── Phase 3 : Sous-titre ───────────────────────────────
    tl.to(subtitle, {
      opacity:  1,
      y:        0,
      duration: 0.60,
      ease:     'power2.out',
    }, 1.55);

    // ── Phase 4 : Localisation ─────────────────────────────
    tl.to(location, {
      opacity:  1,
      y:        0,
      duration: 0.55,
      ease:     'power2.out',
    }, 2.05);

    // ── Phase 5 : HOLD (respiration) ──────────────────────
    // 2.65s → 3.00s : 0.35s de silence. Le carton titre complet.

    // ── Phase 6 : Effacement des textes ───────────────────
    tl.to(texts, {
      opacity:  0,
      duration: 0.18,
      ease:     'power1.in',
    }, 2.90);

    // ── Phase 7 : Signal → HeroImpact peut démarrer ───────
    // 3.10s — loaderReady = true → HeroImpact lance son tl (delay:0.2)
    // Le rideau commence à se lever en même temps.
    tl.call(() => { onComplete(); }, [], 3.10);

    // ── Phase 8 : Rideau se lève ───────────────────────────
    // 8 lés, stagger 48ms de gauche à droite
    // Dernier lé levé à 3.10 + 7×0.048 + 0.65 = 4.086s
    STRIPS.forEach((_, i) => {
      tl.to(strips[i], {
        y:        '-105%',
        duration:  0.65,
        ease:      'power3.inOut',
      }, 3.10 + i * 0.048);
    });

    // ── Phase 9 : Cleanup ─────────────────────────────────
    // 4.20s — L'overlay lui-même disparaît, sessionStorage posé
    tl.call(() => {
      sessionStorage.setItem('marsai_loaded', '1');
      // L'overlay n'est plus visible — on peut le retirer
      if (overlay) {
        overlay.style.display = 'none';
      }
    }, [], 4.20);

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      aria-label="Chargement du festival MARSAI"
      role="status"
      style={{
        position:  'fixed',
        inset:     0,
        zIndex:    10000,
        background: 'var(--color-bg-pure)',
        overflow:  'hidden',
        // pointer-events: none une fois les rideaux levés ne sert à rien
        // car le composant se retire de lui-même
      }}
    >

      {/* ── Grain de pellicule global ──────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: GRAIN_URI,
          backgroundSize:  '200px 200px',
          opacity:         0.055,
          mixBlendMode:    'overlay',
          pointerEvents:   'none',
          animation:       'loader-grain 0.12s steps(1) infinite',
        }}
      />

      {/* ── Filet de splice — ligne horizontale centrale ── */}
      <div
        ref={spliceRef}
        aria-hidden="true"
        style={{
          position:        'absolute',
          top:             '50%',
          left:            0,
          right:           0,
          height:          '1px',
          background:      'linear-gradient(to right, transparent 0%, rgba(226,209,195,0.35) 15%, rgba(226,209,195,0.55) 50%, rgba(226,209,195,0.35) 85%, transparent 100%)',
          transform:       'scaleX(0)',
          transformOrigin: 'center',
          opacity:         0,
        }}
      />

      {/* ── Textes — wrapper global pour effacement groupé ── */}
      <div
        ref={textsRef}
        style={{
          position:        'absolute',
          inset:           0,
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             'clamp(1rem, 2vw, 1.6rem)',
          padding:         '0 clamp(1.5rem, 5vw, 6rem)',
          pointerEvents:   'none',
        }}
      >
        {/* MARSAI — titre principal */}
        <h1
          ref={titleRef}
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(4rem, 16vw, 13rem)',
            letterSpacing: '-0.06em',
            lineHeight:    1,
            textTransform: 'uppercase',
            color:         'var(--color-text)',
            margin:        0,
            textAlign:     'center',
            // Légère texture lumineuse sur le texte
            textShadow:    '0 0 80px rgba(226,209,195,0.08)',
          }}
        >
          MARSAI
        </h1>

        {/* Sous-titre festival */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    600,
            fontSize:      'clamp(0.58rem, 1.1vw, 0.72rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'rgba(226,209,195,0.70)',
            margin:        0,
            textAlign:     'center',
          }}
        >
          Festival du Cinéma par Intelligence Artificielle
        </p>

        {/* Séparateur */}
        <div
          aria-hidden="true"
          style={{
            width:      'clamp(2rem, 4vw, 3.5rem)',
            height:     '1px',
            background: 'rgba(226,209,195,0.30)',
          }}
        />

        {/* Localisation + date */}
        <p
          ref={locationRef}
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    400,
            fontSize:      'clamp(0.55rem, 0.95vw, 0.66rem)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(241,245,249,0.35)',
            margin:        0,
            textAlign:     'center',
          }}
        >
          Marseille · 20 — 22 Juin 2026
        </p>
      </div>

      {/* ── 8 Lés du rideau ────────────────────────────── */}
      {STRIPS.map((strip, i) => (
        <div
          key={strip.id}
          ref={el => { stripsRef.current[i] = el; }}
          aria-hidden="true"
          style={{
            position:         'absolute',
            top:              0,
            bottom:           0,
            left:             strip.left,
            width:            strip.width,
            background:       'var(--color-bg-pure)',
            // Légère variation de teinte entre lés — plis du velours
            filter:           i % 2 === 0 ? 'brightness(1)' : 'brightness(0.92)',
            willChange:       'transform',
          }}
        >
          {/* Grain propre à chaque lé */}
          <div
            aria-hidden="true"
            style={{
              position:        'absolute',
              inset:           0,
              backgroundImage: GRAIN_URI,
              backgroundSize:  '180px 180px',
              opacity:         strip.grainOpacity,
              mixBlendMode:    'overlay',
              pointerEvents:   'none',
            }}
          />

          {/* Traîne lumineuse — bord inférieur du lé */}
          <div
            aria-hidden="true"
            style={{
              position:   'absolute',
              bottom:     0,
              left:       0,
              right:      0,
              height:     '2px',
              background: 'linear-gradient(to right, transparent 0%, rgba(226,209,195,0.18) 30%, rgba(226,209,195,0.32) 50%, rgba(226,209,195,0.18) 70%, transparent 100%)',
            }}
          />
        </div>
      ))}

      {/* ── Keyframes grain animé ──────────────────────── */}
      <style>{`
        @keyframes loader-grain {
          0%   { background-position: 0 0; }
          25%  { background-position: 40px -30px; }
          50%  { background-position: -20px 50px; }
          75%  { background-position: 60px 20px; }
          100% { background-position: -40px -60px; }
        }
      `}</style>
    </div>
  );
}