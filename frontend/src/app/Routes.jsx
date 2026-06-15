import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppShell } from "@/components/layout/AppShell";

// Route Guards
import { ProtectedRoute, PublicRoute, RoleBasedGuard } from "@/components/auth/RouteGuards";

// Components
import LoadingScreen from "@/components/common/LoadingScreen";

// Lazy Loaded Feature Pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const AuthPage = lazy(() => import("../features/auth/pages/AuthPage"));
const RoleDashboard = lazy(() => import("../components/role/RoleDashboard").then(m => ({ default: m.RoleDashboard })));
const MyProjectsPage = lazy(() => import("../features/projects/pages/MyProjectsPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const MentorsPage = lazy(() => import("../features/mentors/pages/MentorsPage"));
const DiscoverProjectsPage = lazy(() => import("../features/sponsor/pages/DiscoverProjectsPage"));
const WatchlistPage = lazy(() => import("../features/sponsor/pages/WatchlistPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/**
 * AppRoutes: Definitive routing architecture for the platform.
 * Segregates public marketing space from authenticated application workspaces.
 */
export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* 
                    PUBLIC SPACE 🌐
                    Only accessible if NOT authenticated.
                    If authenticated users visit these, they are redirected to /dashboard.
                */}
                <Route element={<PublicRoute />}>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                    </Route>
                </Route>

                {/* 
                    AUTHENTICATED WORKSPACE 🔒
                    The core SaaS application shell.
                */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>
                        {/* Common Dashboard (Role-specific logic handled inside RoleDashboard) */}
                        <Route path="/dashboard" element={<RoleDashboard />} />

                        {/* Universal App Features */}
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        {/* Innovator (Founder) specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Innovator']} />}>
                            <Route path="/projects" element={<MyProjectsPage />} />
                            <Route path="/mentors" element={<MentorsPage />} />
                        </Route>

                        {/* Mentor-specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Mentor']} />}>
                            <Route path="/requests" element={<div className="p-8">Guidance Requests</div>} />
                            <Route path="/discover" element={<DiscoverProjectsPage />} />
                        </Route>

                        {/* Sponsor (Investor) specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Sponsor']} />}>
                            <Route path="/sponsor/discover" element={<DiscoverProjectsPage />} />
                            <Route path="/sponsor/watchlist" element={<WatchlistPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* Fallback — accessible regardless of auth state */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Suspense>
    );
};
