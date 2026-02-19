import Reveal from '../../components/animations/Reveal';
import Parallax from '@/components/animations/Parallax';

function Home() {
  return (
    <>
      {/* HERO : L'impact immédiat */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white px-6">
        <Reveal>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            MARSAI
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 font-light tracking-widest uppercase">
            L'apogée du cinéma génératif
          </p>
        </Reveal>
      </div>

      {/* DESCRIPTION : La clarté */}
      <section className="max-w-4xl mx-auto py-32 px-6">
        <Reveal>
          <h2 className="text-4xl font-bold mb-8 tracking-tight">
            Description de l'événement
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-zinc-400 text-xl leading-relaxed">
            Festival dédié à la créativité et à l'innovation réunissant participants,
            jury et partenaires dans une symbiose technologique inédite.
          </p>
        </Reveal>
      </section>

      {/* JURY : La hiérarchie (On remplace le bg-gray-100 par du zinc-900 pour le luxe) */}
      <section id="jury" className="bg-zinc-950 py-32 px-6 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-4xl font-bold mb-12">Le Jury</h2>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="font-bold">Alice Dupont</span>
                <span className="text-zinc-500">Innovation</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="font-bold">Marc Leroy</span>
                <span className="text-zinc-500">Design</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RECOMPENSES : Minimalisme tactile */}
      <section id="recompenses" className="max-w-4xl mx-auto py-32 px-6">
        <Reveal>
          <h2 className="text-4xl font-bold mb-8">Récompenses</h2>
        </Reveal>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-400">
          <Reveal delay={0.1}><li>• Trophées pour les 3 premiers</li></Reveal>
          <Reveal delay={0.2}><li>• Prix en espèces</li></Reveal>
          <Reveal delay={0.3}><li>• Networking Partenaires</li></Reveal>
          <Reveal delay={0.4}><li>• Certificat d'Excellence</li></Reveal>
        </ul>
      </section>

{/* LIEU : L'immersion géographique sans altération */}
<section id="lieu" className="max-w-5xl mx-auto py-32 px-6">
  <Reveal>
    <h2 className="text-4xl font-bold mb-12">Lieu de l'événement</h2>
  </Reveal>
  
  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
    <Parallax speed={1.15} className="h-full w-full">
      <iframe
        title="Plan du lieu"
        src="https://www.google.com/maps/embed?pb=..." // Votre lien
        width="100%"
        height="120%" 
        className="w-full h-full" 
        style={{ border: 0, marginTop: "-10%" }} 
        allowFullScreen
        loading="lazy"
      ></iframe>
    </Parallax>
  </div>
</section>

      {/* CTA : L'appel à l'action sans fioriture */}
      <section className="bg-white text-black py-32 text-center px-6">
        <Reveal>
          <h2 className="text-5xl font-black uppercase mb-10">Envie de participer ?</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <a href="#inscription" className="inline-block">
            <button className="bg-black text-white px-12 py-4 rounded-full font-bold hover:scale-105 transition-transform duration-300">
              S’INSCRIRE MAINTENANT
            </button>
          </a>
        </Reveal>
      </section>

      {/* PARTENAIRES : La constellation */}
<section id="partenaires" className="bg-zinc-950 py-32 px-6">
  <div className="max-w-5xl mx-auto text-center">
    <Reveal>
      <h2 className="text-4xl font-bold mb-20">Nos Partenaires</h2>
    </Reveal>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
      {/* Chaque partenaire a une vitesse différente (1.05, 1.1, 1.15...) */}
      {[1, 2, 3, 4].map((i) => (
        <Parallax key={i} speed={1 + i * 0.05}>
          <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 hover:border-white transition-colors duration-500">
            <img 
              src={`https://via.placeholder.com/150x80?text=Logo+${i}`} 
              alt={`Partenaire ${i}`} 
              className="grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </Parallax>
      ))}
    </div>
  </div>
</section>
    </>
  );
}

export default Home;