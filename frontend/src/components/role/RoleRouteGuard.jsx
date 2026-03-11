import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

export const RoleRouteGuard = ({ allowedRoles, children, fallbackRoute = "/dashboard" }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Can return a spinner here

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    const userRole = user.role;

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={fallbackRoute} replace />;
    }

    return <>{children}</>;
};
