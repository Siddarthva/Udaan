import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

/**
 * ProtectedRoute: Ensures user is authenticated.
 * If not, redirects to authentication page.
 */
export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Or a loading spinner

    if (!user) {
        // Redirect to login page but save the target location for post-login redirect
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

/**
 * PublicRoute: Redirects authenticated users AWAY from public/auth pages.
 * Ensures they land on their role-specific dashboard immediately.
 */
export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        // Redirect authenticated users to their dashboard automatically
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

/**
 * RoleBasedGuard: Ensures a user has a specific role before accessing a route.
 */
export const RoleBasedGuard = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        // Unauthorized role access → redirect back to their own dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
