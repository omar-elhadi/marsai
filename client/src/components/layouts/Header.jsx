import React from 'react';

const Header = () => {
  const links = [
    { name: 'Home', href: '#', active: false },
    { name: 'Events', href: '#', active: false },
    { name: 'Contact', href: '#', active: false },
  ];

  return (
    <nav className="flex items-center justify-between bg-[#111827] px-6 py-3 w-full border-b border-gray-800">
      
      {/* Partie Gauche : Logo + Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo (Style Shokunin : Gradient & Forme) */}
        <div className="flex-shrink-0 cursor-pointer">
          <svg className="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="opacity-80"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Liens de navigation */}
        <div className="flex items-center space-x-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                link.active 
                  ? 'bg-[#1f2937] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2937]/50'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Partie Droite : Outils & Profil */}
      <div className="flex items-center space-x-5">
          {/* Nouveau Bouton : Ajouté ici */}
<a 
  href="#" 
  className="hidden md:flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-all duration-300 shadow-lg active:scale-95"
>
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
  </svg>
  Soumettre un film
            </a>  
        </div>
    </nav>
  );
};

export default Header;