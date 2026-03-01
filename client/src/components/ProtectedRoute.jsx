import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute — garde de route avec vérification session + rôle.
 *
 * Le JWT est stocké dans un cookie httpOnly (inaccessible JS) — protection XSS.
 * On vérifie uniquement les données utilisateur (rôle) stockées en localStorage.
 * L'expiration réelle est gérée côté serveur — un 401 API redirige vers /login.
 *
 * @param {string|string[]} requiredRole - Rôle(s) autorisé(s) : "ADMIN", "MODERATOR", "JURY"
 */
const ProtectedRoute = ({ requiredRole }) => {
  const raw  = localStorage.getItem('marsai_user');
  const user = raw ? JSON.parse(raw) : null;

  // Pas de session connue → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle si requis
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      // Authentifié mais rôle insuffisant → accueil (pas login)
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
