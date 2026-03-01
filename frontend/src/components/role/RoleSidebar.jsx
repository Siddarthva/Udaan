import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useUIStore } from "../../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_NAVIGATION } from "../../config/roles";

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 relative ${isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon size={18} className={`shrink-0 transition-colors duration-150 ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`} />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm truncate"
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-[200] whitespace-nowrap shadow-sm">
                            {label}
                        </div>
                    )}
                </>
            )}
        </NavLink>
    );
};

export const RoleSidebar = () => {
    const { user, logout } = useAuth();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const isCollapsed = !isSidebarOpen;
    const role = user?.role || 'Innovator';
    const navItems = ROLE_NAVIGATION[role];

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-[150] flex flex-col ${isCollapsed ? "w-[72px]" : "w-[260px]"}`}
        >
            {/* Header */}
            <div className="h-16 flex items-center px-5 shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 bg-gray-900 text-white flex items-center justify-center rounded-lg font-semibold text-lg shrink-0">
                        U
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="font-semibold text-gray-900 truncate"
                            >
                                Udaan
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <div className="mb-2 px-3">
                    {!isCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Features</p>}
                </div>
                {navItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 flex flex-col gap-1">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors group w-full text-left"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
                </button>

                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center h-10 w-full hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </aside>
    );
};
