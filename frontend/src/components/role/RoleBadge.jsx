import React from "react";
import { ROLE_THEME } from "@/config/roles";
import { Rocket, Target, Heart } from "lucide-react";

const ROLE_ICONS = {
    Innovator: Rocket,
    Sponsor: Target,
    Mentor: Heart
};

/**
 * RoleBadge: Standardized role indicator used in top navigation and profile details.
 */
export const RoleBadge = ({ role, className = "" }) => {
    const theme = ROLE_THEME[role] || ROLE_THEME['Innovator'];
    const Icon = ROLE_ICONS[role] || Rocket;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.textClass} border border-current shadow-sm ${className}`}
            style={{ backgroundColor: `${theme.color}10` }}
        >
            <Icon size={12} className="shrink-0" />
            <span>{role}</span>
        </div>
    );
};
