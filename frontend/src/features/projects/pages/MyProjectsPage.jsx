import React, { useState, useEffect } from "react";
import {
    Plus,
    TrendingUp,
    Users,
    CreditCard,
    PieChart,
    ArrowUpRight,
    Settings,
    Share2,
    MessageCircle,
    Activity,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Layers,
    Clock,
    Zap,
    Trophy,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../../components/ui";
import { MY_PROJECTS, MY_PORTFOLIO_STATS } from "../../../data/myProjects";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * MyProjectsPage: A high-fidelity founder-grade workspace.
 * Replaces the general discovery view with a personal project management dashboard.
 */
export default function MyProjectsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[400px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl h-24" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2].map(i => (
                        <div key={i} className="h-[400px] border border-gray-100 rounded-[2.5rem] bg-white" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header / Stats Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-200/50">
                <AnimatedSection direction="down" className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-none font-black tracking-widest px-3 py-1 text-[9px]">Founder Dashboard</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock size={12} /> Last Sync: Just Now
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        My Portfolio <span className="text-gray-400">Workspace</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track metrics, manage collaborations, and scale your innovations from a centralized command center.
                    </p>
                </AnimatedSection>

                <AnimatedSection direction="left" className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <Button
                        className="flex-1 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 transition-all border-none"
                        onClick={() => toast.success("Opening Project Creation Suite...")}
                    >
                        <Plus size={18} /> New Project
                    </Button>
                    <Button
                        variant="white"
                        className="h-14 w-14 p-0 rounded-2xl border-gray-100 shadow-sm"
                        onClick={() => toast.success("Opening Settings...")}
                    >
                        <Settings size={20} className="text-gray-400" />
                    </Button>
                </AnimatedSection>
            </div>

            {/* Portfolio Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard icon={Briefcase} label="Total Projects" value={MY_PORTFOLIO_STATS.totalProjects} color="blue" />
                <StatCard icon={Activity} label="Active" value={MY_PORTFOLIO_STATS.activeProjects} color="emerald" />
                <StatCard icon={Users} label="Total Team" value={MY_PORTFOLIO_STATS.totalTeamMembers} color="indigo" />
                <StatCard icon={CreditCard} label="Funding" value={MY_PORTFOLIO_STATS.fundingRaised} color="amber" />
                <StatCard icon={Zap} label="Mentors" value={MY_PORTFOLIO_STATS.mentorConnections} color="rose" />
                <StatCard icon={MessageCircle} label="Reqs" value={MY_PORTFOLIO_STATS.pendingRequests} color="sky" />
            </div>

            {/* My Projects Detail List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Active Ventures</h2>
                    <div className="flex h-1 px-32 bg-gray-100 rounded-full flex-1 mx-6 opacity-50"></div>
                </div>

                <StaggerContainer>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {MY_PROJECTS.map((project) => (
                            <OwnerProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                </StaggerContainer>
            </div>

            {/* Help / Resources */}
            <div className="pt-20 pb-10 flex flex-col items-center">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="h-16 w-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                        <Trophy size={24} />
                    </div>
                    <div className="flex-1 space-y-1 text-center md:text-left">
                        <h4 className="text-lg font-bold text-gray-900">Ready for Fundraising?</h4>
                        <p className="text-sm text-gray-500 font-medium">Your activity scores are high enough to unlock "Investor Mode". Apply for institutional review today.</p>
                    </div>
                    <Button variant="outline" className="h-12 px-6 rounded-xl text-xs font-bold border-gray-200 hover:border-black uppercase tracking-widest shrink-0">
                        Unlock Mode
                    </Button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        indigo: "text-indigo-600 bg-indigo-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        rose: "text-rose-600 bg-rose-50/50",
        sky: "text-sky-600 bg-sky-50/50"
    };

    return (
        <Card className="p-6 border-none shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 rounded-3xl flex items-center gap-5 group">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-gray-900">{value}</p>
            </div>
        </Card>
    );
}

function OwnerProjectCard({ project }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-10 rounded-[3rem] bg-white ring-1 ring-gray-100 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-gray-100 transition-colors duration-500"></div>

                <div className="relative space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="primary" className="bg-gray-100 text-gray-600 border-none font-bold px-3 py-1 text-[9px] uppercase tracking-widest">{project.domain}</Badge>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{project.status}</span>
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 group-hover:text-black">{project.name}</h3>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="white" className="h-10 w-10 p-0 rounded-xl shadow-sm border-gray-100">
                                <Share2 size={16} />
                            </Button>
                            <Button variant="white" className="h-10 w-10 p-0 rounded-xl shadow-sm border-gray-100">
                                <Settings size={16} />
                            </Button>
                        </div>
                    </div>

                    <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">{project.description}</p>

                    {/* Progress Metrics */}
                    <div className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Milestone Progress</span>
                                <span className="text-lg font-black text-gray-900">{project.milestoneProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.milestoneProgress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gray-900 rounded-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity Score</p>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" size={16} />
                                    <span className="text-lg font-black text-gray-900">{project.activityScore}</span>
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investor Interest</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-lg font-black text-gray-900">{project.investorInterest}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden ring-1 ring-gray-100">
                                    {i === 3 ? `+${project.contributors - 2}` : ""}
                                </div>
                            ))}
                            <span className="text-[10px] font-bold text-gray-400 self-center ml-4 uppercase tracking-widest">Team Size: {project.teamSize}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updated {project.lastUpdated}</p>
                            <Button className="h-12 px-8 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center gap-2 group/btn">
                                Manage <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
