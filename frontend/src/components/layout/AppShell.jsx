import React, { useState, useEffect } from "react";
import { RoleSidebar } from "../role/RoleSidebar";
import { TopNavigationBar } from "./TopNavigationBar";
import { CommandBar } from "./CommandBar";
import { useUIStore } from "../../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import GlobalOverlayManager from "../overlays/GlobalOverlayManager";

/**
 * AppShell: The persistent SaaS layout for authenticated users.
 * Features a fixed sidebar, sticky top nav, and scrollable content area.
 */
export const AppShell = () => {
    const { isSidebarOpen } = useUIStore();
    const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandBarOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Sidebar width logic
    const sidebarWidth = isSidebarOpen ? "w-[260px]" : "w-[72px]";
    const contentMargin = isSidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]";

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#1A1F23] flex overflow-x-hidden">
            <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
            <GlobalOverlayManager />
            {/* Sidebar - Desktop */}
            <div className={`hidden md:block fixed top-0 left-0 h-full z-[100] transition-all duration-300 ease-in-out ${sidebarWidth}`}>
                <RoleSidebar />
            </div>

            {/* Main Application Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${contentMargin}`}>
                {/* Fixed Top Navigation */}
                <TopNavigationBar />

                {/* Primary Content Workspace */}
                <main className="flex-1 p-4 md:p-8 pt-6">
                    <div className="max-w-[1600px] mx-auto relative">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Optional: Footer within app shell for legal/status info */}
                <footer className="px-8 py-4 text-[11px] text-gray-400 font-medium uppercase tracking-widest border-t border-gray-100 bg-white/50">
                    &copy; {new Date().getFullYear()} Udaan Ecosystem • v1.0.4-stable
                </footer>
            </div>
        </div>
    );
};
