import React, { useState, useEffect } from "react";
import {
    Activity,
    Target,
    Zap,
    ChevronRight,
    TrendingUp,
    Users,
    Clock,
    Plus,
    BarChart3,
    Bell,
    Layers,
    MessageSquare,
    Trophy,
    ArrowUpRight,
    Briefcase,
    Shield,
    PieChart,
    Globe,
    Landmark,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Skeleton } from "@/components/ui";
import { useAuthStore } from "@/store/domainStores";
import { useUIStore } from "@/store/uiStore";
import { GLOBAL_PROJECTS } from "@/data/projects";
import { PORTFOLIO_HEALTH } from "@/data/portfolio";
import { CAPITAL_LIFECYCLE } from "@/data/portfolio";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * SponsorDashboard: Institutional capital oversight hub.
 * Features: Capital lifecycle tracking, Portfolio PHI, Investment exposure, and Risk Radar.
 */
export default function SponsorDashboard() {
    const { user } = useAuthStore();
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Sponsor Executive Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-950 text-emerald-400 border-none px-4 py-1.5 font-black tracking-[0.2em] text-[10px] uppercase">Fund Oversight Active</Badge>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100">
                            <Shield size={12} className="text-emerald-500" /> PHI: {PORTFOLIO_HEALTH.index} STABLE
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Allocation <span className="text-gray-400">Hub.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track institutional capital deployment, social yield performance, and portfolio-wide risk vectors.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-emerald-200 transition-all border-none active:scale-95"
                        onClick={() => openOverlay('SCENARIO_SIMULATOR')}
                    >
                        <PieChart size={18} /> Risk Radar
                    </Button>
                </div>
            </AnimatedSection>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} label="Capital Deployed" value="₹4.8 Cr" delta="+₹1.2 Cr" color="blue" />
                <StatCard icon={Zap} label="Active Positions" value="7" delta="Synced" color="emerald" />
                <StatCard icon={Users} label="Total Reach" value="52.4k" delta="+4.2k" color="indigo" />
                <StatCard icon={Globe} label="ESG Matrix" value="8.6" delta="+0.4" color="amber" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Capital Lifecycle Velocity</h2>
                        <Button
                            onClick={() => openOverlay('AUDIT_DRAWER')}
                            variant="ghost"
                            className="text-[10px] font-black uppercase text-gray-400"
                        >
                            Full Roadmap
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CAPITAL_LIFECYCLE.slice(0, 3).map((item, i) => (
                            <Card key={i} className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm space-y-4 hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-gray-100 transition-all" />
                                <div className="relative space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.stage}</p>
                                    <h3 className="text-2xl font-black text-gray-900 leading-none">{item.amount}</h3>
                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${60 + i * 10}%` }} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">High-Growth Targets</h2>
                            <Button
                                onClick={() => openOverlay('REGISTRY_VIEWER')}
                                variant="ghost"
                                className="text-[10px] font-black uppercase text-gray-400"
                            >
                                Discover More
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {GLOBAL_PROJECTS.slice(0, 2).map((proj) => (
                                <Card key={proj.id} className="p-8 border-none bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <Badge className="bg-gray-900 text-white border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5 mb-1">{proj.stage}</Badge>
                                            <h3 className="text-2xl font-bold text-gray-900">{proj.name}</h3>
                                        </div>
                                        <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:rotate-12">
                                            <Search size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span>Institutional Rating</span>
                                            <span className="text-gray-900">{proj.innovationScore} PHI</span>
                                        </div>
                                        <Button
                                            onClick={() => openOverlay('DISCOVERY_WIZARD', proj)}
                                            className="w-full h-12 bg-gray-900 text-white border-none rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all"
                                        >
                                            Initiate Discovery Deep-Dive
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Radar Sidebar */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Portfolio Obligations</h2>
                        <div className="space-y-4">
                            {[
                                { title: "AgriDrone Tranche 2", date: "Mar 12, 2026", amount: "₹10.5 L" },
                                { title: "MedAssist Final Review", date: "Apr 01, 2026", amount: "₹25.0 L" }
                            ].map((ob, i) => (
                                <Card key={i} className="p-6 border-none bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center gap-6 group hover:border-emerald-600 transition-all cursor-pointer">
                                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <Landmark size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ob.date}</p>
                                        <h4 className="text-sm font-bold text-gray-900">{ob.title}</h4>
                                    </div>
                                    <p className="text-sm font-black text-gray-900">{ob.amount}</p>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <Card className="p-10 border-none bg-emerald-950 text-white rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900 blur-[40px] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        <Shield size={32} className="text-emerald-400" />
                        <div className="space-y-2">
                            <h4 className="text-2xl font-bold tracking-tight italic">ESG Integrity Node</h4>
                            <p className="text-emerald-200 text-sm font-medium leading-relaxed">Your portfolio climate impact has surpassed Q1 targets by 14.5%.</p>
                        </div>
                        <Button
                            onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'ESG Carbon Disclosure', status: 'Verified', findings: 'The portfolio consolidated carbon footprint has been reduced by 420 Metric Tons of CO2e in the current fiscal year.' })}
                            className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Export Carbon Footprint Dossier
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, delta, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        indigo: "text-indigo-600 bg-indigo-50/50"
    };

    return (
        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                    </div>
                    <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[9px] uppercase tracking-widest">{delta}</Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight leading-none">{value}</p>
                </div>
            </div>
        </Card>
    );
}
