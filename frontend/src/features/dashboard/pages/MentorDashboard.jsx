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
    BookOpen,
    MessageSquare,
    CheckCircle2,
    Clock,
    UserCheck,
    Calendar,
    Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Skeleton, InputField } from "../../../components/ui";
import { useAuthStore } from "../../../store/domainStores";
import { useUIStore } from "../../../store/uiStore";
import { GLOBAL_PROJECTS } from "../../../data/projects";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";

const ChevronRight = ({ className, size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

/**
 * MentorDashboard: Intellectual Oversight & Project Validation Hub.
 * Features: Mentee tracking, Evaluation pipeline, Resource mapping, and Session scheduling.
 */
export default function MentorDashboard() {
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
                    <Skeleton className="h-12 w-[500px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
                <div className="h-[400px] bg-white rounded-[3rem]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-indigo-900 text-white border-none font-black tracking-widest px-4 py-1.5 text-[10px] uppercase">Senior Mentor Console</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Shield size={12} className="text-indigo-500" /> Intellectual Property Guard Active
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Oversight, <span className="text-gray-400">{user?.name?.split(' ')[0] || 'Dr. Vikram'}.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track your academic mentees, evaluate technical milestones, and provide strategic guidance to high-potential ventures.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => openOverlay('SCHEDULE_SESSION')}
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all"
                    >
                        <Calendar size={18} /> Schedule Session
                    </Button>
                </div>
            </AnimatedSection>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Active Mentees" value="8" delta="+2" color="blue" />
                <StatCard icon={Target} label="Validations" value="14" delta="Pending: 3" color="emerald" />
                <StatCard icon={MessageSquare} label="Consultations" value="26" delta="Synced" color="amber" />
                <StatCard icon={Layers} label="Impact Score" value="8.9" delta="+0.4" color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Assigned Project Pipeline</h2>
                        <Button
                            onClick={() => openOverlay('IMPACT_MAP')}
                            variant="ghost"
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900"
                        >
                            View Map
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {GLOBAL_PROJECTS.slice(0, 3).map(proj => (
                            <MenteeProjectCard key={proj.id} project={proj} onEvaluate={() => openOverlay('SCHEDULE_SESSION', proj)} />
                        ))}
                    </div>
                </div>

                {/* Evaluation Sidebar */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Review Queue</h2>
                        <div className="space-y-4">
                            {[
                                { title: "AgriDrone Tech Specs", mentee: "Ananya S.", time: "2h ago" },
                                { title: "MedAssist Privacy Audit", mentee: "Dr. Vikram Seth", time: "1d ago" }
                            ].map((req, i) => (
                                <Card key={i} className="p-6 border-none bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-gray-900 transition-all cursor-pointer group">
                                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.time}</p>
                                        <h4 className="text-sm font-bold text-gray-900">{req.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{req.mentee}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-transform group-hover:translate-x-1" />
                                </Card>
                            ))}
                        </div>
                    </section>

                    <Card className="p-10 border-none bg-indigo-900 text-white rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                        <Activity size={32} className="text-indigo-400" />
                        <div className="space-y-2">
                            <h4 className="text-2xl font-bold tracking-tight italic">Ecosystem Insight</h4>
                            <p className="text-indigo-200 text-sm font-medium leading-relaxed">3 Ventures in your circle have moved to the 'Pilot' stage. Your guidance has directly accelerated 14 months of dev-time.</p>
                        </div>
                        <Button
                            onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'Institutional Milestone Audit', status: 'Published', findings: 'Project exhibits 14-month technical acceleration through strategic mentor intervention nodes.' })}
                            className="w-full h-14 bg-white text-indigo-950 font-black text-[10px] uppercase rounded-2xl border-none shadow-xl shadow-indigo-950/20 active:scale-95 transition-all"
                        >
                            Download Milestone Audit
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

function MenteeProjectCard({ project, onEvaluate }) {
    return (
        <Card className="p-8 border-none bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group">
            <div className="flex items-start gap-8">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:-rotate-3">
                    <UserCheck size={24} />
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1">{project.stage}</Badge>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Founder: {project.founder}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => openOverlay('DISCOVERY_WIZARD', project)}
                                variant="outline"
                                className="h-10 px-4 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 border-gray-100"
                            >
                                <Target size={14} className="mr-2" /> Discovery
                            </Button>
                            <Button
                                onClick={onEvaluate}
                                variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                Evaluate Stage <ArrowUpRight size={14} className="ml-2" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-50">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Technical Rating</p>
                            <p className="text-sm font-black text-gray-900">4.8 / 5.0</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Risk Level</p>
                            <p className="text-sm font-black text-gray-900 capitalize">{project.risk}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Innovation Node</p>
                            <p className="text-sm font-black text-gray-900">{project.innovationScore}</p>
                        </div>
                        <div className="space-y-0.5 text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Review</p>
                            <p className="text-sm font-black text-gray-400 lowercase">4 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
