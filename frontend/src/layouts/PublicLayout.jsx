import React from "react";
import { Outlet, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * PublicLayout: The high-conversion marketing shell for non-authenticated users.
 * Features a traditional landing page navbar and footer.
 */
export const PublicLayout = () => {
    const { user } = useAuth();
    const location = useLocation();

    // If user is already authenticated, redirect away from public pages to dashboard
    if (user && (location.pathname === "/" || location.pathname === "/auth")) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-white text-[#1A1F23]">
            {/* Minimalist Public Navbar */}
            <header className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md z-[200] border-b border-gray-100/50">
                <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                            U
                        </div>
                        <span className="font-bold text-[22px] tracking-tight group-hover:text-black transition-colors">Udaan</span>
                    </Link>

                    

                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="hidden sm:block text-sm font-bold text-gray-900 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/auth">
                            <Button size="lg" className="rounded-xl h-11 px-6 shadow-xl shadow-black/5 flex items-center gap-2 group">
                                Start Building <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <button className="md:hidden p-2.5 text-black">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Public Content with Fade Transition */}
            <main className="pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Minimalist Public Footer */}
            <footer className="bg-[#1A1F23] text-white py-24 mt-20">
                <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <h4 className="font-bold text-2xl mb-6">Udaan Ecosystem</h4>
                        <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
                            The professional platform for visionaries building the future. Designed for efficiency, built for scale.
                        </p>
                        <div className="flex gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                            <span className="font-bold tracking-tighter text-xl">Twitter</span>
                            <span className="font-bold tracking-tighter text-xl">Discord</span>
                            <span className="font-bold tracking-tighter text-xl">GitHub</span>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-6">Platform</h5>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li>Innovator Tools</li>
                            <li>Mentorship Network</li>
                            <li>Investor Relations</li>
                            <li>Verified Discovery</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-6">Legal</h5>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li>Privacy Policy</li>
                            <li>Security Compliance</li>
                            <li>Developer API</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1280px] mx-auto px-6 pt-20 mt-20 border-t border-white/5 text-gray-500 text-xs flex justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} Udaan. Restricted Beta Access.</p>
                    <p className="flex items-center gap-2">Built for high-performance <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> Service Active</p>
                </div>
            </footer>
        </div>
    );
};
