/**
 * Home.jsx — MARSAI Festival · Page d'accueil
 *
 * ARCHITECTURE NARRATIVE
 * ─────────────────────────────────────────────
 *  §0  HeroImpact         100dvh  L'Ouverture         (composant existant, intact)
 *  §1  Manifesto          200vh   La Déclaration       (ligne par ligne · Meijisakaba)
 *  §2  Acte I : L'Éveil   100vh   Qu'est-ce que MARSAI (bleu nuit · électrique)
 *  §3  Acte II : La Fusion 100vh  1 min · 1 film · 1 IA (violet profond · tension)
 *  §4  Acte III : Lumière  100vh  Jury · Récompenses   (ambre chaud · humanité)
 *  §5  Le Nexus            auto   Marseille · La scène  (carte · préservée intacte)
 *  §6  La Constellation   250vh   Option E — films=étoiles, 3 bandes infinies
 *  §7  Alliances            auto  Partenaires           (élégant · minimal)
 *  §8  L'Appel             100vh  CTA Dramatique Final  (noir absolu · urgence)
 *
 * LOIS APPLIQUÉES
 * ─────────────────
 *  Peak-End Rule   : §8 est l'inverse émotionnel du §0 — même noir, réponse opposée
 *  Von Restorff    : un seul élément ambre à la fois dans le champ visuel
 *  Fitts's Law     : CTA final 2× plus grand que tous les autres
 *  Goal-Gradient   : compteur de films soumis → "la constellation grandit avec vous"
 *  Miller's Law    : jamais plus de 7 éléments concurrents dans le même champ visuel
 *  Aesthetic-Usab. : liquid glass sur tous les CTA = perçu plus fiable
 *
 * PRÉSERVÉ DU CODE ORIGINAL
 * ──────────────────────────
 *  IDs : #jury, #lieu, #recompenses, #partenaires — liens footer fonctionnels
 *  Données : Alice Dupont, Marc Leroy, Sophie Martin · 4 récompenses · 4 partenaires
 *  Composants : <HeroImpact /> <Reveal /> <Parallax /> — inchangés
 *  Iframe Google Maps — intacte
 * ════════════════════════════════════════════════════════════════════
 */

import { useRef, useEffect, useState }        from 'react';
import { Link }                                from 'react-router-dom';
import gsap                                    from 'gsap';
import { useGSAP }                             from '@gsap/react';
import { ScrollTrigger }                       from 'gsap/ScrollTrigger';
import HeroImpact                              from '../../components/animations/HeroImpact';
import Reveal                                  from '../../components/animations/Reveal';
import Parallax                                from '../../components/animations/Parallax';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════════════════════════
// DONNÉES — MANIFESTE
// 7 lignes. Contraste de graisses : Outfit 900 vs 200.
// La tension entre les poids = la tension entre humain et machine.
// ════════════════════════════════════════════════════════════════════
const MANIFESTO = [
  { text: 'L\'intelligence artificielle', w: 200, size: 'clamp(1.8rem, 3.5vw, 3rem)',    align: 'left'   },
  { text: 'rêve maintenant.',            w: 900, size: 'clamp(3rem,   6.5vw, 5.5rem)',  align: 'left'   },
  { text: 'Elle rêve en images,',        w: 200, size: 'clamp(1.4rem, 2.8vw, 2.4rem)',  align: 'right'  },
  { text: 'en mouvements,',             w: 200, size: 'clamp(1.4rem, 2.8vw, 2.4rem)',  align: 'right'  },
  { text: 'en émotions.',               w: 900, size: 'clamp(2.8rem, 5.5vw, 4.8rem)',  align: 'right'  },
  { text: 'Vous avez 60 secondes',       w: 300, size: 'clamp(1.5rem, 3vw,   2.6rem)',  align: 'center' },
  { text: 'pour lui donner une âme.',   w: 900, size: 'clamp(2.5rem, 5vw,   4.2rem)',  align: 'center' },
];

// ════════════════════════════════════════════════════════════════════
// DONNÉES — LES TROIS ACTES
// Split-Complementary (bleu #0033FF ↔ violet #977DFF ↔ ambre #FBB924)
// Chaque acte a sa propre émotion-couleur.
// ════════════════════════════════════════════════════════════════════
const ACTS = [
  {
    id:      'act-eveil',
    number:  '01',
    label:   "L'Éveil",
    title:   'Créer avec l\'I.A.',
    body:    'Un festival international dédié aux films nés de la collaboration entre l\'intuition humaine et l\'intelligence artificielle. Chaque œuvre : une minute. Chaque auteur : un visionnaire.',
    bg:      'radial-gradient(ellipse 80% 60% at 25% 55%, rgba(0,22,80,0.90) 0%, rgba(5,5,8,1) 60%)',
    accent:  '#0033FF',
    rgb:     '0, 51, 255',
    icon:    '◉',
  },
  {
    id:      'act-fusion',
    number:  '02',
    label:   'La Fusion',
    title:   '1 minute. 1 film. 1 I.A.',
    body:    'La règle est absolue. Votre voix humaine. L\'intelligence de la machine. De cette collision nécessaire naît une nouvelle forme d\'art — inédite, inattendue, inéluctable.',
    bg:      'radial-gradient(ellipse 70% 65% at 75% 45%, rgba(20,6,48,0.92) 0%, rgba(5,5,8,1) 58%)',
    accent:  '#977DFF',
    rgb:     '151, 125, 255',
    icon:    '⟺',
  },
  {
    id:      'act-lumiere',
    number:  '03',
    label:   'La Lumière',
    title:   'Les meilleures œuvres seront vues.',
    body:    'Un jury d\'élite. Une cérémonie. Les films sélectionnés seront projetés devant le monde. Les auteurs récompensés. L\'histoire, écrite.',
    bg:      'radial-gradient(ellipse 75% 70% at 50% 85%, rgba(38,16,0,0.92) 0%, rgba(5,5,8,1) 58%)',
    accent:  '#FBB924',
    rgb:     '251, 185, 36',
    icon:    '★',
  },
];

