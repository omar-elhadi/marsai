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
import HeroImpact from '@/pages/Home/HeroImpact';
import SectionManifeste from '@/components/SectionManifeste';
import SectionTheme     from '@/components/SectionTheme';
import SectionProgramme from '@/components/SectionProgramme';
import SectionJury      from '@/pages/Home/components/SectionJury';
import SectionRecompenses from '@/pages/Home/components/SectionRecompenses';
import SectionGalerie      from '@/pages/Home/components/SectionGalerie';
import SectionAlliances   from '@/pages/Home/components/SectionAlliances';
import SectionCTA         from '@/pages/Home/components/SectionCTA';

function Home() {
  return (
    <div className="bg-bg-pure text-text">

      {/* ── §1 HERO + STATS ──────────────────────────────────────── */}
      <HeroImpact />

      {/* ── §2 MANIFESTE ─────────────────────────────────────────── */}
      <SectionManifeste />

      {/* ── §3 THÈME ─────────────────────────────────────────────── */}
      <SectionTheme />

      {/* ── §10 CTA FINAL ──────────────────────────────────────────── */}
      <SectionCTA />

      {/* ── §7 RÉCOMPENSES ─────────────────────────────────────────── */}
      <SectionRecompenses />

      {/* ── §5 JURY INTERNATIONAL ────────────────────────────────── */}
      <SectionJury />

      {/* ── §8 GALERIE ──────────────────────────────────────────── */}
      <SectionGalerie />

      {/* ── §4 PROGRAMME ─────────────────────────────────────────── */}
      <SectionProgramme />

      {/* ── §9 ALLIANCES ────────────────────────────────────────── */}
      <SectionAlliances />

    </div>
  );
}

export default Home;