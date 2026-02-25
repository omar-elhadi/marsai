/**
 * SectionCTA.jsx — MARSAI Festival
 * "Intégrez la matrice."
 *
 * ═══════════════════════════════════════════════════════════════
 * DIRECTION VISUELLE : L'appel final — polarité inversée
 * ═══════════════════════════════════════════════════════════════
 *
 * La seule section claire du site — fond var(--color-text).
 * Le contraste maximal signale la fin du voyage et l'appel.
 *
 * Titre révélé mot par mot — rideau clip-path GSAP.
 * Sous-titre : une ligne sobre, dense, poétique.
 * Bouton : LuminousButton en variante 'light' —
 *   barre sombre, halo sombre, transition noire au click.
 *
 * Animation ScrollTrigger :
 *   Ligne fond : scaleX 0→1 depuis la gauche
 *   Mots titre : clip-path inset(100%→0%) stagger 130ms
 *   Sous-titre + bouton : fade + rise
 * ═══════════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LuminousButton from './LuminousButton';

gsap.registerPlugin(ScrollTrigger);

const MOTS = ['Intégrez', 'la', 'matrice.'];

export default function SectionCTA() {
  const sectionRef   = useRef(null);
  const lineRef      = useRef(null);
  const word1Ref     = useRef(null);
  const word2Ref     = useRef(null);
  const word3Ref     = useRef(null);
  const subtitleRef  = useRef(null);
  const btnRef       = useRef(null);

  const wordRefs = [word1Ref, word2Ref, word3Ref];

  useGSAP(() => {
    // États initiaux
    gsap.set(lineRef.current,     { scaleX: 0, transformOrigin: 'left center' });
    wordRefs.forEach(r => gsap.set(r.current, { yPercent: 110 }));
    gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
    gsap.set(btnRef.current,      { opacity: 0, y: 16 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top 70%',
      once:    true,
      onEnter() {
        const tl = gsap.timeline();

        // Filet sable — s'étire depuis la gauche
        tl.to(lineRef.current, {
          scaleX: 1, duration: 0.8, ease: 'power2.inOut',
        });

        // Mots — rideau de bas en haut, stagger 130ms
        tl.to(wordRefs.map(r => r.current), {
          yPercent: 0,
          duration: 0.85,
          stagger:  0.13,
          ease:     'power3.out',
        }, 0.25);

        // Sous-titre
        tl.to(subtitleRef.current, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, 0.70);

        // Bouton
        tl.to(btnRef.current, {
          opacity: 1, y: 0,
          duration: 0.60, ease: 'power2.out',
        }, 0.88);
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="soumettre"
      aria-label="Soumettre un film — appel à candidatures MARSAI"
      style={{
        background: 'var(--color-text)',
        padding:    'clamp(5rem,12vw,10rem) clamp(1.5rem,5vw,6rem)',
        overflow:   'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Filet sable — ligne supérieure dramatique */}
        <div
          ref={lineRef}
          aria-hidden="true"
          style={{
            height:       '1px',
            background:   'var(--color-accent)',
            marginBottom: 'clamp(3rem,6vw,5rem)',
            opacity:      0.5,
          }}
        />

        {/* Titre — mots révélés un par un */}
        <div
          style={{
            display:    'flex',
            flexWrap:   'wrap',
            gap:        '0 clamp(0.4rem,1.5vw,1.2rem)',
            marginBottom: 'clamp(2rem,4vw,3.5rem)',
          }}
        >
          {MOTS.map((mot, i) => (
            <div
              key={mot}
              style={{ overflow: 'hidden', lineHeight: 0.95 }}
            >
              <span
                ref={wordRefs[i]}
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-display)',
                  fontWeight:    900,
                  fontSize:      'clamp(3rem,9vw,8.5rem)',
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  // Sur fond clair — texte sombre
                  color:         mot === 'matrice.' ? 'var(--color-bg-pure)' : 'var(--color-bg)',
                  paddingBottom: '0.06em',
                }}
              >
                {mot}
              </span>
            </div>
          ))}
        </div>

        {/* Sous-titre — dense, poétique */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily:    'var(--font-sans)',
            fontWeight:    300,
            fontSize:      'clamp(0.95rem,1.8vw,1.25rem)',
            letterSpacing: '0.05em',
            color:         'rgba(15,15,15,0.55)',
            marginBottom:  'clamp(2.5rem,5vw,4rem)',
            maxWidth:      '44ch',
          }}
        >
          600 cinéastes. Une minute. L'éternité.
        </p>

        {/* Bouton — LuminousButton variante light */}
        <div ref={btnRef}>
          <LuminousButton
            label   = "Soumettre une œuvre"
            to      = "/soumettre"
            variant = "light"
            size    = "lg"
          />
        </div>

      </div>
    </section>
  );
}