// ════════════════════════════════════════════════════════════════════
// DONNÉES — JURY (préservées exactement)
// ════════════════════════════════════════════════════════════════════
const JURY = [
  { name: 'Alice Dupont',  role: 'Innovation',   index: '01' },
  { name: 'Marc Leroy',    role: 'Design',        index: '02' },
  { name: 'Sophie Martin', role: 'R&D I.A.',      index: '03' },
];

// ════════════════════════════════════════════════════════════════════
// DONNÉES — RÉCOMPENSES (préservées exactement)
// ════════════════════════════════════════════════════════════════════
const REWARDS = [
  { n: '01', title: 'Trophées I.A.',    desc: 'Pour les 3 premiers lauréats.'               },
  { n: '02', title: 'Fonds de Création', desc: 'Prix en espèces et dotations matérielles.'  },
  { n: '03', title: 'Réseau d\'Élite',   desc: 'Networking direct avec les investisseurs.'   },
  { n: '04', title: 'Certification',    desc: 'Label d\'excellence MARSAI pour tous.'        },
];

// ════════════════════════════════════════════════════════════════════
// DONNÉES — CONSTELLATION (3 bandes, films placeholders)
// Quand le backend fournit des films réels, remplacer ces arrays.
// Structure identique aux données API : { id, title, genre, author }
// ════════════════════════════════════════════════════════════════════
const FILMS_ROW1 = [
  { id: 'f1',  title: 'Fragments',  genre: 'Expérimental', author: 'A. Morel'     },
  { id: 'f2',  title: 'Nexus',      genre: 'Sci-Fi',        author: 'T. Bernard'   },
  { id: 'f3',  title: 'Lumière',    genre: 'Poésie',        author: 'S. Petit'     },
  { id: 'f4',  title: 'Genèse',     genre: 'Création',      author: 'M. Laurent'   },
];
const FILMS_ROW2 = [
  { id: 'f5',  title: 'Mémoire',    genre: 'Intimiste',     author: 'C. Dubois'    },
  { id: 'f6',  title: 'Écho',       genre: 'Drame',         author: 'P. Garnier'   },
  { id: 'f7',  title: 'Pulse',      genre: 'Action',        author: 'R. Fontaine'  },
  { id: 'f8',  title: 'Horizon',    genre: 'Contemplation', author: 'L. Moreau'    },
  { id: 'f9',  title: 'Rêve',       genre: 'Onirique',      author: 'E. Simon'     },
  { id: 'f10', title: 'Signal',     genre: 'Abstrait',      author: 'N. Lefort'    },
];
const FILMS_ROW3 = [
  { id: 'f11', title: 'Synapse',    genre: 'Tech',          author: 'V. Blanc'     },
  { id: 'f12', title: 'Code',       genre: 'Cyber',         author: 'A. Renard'    },
  { id: 'f13', title: 'Onde',       genre: 'Abstrait',      author: 'F. Aubert'    },
  { id: 'f14', title: 'Cellule',    genre: 'Bio',           author: 'G. Lebrun'    },
  { id: 'f15', title: 'Vortex',     genre: 'Expérimental',  author: 'H. Collin'    },
  { id: 'f16', title: 'Miroir',     genre: 'Psyché',        author: 'I. Girard'    },
  { id: 'f17', title: 'Trace',      genre: 'Mémoire',       author: 'J. Perrin'    },
  { id: 'f18', title: 'Zéro',       genre: 'Minimalisme',   author: 'K. Dupuis'    },
];

