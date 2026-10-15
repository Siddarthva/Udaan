import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }
    return <Outlet />;
}

export function PublicRoute() {
    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}

export function RoleGuard({ allowedRoles }) {
    const { user } = useAuthStore();
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}
