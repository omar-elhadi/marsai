/**
 * Home.jsx — MARSAI Festival
 *
 * Phase 6 — Galerie intégrée
 * ─────────────────────────────────────────────────────────────
 * Ordre narratif :
 *   §1  HeroImpact + Stats        ✅
 *   §2  Manifeste                 ✅
 *   §3  Thème                     ✅
 *   §4  Programme                 ✅
 *   §5  Jury International        ✅
 *   §7  Récompenses                ✅  ← Phase 5
 *   §6  Nexus                     existant
 *   §7  Récompenses               Phase 5 (à venir)
 *   §8  Alliances                 existant
 *   §9  CTA final                 existant
 */
import HeroImpact       from '../../components/animations/HeroImpact';
import SectionManifeste from '@/components/SectionManifeste';
import SectionTheme     from '@/components/SectionTheme';
import SectionProgramme from '@/components/SectionProgramme';
import SectionJury      from '@/components/SectionJury';
import SectionRecompenses from '@/components/SectionRecompenses';
import SectionGalerie      from '@/components/SectionGalerie';
import SectionAlliances   from '@/components/SectionAlliances';
import SectionCTA         from '@/components/SectionCTA';

function Home() {
  return (
    <div className="bg-bg-pure text-text">

      {/* ── §1 HERO + STATS ──────────────────────────────────────── */}
      <HeroImpact />

      {/* ── §2 MANIFESTE ─────────────────────────────────────────── */}
      <SectionManifeste />

      {/* ── §3 THÈME ─────────────────────────────────────────────── */}
      <SectionTheme />

            {/* ── §7 RÉCOMPENSES ─────────────────────────────────────────── */}
      <SectionRecompenses />

      {/* ── §4 PROGRAMME ─────────────────────────────────────────── */}
      <SectionProgramme />

      {/* ── §5 JURY INTERNATIONAL ────────────────────────────────── */}
      <SectionJury />

      {/* ── §8 GALERIE ──────────────────────────────────────────── */}
      <SectionGalerie />

      {/* ── §10 CTA FINAL ──────────────────────────────────────────── */}
      <SectionCTA />

      {/* ── §9 ALLIANCES ────────────────────────────────────────── */}
      <SectionAlliances />

    </div>
  );
}

export default Home;