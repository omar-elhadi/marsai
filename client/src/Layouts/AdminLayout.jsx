import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, Users, Trophy, LogOut, Menu, X } from 'lucide-react';

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { label: "Vue d'ensemble", path: "/admin", exact: true, icon: <LayoutDashboard size={20} /> },
    { label: "Films", path: "/admin/films", icon: <Film size={20} /> },
    { label: "Jury", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Palmarès", path: "/admin/awards", icon: <Trophy size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Menu Mobile Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-[#262626] rounded-md text-white border border-white/10"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#262626] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <h1 className="text-lg font-bold tracking-[0.2em] uppercase">
            Admin <span className="text-indigo-500">Panel</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 translate-x-1' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-1'}
              `}
            >
              {/* 👇 C'est ici que j'ai corrigé : on utilise une fonction pour les enfants */}
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-white" : "text-white/40 group-hover:text-white transition-colors"}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium tracking-wide uppercase">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-200 rounded-lg transition-colors text-sm font-bold uppercase tracking-wide">
            <LogOut size={18} />
            <span>Sortir</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-black relative w-full">
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen pt-16 md:pt-12">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}

export default AdminLayout;