import React from "react";
import { Plus, Zap, Search, Star } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";

/**
 * QuickActionsPanel: Context-aware rapid execution component.
 * Adapts actions based on the user's role in the ecosystem.
 */
export const QuickActionsPanel = () => {
    const { user } = useAuthStore();
    const { openOverlay } = useUIStore();
    const navigate = useNavigate();
    const role = user?.role || 'Innovator';

    const actionSets = {
        Innovator: [
            { label: "Launch Startup", icon: Plus, action: () => openOverlay('VENTURE_WIZARD'), color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Manage Startups", icon: Zap, action: () => navigate('/projects'), color: "text-orange-500", bg: "bg-orange-50" }
        ],
        Mentor: [
            { label: "Browse Startups", icon: Search, action: () => navigate('/discover'), color: "text-blue-500", bg: "bg-blue-50" },
            { label: "My Requests", icon: Zap, action: () => navigate('/requests'), color: "text-purple-500", bg: "bg-purple-50" }
        ],
        Sponsor: [
            { label: "Discover Startups", icon: Search, action: () => navigate('/sponsor/discover'), color: "text-blue-500", bg: "bg-blue-50" },
            { label: "My Watchlist", icon: Star, action: () => navigate('/sponsor/watchlist'), color: "text-emerald-500", bg: "bg-emerald-50" }
        ]
    };

    const actions = actionSets[role] || actionSets.Innovator;

    return (
        <Card className="p-1 border-none bg-gray-100 flex items-center gap-1 rounded-2xl">
            {actions.map((action, i) => (
                <button
                    key={i}
                    onClick={action.action}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-white rounded-xl transition-all active:scale-95 group cursor-pointer"
                >
                    <div className={`p-1 rounded-md transition-colors ${action.bg} ${action.color} group-hover:bg-gray-100`}>
                        <action.icon size={12} />
                    </div>
                    {action.label}
                </button>
            ))}
        </Card>
    );
};
