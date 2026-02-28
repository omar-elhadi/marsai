import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute — garde de route avec vérification token + expiration + rôle.
 *
 * @param {string|string[]} requiredRole - Rôle(s) autorisé(s) : "ADMIN", "MODERATOR", "JURY"
 *   Si non fourni, seul le token est vérifié (authentification sans restriction de rôle).
 */

/**
 * Décode le payload d'un JWT sans vérifier la signature (côté client uniquement).
 * La vraie vérification se fait côté serveur sur chaque appel API.
 */
const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  // exp est en secondes, Date.now() en millisecondes
  return payload.exp * 1000 < Date.now();
};

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('marsai_token');

  // Pas de token → redirection login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token expiré → nettoyage localStorage + redirection login
  if (isTokenExpired(token)) {
    localStorage.removeItem('marsai_token');
    localStorage.removeItem('marsai_user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle si requis
  if (requiredRole) {
    const raw = localStorage.getItem('marsai_user');
    const user = raw ? JSON.parse(raw) : null;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!user || !roles.includes(user.role)) {
      // Authentifié mais rôle insuffisant → accueil (pas login)
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
