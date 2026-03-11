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
const ContributePage = lazy(() => import("../features/projects/pages/ContributePage"));
const FeedPage = lazy(() => import("../features/feed/pages/FeedPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const InboxPage = lazy(() => import("../features/messaging/pages/InboxPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const FundingPage = lazy(() => import("../features/funding/pages/FundingPage"));
const MentorsPage = lazy(() => import("../features/mentors/pages/MentorsPage"));
const DiscoverProjectsPage = lazy(() => import("../features/sponsor/pages/DiscoverProjectsPage"));
const FundingPipelinePage = lazy(() => import("../features/sponsor/pages/FundingPipelinePage"));
const WatchlistPage = lazy(() => import("../features/sponsor/pages/WatchlistPage"));
const PortfolioImpactPage = lazy(() => import("../features/sponsor/pages/PortfolioImpactPage"));
const ReportsPage = lazy(() => import("../features/sponsor/pages/ReportsPage"));
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
                        <Route path="/about" element={<div className="p-20 text-center text-4xl font-bold">About Udaan</div>} />
                        <Route path="/vision" element={<div className="p-20 text-center text-4xl font-bold">Our Vision</div>} />
                        <Route path="/pricing" element={<div className="p-20 text-center text-4xl font-bold">Ecosystem Pricing</div>} />
                        <Route path="/contact" element={<div className="p-20 text-center text-4xl font-bold">Contact Support</div>} />
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
                        <Route path="/messages" element={<InboxPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/feed" element={<FeedPage />} />

                        {/* Innovator-specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Innovator']} />}>
                            <Route path="/projects" element={<MyProjectsPage />} />
                            <Route path="/contribute" element={<ContributePage />} />
                            <Route path="/funding" element={<FundingPage />} />
                            <Route path="/mentors" element={<MentorsPage />} />
                        </Route>

                        {/* Mentor-specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Mentor']} />}>
                            <Route path="/mentees" element={<div className="p-8">My Mentees</div>} />
                            <Route path="/requests" element={<div className="p-8">Guidance Requests</div>} />
                            <Route path="/sessions" element={<div className="p-8">Sessions Calendar</div>} />
                            <Route path="/resources" element={<div className="p-8">Mentor Resources</div>} />
                        </Route>

                        {/* Sponsor-specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Sponsor']} />}>
                            <Route path="/sponsor/discover" element={<DiscoverProjectsPage />} />
                            <Route path="/sponsor/pipeline" element={<FundingPipelinePage />} />
                            <Route path="/sponsor/watchlist" element={<WatchlistPage />} />
                            <Route path="/sponsor/portfolio" element={<PortfolioImpactPage />} />
                            <Route path="/sponsor/reports" element={<ReportsPage />} />
                        </Route>

                        {/* Admin-specific Routes */}
                        <Route element={<RoleBasedGuard allowedRoles={['Admin']} />}>
                            <Route path="/admin/metrics" element={<div className="p-8">Ecosystem Analytics</div>} />
                            <Route path="/admin/compliance" element={<div className="p-8">Compliance Matrix</div>} />
                            <Route path="/admin/users" element={<div className="p-8">User Directory</div>} />
                            <Route path="/admin/audit" element={<div className="p-8">System Audit Logs</div>} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
};
