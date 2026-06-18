import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Settings,
  Star,
} from "lucide-react";

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Réinitialise le menu mobile si on agrandit la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("marsai_user");
    navigate("/", { replace: true });
  };

  // Texte visible si Mobile OU Sidebar ouverte
  const showFullMenu = isMobileMenuOpen || !isCollapsed;

  return (
    <div
      className="flex h-screen overflow-hidden selection:bg-indigo-500"
      style={{
        background: "var(--color-bg-pure)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── BURGER MOBILE ─────────────────────────────────── */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-2 bg-transparent border-none outline-none focus:ring-0 transition-transform active:scale-90"
      >
        {isMobileMenuOpen ? (
          <X size={40} style={{ color: "var(--color-text)" }} />
        ) : (
          <Menu size={40} style={{ color: "#6366f1" }} strokeWidth={2.5} />
        )}
      </button>

      {/* ── SIDEBAR ───────────────────────────────────────── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0 w-full" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed && !isMobileMenuOpen ? "md:w-20" : "md:w-64"}
        `}
        style={{
          background: "var(--color-bg-pure)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Logo */}
        <div
          className={`shrink-0 transition-opacity duration-300
            ${isCollapsed && !isMobileMenuOpen ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}`}
          style={{ padding: "3rem 1.75rem 2rem" }}
        >
          {/* Tiret + label — même pattern que les headers de pages */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.875rem",
            }}
          >
            <span
              style={{
                width: "2rem",
                height: "1px",
                background: "var(--color-accent)",
                flexShrink: 0,
              }}
            />
            <span className="label-overline">Admin</span>
          </div>
          {/* Titre — même typo que "Vue d'ensemble", "Gestion Jury", etc. */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              fontStyle: "italic",
              lineHeight: 1,
              color: "var(--color-text)",
            }}
          >
            MARSAI <span style={{ color: "#6366f1" }}>Festival</span>
          </h1>
        </div>

        {/* Toggle collapse — tab intégré dans la bordure droite */}
        {!isMobileMenuOpen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute items-center justify-center z-50"
            title={isCollapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
            style={{
              right: "-1px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "18px",
              height: "52px",
              background: "rgba(99,102,241,0.08)",
              borderTop: "1px solid var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
              borderRight: "1px solid var(--color-border)",
              cursor: "pointer",
              color: "#818cf8",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6366f1";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              e.currentTarget.style.color = "#818cf8";
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={10} />
            ) : (
              <ChevronLeft size={10} />
            )}
          </button>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{
            padding: isCollapsed && !isMobileMenuOpen ? "0 0.5rem" : "0 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {[
            {
              to: "/admin",
              end: true,
              icon: LayoutDashboard,
              label: "Dashboard",
            },
            { to: "/admin/users", end: false, icon: Users, label: "Jury" },
            { to: "/admin/films", end: false, icon: Film, label: "Évaluation" },
            {
              to: "/admin/selection",
              end: false,
              icon: Star,
              label: "Sélection",
            },
            {
              to: "/admin/awards",
              end: false,
              icon: Trophy,
              label: "Palmarès",
            },
            {
              to: "/admin/settings",
              end: false,
              icon: Settings,
              label: "Paramètres",
            },
          ].map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center transition-all duration-200 border-l-2 group
                ${isCollapsed && !isMobileMenuOpen ? "justify-center py-4 px-3" : "gap-4 px-5 py-4"}
                ${isMobileMenuOpen ? "py-5 px-8 gap-5" : ""}
                ${isActive ? "border-indigo-500" : "border-transparent"}`
              }
              style={({ isActive }) => ({
                background: isActive ? "rgba(99,102,241,0.07)" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={
                      isCollapsed && !isMobileMenuOpen
                        ? 24
                        : isMobileMenuOpen
                          ? 28
                          : 22
                    }
                    strokeWidth={isActive ? 2.5 : 1.75}
                    style={{
                      color: isActive ? "#6366f1" : "var(--color-text-muted)",
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                    className="group-hover:text-white! transition-colors"
                  />
                  {showFullMenu && (
                    <span
                      className={`font-bold uppercase transition-colors
                        ${isMobileMenuOpen ? "text-lg tracking-[0.15em]" : "text-sm tracking-[0.12em]"}`}
                      style={{
                        color: isActive
                          ? "var(--color-text)"
                          : "var(--color-text-muted)",
                      }}
                    >
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Déconnexion */}
        <div
          style={{
            padding: "clamp(1.5rem, 3vw, 2rem)",
            borderTop: "1px solid var(--color-border)",
            flexShrink: 0,
            display: "flex",
            justifyContent:
              isCollapsed && !isMobileMenuOpen ? "center" : "flex-start",
          }}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 transition-all outline-none group
              ${isMobileMenuOpen ? "text-lg py-4 px-4 gap-5" : "text-xs"}`}
            style={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--color-text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-muted)")
            }
          >
            <LogOut
              size={
                isCollapsed && !isMobileMenuOpen
                  ? 20
                  : isMobileMenuOpen
                    ? 26
                    : 18
              }
              className="group-hover:-translate-x-1 transition-transform shrink-0"
            />
            {showFullMenu && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto relative w-full"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          style={{
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            maxWidth: "88rem",
            margin: "0 auto",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
