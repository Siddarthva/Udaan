import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    User,
    Settings,
    Bell,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    PieChart,
    Shield,
    Users,
    Calendar,
    Trophy,
    Layers,
    Zap,
    Star,
    BookOpen,
    FileText
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${isActive
                ? "bg-[#2F2F2F] text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)]"
                : "text-gray-500 hover:bg-gray-100/80 hover:text-[#2F2F2F]"
            }`
        }
    >
        <Icon size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
        <AnimatePresence>
            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-sm tracking-tight whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}
        </AnimatePresence>

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-[#2F2F2F] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-[200]">
                {label}
            </div>
        )}
    </NavLink>
);

export const StickySidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const isCollapsed = !isSidebarOpen;

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1] z-[150] flex flex-col ${isCollapsed ? "w-24" : "w-72"}`}
        >
            {/* Header */}
            <div className="h-24 flex items-center px-6 mb-4">
                <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="h-12 w-12 bg-[#2F2F2F] text-white flex items-center justify-center rounded-[1.25rem] font-serif text-2xl font-bold shrink-0 shadow-lg">U</div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-serif text-2xl font-bold tracking-tight text-[#2F2F2F]"
                            >
                                Udaan
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2.5 overflow-y-auto no-scrollbar">
                <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" isCollapsed={isCollapsed} />
                <SidebarItem to="/feed" icon={MessageSquare} label="Community" isCollapsed={isCollapsed} />

                <div className="pt-4 pb-2 px-4 whitespace-nowrap overflow-hidden">
                    <p className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        Workspace
                    </p>
                </div>

                {/* Role-Specific Navigation */}
                {user?.role === 'Innovator' && (
                    <>
                        <SidebarItem to="/projects" icon={Briefcase} label="My Projects" isCollapsed={isCollapsed} />
                        <SidebarItem to="/contribute" icon={Zap} label="Contribute" isCollapsed={isCollapsed} />
                        <SidebarItem to="/funding" icon={Trophy} label="Funding Ops" isCollapsed={isCollapsed} />
                        <SidebarItem to="/mentors" icon={Users} label="Mentors" isCollapsed={isCollapsed} />
                    </>
                )}

                {user?.role === 'Mentor' && (
                    <>
                        <SidebarItem to="/mentees" icon={Users} label="My Mentees" isCollapsed={isCollapsed} />
                        <SidebarItem to="/requests" icon={Search} label="Requests" isCollapsed={isCollapsed} />
                        <SidebarItem to="/sessions" icon={Calendar} label="Sessions" isCollapsed={isCollapsed} />
                        <SidebarItem to="/resources" icon={BookOpen} label="Resources" isCollapsed={isCollapsed} />
                    </>
                )}

                {user?.role === 'Sponsor' && (
                    <>
                        <SidebarItem to="/sponsor/discover" icon={Search} label="Discover" isCollapsed={isCollapsed} />
                        <SidebarItem to="/sponsor/pipeline" icon={Zap} label="Pipeline" isCollapsed={isCollapsed} />
                        <SidebarItem to="/sponsor/watchlist" icon={Star} label="Watchlist" isCollapsed={isCollapsed} />
                        <SidebarItem to="/sponsor/portfolio" icon={PieChart} label="Portfolio" isCollapsed={isCollapsed} />
                        <SidebarItem to="/sponsor/reports" icon={FileText} label="Reports" isCollapsed={isCollapsed} />
                    </>
                )}

                {user?.role === 'Admin' && (
                    <>
                        <SidebarItem to="/admin/metrics" icon={BarChart3} label="Ecosystem" isCollapsed={isCollapsed} />
                        <SidebarItem to="/admin/compliance" icon={Shield} label="Compliance" isCollapsed={isCollapsed} />
                        <SidebarItem to="/admin/users" icon={Users} label="Users" isCollapsed={isCollapsed} />
                        <SidebarItem to="/admin/audit" icon={FileText} label="Audit" isCollapsed={isCollapsed} />
                    </>
                )}

                <div className="pt-4 pb-2 px-4 whitespace-nowrap overflow-hidden">
                    <p className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        Account
                    </p>
                </div>
                <SidebarItem to="/profile" icon={User} label="Profile" isCollapsed={isCollapsed} />
                <SidebarItem to="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-50 flex flex-col gap-2">
                <button
                    onClick={() => { logout(); navigate('/', { replace: true }); }}
                    className="flex items-center gap-4 px-4 py-3.5 text-red-500 hover:bg-red-50/50 rounded-2xl transition-all group"
                >
                    <LogOut size={22} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    {!isCollapsed && <span className="font-bold text-sm tracking-tight">Sign Out</span>}
                </button>

                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center h-10 w-full hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
        </aside>
    );
};