// ════════════════════════════════════════════════════════════════════
// ÉTOILES — positions déterministes (jamais Math.random au render)
// Formule : i * golden_ratio % 1 pour distribution uniforme
// ════════════════════════════════════════════════════════════════════
const STARS = Array.from({ length: 90 }, (_, i) => ({
  left:     `${((i * 61.803 + 7.2) % 100).toFixed(2)}%`,
  top:      `${((i * 38.197 + 11.8) % 100).toFixed(2)}%`,
  size:     ((i % 3) + 1),
  dur:      `${2.2 + ((i * 0.37) % 3.8).toFixed(1)}s`,
  delay:    `${((i * 0.31) % 4.9).toFixed(1)}s`,
  opacity:  (0.12 + ((i % 7) * 0.09)).toFixed(2),
}));

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — FilmCard
// Liquid glass treatment sur chaque carte film.
// Structure physique identique aux boutons de navigation.
// ════════════════════════════════════════════════════════════════════
const FilmCard = ({ film, size = 'md' }) => {
  const sizes = {
    lg: { width: 264, height: 158, radius: 14, titleSize: '0.85rem' },
    md: { width: 204, height: 124, radius: 12, titleSize: '0.75rem' },
    sm: { width: 164, height: 100, radius: 10, titleSize: '0.68rem' },
  };
  const s = sizes[size];

  return (
    <div
      style={{
        flexShrink:           0,
        width:                s.width,
        height:               s.height,
        borderRadius:         s.radius,
        background:           'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:               '0.5px solid rgba(255,255,255,0.14)',
        boxShadow:            [
          'inset 0 1px 0 rgba(255,255,255,0.25)',
          'inset 0 -0.5px 0 rgba(255,255,255,0.08)',
          '0 8px 32px rgba(0,0,0,0.55)',
          '0 0 0 0.5px rgba(255,255,255,0.07)',
        ].join(', '),
        position:             'relative',
        overflow:             'hidden',
        cursor:               'default',
      }}
    >
      {/* Fond bruité film */}
      <div style={{
        position:   'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(12,14,28,0.95) 0%, rgba(5,5,8,1) 100%)',
      }} />

      {/* Arc spéculaire haut */}
      <div style={{
        position:     'absolute', top: 0, left: '8%', right: '8%',
        height:       '38%',
        background:   'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 100%)',
        borderRadius: '0 0 50% 50%',
        opacity:      0.55,
      }} />

      {/* Rim prismatique bas */}
      <div style={{
        position:   'absolute', left: 0, right: 0, bottom: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,80,180,0.50) 20%, rgba(80,200,255,0.55) 40%, rgba(255,215,80,0.50) 60%, rgba(80,100,255,0.55) 80%, transparent)',
        opacity:    0.75,
      }} />

      {/* Contenu */}
      <div style={{
        position:   'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end',
        padding:    '0 12px 10px',
      }}>
        {/* Badge durée */}
        <div style={{
          position:      'absolute', top: 9, right: 10,
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    600,
          fontSize:      '0.52rem',
          letterSpacing: '0.14em',
          color:         'rgba(251,185,36,0.85)',
          background:    'rgba(251,185,36,0.08)',
          border:        '0.5px solid rgba(251,185,36,0.25)',
          borderRadius:  999,
          padding:       '2px 6px',
        }}>01:00</div>

        {/* Badge genre */}
        <div style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    300,
          fontSize:      '0.50rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.35)',
          marginBottom:  4,
        }}>{film.genre}</div>

        {/* Titre */}
        <div style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    700,
          fontSize:      s.titleSize,
          letterSpacing: '0.04em',
          color:         'rgba(255,255,255,0.92)',
          lineHeight:    1.15,
        }}>{film.title}</div>

        {/* Auteur */}
        <div style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    300,
          fontSize:      '0.52rem',
          color:         'rgba(255,255,255,0.30)',
          marginTop:     3,
          letterSpacing: '0.08em',
        }}>{film.author}</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — ManifestoSection
