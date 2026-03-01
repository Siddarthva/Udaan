import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase, MessageSquare, User, Bell } from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative ${isActive ? "text-black" : "text-gray-400"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                {isActive && (
                    <motion.div
                        layoutId="bottom-nav-active"
                        className="absolute -top-3 w-1.5 h-1.5 bg-black rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </>
        )}
    </NavLink>
);

const MobileBottomNav = () => {
    return (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-black/5 shadow-2xl flex items-center justify-around px-4 z-[100] preserve-shadow">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Hub" />
            <NavItem to="/projects" icon={Briefcase} label="Launch" />
            <NavItem to="/feed" icon={MessageSquare} label="Talk" />
            <NavItem to="/inbox" icon={Bell} label="Alerts" />
            <NavItem to="/profile" icon={User} label="Me" />
        </nav>
    );
};

export default MobileBottomNav;
