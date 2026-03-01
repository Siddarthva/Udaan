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
        { to: "/projects", icon: Briefcase, label: "My Projects" },
        { to: "/contribute", icon: Zap, label: "Contribute" },
        { to: "/funding", icon: Trophy, label: "Funding Opportunities" },
        { to: "/mentors", icon: Users, label: "Mentors" },
        { to: "/feed", icon: MessageSquare, label: "Community" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Mentor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/mentees", icon: Users, label: "Mentees" },
        { to: "/requests", icon: Search, label: "Requests for Guidance" },
        { to: "/sessions", icon: Calendar, label: "Sessions / Calendar" },
        { to: "/resources", icon: BookOpen, label: "Resources" },
        { to: "/feed", icon: MessageSquare, label: "Community" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
        { to: "/notifications", icon: Bell, label: "Notifications" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" }
    ],
    Sponsor: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/sponsor/discover", icon: Search, label: "Discover Projects" },
        { to: "/sponsor/pipeline", icon: Zap, label: "Funding Pipeline" },
        { to: "/sponsor/watchlist", icon: Star, label: "Watchlist" },
        { to: "/sponsor/portfolio", icon: PieChart, label: "Portfolio / Impact" },
        { to: "/sponsor/reports", icon: FileText, label: "Reports" },
        { to: "/messages", icon: MessageSquare, label: "Messages" },
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
