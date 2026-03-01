import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, BarChart3, Clock, Search, PieChart, Shield, Loader2, ChevronRight, Briefcase } from 'lucide-react';
import { Card, Button, Badge } from "../../../components/ui";
import projectService from "../../../services/projectService";
import { useAuth } from "../../auth/context/AuthContext";
import { delay } from "../../../services/mockDb";

/**
 * SponsorDashboard: Professional investment and sponsorship workspace.
 * Integrated with mock services for real-world simulation.
 */
const SponsorDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ capital: "₹0", activeInterests: 0, matching: "92%" });

    useEffect(() => {
        const loadSponsorData = async () => {
            setLoading(true);
            try {
                // Simulate fetching metrics/portfolio
                await delay(1300);
            } finally {
                setLoading(false);
            }
        };
        loadSponsorData();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
                <Loader2 size={32} className="animate-spin opacity-50 text-gray-900" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Analyzing Funding Pipelines...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm">Sponsor Workspace</Badge>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Shield size={12} /> Institutional Access Verified</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-none">
                        Welcome, {user?.name?.split(' ')[0] || 'Partner'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Access your Funding Pipeline and manage institutional capital.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="primary" size="lg" className="h-12 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 text-white border-none py-2 px-6">
                        <Search size={18} className="mr-2" /> Explore Verified Nodes
                    </Button>
                </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Capital Deployed", value: stats.capital, icon: TrendingUp, color: "emerald", trend: "0%" },
                    { label: "Active Interests", value: stats.activeInterests.toString(), icon: Target, color: "blue", trend: "N/A" },
                    { label: "Portfolio Yield", value: "12.4%", icon: PieChart, color: "purple", trend: "Est." },
                    { label: "Sponsorships", value: "0", icon: Briefcase, color: "orange", trend: "N/A" }
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
                {/* Main Content Area: Discovery & Portfolio */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="p-0 border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <PieChart size={20} className="text-gray-400" /> Portfolio Analytics
                            </h3>
                            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">Generate Reports</Button>
                        </div>
                        <div className="flex-1 p-12 flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm mb-6">
                                <BarChart3 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Pipeline is currently empty</h3>
                            <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
                                Start identifying innovation nodes by following sectors or exploring the verified discovery feed.
                            </p>
                            <Button size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl shadow-xl shadow-emerald-100 active:scale-95 transition-all outline-none border-none">
                                Discover High-Yield Assets
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border-none shadow-sm bg-gray-900 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp size={120} />
                        </div>
                        <h3 className="text-base font-bold mb-4 relative z-10">Market Pulse</h3>
                        <div className="space-y-3 relative z-10">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/5">
                                <p className="text-xs font-bold mb-1 opacity-60 uppercase tracking-widest">Sector Alert</p>
                                <p className="text-sm font-medium leading-relaxed">HealthTech activity increased by 14% in your targeted region.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SponsorDashboard;
