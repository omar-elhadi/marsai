import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Users, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // --- FIX : Réinitialise le menu mobile si on agrandit la fenêtre ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('marsai_token');
    localStorage.removeItem('marsai_user');
    navigate('/', { replace: true });
  };

  // Helper pour l'affichage conditionnel (Texte visible si Mobile OU Sidebar ouverte)
  const showFullMenu = isMobileMenuOpen || !isCollapsed;

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden selection:bg-indigo-500">
      
      {/* --- BURGER MOBILE (Violet & Imposant) --- */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-2 bg-transparent border-none outline-none focus:ring-0 transition-transform active:scale-90"
      >
        {isMobileMenuOpen ? (
          <X size={40} className="text-white" />
        ) : (
          <Menu size={40} className="text-indigo-500" strokeWidth={2.5} />
        )}
      </button>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 bg-[#0D0D0D] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 w-full' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed && !isMobileMenuOpen ? 'md:w-20' : 'md:w-64'} 
      `}>
        
        {/* LOGO SECTION : ADMIN MARSAI (Gris) */}
        <div className={`pt-10 md:pt-22 pb-16 px-10 shrink-0 transition-opacity duration-300 
          ${isCollapsed && !isMobileMenuOpen ? 'md:opacity-0' : 'opacity-100'}`}>
          <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none text-gray-500">
            ADMIN <span className="text-gray-400">MARSAI</span>
          </h1>
        </div>

        {/* TOGGLE BUTTON (Bureau uniquement) */}
        {!isMobileMenuOpen && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-20 bg-indigo-600 rounded-full p-1 border border-black hover:bg-indigo-500 transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        )}

        {/* NAVIGATION */}
        <nav className={`flex-1 space-y-3 overflow-y-auto custom-scrollbar transition-all
          ${isCollapsed && !isMobileMenuOpen ? 'px-2' : 'px-4'}`}>
          
          {/* DASHBOARD */}
          <NavLink to="/admin" end className={({ isActive }) => 
            `flex items-center transition-all rounded-sm border-2 group
            ${isCollapsed && !isMobileMenuOpen ? 'justify-center p-3' : 'gap-5 px-6 py-4 md:py-3.5'} 
            ${isMobileMenuOpen ? 'py-8 px-10' : ''} 
            ${isActive ? 'border-indigo-600 text-white' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white'}`
          }>
            {({ isActive }) => (
              <>
                <LayoutDashboard 
                  size={isCollapsed && !isMobileMenuOpen ? 28 : (isMobileMenuOpen ? 32 : 20)} 
                  className={isActive ? "text-indigo-500" : "text-gray-600 group-hover:text-white transition-colors"} 
                />
                {showFullMenu && (
                  <span className={`font-black uppercase tracking-[0.25em] transition-all
                    ${isMobileMenuOpen ? 'text-xl' : 'text-[11px]'}`}>
                    Dashboard
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* JURY */}
          <NavLink to="/admin/users" className={({ isActive }) => 
            `flex items-center transition-all rounded-sm border-2 group
            ${isCollapsed && !isMobileMenuOpen ? 'justify-center p-3' : 'gap-5 px-6 py-4 md:py-3.5'} 
            ${isMobileMenuOpen ? 'py-8 px-10' : ''}
            ${isActive ? 'border-indigo-600 text-white' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white'}`
          }>
            {({ isActive }) => (
              <>
                <Users 
                  size={isCollapsed && !isMobileMenuOpen ? 28 : (isMobileMenuOpen ? 32 : 20)} 
                  className={isActive ? "text-indigo-500" : "text-gray-600 group-hover:text-white transition-colors"} 
                />
                {showFullMenu && (
                  <span className={`font-black uppercase tracking-[0.25em] transition-all
                    ${isMobileMenuOpen ? 'text-xl' : 'text-[11px]'}`}>
                    Jury
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* FILMS */}
          <NavLink to="/admin/films" className={({ isActive }) =>
            `flex items-center transition-all rounded-sm border-2 group
            ${isCollapsed && !isMobileMenuOpen ? 'justify-center p-3' : 'gap-5 px-6 py-4 md:py-3.5'}
            ${isMobileMenuOpen ? 'py-8 px-10' : ''}
            ${isActive ? 'border-indigo-600 text-white' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white'}`
          }>
            {({ isActive }) => (
              <>
                <Film
                  size={isCollapsed && !isMobileMenuOpen ? 28 : (isMobileMenuOpen ? 32 : 20)}
                  className={isActive ? "text-indigo-500" : "text-gray-600 group-hover:text-white transition-colors"}
                />
                {showFullMenu && (
                  <span className={`font-black uppercase tracking-[0.25em] transition-all
                    ${isMobileMenuOpen ? 'text-xl' : 'text-[11px]'}`}>
                    Films
                  </span>
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* DECONNEXION : Aligné à gauche, petite taille */}
        <div className={`p-10 border-t border-white/5 shrink-0 flex ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : 'justify-start'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 text-indigo-500 hover:text-indigo-400 transition-all font-black uppercase tracking-[0.2em] outline-none group 
            ${isMobileMenuOpen ? 'text-xl py-6 px-6' : 'text-[10px]'}`}
          >
            <LogOut 
              size={isCollapsed && !isMobileMenuOpen ? 24 : (isMobileMenuOpen ? 32 : 16)} 
              className="group-hover:-translate-x-1 transition-transform shrink-0" 
            />
            {showFullMenu && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-black relative w-full">
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}

export default AdminLayout;