// Chaque ligne arrive depuis le bas, filtre blur dissout.
// Alternance gauche/droite/centre — rythme Meijisakaba.
// ════════════════════════════════════════════════════════════════════
const ManifestoSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const lines = gsap.utils.toArray('.manifesto-line', sectionRef.current);
    lines.forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0, y: 55, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.0,
          ease:     'power3.out',
          scrollTrigger: {
            trigger: line,
            start:   'top 85%',
            end:     'top 50%',
            once:    true,
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-label="Manifeste MARSAI"
      style={{
        background:    '#050508',
        padding:       'clamp(6rem, 12vh, 10rem) clamp(1.5rem, 6vw, 8rem)',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Filet ambre — transition depuis HeroImpact */}
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(251,185,36,0.25) 30%, rgba(255,255,255,0.15) 50%, rgba(251,185,36,0.25) 70%, transparent)',
      }} />

      {/* Lignes du manifeste */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {MANIFESTO.map((line, i) => (
          <div
            key={i}
            className="manifesto-line"
            style={{
              textAlign:     line.align,
              marginBottom:  i < MANIFESTO.length - 1 ? 'clamp(1.2rem, 2.5vh, 2.4rem)' : 0,
              willChange:    'transform, opacity',
            }}
          >
            <span style={{
              fontFamily:  "'Outfit', -apple-system, sans-serif",
              fontWeight:  line.w,
              fontSize:    line.size,
              lineHeight:  1.1,
              color:       line.w >= 700 ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.42)',
              letterSpacing: line.w >= 700 ? '-0.02em' : '0.01em',
              display:     'block',
            }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Filet de bas — prépare l'Acte I */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,51,255,0.20) 50%, transparent)',
      }} />
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — ActSection (réutilisable · 3 instances)
//
// Layout :
//   [grand numéro en fond, opacité fantôme]
//   [label acte]
//   [grand titre]
//   [corps de texte]
//   [children optionnel — jury, récompenses, etc.]
//
// ScrollTrigger :
//   - Le numéro de fond entre à opacity 0 → 0.06
//   - Le titre monte depuis y:70
//   - Le corps fade in avec 0.15s de délai
// ════════════════════════════════════════════════════════════════════
const ActSection = ({ act, id, children }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Numéro fantôme en fond
    const bgNum  = sectionRef.current.querySelector('.act-bg-number');
    const title  = sectionRef.current.querySelector('.act-title');
    const body   = sectionRef.current.querySelector('.act-body');
    const label  = sectionRef.current.querySelector('.act-label');
    const inner  = sectionRef.current.querySelector('.act-inner');

    if (bgNum) {
      gsap.fromTo(bgNum,
        { opacity: 0, x: 40 },
        {
          opacity: 0.055, x: 0,
          duration: 1.4, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      );
    }
    if (label && title && body) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
      });
      tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo(title, { opacity: 0, y: 60, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, '-=0.3')
        .fromTo(body,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.5');
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{
        position:  'relative',
        minHeight: '100vh',
        display:   'flex',
        alignItems: 'center',
        background: act.bg,
        overflow:  'hidden',
        padding:   'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 6vw, 8rem)',
      }}
    >
      {/* Numéro fantôme — fond */}
      <div
        className="act-bg-number"
        aria-hidden="true"
        style={{
          position:    'absolute',
          right:       '-0.05em',
          top:         '50%',
          transform:   'translateY(-50%)',
          fontFamily:  "'Outfit', sans-serif",
          fontWeight:  900,
          fontSize:    'clamp(12rem, 28vw, 24rem)',
          lineHeight:  1,
          color:       `rgba(${act.rgb}, 1)`,
          userSelect:  'none',
          letterSpacing: '-0.04em',
          opacity:     0,
          willChange:  'opacity, transform',
        }}
      >{act.number}</div>

      {/* Contenu */}
      <div
        className="act-inner"
        style={{ maxWidth: 760, position: 'relative', zIndex: 2 }}
      >
        {/* Label */}
        <div
          className="act-label"
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           10,
            marginBottom:  'clamp(1.2rem, 2.5vh, 2rem)',
            opacity:       0,
          }}
        >
          <span style={{
            fontFamily:    "'Outfit', sans-serif",
            fontWeight:    300,
            fontSize:      '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         `rgba(${act.rgb}, 0.70)`,
          }}>Acte {act.number}</span>
          <div style={{
            width: 28, height: '0.5px',
            background: `rgba(${act.rgb}, 0.35)`,
          }} />
          <span style={{
            fontFamily:    "'Outfit', sans-serif",
            fontWeight:    700,
            fontSize:      '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         `rgba(${act.rgb}, 0.85)`,
          }}>{act.label}</span>
        </div>

        {/* Titre */}
        <h2
          className="act-title"
          style={{
            fontFamily:    "'Outfit', sans-serif",
            fontWeight:    900,
            fontSize:      'clamp(2.2rem, 5.5vw, 4.5rem)',
            lineHeight:    1.05,
            letterSpacing: '-0.025em',
            color:         'rgba(255,255,255,0.96)',
            marginBottom:  'clamp(1rem, 2.5vh, 2rem)',
            opacity:       0,
            willChange:    'transform, opacity',
          }}
        >{act.title}</h2>

        {/* Corps */}
        <p
          className="act-body"
          style={{
            fontFamily:  "'Outfit', sans-serif",
            fontWeight:  300,
            fontSize:    'clamp(1rem, 1.8vw, 1.35rem)',
            lineHeight:  1.75,
            color:       'rgba(255,255,255,0.48)',
            maxWidth:    580,
            opacity:     0,
          }}
        >{act.body}</p>

        {/* Children optionnel */}
        {children && (
          <div style={{ marginTop: 'clamp(2rem, 5vh, 4rem)' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — JuryBlock
// Intégré dans Acte III · Données préservées exactement.
// Présentation : numéros + noms + rôles — cinématographique.
// ════════════════════════════════════════════════════════════════════
const JuryBlock = () => {
  const ref = useRef(null);

  useGSAP(() => {
    const rows = gsap.utils.toArray('.jury-row', ref.current);
    rows.forEach((row, i) => {
      gsap.fromTo(row,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.7, ease: 'power2.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        }
      );
    });
  }, { scope: ref });

  return (
    <div ref={ref} id="jury" style={{ marginBottom: 'clamp(2.5rem, 6vh, 5rem)' }}>
      <div style={{
        fontFamily:    "'Outfit', sans-serif",
        fontWeight:    300,
        fontSize:      '0.65rem',
        letterSpacing: '0.40em',
        textTransform: 'uppercase',
        color:         'rgba(251,185,36,0.50)',
        marginBottom:  '1.4rem',
      }}>Le Jury</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {JURY.map((member, i) => (
          <div
            key={member.name}
            className="jury-row"
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'flex-end',
              borderBottom:   '0.5px solid rgba(251,185,36,0.12)',
              paddingBottom:  '0.8rem',
              opacity:        0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{
                fontFamily:  "'Outfit', sans-serif",
                fontWeight:  300,
                fontSize:    '0.55rem',
                color:       'rgba(251,185,36,0.45)',
                letterSpacing: '0.15em',
              }}>{member.index}</span>
              <span style={{
                fontFamily:  "'Outfit', sans-serif",
                fontWeight:  700,
                fontSize:    'clamp(1.2rem, 2.8vw, 2rem)',
                color:       'rgba(255,255,255,0.92)',
                letterSpacing: '-0.01em',
              }}>{member.name}</span>
            </div>
            <span style={{
              fontFamily:    "'Outfit', sans-serif",
              fontWeight:    300,
              fontSize:      '0.65rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'rgba(251,185,36,0.60)',
            }}>{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — RewardsGrid
// Intégré dans Acte III · Données préservées exactement.
// ════════════════════════════════════════════════════════════════════
const RewardsGrid = () => {
  const ref = useRef(null);

  useGSAP(() => {
    const items = gsap.utils.toArray('.reward-item', ref.current);
    gsap.fromTo(items,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0,
        stagger: 0.10, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
      }
    );
  }, { scope: ref });

  return (
    <div
      ref={ref}
      id="recompenses"
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap:                 '1.2rem',
      }}
    >
      {REWARDS.map((r) => (
        <div
          key={r.n}
          className="reward-item"
          style={{
            borderTop:  '0.5px solid rgba(251,185,36,0.22)',
            paddingTop: '1.2rem',
            opacity:    0,
          }}
        >
          <div style={{
            fontFamily:  "'Outfit', sans-serif",
            fontWeight:  700,
            fontSize:    '0.6rem',
            color:       'rgba(251,185,36,0.70)',
            marginBottom: 8,
            letterSpacing: '0.12em',
          }}>{r.n}.</div>
          <div style={{
            fontFamily:  "'Outfit', sans-serif",
            fontWeight:  700,
            fontSize:    'clamp(0.95rem, 1.8vw, 1.2rem)',
            color:       'rgba(255,255,255,0.92)',
            marginBottom: 6,
          }}>{r.title}</div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 300,
            fontSize:   '0.80rem',
            color:      'rgba(255,255,255,0.38)',
            lineHeight: 1.6,
          }}>{r.desc}</div>
        </div>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — ConstellationGallery — OPTION E
//
// 3 bandes horizontales infinies à vitesses différentes.
// Comme Luma mais plus dense, plus atmosphérique.
//
// Bande 1 (lente · grande) : films mis en avant  — Row1
// Bande 2 (médium · médium): films récents        — Row2
// Bande 3 (rapide · petite): nouveaux films       — Row3 (direction inverse)
//
// Technique boucle infinie : films dupliqués × 2 dans chaque bande.
// GSAP to({ x: '-=singleWidth' }, { repeat: -1, ease: 'none', duration })
//
// Fond : étoiles CSS-only (80 points · @keyframes marsai-twinkle)
// ════════════════════════════════════════════════════════════════════
const ConstellationGallery = () => {
  const sectionRef = useRef(null);
  const row1Ref    = useRef(null);
  const row2Ref    = useRef(null);
  const row3Ref    = useRef(null);
  const titleRef   = useRef(null);
  const row1TweenRef = useRef(null);
  const row2TweenRef = useRef(null);
  const row3TweenRef = useRef(null);

  // Largeurs des bandes (card + gap) × nombre de films d'origine
  const W1 = (264 + 28) * FILMS_ROW1.length;   // 4 films
  const W2 = (204 + 22) * FILMS_ROW2.length;   // 6 films
  const W3 = (164 + 18) * FILMS_ROW3.length;   // 8 films

  useGSAP(() => {
    // Révélation du titre
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
      }
    );

    // Bandes — révélation en stagger
    [row1Ref, row2Ref, row3Ref].forEach((r, i) => {
      gsap.fromTo(r.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 1.2, ease: 'power2.out',
          delay: i * 0.18,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', once: true },
        }
      );
    });

    // Tweens infinies — lancées après révélation (delay 0.6s)
    // Bande 1 → gauche (lente)
    row1TweenRef.current = gsap.to(row1Ref.current, {
      x:        `-=${W1}`,
      duration: 38,
      ease:     'none',
      repeat:   -1,
      delay:    0.6,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % W1),
      },
    });
    // Bande 2 → gauche (médium)
    row2TweenRef.current = gsap.to(row2Ref.current, {
      x:        `-=${W2}`,
      duration: 26,
      ease:     'none',
      repeat:   -1,
      delay:    0.8,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % W2),
      },
    });
    // Bande 3 → droite (rapide, direction inverse pour profondeur)
    row3TweenRef.current = gsap.to(row3Ref.current, {
      x:        `+=${W3}`,
      duration: 18,
      ease:     'none',
      repeat:   -1,
      delay:    0.4,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % W3),
      },
    });

    // Scroll multiplie la vitesse des bandes (effet caméra)
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top bottom',
      end:     'bottom top',
      onUpdate(self) {
        const boost = 1 + self.getVelocity() / 2200;
        row1TweenRef.current?.timeScale(boost);
        row2TweenRef.current?.timeScale(boost);
        row3TweenRef.current?.timeScale(boost);
        // Revient à la vitesse normale après boost
        gsap.to([row1TweenRef.current, row2TweenRef.current, row3TweenRef.current], {
          timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true,
          onUpdate() {},
        });
      },
    });

    return () => { st.kill(); };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="galerie"
      style={{
        position:   'relative',
        background: '#010108',
        padding:    'clamp(5rem, 10vh, 9rem) 0',
        overflow:   'hidden',
      }}
    >
      {/* Champ d'étoiles — CSS-only (zéro GSAP = zéro charge) */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position:        'absolute',
              left:            s.left,
              top:             s.top,
              width:           s.size,
              height:          s.size,
              borderRadius:    '50%',
              background:      'rgba(255,255,255,1)',
              opacity:         s.opacity,
              animation:       `marsai-twinkle ${s.dur} ease-in-out ${s.delay} infinite alternate`,
              boxShadow:       s.size >= 3 ? '0 0 4px rgba(255,255,255,0.50)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Nébuleuse ambre — capte le glow du logo (cohérence atmosphérique) */}
      <div aria-hidden="true" style={{
        position:   'absolute',
        top:        '50%', left: '50%',
        transform:  'translate(-50%, -50%)',
        width:      '60%', height: '80%',
        background: 'radial-gradient(ellipse, rgba(251,185,36,0.04) 0%, transparent 70%)',
        filter:     'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* En-tête */}
      <div
        ref={titleRef}
        style={{
          maxWidth:     1100,
          margin:       '0 auto',
          padding:      '0 clamp(1.5rem, 6vw, 8rem)',
          marginBottom: 'clamp(3rem, 6vh, 5rem)',
          opacity:      0,
        }}
      >
        <div style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    300,
          fontSize:      '0.65rem',
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.28)',
          marginBottom:  '0.8rem',
        }}>La Constellation</div>

        <h2 style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    900,
          fontSize:      'clamp(2rem, 4.5vw, 3.8rem)',
          letterSpacing: '-0.025em',
          lineHeight:    1.05,
          color:         'rgba(255,255,255,0.92)',
          maxWidth:      620,
          marginBottom:  '1rem',
        }}>Chaque film soumis<br/>est une étoile.</h2>

        <p style={{
          fontFamily:  "'Outfit', sans-serif",
          fontWeight:  300,
          fontSize:    'clamp(0.9rem, 1.6vw, 1.15rem)',
          color:       'rgba(255,255,255,0.35)',
          maxWidth:    480,
          lineHeight:  1.7,
        }}>La constellation grandit à chaque soumission. Votre film rejoindra ces étoiles.</p>
      </div>

      {/* Bande 1 — grande · lente · mis en avant */}
      <div style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div
          ref={row1Ref}
          style={{ display: 'flex', gap: 28, paddingLeft: 28, opacity: 0 }}
        >
          {/* Films × 3 pour garantir la fluidité sur tous les écrans */}
          {[...FILMS_ROW1, ...FILMS_ROW1, ...FILMS_ROW1].map((film, i) => (
            <FilmCard key={`r1-${i}`} film={film} size="lg" />
          ))}
        </div>
      </div>

      {/* Bande 2 — médium · vitesse moyenne */}
      <div style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div
          ref={row2Ref}
          style={{ display: 'flex', gap: 22, paddingLeft: 22, opacity: 0 }}
        >
          {[...FILMS_ROW2, ...FILMS_ROW2, ...FILMS_ROW2].map((film, i) => (
            <FilmCard key={`r2-${i}`} film={film} size="md" />
          ))}
        </div>
      </div>

      {/* Bande 3 — petite · rapide · direction inverse */}
      <div style={{ overflow: 'hidden' }}>
        <div
          ref={row3Ref}
          style={{ display: 'flex', gap: 18, paddingLeft: 18, opacity: 0 }}
        >
          {[...FILMS_ROW3, ...FILMS_ROW3, ...FILMS_ROW3].map((film, i) => (
            <FilmCard key={`r3-${i}`} film={film} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — GlassCTAButton
// Version grande du LiquidGlassPill — dédiée aux CTAs primaires.
// Même physique glass, scale × 2.
// mix-blend-mode: difference → texte adaptatif sur toute surface.
// ════════════════════════════════════════════════════════════════════
const GlassCTAButton = ({ to: href, children, size = 'lg' }) => {
  const btnRef   = useRef(null);
  const shardRef = useRef(null);

  const padding = size === 'xl' ? '18px 56px' : '14px 40px';
  const fSize   = size === 'xl' ? 'clamp(0.78rem, 1.4vw, 0.96rem)' : '0.72rem';

  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.05, y: -3,
      boxShadow: [
        'inset 0 2px 0 rgba(255,255,255,0.80)',
        'inset 0 -0.5px 0 rgba(255,255,255,0.22)',
        '0 12px 36px rgba(0,0,0,0.50)',
        '0 2px 8px rgba(0,0,0,0.30)',
        '0 0 0 0.5px rgba(255,255,255,0.28)',
      ].join(', '),
      duration: 0.22, ease: 'power2.out',
    });
  };
  const handleLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1, y: 0,
      boxShadow: [
        'inset 0 1.5px 0 rgba(255,255,255,0.58)',
        'inset 0 -0.5px 0 rgba(255,255,255,0.12)',
        '0 6px 22px rgba(0,0,0,0.40)',
        '0 1px 4px rgba(0,0,0,0.24)',
        '0 0 0 0.5px rgba(255,255,255,0.16)',
      ].join(', '),
      duration: 0.30, ease: 'power2.out',
    });
  };

  return (
    <Link to={href} style={{ display: 'inline-block', textDecoration: 'none' }}>
      <div
        ref={btnRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position:             'relative',
          display:              'inline-flex',
          alignItems:           'center',
          justifyContent:       'center',
          padding,
          borderRadius:         999,
          background: [
            'linear-gradient(180deg,',
            '  rgba(255,255,255,0.18) 0%,',
            '  rgba(255,255,255,0.07) 38%,',
            '  rgba(255,255,255,0.03) 65%,',
            '  rgba(255,255,255,0.11) 100%)',
          ].join(''),
          backdropFilter:       'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          border:               '0.5px solid rgba(255,255,255,0.22)',
          boxShadow: [
            'inset 0 1.5px 0 rgba(255,255,255,0.58)',
            'inset 0 -0.5px 0 rgba(255,255,255,0.12)',
            '0 6px 22px rgba(0,0,0,0.40)',
            '0 1px 4px rgba(0,0,0,0.24)',
            '0 0 0 0.5px rgba(255,255,255,0.16)',
          ].join(', '),
          cursor:               'pointer',
          willChange:           'transform, box-shadow',
          overflow:             'visible',
        }}
      >
        {/* Arc spéculaire */}
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%',
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, transparent 100%)',
          borderRadius: '999px 999px 50% 50%',
          opacity: 0.52,
          pointerEvents: 'none',
        }} />
        {/* Rim prismatique */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,80,180,0.65) 18%, rgba(80,200,255,0.70) 35%, rgba(255,215,80,0.65) 50%, rgba(80,100,255,0.70) 65%, rgba(200,80,255,0.65) 82%, transparent)',
          borderRadius: '0 0 999px 999px',
          opacity: 0.85,
          pointerEvents: 'none',
        }} />
        {/* Texte */}
        <span style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    700,
          fontSize:      fSize,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color:         'white',
          mixBlendMode:  'difference',
          position:      'relative',
          zIndex:        1,
          lineHeight:    1,
          userSelect:    'none',
        }}>{children}</span>
      </div>
    </Link>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT — FinalCTASection — L'Appel
