import React from "react";
import { Outlet } from "react-router-dom";
import { RoleSidebar } from "./RoleSidebar";
import { RoleMobileNav } from "./RoleMobileNav";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

export const RoleBasedLayout = () => {
    const { isSidebarOpen } = useUIStore();
    const sidebarWidth = isSidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]";

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
            {/* Sidebar */}
            <div className="hidden md:block">
                <RoleSidebar />
            </div>

            {/* Mobile Nav */}
            <RoleMobileNav />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarWidth}`}>
                <StickyHeader />

                <main className="flex-1 pb-24 md:pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};
