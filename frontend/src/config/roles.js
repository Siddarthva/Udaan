import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    User,
    Settings,
    Bell,
    Users,
    Search,
    BookOpen,
    TrendingUp,
    Calendar,
    Target,
    PieChart,
    FileText,
    Heart,
    Trophy,
    Zap,
    Star
} from "lucide-react";

export const ROLE_NAVIGATION = {
    Innovator: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/projects", icon: Briefcase, label: "My Startups" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Mentor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/discover", icon: Search, label: "Browse Startups" },
        { to: "/requests", icon: Search, label: "Mentorship Requests" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Sponsor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/sponsor/discover", icon: Search, label: "Discover Startups" },
        { to: "/sponsor/watchlist", icon: Star, label: "Watchlist" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ]
};

export const ROLE_THEME = {
    Innovator: { color: '#3B82F6', bgClass: 'bg-blue-500', textClass: 'text-blue-500', label: 'Innovator', icon: Briefcase },
    Mentor: { color: '#8B5CF6', bgClass: 'bg-purple-500', textClass: 'text-purple-500', label: 'Mentor', icon: Heart },
    Sponsor: { color: '#10B981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', label: 'Sponsor', icon: Target }
};
