import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ScrollProgressBar, PageContainer } from "@/components/layout/LayoutPrimitives";

const PageTransition = ({ children }) => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

const MainLayout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === "/auth";

    return (
        <div className="min-h-screen bg-[#F7F7F3] text-[#2F2F2F] font-sans selection:bg-[#2F2F2F] selection:text-white flex flex-col">
            <ScrollProgressBar />
            <Navbar />

            <main className="flex-1 pt-24 pb-32">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>

            {!isAuthPage && <MobileBottomNav />}

            <footer className="hidden md:block bg-white py-24 border-t border-gray-100 text-center text-gray-400">
                <PageContainer>
                    <p className="font-serif text-3xl text-[#2F2F2F] font-bold mb-8">Udaan</p>
                    <div className="flex justify-center gap-12 mb-12 text-gray-400 font-bold uppercase tracking-widest text-xs">
                        <a href="#" className="hover:text-black transition-colors">Twitter</a>
                        <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-black transition-colors">Instagram</a>
                    </div>
                    <p className="text-sm">&copy; {new Date().getFullYear()} Udaan Innovation Platform. Crafted for visionaries.</p>
                </PageContainer>
            </footer>
        </div>
    );
};

export default MainLayout;
