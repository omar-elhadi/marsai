import { useState, useEffect, useRef } from 'react';
import gsap              from 'gsap';
import { useGSAP }       from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CSS = `
  .politique-section {
    background:  var(--color-bg-pure);
    border-top:  1px solid var(--color-border);
    min-height:  100vh;
    padding:     clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,6rem);
    padding-top: clamp(4rem,6vw,5rem);
  }
  .politique-inner { max-width: 820px; margin: 0 auto; }
  .politique-header { margin-bottom: clamp(4rem,8vw,7rem); }
  .politique-overline { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
  .politique-overline-bar { display: block; width: clamp(2rem,3vw,3rem); height: 1px; background: var(--color-accent); flex-shrink: 0; }
  .politique-titles { margin-bottom: 1.5rem; }
  .politique-title-line { overflow: hidden; line-height: 1; }
  .politique-title-line span { display: block; padding-bottom: 0.06em; }
  .politique-title-accent { color: var(--color-accent); }

  .politique-timeline { position: relative; padding-left: clamp(2.5rem,4vw,3.5rem); }
  .politique-track { position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px; background: var(--color-border); }
  .politique-progress-wrap { position: absolute; left: 1.5rem; top: 0; width: 1px; height: 100%; overflow: hidden; }
  .politique-progress { width: 1px; height: 0%; background: linear-gradient(to bottom, rgba(226,209,195,0.85) 0%, rgba(226,209,195,0.45) 65%, rgba(226,209,195,0.12) 100%); }
  .politique-dot { position: absolute; left: calc(1.5rem - 6px); top: -6px; width: 13px; height: 13px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 18px rgba(226,209,195,0.90), 0 0 36px rgba(226,209,195,0.32); z-index: 4; }

  .politique-modules { display: flex; flex-direction: column; gap: clamp(3rem,6vw,5rem); }

  .module-block { margin-bottom: clamp(3rem,6vw,5rem); }
  .module-header { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; padding-bottom: 0.9rem; border-bottom: 1px solid var(--color-border); }
  .module-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(1.3rem,2.2vw,1.8rem); letter-spacing: -0.02em; text-transform: uppercase; color: var(--color-text); margin: 0; }
  .module-tag { flex-shrink: 0; }

  .accordion-row { opacity: 0; border-bottom: 1px solid var(--color-border); }
  .accordion-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.3rem 0; background: none; border: none; cursor: pointer; text-align: left; gap: 1rem; }
  .accordion-btn-left { display: flex; align-items: baseline; gap: 1rem; }
  .accordion-num { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: clamp(0.8rem,1.2vw,1rem); color: var(--color-accent); opacity: 0.45; line-height: 1; flex-shrink: 0; }
  .accordion-title { font-family: var(--font-sans); font-weight: 500; font-size: clamp(0.95rem,1.4vw,1.05rem); color: var(--color-text-muted); transition: color 240ms var(--ease-out); }
  .accordion-title.is-open { color: var(--color-text); }
  .accordion-toggle { font-family: var(--font-sans); font-size: 1.2rem; font-weight: 300; color: var(--color-accent); flex-shrink: 0; opacity: 0.45; transition: opacity 240ms; }
  .accordion-toggle.is-open { opacity: 1; }
  .accordion-body { height: 0; opacity: 0; overflow: hidden; }

  .accordion-content { padding-bottom: 1.6rem; padding-left: 2.2rem; }
  .accordion-text { font-family: var(--font-sans); font-size: clamp(0.9rem,1.2vw,1rem); color: var(--color-text-muted); line-height: 1.75; margin: 0 0 1.2rem; }
  .accordion-protocol { display: flex; align-items: center; gap: 0.75rem; }
  .accordion-protocol-bar { height: 1px; width: 2rem; background: linear-gradient(to right, transparent, var(--color-accent)); }
  .accordion-protocol-bar.reverse { background: linear-gradient(to left, transparent, var(--color-accent)); }
  .accordion-protocol-label { font-family: var(--font-sans); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-accent); opacity: 0.7; }
`;

const MODULES = [
  {
    key: 'collecte',
    title: 'Données collectées',
    tag: 'MODULE_01',
    items: [
      {
        id: 'd1',
        title: 'Informations personnelles',
        content: 'Les données collectées incluent votre nom, votre adresse email et vos données de navigation. Ces informations sont utilisées uniquement dans le but d\'améliorer nos services.',
        protocol: 'PROTOCOLE_RGPD_ACTIF',
      },
      {
        id: 'd2',
        title: 'Données de navigation',
        content: 'Nous collectons des données anonymisées relatives à votre parcours sur la plateforme afin d\'optimiser l\'expérience utilisateur et la fluidité du système.',
        protocol: 'TRACKING_ANONYMISÉ',
      },
    ],
  },
  {
    key: 'securite',
    title: 'Mesures de sécurité',
    tag: 'MODULE_02',
    items: [
      {
        id: 's1',
        title: 'Chiffrement des données',
        content: 'Nous utilisons un cryptage de pointe AES-256 pour protéger vos données contre tout accès non autorisé, interception ou divulgation à des tiers.',
        protocol: 'CRYPTAGE_AES_256',
      },
      {
        id: 's2',
        title: 'Accès restreint',
        content: 'L\'accès aux données personnelles est strictement limité aux membres habilités de l\'équipe MarsAI, sous protocole d\'authentification renforcée.',
        protocol: 'ACCESS_CONTROL_V2',
      },
    ],
  },
  {
    key: 'acceptation',
    title: 'Acceptation & droits',
    tag: 'MODULE_03',
    items: [
      {
        id: 'a1',
        title: 'Acceptation des pratiques',
        content: 'En naviguant sur MarsAi, vous acceptez les protocoles de confidentialité en vigueur pour l\'édition 2026. Vous pouvez retirer votre consentement à tout moment.',
        protocol: 'ACCORD_UTILISATEUR_OK',
      },
      {
        id: 'a2',
        title: 'Vos droits RGPD',
        content: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données. Toute demande peut être adressée à notre DPO.',
        protocol: 'DROITS_RGPD_GARANTIS',
      },
    ],
  },
];

