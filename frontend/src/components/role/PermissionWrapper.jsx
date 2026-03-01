import React from "react";
import { useAuth } from "../../features/auth/context/AuthContext";

export const PermissionWrapper = ({ allowedRoles, children, fallback = null }) => {
    const { user } = useAuth();

    if (!user) return <>{fallback}</>;

    const userRole = user.role;

    if (!allowedRoles.includes(userRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
