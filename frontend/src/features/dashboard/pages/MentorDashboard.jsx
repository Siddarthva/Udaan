import React, { useState, useEffect } from 'react';
import { Target, Users, Calendar, Clock, MessageSquare, Heart, Bell, Loader2, BarChart3, ChevronRight, Plus } from 'lucide-react';
import { Card, Button, Badge } from "../../../components/ui";
import { notificationService } from "../../../services/messageService";
import { useAuth } from "../../auth/context/AuthContext";
import { delay } from "../../../services/mockDb";

/**
 * MentorDashboard: Professional workspace for guiding teams.
 * Integrated with mock services for real-world simulation.
 */
const MentorDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ mentees: 0, requests: 0, score: 4.8 });

    useEffect(() => {
        const loadMentorData = async () => {
            setLoading(true);
            try {
                // Simulate fetching metrics/mentees
                await delay(1200);
            } finally {
                setLoading(false);
            }
        };
        loadMentorData();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
                <Loader2 size={32} className="animate-spin opacity-50 text-gray-900" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Restoring Guidance Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border-purple-100 shadow-sm">Mentorship Center</Badge>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Real-time active</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-none">
                        Welcome, Dr. {user?.name?.split(' ')[1] || user?.name?.split(' ')[0] || 'Mentor'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Access your Mentorship Hub and guide the next generation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="primary" size="lg" className="h-12 bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100 text-white border-none py-2 px-6">
                        <Calendar size={18} className="mr-2" /> Schedule Sessions
                    </Button>
                </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Active Mentees", value: stats.mentees.toString(), icon: Users, color: "blue", trend: "0%" },
                    { label: "Guidance Requests", value: stats.requests.toString(), icon: MessageSquare, color: "purple", trend: "New" },
                    { label: "Impact Score", value: stats.score.toString(), icon: Heart, color: "red", trend: "High" },
                    { label: "Sessions Hosted", value: "0", icon: Clock, color: "emerald", trend: "N/A" }
                ].map((stat, i) => (
                    <Card key={i} className="p-5 border-none shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl bg-gray-50 text-gray-900`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area: Active Guidance */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-0 border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <Users size={20} className="text-gray-400" /> Guidance Portfolio
                            </h3>
                            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">All Teams</Button>
                        </div>
                        <div className="flex-1 p-12 flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio is ready for expansion</h3>
                            <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
                                You haven&apos;t accepted any mentorship requests yet. Check the discovery feed to find teams seeking advisory.
                            </p>
                            <Button size="lg" className="mt-8 bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 rounded-xl shadow-xl shadow-purple-100 active:scale-95 transition-all outline-none border-none">
                                Review Active Inbounds
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border-none shadow-sm bg-purple-600 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Heart size={120} />
                        </div>
                        <h3 className="text-base font-bold mb-4 relative z-10">Impact Summary</h3>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/5">
                                <p className="text-3xl font-bold mb-1">0</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Cases</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/5">
                                <p className="text-3xl font-bold mb-1">4.8</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Rating</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
