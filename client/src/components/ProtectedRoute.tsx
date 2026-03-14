// @ts-nocheck
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();
  
  if (loading) return <div>Chargement...</div>;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();
  
  if (loading) return <div>Chargement...</div>;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
