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

export const ROLES = {
    INNOVATOR: "Innovator",
    MENTOR: "Mentor",
    SPONSOR: "Sponsor",
    ADMIN: "Admin"
};

export const ROLE_NAVIGATION = {
    Innovator: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/community", icon: Users, label: "Community" },
        { to: "/projects", icon: Briefcase, label: "My Startups" },
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

export function mapRoleToClient(dbRole) {
    const mapping = {
        founder: ROLES.INNOVATOR,
        investor: ROLES.SPONSOR,
        mentor: ROLES.MENTOR,
        admin: ROLES.ADMIN
    };
    return mapping[dbRole?.toLowerCase()] || dbRole || ROLES.INNOVATOR;
}

export function mapRoleToDb(clientRole) {
    const mapping = {
        innovator: "founder",
        sponsor: "investor",
        mentor: "mentor",
        admin: "admin"
    };
    return mapping[clientRole?.toLowerCase()] || clientRole || "founder";
}
