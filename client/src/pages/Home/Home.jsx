import Reveal from '../../components/animations/Reveal';
import Parallax from '../../components/animations/Parallax';
import HeroImpact from '../../components/animations/HeroImpact';

function Home() {
  return (
    <div className="bg-black text-white selection:bg-amber-500 selection:text-black">

      {/* 1. HERO : L'Impact (Déjà rendu intrinsèquement responsive via les vw/vh) */}
      <HeroImpact />

      {/* 2. DESCRIPTION : La Respiration */}
      {/* Py-20 sur mobile, py-32 sur tablette, py-40 sur desktop pour laisser le texte respirer */}
      <section className="max-w-5xl mx-auto py-20 md:py-32 lg:py-40 px-6 md:px-12">
        <Reveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-10 tracking-tight leading-tight">
            Description de l'événement
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-zinc-400 text-lg md:text-2xl lg:text-3xl leading-relaxed font-light">
            Festival dédié à la créativité et à l'innovation réunissant participants,
            jury et partenaires dans une symbiose technologique inédite.
          </p>
        </Reveal>
      </section>

      {/* 3. JURY : La Hiérarchie Rigoureuse */}
      <section id="jury" className="bg-zinc-950 py-20 md:py-32 px-6 md:px-12 border-y border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16">Le Jury</h2>
          </Reveal>
          {/* L'espacement (space-y) s'agrandit sur les grands écrans pour la lisibilité */}
          <div className="space-y-6 md:space-y-10">
            <Reveal delay={0.1}>
              <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-zinc-800 pb-4 md:pb-6 group">
                <span className="text-2xl md:text-4xl font-bold group-hover:text-amber-400 transition-colors duration-300">Alice Dupont</span>
                <span className="text-zinc-500 text-sm md:text-lg uppercase tracking-widest mt-2 md:mt-0">Innovation</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-zinc-800 pb-4 md:pb-6 group">
                <span className="text-2xl md:text-4xl font-bold group-hover:text-amber-400 transition-colors duration-300">Marc Leroy</span>
                <span className="text-zinc-500 text-sm md:text-lg uppercase tracking-widest mt-2 md:mt-0">Design</span>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-zinc-800 pb-4 md:pb-6 group">
                <span className="text-2xl md:text-4xl font-bold group-hover:text-amber-400 transition-colors duration-300">Sophie Martin</span>
                <span className="text-zinc-500 text-sm md:text-lg uppercase tracking-widest mt-2 md:mt-0">R&D I.A.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. LIEU : L'Immersion Géographique (Parallax Sécurisé) */}
      <section id="lieu" className="max-w-6xl mx-auto py-20 md:py-32 px-6 md:px-12">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">Le Nexus</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-zinc-400 text-base md:text-xl mb-10 max-w-2xl">
            Le festival se tiendra a <strong className="text-white">Marseille</strong>,
            épicentre de la collision entre tradition, nostalgie, technologie et innovation.
          </p>
        </Reveal>
        
        {/* Hauteur fluide : 50vh sur mobile, 600px figés sur desktop pour ne pas écraser l'écran */}
        <div className="relative h-[50vh] md:h-[600px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800">
          <Parallax speed={1.15} className="h-full w-full">
            <iframe
              title="Plan du lieu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047744348!2d2.281344415674389!3d48.87838327928942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8f%3A0xd9b5676e112e643d!2sPalais%20des%20congr%C3%A8s%20de%20Paris!5e0!3m2!1sfr!2sfr!4v1680000000000!5m2!1sfr!2sfr" // Remettez votre lien exact
              width="100%"
              height="120%"
              className="w-full h-full" // Purge totale des altérations visuelles
              style={{ border: 0, marginTop: "-10%" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </Parallax>
        </div>
      </section>

      {/* 5. RÉCOMPENSES : Minimalisme Tactile */}
      <section id="recompenses" className="max-w-5xl mx-auto py-20 md:py-32 px-6 md:px-12">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16">Récompenses</h2>
        </Reveal>
        {/* Grille adaptative : 1 colonne -> 2 colonnes -> 4 colonnes */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-zinc-400">
          <Reveal delay={0.1}>
            <li className="flex flex-col border-t border-zinc-800 pt-6">
              <span className="text-amber-500 font-bold mb-2">01.</span>
              <span className="text-lg md:text-xl text-white font-medium">Trophées I.A.</span>
              <span className="text-sm mt-2">Pour les 3 premiers lauréats.</span>
            </li>
          </Reveal>
          <Reveal delay={0.2}>
            <li className="flex flex-col border-t border-zinc-800 pt-6">
              <span className="text-amber-500 font-bold mb-2">02.</span>
              <span className="text-lg md:text-xl text-white font-medium">Fonds de Création</span>
              <span className="text-sm mt-2">Prix en espèces et dotations matérielles.</span>
            </li>
          </Reveal>
          <Reveal delay={0.3}>
            <li className="flex flex-col border-t border-zinc-800 pt-6">
              <span className="text-amber-500 font-bold mb-2">03.</span>
              <span className="text-lg md:text-xl text-white font-medium">Réseau d'Élite</span>
              <span className="text-sm mt-2">Networking direct avec les investisseurs.</span>
            </li>
          </Reveal>
          <Reveal delay={0.4}>
            <li className="flex flex-col border-t border-zinc-800 pt-6">
              <span className="text-amber-500 font-bold mb-2">04.</span>
              <span className="text-lg md:text-xl text-white font-medium">Certification</span>
              <span className="text-sm mt-2">Label d'excellence MARSAI pour tous.</span>
            </li>
          </Reveal>
        </ul>
      </section>

      {/* 6. PARTENAIRES : La Constellation */}
      <section id="partenaires" className="bg-zinc-950 py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 md:mb-24">Alliances</h2>
          </Reveal>
          
          {/* Grille : 2 colonnes (mobile) -> 3 (tablette) -> 4 (desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12 items-center">
            {[1, 2, 3, 4].map((i) => (
              <Parallax key={i} speed={1 + i * 0.03}>
                <div className="aspect-[3/2] flex items-center justify-center bg-zinc-900/50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-zinc-800/50 hover:border-amber-500/50 transition-colors duration-500 group">
                  <span className="text-zinc-600 font-black text-xl md:text-3xl uppercase tracking-widest group-hover:text-zinc-300 transition-colors duration-500">
                    ORG {i}
                  </span>
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA : L'Appel Final */}
      <section className="bg-white text-black py-24 md:py-40 text-center px-6 md:px-12">
        <Reveal>
          {/* Clamp sur le texte pour une adaptation millimétrée entre mobile et desktop */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[8vw] font-black uppercase tracking-tighter leading-none mb-8 md:mb-16">
            Intégrez la matrice.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <a href="soumettre" className="inline-block group">
            <button className="bg-black text-white px-10 md:px-16 py-4 md:py-6 rounded-full text-sm md:text-lg font-bold tracking-widest uppercase overflow-hidden relative">
              <span className="relative z-10">Soumettre une œuvre</span>
              <div className="absolute inset-0 bg-amber-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
            </button>
          </a>
        </Reveal>
      </section>

    </div>
  );
}

export default Home;