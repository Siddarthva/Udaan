import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    ArrowUpRight,
    Layers,
    Zap,
    TrendingUp,
    Plus,
    Bookmark,
    BookmarkCheck,
    PieChart,
    Activity,
    Target,
    Shield,
    Clock,
    CheckCircle2,
    Briefcase,
    Building2,
    BriefcaseIcon,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "@/components/ui";
import { DISCOVER_PROJECTS, SPONSOR_STATS } from "@/data/sponsorProjects";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import DealWorkflow from "@/features/sponsor/components/DealWorkflow";
import toast from "react-hot-toast";

import { useFundingStore, useIntelligenceStore } from "@/store/domainStores";
import { useUIStore } from "@/store/uiStore";

/**
 * DiscoverProjectsPage: A professional investment discovery hub for sponsors.
 */
export default function DiscoverProjectsPage() {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useFundingStore();
    const { pushAlert } = useIntelligenceStore();
    const { openOverlay } = useUIStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedStage, setSelectedStage] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [isDealWorkflowOpen, setIsDealWorkflowOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const domains = ["All", "AgriTech", "CleanTech", "FinTech", "HealthTech", "DeepTech"];
    const stages = ["All", "Idea", "Prototype", "MVP", "Scaling", "Early Research"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const toggleWatchlist = (project, e) => {
        e?.stopPropagation();
        if (watchlist.includes(project.id)) {
            removeFromWatchlist(project.id);
            toast.success("Removed from watchlist.");
        } else {
            addToWatchlist(project.id);
            pushAlert({
                type: 'WATCHLIST_ADD',
                title: 'Strategic Asset Tracked',
                message: `${project.name} has been added to your institutional watchlist.`,
                severity: 'low'
            });
            toast.success("Added to institutional watchlist.");
        }
    };

    const addToPipeline = (project, e) => {
        e?.stopPropagation();
        setSelectedProject(project);
        setIsDealWorkflowOpen(true);
    };

    const filteredProjects = useMemo(() => {
        return DISCOVER_PROJECTS.filter(project => {
            const matchesSearch =
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.problem.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDomain = selectedDomain === "All" || project.domain.includes(selectedDomain);
            const matchesStage = selectedStage === "All" || project.stage === selectedStage;

            return matchesSearch && matchesDomain && matchesStage;
        });
    }, [searchQuery, selectedDomain, selectedStage]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl h-24" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[400px] border border-gray-100 rounded-[2.5rem] bg-white" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header Section */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-gray-900 text-white border-none font-black tracking-widest px-3 py-1 text-[9px]">Sponsor Hub</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Activity size={12} /> Active Discovery Mode
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Discover <span className="text-gray-400">Ventures.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Evaluate investment-ready projects, monitor emerging traction, and build your high-impact portfolio from the most innovative institutional nodes.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-96">
                        <InputField
                            icon={Search}
                            placeholder="Search ventures, problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'Institutional Impact Report', type: 'Strategic' })}
                        variant="white"
                        className="h-14 px-6 rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-sm border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Download size={18} /> Download Impact Report
                    </Button>
                </div>
            </AnimatedSection>

            {/* Top Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <SponsorStatCard icon={Layers} label="Reviewed" value={SPONSOR_STATS.projectsReviewed} color="blue" />
                <SponsorStatCard icon={Briefcase} label="Active Deals" value={SPONSOR_STATS.activeDeals} color="emerald" />
                <SponsorStatCard icon={Zap} label="Committed" value={SPONSOR_STATS.totalCommitted} color="amber" />
                <SponsorStatCard icon={Target} label="Impact Score" value={`${SPONSOR_STATS.overallImpactScore}%`} color="indigo" />
                <SponsorStatCard icon={Bookmark} label="Watchlist" value={SPONSOR_STATS.watchlistSize} color="rose" />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 min-w-max">
                    <Filter size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Investor Filters</span>
                </div>

                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-3 no-scrollbar flex-1">
                    <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all h-12 min-w-[180px]"
                    >
                        <option value="All">All Domains</option>
                        {domains.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all h-12 min-w-[180px]"
                    >
                        <option value="All">All Stages</option>
                        {stages.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 ml-2"
                        onClick={() => {
                            setSelectedDomain("All");
                            setSelectedStage("All");
                            setSearchQuery("");
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={() => toast.success("Applying Institutional filters to discovery stream node.")}
                        className="h-12 px-6 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none active:scale-95 transition-all shadow-lg"
                    >
                        Apply Institutional Filters
                    </Button>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-2xl border border-gray-800 ml-auto">
                    <TrendingUp className="text-emerald-400" size={16} />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">
                        High Potential Targets Detected
                    </span>
                </div>
            </div>

            {/* Results Grid */}
            <StaggerContainer>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <SponsorProjectCard
                                key={project.id}
                                project={project}
                                isInWatchlist={watchlist.includes(project.id)}
                                onToggleWatchlist={(e) => toggleWatchlist(project, e)}
                                onAddToPipeline={(e) => addToPipeline(project, e)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={AlertCircle}
                        title="No Matching Ventures"
                        description="Try adjusting your investment filters or search keywords to find relevant startup nodes."
                        action={
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setSelectedDomain("All");
                                    setSelectedStage("All");
                                    setSearchQuery("");
                                }}
                            >
                                Reset All Filters
                            </Button>
                        }
                    />
                )}
            </StaggerContainer>

            {/* Deal Execution Workflow */}
            <AnimatePresence>
                {isDealWorkflowOpen && selectedProject && (
                    <DealWorkflow
                        project={selectedProject}
                        isOpen={isDealWorkflowOpen}
                        onClose={() => {
                            setIsDealWorkflowOpen(false);
                            // Optionally refresh stats or pipeline here
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function SponsorStatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        indigo: "text-indigo-600 bg-indigo-50/50",
        rose: "text-rose-600 bg-rose-50/50"
    };

    return (
        <Card className="p-6 border-none shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 rounded-3xl flex items-center gap-5 group bg-white">
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

function SponsorProjectCard({ project, isInWatchlist, onToggleWatchlist, onAddToPipeline }) {
    const { openOverlay } = useUIStore();
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400 border-none">
                            {project.stage}
                        </Badge>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{project.domain}</p>
                    </div>
                    <button
                        onClick={onToggleWatchlist}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isInWatchlist ? 'text-amber-500' : 'text-gray-300 hover:text-gray-900 bg-gray-50'}`}
                    >
                        {isInWatchlist ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                    </button>
                </div>

                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-black">
                        {project.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed line-clamp-2">
                        {project.problem}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Funding Sought</p>
                            <p className="text-sm font-black text-gray-900">{project.fundingSought}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Innovation Score</p>
                            <div className="flex items-center justify-end gap-2">
                                <Zap className="text-amber-500" size={14} />
                                <p className="text-sm font-black text-gray-900">{project.innovationScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Traction Indicator</p>
                        <p className="text-xs font-bold text-gray-600 leading-relaxed italic line-clamp-2">"{project.traction}"</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                    <Button
                        onClick={onAddToPipeline}
                        className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all"
                    >
                        Pipeline <TrendingUp size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                    <Button
                        variant="white"
                        onClick={() => openOverlay('DOSSIER_VIEWER', project)}
                        className="h-12 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-gray-100 flex items-center gap-2 group/btn2 active:scale-95 transition-all"
                    >
                        Details <ArrowUpRight size={14} className="group-hover/btn2:translate-x-0.5 group-hover/btn2:-translate-y-0.5 transition-transform" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
