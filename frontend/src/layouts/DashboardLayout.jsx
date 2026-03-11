import React from "react";
import { Outlet } from "react-router-dom";
import { StickySidebar } from "@/components/layout/StickySidebar";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { PageContainer, ScrollProgressBar } from "@/components/layout/LayoutPrimitives";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
    const { isSidebarOpen } = useUIStore();
    const sidebarWidth = isSidebarOpen ? "w-72" : "w-24";

    return (
        <div className="min-h-screen bg-[#F7F7F3] flex text-[#2F2F2F]">
            {/* 1. Sticky Sidebar - Fixed height, sticky to top */}
            <div className={`hidden md:block shrink-0 transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${sidebarWidth}`}>
                <StickySidebar />
            </div>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <ScrollProgressBar />
                <StickyHeader />

                <main className="flex-1 pb-32">
                    <PageContainer className="pt-8 md:pt-12">
                        {/* 3. Smooth Fade Entrance for Routes */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </PageContainer>
                </main>

                {/* Optional: Simple Footer for Dashboard */}
                <footer className="py-8 border-t border-gray-100 flex justify-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-widest">&copy; Udaan Ecosystem Systems</p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
