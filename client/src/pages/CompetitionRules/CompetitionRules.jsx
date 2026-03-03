import React from 'react';

const CompetitionRules = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#d1c7a3] selection:text-black">
      {/* Overlay de grain subtil */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* pt-40 pour passer sous la navbar fixed (~80px) + marge supplémentaire */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-40 lg:px-8">
        
        {/* Header de la page - mt-32 supprimé, le pt-40 du parent suffit */}
        <header className="mb-32 border-b border-white/10 pb-16">
          <h1 className="text-6xl font-black uppercase tracking-tighter sm:text-8xl lg:text-9xl leading-[0.9]">
            Règlement <br />
            <span className="text-[#d1c7a3]">Général</span>
          </h1>
          <div className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.4em] text-white/40">
            <span>Marsai Festival</span>
            <span className="h-px w-12 bg-[#d1c7a3]/40" />
            <span>Édition 2026</span>
          </div>
        </header>

        <main className="space-y-0">
          
          {/* Section 01 - Admissibilité */}
          <section className="grid grid-cols-1 gap-12 border-b border-white/10 py-24 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-serif text-3xl italic text-[#d1c7a3] opacity-60">01</span>
              <h2 className="text-xl uppercase tracking-widest font-bold">Admissibilité</h2>
            </div>
            <div className="lg:col-span-2 max-w-2xl space-y-8 text-xl text-white/70 font-light leading-relaxed">
              <p>
                Le concours est ouvert aux créateurs explorant les frontières entre l'intelligence artificielle et la narration cinématographique.
              </p>
              <ul className="space-y-6 text-lg">
                <li className="flex gap-4 items-start">
                  <span className="text-[#d1c7a3] mt-1">—</span>
                  <span>Les œuvres doivent intégrer des outils d'IA générative dans au moins une étape de production (image, son, ou montage).</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-[#d1c7a3] mt-1">—</span>
                  <span>Durée maximale : 15 minutes, générique compris.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 02 - Éthique */}
          <section className="grid grid-cols-1 gap-12 border-b border-white/10 py-24 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-serif text-3xl italic text-[#d1c7a3] opacity-60">02</span>
              <h2 className="text-xl uppercase tracking-widest font-bold">Éthique</h2>
            </div>
            <div className="lg:col-span-2 max-w-2xl space-y-8 text-xl text-white/70 font-light leading-relaxed">
              <p>
                Chaque soumission doit être accompagnée d'une note détaillant les outils utilisés. Le festival valorise la transparence et le respect des droits d'auteur.
              </p>
            </div>
          </section>

          {/* Section 03 - Propriété */}
          <section className="grid grid-cols-1 gap-12 border-b border-white/10 py-24 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-serif text-3xl italic text-[#d1c7a3] opacity-60">03</span>
              <h2 className="text-xl uppercase tracking-widest font-bold">Propriété</h2>
            </div>
            <div className="lg:col-span-2 max-w-2xl text-xl text-white/70 font-light leading-relaxed space-y-6">
              <p>
                Les participants garantissent être titulaires des droits d'auteur pour les éléments non générés par l'IA.
              </p>
              <p className="text-base text-white/40 italic uppercase tracking-[0.2em]">
                MARSAI se réserve le droit de diffuser les extraits à des fins de promotion.
              </p>
            </div>
          </section>

          {/* Section 04 - Soumission */}
          <section className="grid grid-cols-1 gap-12 border-b border-white/10 py-24 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-serif text-3xl italic text-[#d1c7a3] opacity-60">04</span>
              <h2 className="text-xl uppercase tracking-widest font-bold">Soumission</h2>
            </div>
            <div className="lg:col-span-2 max-w-2xl text-xl text-white/70 font-light leading-relaxed">
              <p>
                Date limite : <span className="text-[#d1c7a3] font-bold">30 juin 2026</span>. Format requis : .MP4 ou .MOV, résolution minimale 1080p.
              </p>
            </div>
          </section>

          {/* Section 05 - Jury */}
          <section className="grid grid-cols-1 gap-12 py-24 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-serif text-3xl italic text-[#d1c7a3] opacity-60">05</span>
              <h2 className="text-xl uppercase tracking-widest font-bold">Sélection</h2>
            </div>
            <div className="lg:col-span-2 max-w-2xl text-xl text-white/70 font-light leading-relaxed">
              <p>
                Les décisions du jury international sont souveraines. Les critères incluent l'esthétique, l'innovation technique et la narration.
              </p>
            </div>
          </section>

        </main>

        <footer className="mt-40 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 italic font-sans">
            MARSAI Festival — Marseille MMXXVI. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CompetitionRules;