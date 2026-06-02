import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN || "/login"} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />; // fallback to root if unauthorized route is missing
  }

  return <Outlet />;
};

export default ProtectedRoute;