const flatItems = MODULES.flatMap(m => m.items);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function AccordionItem({ item, globalIndex, isVisible, isOpen, onToggle }) {
  const rowRef  = useRef(null);
  const bodyRef = useRef(null);

  useGSAP(() => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current, {
      opacity:  isVisible ? 1 : 0,
      x:        isVisible ? 0 : 18,
      duration: 0.45,
      ease:     'power2.out',
    });
  }, [isVisible]);

  useGSAP(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      gsap.to(bodyRef.current, { height: 'auto', opacity: 1, duration: 0.38, ease: 'power2.out' });
    } else {
      gsap.to(bodyRef.current, { height: 0,      opacity: 0, duration: 0.28, ease: 'power2.in'  });
    }
  }, [isOpen]);

  return (
    <div ref={rowRef} className="accordion-row">
      <button onClick={onToggle} className="accordion-btn">
        <div className="accordion-btn-left">
          <span className="accordion-num">
            {String(globalIndex + 1).padStart(2, '0')}
          </span>
          <span className={'accordion-title' + (isOpen ? ' is-open' : '')}>
            {item.title}
          </span>
        </div>
        <span className={'accordion-toggle' + (isOpen ? ' is-open' : '')}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div ref={bodyRef} className="accordion-body">
        <div className="accordion-content">
          <p className="accordion-text">{item.content}</p>
          <div className="accordion-protocol">
            <div className="accordion-protocol-bar" />
            <span className="accordion-protocol-label">{item.protocol}</span>
            <div className="accordion-protocol-bar reverse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleBlock({ module, startIndex, visibleCount }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="module-block">
      <div className="module-header">
        <h2 className="module-title">{module.title}</h2>
        <span className="label-overline module-tag">{module.tag}</span>
      </div>
      {module.items.map((item, i) => (
        <AccordionItem
          key={item.id}
          item={item}
          globalIndex={startIndex + i}
          isVisible={visibleCount > startIndex + i}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

export default function PolitiqueDeConfidentialite() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const dotRef      = useRef(null);

  const [started,      setStarted]      = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const total = flatItems.length;

  const moduleStartIndex = MODULES.reduce((acc, mod, i) => {
    acc[mod.key] = MODULES.slice(0, i).reduce((s, m) => s + m.items.length, 0);
    return acc;
  }, {});

  useGSAP(() => {
    gsap.set(overlineRef.current,                  { opacity: 0, y: 12  });
    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110       });
    gsap.set(subtitleRef.current,                  { opacity: 0, y: 18  });
    ScrollTrigger.create({
      trigger: sectionRef.current, start: 'top 75%', once: true,
      onEnter() {
        const tl = gsap.timeline();
        tl.to(overlineRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
        tl.to([line1Ref.current, line2Ref.current],
          { yPercent: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, 0.15);
        tl.to(subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.50);
      },
    });
  }, { scope: sectionRef });

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion()) { setVisibleCount(total); return; }
    setVisibleCount(0);
    let current = 0;
    const id = setInterval(() => {
      current++;
      setVisibleCount(current);
      if (current >= total) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [started, total]);

  useGSAP(() => {
    if (!timelineRef.current || !progressRef.current || !dotRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start:   'top center',
        end:     'bottom center',
        scrub:   0.4,
      },
    });
    tl.to(progressRef.current, { height: '100%',          ease: 'none' }, 0);
    tl.to(dotRef.current,      { top: 'calc(100% - 6px)', ease: 'none' }, 0);
  }, { scope: sectionRef });

  return (
    <>
      <style>{CSS}</style>

      <section ref={sectionRef} id="politique" className="politique-section">
        <div className="politique-inner">

          <div className="politique-header">
            <div ref={overlineRef} className="politique-overline">
              <span className="politique-overline-bar" />
              <span className="label-overline">Mars AI · Sécurité des données — 2026</span>
            </div>

            <div className="politique-titles">
              <div className="politique-title-line">
                <span ref={line1Ref} className="title-section">Politique de</span>
              </div>
              <div className="politique-title-line">
                <span ref={line2Ref} className="title-section politique-title-accent">Confidentialité</span>
              </div>
            </div>

            <p ref={subtitleRef} className="body-editorial">
              Vos données sont traitées avec la plus grande rigueur, dans le respect
              du protocole de sécurité Marseille-2026 et des réglementations RGPD en vigueur.
            </p>
          </div>

          <div ref={timelineRef} className="politique-timeline">
            <div aria-hidden="true" className="politique-track" />
            <div aria-hidden="true" className="politique-progress-wrap">
              <div ref={progressRef} className="politique-progress" />
            </div>
            <div ref={dotRef} aria-hidden="true" className="politique-dot" />

            <div className="politique-modules">
              {MODULES.map(module => (
                <ModuleBlock
                  key={module.key}
                  module={module}
                  startIndex={moduleStartIndex[module.key]}
                  visibleCount={visibleCount}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}