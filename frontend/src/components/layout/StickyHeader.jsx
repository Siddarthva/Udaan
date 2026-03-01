import React, { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useUIStore } from "../../store/uiStore";
import { RoleBadge } from "../role/RoleBadge";
import { InputField } from "../ui";

export const StickyHeader = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useUIStore();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    return (
        <header
            className={`sticky top-0 z-[140] h-16 flex items-center justify-between px-6 transition-colors duration-200 border-b ${scrolled ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm" : "bg-white border-transparent"
                }`}
        >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md md:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="relative group hidden sm:block max-w-sm w-full">
                    <InputField
                        icon={Search}
                        placeholder="Search workspace..."
                        className="bg-gray-50 h-9"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                        {user?.role && <RoleBadge role={user.role} className="mt-0.5 scale-90 origin-right" />}
                    </div>
                    <button className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-sm hover:ring-gray-200 transition-all">
                        {user?.name?.[0]}
                    </button>
                </div>
            </div>
        </header>
    );
};
