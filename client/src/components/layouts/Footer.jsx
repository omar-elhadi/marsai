import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Le Moteur Atmosphérique (Rayons de Soleil)
const SunRays = () => {
  const raysRef = useRef(null);

  useGSAP(() => {
    // Les rayons respirent de manière asynchrone pour imiter le passage des nuages
    gsap.to('.ray', {
      rotate: "+=3", // Léger balayage géométrique
      opacity: () => Math.random() * 0.2 + 0.1, // Variation d'intensité
      duration: () => Math.random() * 5 + 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.7, // Désynchronisation totale des faisceaux
    });
  }, { scope: raysRef });

  return (
    // mix-blend-screen est la clé : il additionne la lumière des rayons à celle des particules en dessous
    <div ref={raysRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-80">
      {/* Faisceau Principal */}
      <div className="ray absolute top-[-10%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-b from-amber-500/15 via-amber-400/5 to-transparent origin-top-left -rotate-[35deg] blur-3xl"></div>
      {/* Faisceau Secondaire (Plus dense) */}
      <div className="ray absolute top-[-20%] left-[20%] w-[100%] h-[150%] bg-gradient-to-b from-amber-300/15 via-amber-200/5 to-transparent origin-top-left -rotate-[42deg] blur-[100px]"></div>
      {/* Faisceau Périphérique (Plus chaud) */}
      <div className="ray absolute top-[-5%] left-[40%] w-[120%] h-[150%] bg-gradient-to-b from-amber-600/10 via-amber-500/5 to-transparent origin-top-left -rotate-[28deg] blur-2xl"></div>
    </div>
  );
};

// Le Moteur Particulaire (L'Essaim Doré)
const ParticleSystem = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const particles = gsap.utils.toArray('.particle');
    
    particles.forEach((p) => {
      gsap.set(p, {
        x: () => Math.random() * window.innerWidth,
        y: () => Math.random() * 500,
        opacity: 0, 
        scale: () => Math.random() * 1.5 + 0.5,
      });

      // Ascension inéluctable
      gsap.to(p, {
        y: "-=250", 
        x: "+=random(-50, 50)", 
        duration: () => Math.random() * 12 + 8, 
        repeat: -1, 
        ease: "none",
        delay: () => Math.random() * -15, 
      });

      // Scintillement stochastique
      gsap.to(p, {
        opacity: () => Math.random() * 0.8 + 0.2, 
        duration: () => Math.random() * 0.4 + 0.1, 
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: () => Math.random() * -5, 
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 250 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute w-[2px] h-[2px] bg-amber-100 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)]"
        />
      ))}
    </div>
  );
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-gray-400 overflow-hidden border-t border-white/5">
      
      {/* Le Fond Numérique */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black pointer-events-none z-0"></div>
      
      {/* L'Atmosphère */}
      <ParticleSystem />
      <SunRays />
      
      {/* Contenu Typographique */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* L'En-tête du Footer */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 mb-16">
          <div>
            <h2 className="text-white text-5xl md:text-7xl font-black mb-2 tracking-tighter uppercase">
              MARSAI
            </h2>
          </div>
          <div className="flex items-center space-x-3 mt-6 md:mt-0 text-sm tracking-widest text-purple-300/60 uppercase">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(155, 137, 255)]"></span>
            <span>Festival 2026</span>
          </div>
        </div>

        {/* LA NOUVELLE GRILLE : 3 colonnes, parfaitement centrées et espacées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto mb-20">
          
          {/* Colonne 1 : Participer */}
          <div className="md:justify-self-center">
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs opacity-50">Participer</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="soumettre" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Soumettre un film</a></li>
              <li>
                <Link
                  to="/reglement"
                  className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300"
                >
                  Règlement du concours
                </Link>
              </li>
              <li><a href="calendrier" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Calendrier</a></li>
              <li><a href="/login" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Se connecter</a></li>
            </ul>
          </div>

          {/* Colonne 2 : Ressources */}
          <div className="md:justify-self-center">
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs opacity-50">Ressources</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="F-A-Q" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">FAQ</a></li>
              <li><a href="#" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Actualités</a></li>
              <li><a href="contact" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Légal */}
          <div className="md:justify-self-center">
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs opacity-50">Légal</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="Mention" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Mentions légales</a></li>
              <li><a href="PolitiqueDeConfidentialite" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Confidentialité</a></li>
              <li><a href="regles-conditions" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">CGU</a></li>
              <li><a href="cookies" className="inline-block hover:translate-x-2 hover:text-amber-400 transition-all duration-300">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Barre Inférieure */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-600 tracking-wider">
          <p>&copy; {currentYear} <span className="text-white font-bold">MARSAI</span> — TOUS DROITS RÉSERVÉS.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Les icônes sociales SVG */}
            <a href="#" className="hover:text-amber-400 transition-colors hover:-translate-y-1 duration-300"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            <a href="#" className="hover:text-amber-400 transition-colors hover:-translate-y-1 duration-300"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
            <a href="#" className="hover:text-amber-400 transition-colors hover:-translate-y-1 duration-300"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;