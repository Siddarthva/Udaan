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
    Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../../components/ui";
import { useProjectStore, useIntelligenceStore, useAuthStore } from "../../../store/domainStores";
import { useUIStore } from "../../../store/uiStore";
import { AnimatedSection } from "../../../components/animation/MotionSystem";
import toast from "react-hot-toast";

const NOTIFICATIONS = [
    { id: 1, type: 'System', title: 'Network Hub Synced', message: 'Nodes active', severity: 'low', timestamp: 'Just now' },
    { id: 2, type: 'Grant', title: 'AgriTech Tranche A disbursed', message: 'Funds available', severity: 'high', timestamp: '2h ago' }
];

/**
 * InnovatorDashboard: Premium workspace for building and scaling projects.
 * Features: Project progress, Milestone tracking, Funding status, and Collaboration alerts.
 */
export default function InnovatorDashboard() {
    const { user } = useAuthStore();
    const { projects } = useProjectStore();
    const { alerts } = useIntelligenceStore();
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);

    const handleLaunchVenture = () => {
        toast.promise(
            new Promise(res => setTimeout(res, 1200)),
            {
                loading: 'Initializing venture node...',
                success: 'Workspace created! Use the global command bar (Ctrl+K) to add details.',
                error: 'Initialization failed.'
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-[400px]" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
                <div className="h-[400px] bg-white rounded-[3rem]" />
            </div>
        );
    }

    // Filter projects owned by current user
    const myProjects = projects.filter(p => p.founder.includes(user?.name?.split(' ')[0] || "Ananya"));

    // Combine static notifications with dynamic intelligence alerts
    const activeAlerts = [
        ...alerts.map(a => ({ ...a, severity: a.severity || 'low' })),
        ...NOTIFICATIONS
    ].slice(0, 5);

    // Dynamic stats calculation
    const totalRaisedVal = myProjects.reduce((acc, p) => acc + (p.stage === 'Funded' ? 25 : 0), 85); // Hacky mock logic for demo

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 shadow-sm">Innovation Core active</Badge>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Synced: dev-mode-alpha</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Pulse, <span className="text-gray-400">{user?.name?.split(' ')[0] || 'Innovator'}.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track your project velocity, manage milestones, and coordinate with your mentor network.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => openOverlay('VENTURE_WIZARD')}
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all active:scale-95"
                    >
                        <Plus size={18} /> Launch New Venture
                    </Button>
                </div>
            </AnimatedSection>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} label="Total Raised" value={`₹${totalRaisedVal.toFixed(1)}L`} delta="+₹10L" color="emerald" />
                <StatCard icon={Layers} label="Active Nodes" value={myProjects.length.toString()} delta="1 Pending" color="blue" />
                <StatCard icon={Target} label="Milestones" value="4/12" delta="33%" color="amber" />
                <StatCard icon={Users} label="Collaborators" value="12" delta="+2" color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Project Pipeline */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Project Performance</h2>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-gray-400">View Lifecycle</Button>
                    </div>

                    <div className="space-y-6">
                        {myProjects.length > 0 ? (
                            myProjects.map(project => (
                                <ProjectRow key={project.id} project={project} />
                            ))
                        ) : (
                            <EmptyState
                                icon={Briefcase}
                                title="No Ventures Active"
                                description="Start your journey by documenting your innovation node."
                            />
                        )}
                    </div>

                    {/* Contribution Requests */}
                    <div className="space-y-6 pt-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Contribution Requests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1].map(req => (
                                <Card key={req} className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm space-y-6 border border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Siddharth J.</p>
                                            <h4 className="text-sm font-bold text-gray-900">Lead Developer Request</h4>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] uppercase">New</Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Interested in joining AgriDrone AI to handle the edge-computing layer sync.</p>
                                    <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 h-10 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Review</Button>
                                        <Button variant="ghost" className="flex-1 h-10 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest">Decline</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Real-time Alerts Sidebar */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Ecosystem Alerts</h2>
                        <div className="space-y-4">
                            {NOTIFICATIONS.slice(0, 3).map(notif => (
                                <AlertCard key={notif.id} notif={notif} />
                            ))}
                        </div>
                    </section>

                    <Card className="p-10 border-none bg-indigo-900 text-white rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        <MessageSquare size={32} className="text-indigo-400" />
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold italic tracking-tight">Mentor Intelligence</h4>
                            <p className="text-indigo-200 text-sm font-medium leading-relaxed">Dr. Vikram Seth left a review on your 'AgriDrone AI' tech-node. 14 critical insights detected.</p>
                        </div>
                        <Button className="w-full h-14 bg-white text-indigo-950 font-black text-[10px] uppercase tracking-widest rounded-2xl border-none shadow-xl hover:shadow-indigo-950/50">
                            Open Workspace
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
        indigo: "text-indigo-600 bg-indigo-50/50",
        purple: "text-purple-600 bg-purple-50/50"
    };

    return (
        <Card className="p-6 border-none bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                    </div>
                    <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[9px] uppercase">{delta}</Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function ProjectRow({ project }) {
    return (
        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center gap-8 group">
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:rotate-6">
                <BarChart3 size={24} />
            </div>
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">{project.name}</h3>
                    <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[8px] uppercase tracking-[0.2em]">{project.stage}</Badge>
                </div>
                <div className="flex items-center gap-10">
                    <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            className="h-full bg-gray-900 rounded-full"
                        />
                    </div>
                    <span className="text-[10px] font-black text-gray-900 tabular-nums">{project.progress}% READY</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => openOverlay('DISCOVERY_WIZARD', project)}
                    variant="ghost"
                    className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-900 flex items-center gap-2"
                >
                    <Target size={14} /> Discovery
                </Button>
                <Button
                    onClick={() => openOverlay('DOSSIER_VIEWER', project)}
                    className="h-12 px-8 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center gap-2 group/btn"
                >
                    Manage <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
            </div>
        </Card>
    );
}

function AlertCard({ notif }) {
    const severities = {
        high: "bg-rose-50 text-rose-600 ring-rose-100/50",
        medium: "bg-amber-50 text-amber-600 ring-amber-100/50",
        low: "bg-blue-50 text-blue-600 ring-blue-100/50"
    };

    return (
        <div className={`p-5 rounded-[2rem] ring-1 shadow-sm flex gap-4 ${severities[notif.severity]}`}>
            <div className="h-2 w-2 rounded-full bg-current mt-1.5 shrink-0" />
            <div className="space-y-1 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{notif.type}</p>
                <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
                <p className="text-[10px] font-medium opacity-80 leading-relaxed font-mono">{notif.timestamp}</p>
            </div>
        </div>
    );
}
