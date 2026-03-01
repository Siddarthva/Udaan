import React, { useState, useEffect } from "react";
import {
    Bookmark,
    BookmarkCheck,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    Clock,
    Zap,
    Star,
    AlertCircle,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Activity,
    Target,
    Briefcase,
    Building2,
    Calendar,
    MessageCircle,
    Plus,
    Minus,
    ClipboardList,
    MoreVertical,
    MoveRight,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "../../../components/ui";
import { WATCHLIST } from "../../../data/watchlist";
import { SPONSOR_STATS } from "../../../data/sponsorProjects";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import DealWorkflow from "../components/DealWorkflow";
import toast from "react-hot-toast";

/**
 * WatchlistPage: A centralized tracker for shortlisted opportunities monitoring and analysis.
 */
export default function WatchlistPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [watchlistItems, setWatchlistItems] = useState(WATCHLIST);
    const [isDealWorkflowOpen, setIsDealWorkflowOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        // Sync with local storage
        const savedWatchlist = JSON.parse(localStorage.getItem('sponsor_watchlist_detailed') || '[]');
        if (savedWatchlist.length > 0) {
            setWatchlistItems(savedWatchlist);
        }
        return () => clearTimeout(timer);
    }, []);

    const removeFromWatchlist = (id) => {
        const newWatchlist = watchlistItems.filter(item => item.id !== id);
        setWatchlistItems(newWatchlist);
        localStorage.setItem('sponsor_watchlist_detailed', JSON.stringify(newWatchlist));
        toast.success("Removed from watchlist.");
    };

    const filteredWatchlist = watchlistItems.filter(item =>
        item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.overview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 border border-gray-100 rounded-[2.5rem] bg-white p-8 space-y-6">
                            <Skeleton className="h-8 w-1/2 rounded-full" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
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
                        <Badge variant="primary" className="bg-rose-50 text-rose-600 border-none font-black tracking-widest px-3 py-1 text-[9px]">Strategic Watchlist</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Star size={12} /> Priority Monitoring Enabled
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Shortlisted <span className="text-gray-400">Ventures.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Actively monitor shortlisted high-potential projects, track emerging traction pulses, and prepare for pipeline acceleration.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <InputField
                            icon={Search}
                            placeholder="Find tracked projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                        />
                    </div>
                    <Button
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 transition-all border-none"
                        onClick={() => toast.success("Opening Portfolio Suite...")}
                    >
                        Portfolio Suitability Analysis
                    </Button>
                </div>
            </AnimatedSection>

            {/* Results Grid */}
            <StaggerContainer>
                {filteredWatchlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWatchlist.map((item) => (
                            <WatchlistCard
                                key={item.id}
                                item={item}
                                onRemove={() => removeFromWatchlist(item.id)}
                                onMove={() => {
                                    setSelectedProject({ ...item, name: item.projectName }); // Mapping name
                                    setIsDealWorkflowOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Star}
                        title="Your Watchlist is Empty"
                        description="Begin discovery to find high-impact projects and shortlist them for active monitoring."
                        action={
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.location.href = '/sponsor/discover'}
                            >
                                Start Discovery
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
                            // Optionally remove from watchlist after successful deal
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Watchlist Analysis Summary */}
            <div className="pt-10">
                <div className="p-10 bg-white border border-gray-100 rounded-[3rem] flex flex-col lg:flex-row items-center gap-12 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-rose-50 to-transparent pointer-events-none opacity-50"></div>

                    <div className="shrink-0 space-y-4 text-center lg:text-left">
                        <div className="h-16 w-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white mx-auto lg:mx-0 shadow-xl">
                            <Activity size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Watchlist Health Pulse</h4>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                            <TrendingUp className="text-emerald-500" size={18} />
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aggregate Sentiment: High</span>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
                        <div className="space-y-1 text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pipeline Readiness</p>
                            <p className="text-2xl font-black text-gray-900">72% <span className="text-xs font-bold text-emerald-500 ml-1">↑ 4%</span></p>
                        </div>
                        <div className="space-y-1 text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monitoring Intensity</p>
                            <p className="text-2xl font-black text-gray-900">Daily Pulse</p>
                        </div>
                        <div className="space-y-1 text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shortlist Value</p>
                            <p className="text-2xl font-black text-gray-900">₹8.5 Cr</p>
                        </div>
                    </div>

                    <div className="shrink-0 w-full lg:w-auto">
                        <Button variant="outline" className="w-full lg:w-auto h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-gray-200">
                            Download Portfolio Analysis Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WatchlistCard({ item, onRemove, onMove }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100 overflow-hidden relative">
                <div className="space-y-6 relative">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {item.tags.map(tag => (
                                    <Badge key={tag} className="bg-gray-50 text-gray-400 border-none px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest">{tag}</Badge>
                                ))}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-black">{item.projectName}</h3>
                        </div>
                        <button
                            onClick={onRemove}
                            className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors shadow-sm active:scale-95"
                        >
                            <Minus size={20} />
                        </button>
                    </div>

                    <p className="text-sm font-medium text-gray-400 leading-relaxed italic line-clamp-2">"{item.overview}"</p>

                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4 group-hover:bg-white transition-colors duration-500">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <TrendingUp size={14} /> {item.trend}
                            </div>
                            <div className={`flex items-center gap-2 ${item.risk.includes('↑') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                <Zap size={14} /> {item.risk}
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-gray-100" />
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">{item.metrics}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-900">
                            <Clock size={16} className="text-gray-400" />
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Strategic Update Pulse</p>
                        </div>
                        <p className="text-xs font-medium text-gray-500 leading-relaxed">{item.updates}</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            onClick={onMove}
                            className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none flex items-center justify-center gap-2 group/btn active:scale-95 transition-all shadow-xl"
                        >
                            Accelerate to Pipeline <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="white"
                            className="h-12 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-gray-100 group/btn2 active:scale-95 transition-all"
                        >
                            <ArrowUpRight size={18} className="group-hover/btn2:translate-x-0.5 group-hover/btn2:-translate-y-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
