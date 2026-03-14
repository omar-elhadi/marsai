import { useRef } from 'react';
import gsap        from 'gsap';
import { useGSAP } from '@gsap/react';

const SECTIONS_LEFT = [
  {
    id: '01',
    slug: 'utilisation',
    title: 'Utilisation',
    content: [
      {
        type: 'paragraph',
        text: 'Ce site utilise des traceurs de données pour optimiser votre expérience et le flux de navigation inter-système.',
      },
      {
        type: 'list',
        items: [
          'Les cookies techniques sont nécessaires au bon fonctionnement de la plateforme.',
          'Les cookies analytiques permettent d\'améliorer les performances et la navigation.',
        ],
      },
    ],
  },
  {
    id: '02',
    slug: 'conservation',
    title: 'Conservation',
    content: [
      {
        type: 'paragraph',
        text: 'Les données collectées sont conservées pour une durée limitée, conformément aux réglementations en vigueur en matière de protection des données personnelles.',
      },
      {
        type: 'deadline',
        label: 'Durée de conservation',
        value: '13 mois',
      },
    ],
  },
  {
    id: '03',
    slug: 'tiers',
    title: 'Tiers',
    content: [
      {
        type: 'paragraph',
        text: 'Certains services tiers peuvent déposer des cookies lors de votre navigation. Ces partenaires s\'engagent à respecter la confidentialité de vos données.',
      },
      {
        type: 'note',
        text: 'MARSAI ne revend aucune donnée personnelle à des fins commerciales.',
      },
    ],
  },
];

const SECTIONS_RIGHT = [
  {
    id: '04',
    slug: 'consentement',
    title: 'Consentement',
    content: [
      {
        type: 'paragraph',
        text: 'En poursuivant votre navigation, vous acceptez l\'utilisation des cookies conformément à notre protocole de confidentialité.',
      },
      {
        type: 'list',
        items: [
          'Vous pouvez retirer votre consentement à tout moment via les paramètres de votre navigateur.',
          'Le refus de certains cookies peut limiter l\'accès à des fonctionnalités du site.',
        ],
      },
    ],
  },
  {
    id: '05',
    slug: 'droits',
    title: 'Vos droits',
    content: [
      {
        type: 'paragraph',
        text: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données. Toute demande peut être adressée à notre délégué à la protection des données.',
      },
    ],
  },
  {
    id: '06',
    slug: 'contact',
    title: 'Contact',
    content: [
      {
        type: 'paragraph',
        text: 'Pour toute question relative à l\'usage des cookies ou à la gestion de vos données personnelles, contactez notre équipe via le formulaire officiel du festival.',
      },
      {
        type: 'note',
        text: 'Protocole de sécurité Marseille-2026 — Mars Ai Terminal v.2.50',
      },
    ],
  },
];