// Peak de l'expérience. La plus grande CTA du site.
// Texte apparaît mot par mot — vitesse lente et délibérée.
// Le silence avant est aussi puissant que le texte.
// ════════════════════════════════════════════════════════════════════
const FinalCTASection = () => {
  const sectionRef = useRef(null);
  const q1Ref      = useRef(null);
  const q2Ref      = useRef(null);
  const ctaRef     = useRef(null);
  const metaRef    = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top 62%',
        once:    true,
      },
    });

    tl.fromTo(q1Ref.current,
      { opacity: 0, y: 50, filter: 'blur(12px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)',  duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(q2Ref.current,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)',  duration: 1.1, ease: 'power3.out' },
      '+=0.45'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.95, ease: 'power2.out' },
      '+=0.35'
    )
    .fromTo(metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.30'
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        position:   'relative',
        minHeight:  '100vh',
        background: '#050508',
        display:    'flex',
        flexDirection: 'column',
        alignItems:  'center',
        justifyContent: 'center',
        padding:    'clamp(5rem, 12vh, 10rem) clamp(1.5rem, 6vw, 8rem)',
        overflow:   'hidden',
        textAlign:  'center',
      }}
    >
      {/* Vignette ambre — l'unique lumière du monde */}
      <div aria-hidden="true" style={{
        position:   'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(251,185,36,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Filet haut */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)',
      }} />

      {/* Question */}
      <h2
        ref={q1Ref}
        style={{
          fontFamily:    "'Outfit', sans-serif",
          fontWeight:    900,
          fontSize:      'clamp(3.5rem, 9vw, 8rem)',
          letterSpacing: '-0.035em',
          lineHeight:    1,
          color:         'rgba(255,255,255,0.96)',
          marginBottom:  'clamp(1.5rem, 3vh, 2.5rem)',
          opacity:       0,
        }}
      >Et vous&nbsp;?</h2>

      {/* Réponse */}
      <p
        ref={q2Ref}
        style={{
          fontFamily:  "'Outfit', sans-serif",
          fontWeight:  300,
          fontSize:    'clamp(1.1rem, 2.2vw, 1.8rem)',
          lineHeight:  1.65,
          color:       'rgba(255,255,255,0.42)',
          maxWidth:    540,
          marginBottom: 'clamp(2.5rem, 6vh, 5rem)',
          opacity:     0,
        }}
      >
        Votre film existe déjà.<br />
        Il attend que vous le créiez.
      </p>

      {/* CTA — la plus grande de tout le site */}
      <div ref={ctaRef} style={{ opacity: 0 }}>
        <GlassCTAButton to="/soumettre" size="xl">
          Soumettre mon film
        </GlassCTAButton>
      </div>

      {/* Méta-info — sociale + rassurant */}
      <div
        ref={metaRef}
        style={{
          display:       'flex',
          gap:           'clamp(1rem, 3vw, 2.5rem)',
          marginTop:     'clamp(1.8rem, 4vh, 3rem)',
          opacity:       0,
        }}
      >
        {['1 minute', 'Gratuit', 'I.A. uniquement'].map((tag) => (
          <span key={tag} style={{
            fontFamily:    "'Outfit', sans-serif",
            fontWeight:    300,
            fontSize:      '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.22)',
          }}>{tag}</span>
        ))}
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — Home
// Assemble tous les actes dans l'ordre narratif.
// Préserve exactement : <HeroImpact /> <Reveal /> <Parallax />
// ════════════════════════════════════════════════════════════════════
function Home() {

  // ScrollTrigger refresh après montage
  // Garantit la compatibilité avec Lenis quelle que soit son setup
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(timer);
      // ScrollTrigger cleanup géré par useGSAP dans chaque composant
    };
  }, []);

  return (
    <div
      className="bg-black text-white selection:bg-amber-500 selection:text-black"
      style={{ fontFamily: "'Outfit', -apple-system, sans-serif" }}
    >
      {/* KEYFRAMES — injectées une seule fois */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');

        @keyframes marsai-twinkle {
          from { opacity: var(--op-from, 0.08); transform: scale(1); }
          to   { opacity: var(--op-to,   0.85); transform: scale(1.6); }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          §0 — HERO IMPACT
          L'Ouverture. Intact, inchangé, parfait.
          Le pont vers §1 est assuré par les débris verticaux
          qui tombent naturellement vers la section suivante.
          ═══════════════════════════════════════════════════════ */}
      <HeroImpact />

      {/* ═══════════════════════════════════════════════════════
          §1 — MANIFESTE
          La Déclaration. 7 lignes. Meijisakaba style.
          ═══════════════════════════════════════════════════════ */}
      <ManifestoSection />

      {/* ═══════════════════════════════════════════════════════
          §2 — ACTE I : L'ÉVEIL
          Bleu nuit · électrique · technologique
          ═══════════════════════════════════════════════════════ */}
      <ActSection act={ACTS[0]} id="about" />

      {/* ═══════════════════════════════════════════════════════
          §3 — ACTE II : LA FUSION
          Violet profond · créativité · tension humain/machine
          ═══════════════════════════════════════════════════════ */}
      <ActSection act={ACTS[1]} id="regles" />

      {/* ═══════════════════════════════════════════════════════
          §4 — ACTE III : LA LUMIÈRE
          Ambre chaud · humanité · jury · récompenses
          Contient les sections #jury et #recompenses (IDs préservés)
          ═══════════════════════════════════════════════════════ */}
      <ActSection act={ACTS[2]} id="evenement">
        <JuryBlock />
        <RewardsGrid />
      </ActSection>

      {/* ═══════════════════════════════════════════════════════
          §6 — LA CONSTELLATION — OPTION E
          Les films comme étoiles. 3 bandes infinies.
          ═══════════════════════════════════════════════════════ */}
      <ConstellationGallery />

      {/* ═══════════════════════════════════════════════════════
          §8 — L'APPEL
          CTA Final. Noir absolu. Silence.
          Le pic émotionnel. La Peak-End Rule.
          ═══════════════════════════════════════════════════════ */}
      <FinalCTASection />

      {/* ═══════════════════════════════════════════════════════
          §5 — LE NEXUS
          Marseille. La scène physique.
          Iframe préservée exactement (données backend intactes).
          Habillage cinématographique ajouté autour.
          ═══════════════════════════════════════════════════════ */}
      <section
        id="lieu"
        style={{
          background: '#050508',
          padding:    'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 6vw, 8rem)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           12,
              marginBottom:  'clamp(0.8rem, 1.5vh, 1.2rem)',
            }}>
              <span style={{
                fontFamily:    "'Outfit', sans-serif",
                fontWeight:    300,
                fontSize:      '0.65rem',
                letterSpacing: '0.40em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.28)',
              }}>Le Nexus</span>
              <div style={{ width: 24, height: '0.5px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </Reveal>
          <Reveal>
            <h2 style={{
              fontFamily:    "'Outfit', sans-serif",
              fontWeight:    900,
              fontSize:      'clamp(2.2rem, 5vw, 4rem)',
              letterSpacing: '-0.025em',
              lineHeight:    1.05,
              color:         'rgba(255,255,255,0.94)',
              marginBottom:  'clamp(0.8rem, 1.8vh, 1.4rem)',
            }}>Marseille.</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{
              fontFamily:  "'Outfit', sans-serif",
              fontWeight:  300,
              fontSize:    'clamp(0.95rem, 1.7vw, 1.2rem)',
              color:       'rgba(255,255,255,0.38)',
              maxWidth:    520,
              lineHeight:  1.70,
              marginBottom: 'clamp(2rem, 4vh, 3.5rem)',
            }}>
              Épicentre de la collision entre tradition, nostalgie, technologie et innovation.
            </p>
          </Reveal>

          {/* Carte — préservée exactement */}
          <div style={{
            position:     'relative',
            height:       'clamp(320px, 50vh, 600px)',
            borderRadius: 24,
            overflow:     'hidden',
            border:       '0.5px solid rgba(255,255,255,0.10)',
            boxShadow:    '0 20px 60px rgba(0,0,0,0.60)',
          }}>
            <Parallax speed={1.15} className="h-full w-full">
              <iframe
                title="Plan du lieu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047744348!2d2.281344415674389!3d48.87838327928942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8f%3A0xd9b5676e112e643d!2sPalais%20des%20congr%C3%A8s%20de%20Paris!5e0!3m2!1sfr!2sfr!4v1680000000000!5m2!1sfr!2sfr"
                width="100%"
                height="120%"
                style={{ border: 0, marginTop: '-10%' }}
                allowFullScreen
                loading="lazy"
              />
            </Parallax>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          §7 — ALLIANCES
          Partenaires. Minimal. Élégant.
          ID #partenaires préservé (lien footer fonctionnel).
          ═══════════════════════════════════════════════════════ */}
      <section
        id="partenaires"
        style={{
          background: '#050508',
          padding:    'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 8rem)',
          borderTop:  '0.5px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{
              fontFamily:    "'Outfit', sans-serif",
              fontWeight:    900,
              fontSize:      'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.02em',
              color:         'rgba(255,255,255,0.92)',
              textAlign:     'center',
              marginBottom:  'clamp(2rem, 5vh, 4rem)',
            }}>Alliances</h2>
          </Reveal>

          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap:                 'clamp(1rem, 2vw, 1.5rem)',
          }}>
            {[1, 2, 3, 4].map((i) => (
              <Parallax key={i} speed={1 + i * 0.03}>
                <Reveal delay={i * 0.08}>
                  <div style={{
                    aspectRatio:  '3/2',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    background:   'rgba(255,255,255,0.02)',
                    border:       '0.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding:      'clamp(1.2rem, 2.5vw, 2rem)',
                    transition:   'border-color 0.5s, background 0.5s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(251,185,36,0.35)';
                      e.currentTarget.style.background  = 'rgba(251,185,36,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.background  = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <span style={{
                      fontFamily:    "'Outfit', sans-serif",
                      fontWeight:    900,
                      fontSize:      'clamp(1rem, 2.2vw, 1.6rem)',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color:         'rgba(255,255,255,0.15)',
                      userSelect:    'none',
                    }}>ORG {i}</span>
                  </div>
                </Reveal>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;