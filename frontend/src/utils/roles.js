import {
    LayoutDashboard,
    Briefcase,
    Search,
    Star,
    Bell,
    User,
    Settings,
    MessageSquare,
    Users
} from "lucide-react";

// UI role labels. The API / database use INNOVATOR | MENTOR | SPONSOR.
export const ROLES = {
    INNOVATOR: "Innovator",
    MENTOR: "Mentor",
    SPONSOR: "Sponsor"
};

export const ROLE_NAVIGATION = {
    Innovator: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/community", icon: Users, label: "Community" },
        { to: "/projects", icon: Briefcase, label: "My Startups" },
        { to: "/mentors", icon: Users, label: "Mentors" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Mentor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/community", icon: Users, label: "Community" },
        { to: "/discover", icon: Search, label: "Browse Startups" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Sponsor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/community", icon: Users, label: "Community" },
        { to: "/sponsor/discover", icon: Search, label: "Discover Startups" },
        { to: "/sponsor/watchlist", icon: Star, label: "Watchlist" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ]
};

const API_TO_UI = {
    INNOVATOR: ROLES.INNOVATOR,
    FOUNDER: ROLES.INNOVATOR,
    MENTOR: ROLES.MENTOR,
    SPONSOR: ROLES.SPONSOR,
    INVESTOR: ROLES.SPONSOR
};

/** API role (any case, legacy aliases) -> UI label, or null when unknown. */
export function mapRoleToClient(apiRole) {
    return API_TO_UI[String(apiRole || "").toUpperCase()] || null;
}

/** UI label / any case -> canonical API role. */
export function mapRoleToApi(role) {
    const ui = mapRoleToClient(role);
    return ui ? ui.toUpperCase() : null;
}
