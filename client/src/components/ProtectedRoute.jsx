import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // On remplace 'token' par 'marsai_token' pour correspondre à ton stockage
  const token = localStorage.getItem('marsai_token'); 

  if (!token) {
    console.log("Accès refusé : marsai_token introuvable");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;