import React from "react";
import { Plus, Zap, Heart, MessageSquare, Search, FileText } from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Card } from "../ui";

/**
 * QuickActionsPanel: Context-aware rapid execution component.
 * Adapts actions based on the user's role in the ecosystem.
 */
export const QuickActionsPanel = () => {
    const { user } = useAuth();
    const role = user?.role || 'Innovator';

    const actionSets = {
        Innovator: [
            { label: "Add Milestone", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Update Metrics", icon: Plus, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Contact Mentor", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" }
        ],
        Mentor: [
            { label: "Open Calendar", icon: Plus, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Review Pitch", icon: Search, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Endorse Node", icon: Heart, color: "text-red-500", bg: "bg-red-50" }
        ],
        Sponsor: [
            { label: "Funding Sheet", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Market Intel", icon: Search, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Watchlist Sync", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" }
        ]
    };

    const actions = actionSets[role] || actionSets.Innovator;

    return (
        <Card className="p-1 border-none bg-gray-50 flex items-center gap-1 rounded-2xl">
            {actions.map((action, i) => (
                <button
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-white rounded-xl transition-all active:scale-95 group"
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
