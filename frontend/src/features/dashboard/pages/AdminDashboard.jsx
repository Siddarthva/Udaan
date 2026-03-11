import React, { useState, useEffect } from "react";
import {
    Activity,
    Shield,
    Users,
    Zap,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Search,
    Filter,
    Layers,
    AlertCircle,
    LayoutDashboard,
    Globe,
    Cpu,
    Briefcase,
    Clock,
    Download,
    FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button, Badge, Skeleton, InputField } from "../../../components/ui";
import { useProjectStore, useIntelligenceStore, useFundingStore, useAuthStore } from "../../../store/domainStores";
import { useUIStore } from "../../../store/uiStore";
import { AnimatedSection } from "../../../components/animation/MotionSystem";

/**
 * AdminDashboard: Institutional Governance & Ecosystem Control.
 * Provides high-level metrics on program performance, compliance, and user growth.
 */
export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { projects } = useProjectStore();
    const { alerts } = useIntelligenceStore();
    const { deals } = useFundingStore();
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[500px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
                <div className="h-[500px] bg-white rounded-[3rem]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Admin Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-gray-900 text-white border-none font-black tracking-widest px-4 py-1.5 text-[10px] uppercase">Nexus Admin v4.2</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Shield size={12} className="text-emerald-500" /> Full Oversight Access
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Ecosystem <span className="text-gray-400">Control.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Monitor innovation density, capital distribution, and regulatory compliance across the national Udaan network.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => openOverlay('REGISTRY_VIEWER')}
                        variant="outline"
                        className="h-14 px-8 border-gray-200 text-gray-900 rounded-2xl flex items-center gap-3 font-black text-xs uppercase hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Layers size={18} /> View Full Registry
                    </Button>
                    <Button
                        onClick={() => openOverlay('AUDIT_DRAWER')}
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all active:scale-95"
                    >
                        <Shield size={18} /> System Audit
                    </Button>
                </div>
            </AnimatedSection>

            {/* Ecosystem Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value="12,482" delta="+14%" color="blue" />
                <StatCard icon={Cpu} label="Active Ventures" value={projects.length.toString()} delta="+2" color="emerald" />
                <StatCard icon={Globe} label="Gov Programs" value="8" delta="Active" color="amber" />
                <StatCard icon={Briefcase} label="Capital Flow" value={`₹${(deals.length * 25 + 480) / 100} Cr`} delta="Real-time" color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Mid-level Controls */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Program Performance</h2>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Export Analytics</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-10 border-none bg-white rounded-[3rem] shadow-sm space-y-10 group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-gray-100 transition-all" />
                            <div className="relative space-y-6">
                                <h3 className="text-xl font-bold text-gray-900">User Growth Vector</h3>
                                <div className="h-32 flex items-end gap-3 px-2">
                                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-100 rounded-lg group-hover:bg-gray-900/5 transition-all relative overflow-hidden">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                className="absolute bottom-0 left-0 right-0 bg-gray-900"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>JAN 2026</span>
                                    <span>MAR 2026</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-10 border-none bg-[#0A0A0B] text-white rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full -mr-24 -mt-24" />
                            <div className="relative space-y-6">
                                <div className="flex justify-between items-start">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Institutional Liquidity</p>
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[9px] py-1">REAL-TIME</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black">₹482.50<span className="text-lg opacity-40 ml-1">Cr</span></h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available Capital Pool</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                    <Button
                                        onClick={() => openOverlay('COMPLIANCE_CONSOLE')}
                                        className="h-10 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Compliance Status
                                    </Button>
                                    <Button
                                        onClick={() => openOverlay('SCENARIO_SIMULATOR')}
                                        className="h-10 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Scenario Pulse
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'Institutional Liquidity Forecast', type: 'Strategic' })}
                                    className="w-full h-12 bg-white text-black hover:bg-emerald-400 hover:text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-4"
                                >
                                    Liquidity Forecast
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-10 border-none bg-white rounded-[3rem] shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Project Distribution Node</h3>
                            <Badge className="bg-gray-100 text-gray-500 border-none font-bold text-[10px] px-3">BY SECTOR</Badge>
                        </div>
                        <div className="space-y-6">
                            {["AgriTech", "HealthTech", "CleanTech", "FinTech"].map((sector, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sector}</p>
                                        <p className="text-xs font-black text-gray-900">{Math.floor(Math.random() * 40) + 10} PROJECTS</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Alerts */}
                <div className="space-y-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">System Alerts</h2>
                    <div className="space-y-6">
                        {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').map((alert, idx) => (
                            <AlertItem
                                key={idx}
                                icon={AlertCircle}
                                title={alert.title}
                                desc={alert.message}
                                severity={alert.severity || 'high'}
                            />
                        ))}
                        <AlertItem
                            icon={ArrowUpRight}
                            title="Capital Tranche Due"
                            desc="Institutional Fund A disbursement scheduled for tomorrow."
                            severity="medium"
                        />
                        <AlertItem
                            icon={TrendingUp}
                            title="Peak Load Detected"
                            desc="User registration increased by 400% in the West Zone."
                            severity="low"
                        />
                    </div>

                    <Card className="p-10 border-none bg-indigo-900 text-white rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[80px] -mr-16 -mt-16" />
                        <Shield size={32} className="text-indigo-400" />
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold">Audit Mode</h4>
                            <p className="text-indigo-200 text-sm leading-relaxed font-medium">Internal review cycles are active. All data displayed is verified against IFRS standards.</p>
                        </div>
                        <Button
                            onClick={() => openOverlay('AUDIT_DRAWER')}
                            className="w-full h-12 bg-white text-indigo-950 font-black text-[10px] uppercase rounded-xl border-none shadow-xl shadow-indigo-950/50 active:scale-95 transition-all"
                        >
                            Launch Full System Audit
                        </Button>
                    </Card>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-t border-gray-100 pt-6">System Reports Node</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                onClick={() => openOverlay('COMPLIANCE_CONSOLE', { download: true })}
                                variant="outline"
                                className="w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                <Download size={14} /> Download Full Compliance Report
                            </Button>
                            <Button
                                onClick={() => openOverlay('AUDIT_DRAWER', { detail: true })}
                                variant="outline"
                                className="w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                <FileText size={14} /> Audit Detail
                            </Button>
                        </div>
                    </div>
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
        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                    </div>
                    <Badge className="bg-gray-100 text-gray-500 border-none font-black text-[9px] uppercase">{delta}</Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-black text-gray-900">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function AlertItem({ icon: Icon, title, desc, severity }) {
    const severities = {
        high: "bg-rose-50 text-rose-600 ring-rose-100/50",
        medium: "bg-amber-50 text-amber-600 ring-amber-100/50",
        low: "bg-blue-50 text-blue-600 ring-blue-100/50"
    };

    return (
        <Card className={`p-6 border-none rounded-3xl ring-1 shadow-sm flex gap-4 ${severities[severity]}`}>
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
                <Icon size={20} />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-bold leading-tight">{title}</h4>
                <p className="text-[10px] font-medium opacity-80 leading-relaxed">{desc}</p>
            </div>
        </Card>
    );
}
