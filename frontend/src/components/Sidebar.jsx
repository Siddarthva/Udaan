import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_NAVIGATION } from "@/utils/roles";
import { cn } from "@/utils/helpers";

export default function Sidebar() {
    const { user } = useAuth();
    const role = user?.role || "Innovator";
    const navItems = ROLE_NAVIGATION[role] || ROLE_NAVIGATION["Innovator"];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4 hidden md:block shrink-0">
            <div className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                                    isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )
                            }
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </aside>
    );
}
export { Sidebar };
