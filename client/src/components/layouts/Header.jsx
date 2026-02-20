import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // L'outil indispensable pour une navigation sans coupure

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Verrouillage du scroll physique lors de l'ouverture du menu mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          
          {/* LOGO */}
          <div className="relative z-[110]">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-black tracking-tighter uppercase"
            >
              MARSAI
            </Link>
          </div>

          {/* NAVIGATION DESKTOP (Espace optimisé pour accueillir 5 liens) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <a href="/#festival" className="text-xs lg:text-sm font-bold tracking-widest text-zinc-400 hover:text-white uppercase transition-colors">Le Festival</a>
            {/* Utilisation de Link pour les pages dédiées */}
            <Link to="/galerie" className="text-xs lg:text-sm font-bold tracking-widest text-zinc-400 hover:text-white uppercase transition-colors">Galerie</Link>
            <Link to="/events" className="text-xs lg:text-sm font-bold tracking-widest text-zinc-400 hover:text-white uppercase transition-colors">Events</Link>
            <a href="/soumettre" className="text-xs lg:text-sm font-bold tracking-widest text-zinc-400 hover:text-white uppercase transition-colors">Participer</a>
          </nav>

          {/* BOUTON BURGER MOBILE */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[110] w-10 h-10 flex flex-col items-end justify-center gap-[6px] focus:outline-none"
            aria-label="Menu"
          >
            <span className={`block h-[2px] bg-white transition-all duration-300 ease-in-out origin-right ${isOpen ? 'w-6 -rotate-45 -translate-y-[2px]' : 'w-8'}`}></span>
            <span className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-0 opacity-0' : 'w-6'}`}></span>
            <span className={`block h-[2px] bg-white transition-all duration-300 ease-in-out origin-right ${isOpen ? 'w-6 rotate-45 translate-y-[2px]' : 'w-4'}`}></span>
          </button>
        </div>
      </header>

      {/* OVERLAY DU MENU MOBILE */}
      <div 
        className={`fixed inset-0 bg-black z-[105] flex flex-col items-center justify-center transition-opacity duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* L'espacement (space-y-8) est calibré pour que les 5 liens tiennent sur un iPhone 13 mini */}
        <nav className="flex flex-col space-y-8 text-center">
          <a 
            href="/#festival" 
            onClick={() => setIsOpen(false)} 
            className={`text-3xl font-black uppercase tracking-widest text-white transition-transform duration-500 delay-[100ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Le Festival
          </a>
          
          <Link 
            to="/galerie" 
            onClick={() => setIsOpen(false)} 
            className={`text-3xl font-black uppercase tracking-widest text-white transition-transform duration-500 delay-[150ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Galerie
          </Link>
          
          <Link 
            to="/events" 
            onClick={() => setIsOpen(false)} 
            className={`text-3xl font-black uppercase tracking-widest text-white transition-transform duration-500 delay-[200ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Events
          </Link>
          
          <a 
            href="/#participer" 
            onClick={() => setIsOpen(false)} 
            className={`text-3xl font-black uppercase tracking-widest text-white transition-transform duration-500 delay-[250ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Participer
          </a>
        
        </nav>
      </div>
    </>
  );
}