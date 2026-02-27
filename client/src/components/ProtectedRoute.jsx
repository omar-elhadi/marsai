import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute — garde de route avec vérification token + rôle.
 *
 * @param {string|string[]} requiredRole - Rôle(s) autorisé(s) : "ADMIN", "MODERATOR", "JURY"
 *   Si non fourni, seul le token est vérifié (authentification sans restriction de rôle).
 *
 * Exemple d'usage dans App.jsx :
 *   <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
 *     <Route path="/admin" element={<AdminDashboard />} />
 *   </Route>
 */
const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('marsai_token');

  // Pas de token → redirection login
  if (!token) {
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
