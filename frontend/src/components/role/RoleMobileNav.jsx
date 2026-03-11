import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ROLE_NAVIGATION, ROLE_THEME } from "@/config/roles";

const NavItem = ({ to, icon: Icon, label, themeClass }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative ${isActive ? "text-black" : "text-gray-400"}`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon size={20} className={`transition-transform duration-300 ${isActive ? `scale-110 ${themeClass}` : ""}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1 truncate max-w-[50px] text-center" title={label}>
                        {label}
                    </span>
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
};

export const RoleMobileNav = () => {
    const { user } = useAuth();
    const role = user?.role || 'Innovator';
    const navItems = ROLE_NAVIGATION[role].slice(0, 5); // take max 5 for mobile bottom nav
    const theme = ROLE_THEME[role];

    return (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-black/5 shadow-2xl flex items-center justify-around px-2 z-[100] preserve-shadow">
            {navItems.map((item, index) => (
                <NavItem
                    key={index}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    themeClass={theme.textClass}
                />
            ))}
        </nav>
    );
};