function CookieSection({ section, isLast }) {
  const { id, title, content } = section;

  return (
    <article
      id={section.slug}
      style={{
        paddingBottom: isLast ? 0 : '3.5rem',
        marginBottom:  isLast ? 0 : '3.5rem',
        borderBottom:  isLast ? 'none' : '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <div className="flex items-baseline gap-3" style={{ marginBottom: '1.2rem' }}>
        <span className="font-black italic text-xl text-[#d1c7a3] leading-none shrink-0" style={{ opacity: 0.55 }}>
          {id}
        </span>
        <h2 className="font-bold uppercase text-white/80 m-0" style={{ fontSize: '0.60rem', letterSpacing: '0.22em' }}>
          {title}
        </h2>
      </div>

      <div className="flex flex-col" style={{ gap: '1rem' }}>
        {content.map((block, i) => {
          if (block.type === 'paragraph') return (
            <p key={i} className="text-white/60 font-light leading-relaxed m-0" style={{ fontSize: '1rem' }}>
              {block.text}
            </p>
          );
          if (block.type === 'list') return (
            <ul key={i} className="m-0 p-0 list-none flex flex-col" style={{ gap: '0.75rem' }}>
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start" style={{ gap: '0.75rem' }}>
                  <span className="text-[#d1c7a3] shrink-0 leading-none" style={{ marginTop: '0.15em' }}>—</span>
                  <span className="text-white/60 font-light leading-relaxed" style={{ fontSize: '1rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          );
          if (block.type === 'note') return (
            <p key={i} className="text-white/30 italic uppercase m-0" style={{ fontSize: '0.72rem', letterSpacing: '0.15em' }}>
              {block.text}
            </p>
          );
          if (block.type === 'deadline') return (
            <div key={i} className="inline-flex flex-col self-start rounded-sm" style={{
              gap:        '0.3rem',
              padding:    '0.85rem 1.2rem',
              border:     '1px solid rgba(255,255,255,0.10)',
              borderLeft: '2px solid #d1c7a3',
            }}>
              <span className="font-semibold uppercase text-white/40" style={{ fontSize: '0.56rem', letterSpacing: '0.22em', marginBottom: '0.2rem' }}>
                {block.label}
              </span>
              <span className="font-black uppercase text-[#d1c7a3] leading-none" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
                {block.value}
              </span>
            </div>
          );
          return null;
        })}
      </div>
    </article>
  );
}

export default function CookiesProtocol() {
  const pageRef  = useRef(null);
  const topRef   = useRef(null);
  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  useGSAP(() => {
    gsap.set(topRef.current,   { opacity: 0, y: -20 });
    gsap.set(leftRef.current,  { opacity: 0, x: -22 });
    gsap.set(rightRef.current, { opacity: 0, x:  22 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(topRef.current,   { opacity: 1, y: 0, duration: 0.70, ease: 'power2.out' }, 0.00);
    tl.to(leftRef.current,  { opacity: 1, x: 0, duration: 0.80, ease: 'power3.out' }, 0.25);
    tl.to(rightRef.current, { opacity: 1, x: 0, duration: 0.80, ease: 'power3.out' }, 0.35);
  }, { scope: pageRef });

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0a] min-h-screen flex flex-col"
      style={{ paddingTop: 'clamp(4rem,6vw,5rem)' }}
    >
      <div ref={topRef} style={{ padding: 'clamp(2rem,3.5vw,3rem) clamp(2rem,5vw,5rem)' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '1.2rem' }}>
          <span className="block h-px bg-[#d1c7a3] shrink-0" style={{ width: 'clamp(2rem,3vw,3rem)' }} />
          <span className="font-semibold uppercase text-white/40" style={{ fontSize: '0.60rem', letterSpacing: '0.22em' }}>
            Marsai Festival — Édition 2026
          </span>
        </div>
        <h1 className="text-center font-black uppercase text-white mx-auto leading-none" style={{ fontSize: 'clamp(3rem,8vw,6rem)', letterSpacing: '-0.03em' }}>
          Cookies
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        <div ref={leftRef} className="border-b md:border-b-0 md:border-r border-white/10" style={{ padding: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)' }}>
          <div className="w-full bg-gradient-to-r from-[#d1c7a3] to-transparent" style={{ height: '1px', marginBottom: '3rem' }} />
          {SECTIONS_LEFT.map((section, i) => (
            <CookieSection key={section.id} section={section} isLast={i === SECTIONS_LEFT.length - 1} />
          ))}
        </div>

        <div ref={rightRef} className="flex flex-col" style={{ padding: 'clamp(3rem,5vw,5rem) clamp(2rem,4vw,4rem)' }}>
          <div className="w-full bg-gradient-to-r from-[#d1c7a3] to-transparent" style={{ height: '1px', marginBottom: '3rem' }} />
          {SECTIONS_RIGHT.map((section, i) => (
            <CookieSection key={section.id} section={section} isLast={i === SECTIONS_RIGHT.length - 1} />
          ))}
          <p className="mt-auto uppercase italic text-white/20" style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.55rem', letterSpacing: '0.4em' }}>
            MARSAI Festival — Marseille MMXXVI. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}