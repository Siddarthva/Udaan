import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, User, LogOut, Settings, HelpCircle, LayoutGrid, CheckSquare, Plus } from "lucide-react";
import { useAuthStore } from "@/store/domainStores";
import { useUIStore } from "@/store/uiStore";
import { RoleBadge } from "@/components/role/RoleBadge";
import { InputField } from "@/components/ui";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TopNavigationBar: The primary utility bar for the authenticated workspace.
 * Features: Dashboard search, Role display, Notifications, User menu.
 */
export const TopNavigationBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const { toggleSidebar, openOverlay } = useUIStore();
    const [scrolled, setScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    const userInitial = user?.name?.[0] || 'U';

    return (
        <header
            className={`sticky top-0 z-[140] h-14 md:h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300 border-b ${scrolled ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-sm" : "bg-[#F8F9FA]/80 backdrop-blur-sm border-transparent"
                }`}
        >
            {/* Left Section: Mobile Toggle & Workspace Info */}
            <div className="flex items-center gap-4 flex-1 max-w-[500px]">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-200/50 rounded-lg md:hidden transition-all duration-200 active:scale-95"
                >
                    <Menu size={20} />
                </button>

                <div className="relative group hidden sm:block w-full">
                    <InputField
                        icon={Search}
                        placeholder={`Search ${user?.role || 'workspace'}...`}
                        className="bg-white/50 border-gray-100 hover:border-gray-200 focus:bg-white h-10 text-sm shadow-sm transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40 group-focus-within:opacity-0 transition-opacity pointer-events-none">
                        <kbd className="h-5 px-1.5 text-[10px] bg-gray-100 border border-gray-200 rounded-md font-sans">⌘</kbd>
                        <kbd className="h-5 px-1.5 text-[10px] bg-gray-100 border border-gray-200 rounded-md font-sans">K</kbd>
                    </div>
                </div>
            </div>

            {/* Right Section: Utilities & User Profile */}
            <div className="flex items-center gap-2 md:gap-4 ml-4">
                {/* Rapid Action Button */}
                <div className="hidden lg:block">
                    <QuickActionsPanel />
                </div>

                <div className="h-5 w-px bg-gray-200 hidden md:block"></div>

                <button
                    onClick={() => openOverlay('AUDIT_DRAWER')}
                    className="p-2 text-gray-500 hover:bg-gray-200/50 rounded-lg transition-all relative group active:scale-95"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/10 scale-100 group-hover:scale-125 transition-transform duration-200"></span>
                </button>

                <button
                    onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'Ecosystem Intelligence & Support', status: 'Active', findings: 'Udaan Protocol v1.0.4 is fully operational. Secure encryption layer active. 24/7 institutional support available via the global command node.' })}
                    className="hidden sm:inline-flex p-2 text-gray-500 hover:bg-gray-200/50 rounded-lg transition-all active:scale-95"
                >
                    <HelpCircle size={20} />
                </button>

                <div className="h-5 w-px bg-gray-200 hidden sm:block mx-1"></div>

                {/* User Context Area */}
                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 pl-2 pr-1 h-10 hover:bg-gray-200/50 rounded-xl transition-all active:scale-95 group"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-black">{user?.name}</p>
                            <div className="flex justify-end mt-0.5">
                                <RoleBadge role={user?.role} className="scale-75 origin-right transform border-none bg-gray-100" />
                            </div>
                        </div>
                        <div className="h-9 w-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-3">
                            {userInitial}
                        </div>
                    </button>

                    {/* Popover User Menu */}
                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-[150]"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[160] overflow-hidden p-2"
                                >
                                    <div className="px-3 py-4 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email || 'user@example.com'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors">
                                            <User size={18} /> Profile Details
                                        </Link>
                                        <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors">
                                            <LayoutGrid size={18} /> My Workspace
                                        </Link>
                                        <Link to="/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors">
                                            <Settings size={18} /> Account Settings
                                        </Link>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                logout();
                                                navigate('/', { replace: true });
                                            }}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                                        >
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};
