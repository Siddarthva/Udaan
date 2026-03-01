import React, { Suspense, lazy } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import LoadingScreen from "../common/LoadingScreen";

// Lazy load role-specific dashboards to conserve performance
const InnovatorDashboard = lazy(() => import("../../features/dashboard/pages/InnovatorDashboard"));
const SponsorDashboard = lazy(() => import("../../features/dashboard/pages/SponsorDashboard"));
const MentorDashboard = lazy(() => import("../../features/dashboard/pages/MentorDashboard"));

/**
 * RoleDashboard: Primary entry point for authenticated users.
 * Automatically renders the correct dashboard based on user role.
 */
export const RoleDashboard = () => {
    const { user } = useAuth();
    const role = user?.role || 'Innovator';

    return (
        <Suspense fallback={<LoadingScreen />}>
            {role === 'Innovator' && <InnovatorDashboard />}
            {role === 'Sponsor' && <SponsorDashboard />}
            {role === 'Mentor' && <MentorDashboard />}
        </Suspense>
    );
};
