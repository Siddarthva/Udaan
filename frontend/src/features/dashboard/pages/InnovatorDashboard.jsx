import React, { useState, useEffect } from 'react';
import { Briefcase, Target, Zap, ChevronRight, CheckCircle2, TrendingUp, Users, Clock, Plus, BarChart3, Bell, Loader2 } from 'lucide-react';
import { Card, Button, EmptyState, Badge } from "../../../components/ui";
import projectService from "../../../services/projectService";
import { notificationService } from "../../../services/messageService";
import { useAuth } from "../../auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InnovatorDashboard: Workspace tailored for building projects and tracking progress.
 * Now integrated with mock services for real-world simulation.
 */
const InnovatorDashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [projData, notifData] = await Promise.all([
                    projectService.fetchAll({ ownerId: user.id }),
                    notificationService.fetchUserAlerts(user.id)
                ]);
                setProjects(projData);
                setNotifications(notifData);
            } catch (err) {
                console.error("[DASHBOARD]: Data sync failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
                <Loader2 size={32} className="animate-spin opacity-50 text-gray-900" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing Innovation Core...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header ... same as before but dynamic ... */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100 shadow-sm">Innovator Workspace</Badge>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Last active: just now</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-none">
                        Welcome back, {user?.name?.split(' ')[0] || 'Innovator'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Access your Innovation Core and scale your vision.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="primary" size="lg" className="h-12 bg-gray-900 shadow-xl shadow-black/10 text-white border-none py-2 px-6">
                        <Plus size={18} className="mr-2" /> Launch New Project
                    </Button>
                </div>
            </div>

            {/* Core Stats ... dynamic values from projects ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Total Raised", value: `₹${projects.reduce((acc, p) => acc + p.raised, 0).toLocaleString()}`, icon: TrendingUp, color: "emerald", trend: "Active" },
                    { label: "Active Nodes", value: projects.length.toString(), icon: Briefcase, color: "blue", trend: "Synced" },
                    { label: "Alerts", value: notifications.filter(n => !n.read).length.toString(), icon: Bell, color: "purple", trend: "Live" },
                    { label: "Milestones", value: "0", icon: Target, color: "orange", trend: "0%" }
                ].map((stat, i) => {
                    const colorClasses = {
                        emerald: "bg-emerald-50 text-emerald-600",
                        blue: "bg-blue-50 text-blue-600",
                        purple: "bg-purple-50 text-purple-600",
                        orange: "bg-orange-50 text-orange-600"
                    }[stat.color] || "bg-gray-50 text-gray-600";

                    return (
                        <Card key={i} className="p-5 border-none shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${colorClasses}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</h3>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area: Project Tracking */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-0 border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <BarChart3 size={20} className="text-gray-400" /> My Projects Repository
                            </h3>
                            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">All Assets</Button>
                        </div>
                        <div className="flex-1 p-6">
                            {projects.length > 0 ? (
                                <div className="space-y-4">
                                    {projects.map(p => (
                                        <div key={p.id} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-300 transition-all flex items-center gap-6 group">
                                            <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-900 font-black border border-gray-100 group-hover:scale-105 transition-transform">
                                                {p.title[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.15em] border-gray-200">{p.status}</Badge>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Raised ₹{p.raised.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-400 hover:text-black transition-colors">
                                                <ChevronRight size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-6">
                                        <Plus size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No active projects</h3>
                                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Launching your first project takes less than 2 minutes. Start building today.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar area remains similar, but linked to notifs */}
                <div className="lg:col-span-4 space-y-6">
                    {/* ... other Widgets ... */}
                    <Card className="p-6 border-none shadow-sm bg-gray-900 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Bell size={120} />
                        </div>
                        <h3 className="text-base font-bold mb-4 relative z-10">Notifications</h3>
                        <div className="space-y-3 relative z-10">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 3).map(n => (
                                    <div key={n.id} className={`p-4 rounded-xl backdrop-blur-md border ${n.read ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/10'}`}>
                                        <p className="text-xs font-bold mb-1 opacity-60 uppercase tracking-widest">{n.title}</p>
                                        <p className="text-sm font-medium leading-relaxed">{n.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">No Alerts</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InnovatorDashboard;
