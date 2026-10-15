import React, { useEffect, lazy, Suspense } from "react";
import { useStartupStore } from "@/store/startupStore";
import { useMentorStore } from "@/store/mentorStore";
import { useInvestorStore } from "@/store/investorStore";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { ProtectedRoute, PublicRoute, RoleGuard } from "@/utils/routes";
import { useAuthStore } from "@/store/authStore";

// Lazy Loaded Pages
const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Projects = lazy(() => import("@/pages/Projects"));
const Discover = lazy(() => import("@/pages/Discover"));
const Community = lazy(() => import("@/pages/Community"));
const Watchlist = lazy(() => import("@/pages/Watchlist"));
const Mentors = lazy(() => import("@/pages/Mentors"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Messages = lazy(() => import("@/pages/Messages"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
                    <Suspense fallback={<Loader text="Loading page..." />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

// Drops every piece of per-user client state when the session ends so the next user never sees stale data.
function SessionStateReset() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    useEffect(() => {
        if (isLoading || isAuthenticated) return;
        queryClient.clear();
        useStartupStore.setState({ startups: [], currentStartup: null, error: null });
        useMentorStore.setState({ requests: [], error: null });
        useInvestorStore.setState({ watchlist: [], interests: [], error: null });
    }, [isAuthenticated, isLoading]);
    return null;
}

export default function App() {
    const initialize = useAuthStore((state) => state.initialize);
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        return <Loader fullScreen text="Initializing Workspace..." />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <SessionStateReset />
            <Suspense fallback={<Loader fullScreen text="Loading..." />}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/auth" element={<Login />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/messages" element={<Messages />} />

                            {/* Innovator Routes */}
                            <Route element={<RoleGuard allowedRoles={["Innovator"]} />}>
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/mentors" element={<Mentors />} />
                            </Route>

                            {/* Discover Startups (Mentor / Sponsor) */}
                            <Route path="/discover" element={<Discover />} />
                            <Route path="/sponsor/discover" element={<Discover />} />

                            {/* Sponsor Routes */}
                            <Route element={<RoleGuard allowedRoles={["Sponsor"]} />}>
                                <Route path="/sponsor/watchlist" element={<Watchlist />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </QueryClientProvider>
    );
}
