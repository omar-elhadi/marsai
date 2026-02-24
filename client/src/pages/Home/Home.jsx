/**
 * Home.jsx — MARSAI Festival
 *
 * Phase 4 — Jury International intégré
 * ─────────────────────────────────────────────────────────────
 * Ordre narratif :
 *   §1  HeroImpact + Stats        ✅
 *   §2  Manifeste                 ✅
 *   §3  Thème                     ✅
 *   §4  Programme                 ✅
 *   §5  Jury International        ✅  ← Phase 4
 *   §6  Nexus                     existant
 *   §7  Récompenses               Phase 5 (à venir)
 *   §8  Alliances                 existant
 *   §9  CTA final                 existant
 */

import Reveal           from '../../components/animations/Reveal';
import Parallax         from '../../components/animations/Parallax';
import HeroImpact       from '../../components/animations/HeroImpact';
import SectionManifeste from '@/components/SectionManifeste';
import SectionTheme     from '@/components/SectionTheme';
import SectionProgramme from '@/components/SectionProgramme';
import SectionJury      from '@/components/SectionJury';

function Home() {
  return (
    <div className="bg-bg-pure text-text">

      {/* ── §1 HERO + STATS ──────────────────────────────────────── */}
      <HeroImpact />

      {/* ── §2 MANIFESTE ─────────────────────────────────────────── */}
      <SectionManifeste />

      {/* ── §3 THÈME ─────────────────────────────────────────────── */}
      <SectionTheme />

      {/* ── §4 PROGRAMME ─────────────────────────────────────────── */}
      <SectionProgramme />

      {/* ── §5 JURY INTERNATIONAL ────────────────────────────────── */}
      <SectionJury />

      {/* ── §6 NEXUS ─────────────────────────────────────────────── */}
      <section id="lieu" className="max-w-6xl mx-auto py-20 md:py-32 px-6 md:px-12">
        <Reveal>
          <h2 className="title-section mb-8 md:mb-12">Le Nexus</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="body-editorial max-w-2xl mb-10">
            Le festival se tiendra à <strong className="text-text font-semibold">Marseille</strong>,
            épicentre de la collision entre tradition, nostalgie, technologie et innovation.
          </p>
        </Reveal>
        <div
          className="relative h-[50vh] md:h-[600px] overflow-hidden"
          style={{
            borderRadius: 'var(--radius-md)',
            border:       '1px solid var(--color-border)',
            boxShadow:    '0 25px 60px rgba(0,0,0,0.5)',
          }}
        >
          <Parallax speed={1.15} className="h-full w-full">
            <iframe
              title="Plan du lieu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047744348!2d2.281344415674389!3d48.87838327928942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8f%3A0xd9b5676e112e643d!2sPalais%20des%20congr%C3%A8s%20de%20Paris!5e0!3m2!1sfr!2sfr!4v1680000000000!5m2!1sfr!2sfr"
              width="100%"
              height="120%"
              className="w-full h-full"
              style={{ border: 0, marginTop: '-10%' }}
              allowFullScreen
              loading="lazy"
            />
          </Parallax>
        </div>
      </section>

      {/* ── §7 RÉCOMPENSES — Phase 5 à venir ─────────────────────── */}
      <section id="recompenses" className="max-w-5xl mx-auto py-20 md:py-32 px-6 md:px-12">
        <Reveal>
          <h2 className="title-section mb-10 md:mb-16">Récompenses</h2>
        </Reveal>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[
            { num: '01', title: 'Trophées I.A.',     desc: 'Pour les 3 premiers lauréats.',             delay: 0.1 },
            { num: '02', title: 'Fonds de Création', desc: 'Prix en espèces et dotations matérielles.', delay: 0.2 },
            { num: '03', title: "Réseau d'Élite",    desc: 'Networking direct avec les investisseurs.', delay: 0.3 },
            { num: '04', title: 'Certification',     desc: "Label d'excellence MARSAI pour tous.",      delay: 0.4 },
          ].map(({ num, title, desc, delay }) => (
            <Reveal key={num} delay={delay}>
              <li className="flex flex-col pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <span className="label-category mb-2">{num}.</span>
                <span className="text-text font-semibold text-lg md:text-xl mb-2">{title}</span>
                <span className="body-meta">{desc}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── §8 ALLIANCES ─────────────────────────────────────────── */}
      <section id="partenaires" className="bg-surface py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="title-section mb-16 md:mb-24">Alliances</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12 items-center">
            {[1, 2, 3, 4].map((i) => (
              <Parallax key={i} speed={1 + i * 0.03}>
                <div
                  className="aspect-[3/2] flex items-center justify-center p-6 md:p-8 transition-colors duration-500"
                  style={{
                    background:   'var(--color-surface-high)',
                    borderRadius: 'var(--radius-md)',
                    border:       '1px solid var(--color-border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor  = 'var(--color-border)'}
                >
                  <span className="label-category">ORG {i}</span>
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* ── §9 CTA FINAL ─────────────────────────────────────────── */}
      <section
        className="py-24 md:py-40 text-center px-6 md:px-12"
        style={{ background: 'var(--color-text)', color: 'var(--color-bg-pure)' }}
      >
        <Reveal>
          <h2
            className="font-black uppercase leading-none mb-8 md:mb-16"
            style={{
              fontSize:      'clamp(2.5rem, 8vw, 7rem)',
              letterSpacing: '-0.04em',
              color:         'var(--color-bg-pure)',
            }}
          >
            Intégrez la matrice.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <a href="/soumettre" className="inline-block">
            <button
              className="font-bold tracking-widest uppercase transition-all duration-500"
              style={{
                background:   'var(--color-bg-pure)',
                color:        'var(--color-text)',
                padding:      'clamp(0.9rem, 1.5vw, 1.5rem) clamp(2.5rem, 4vw, 4rem)',
                borderRadius: 'var(--radius-pill)',
                fontSize:     'clamp(0.75rem, 1vw, 1rem)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color      = 'var(--color-bg-pure)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-bg-pure)';
                e.currentTarget.style.color      = 'var(--color-text)';
              }}
            >
              Soumettre une œuvre
            </button>
          </a>
        </Reveal>
      </section>

    </div>
  );
}

export default Home;