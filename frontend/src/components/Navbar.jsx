import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationsQuery } from "@/api/hooks";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { data: notificationData } = useNotificationsQuery();
    const unreadCount = notificationData?.unread_count || 0;

    const handleLogout = async () => {
        await logout();
        navigate("/auth", { replace: true });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-900 text-white font-bold rounded-lg flex items-center justify-center text-sm">
                        U
                    </div>
                    <span className="font-bold text-gray-900 text-base tracking-tight">UDAAN</span>
                </Link>
                {user?.role && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase tracking-wider rounded border border-gray-200">
                        {user.role}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                <Link
                    to="/notifications"
                    className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    title={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Link>
                <Link
                    to="/profile"
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
                >
                    <div className="h-7 w-7 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold">
                        {user?.name?.[0] || "U"}
                    </div>
                    <span className="hidden sm:inline">{user?.name || "User"}</span>
                </Link>
                <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
export { Navbar };
