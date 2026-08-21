import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
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
