import React from "react";
import { Plus, Zap, Heart, MessageSquare, Search, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "../../store/uiStore";
import { Card } from "../ui";
import toast from "react-hot-toast";

/**
 * QuickActionsPanel: Context-aware rapid execution component.
 * Adapts actions based on the user's role in the ecosystem.
 */
export const QuickActionsPanel = () => {
    const { user } = useAuthStore();
    const { openOverlay } = useUIStore();
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

    const handleAction = (label) => {
        switch (label) {
            case "Contact Mentor":
            case "Open Calendar":
                openOverlay('SCHEDULE_SESSION');
                break;
            case "Funding Sheet":
            case "Market Intel":
            case "Review Pitch":
                openOverlay('DOSSIER_VIEWER', { title: `${label} - Strategic Analysis`, findings: 'Consolidated ecosystem data indicates high liquidity and positive traction across primary innovation nodes.' });
                break;
            case "Watchlist Sync":
                openOverlay('AUDIT_DRAWER');
                break;
            case "Add Milestone":
            case "Update Metrics":
                openOverlay('DISCOVERY_WIZARD');
                break;
            case "Endorse Node":
                openOverlay('COMPLIANCE_CONSOLE');
                break;
            default:
                toast.success(`Action Triggered: ${label}`);
        }
    };

    return (
        <Card className="p-1 border-none bg-gray-100 flex items-center gap-1 rounded-2xl">
            {actions.map((action, i) => (
                <button
                    key={i}
                    onClick={() => handleAction(action.label)}
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
