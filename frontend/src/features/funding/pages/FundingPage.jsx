import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    Calendar,
    ExternalLink,
    Bookmark,
    BookmarkCheck,
    ChevronDown,
    Trophy,
    Globe,
    Building2,
    Layers,
    Clock,
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "../../../components/ui";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import { FUNDING_OPPORTUNITIES } from "../../../data/fundingOpportunities";
import toast from "react-hot-toast";

/**
 * FundingPage: A professional discovery engine for institutional funding and grants.
 * Features: High-fidelity filtering, role-based recommendations, and application tracking.
 */
export default function FundingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortBy, setSortBy] = useState("deadline"); // deadline, funding
    const [isLoading, setIsLoading] = useState(true);
    const [savedOpportunities, setSavedOpportunities] = useState([]);

    // Categories and Domains for Filtering
    const categories = ["All", "Government", "Academic", "Corporate", "Hackathons", "Grants", "Incubation"];
    const domains = ["All", "AI / ML", "Healthcare", "FinTech", "Defence", "Sustainability", "EdTech", "General Innovation"];
    const statuses = ["All", "Open", "Closing Soon", "Upcoming"];

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => setIsLoading(false), 1200);

        // Load saved opportunities from localStorage
        const saved = JSON.parse(localStorage.getItem('udaan_saved_funding') || '[]');
        setSavedOpportunities(saved);

        return () => clearTimeout(timer);
    }, []);

    const toggleSave = (id) => {
        let newSaved;
        if (savedOpportunities.includes(id)) {
            newSaved = savedOpportunities.filter(item => item !== id);
            toast.success("Removed from your saved opportunities.");
        } else {
            newSaved = [...savedOpportunities, id];
            toast.success("Opportunity saved to your profile.");
        }
        setSavedOpportunities(newSaved);
        localStorage.setItem('udaan_saved_funding', JSON.stringify(newSaved));
    };

    const filteredOpportunities = useMemo(() => {
        return FUNDING_OPPORTUNITIES.filter(opp => {
            const matchesSearch =
                opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "All" || opp.category === selectedCategory;
            const matchesDomain = selectedDomain === "All" || opp.domain.includes(selectedDomain);
            const matchesStatus = selectedStatus === "All" || opp.status === selectedStatus;

            return matchesSearch && matchesCategory && matchesDomain && matchesStatus;
        }).sort((a, b) => {
            if (sortBy === "deadline") {
                if (a.deadline === "Rolling Basis") return 1;
                if (b.deadline === "Rolling Basis") return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            }
            return 0; // Default or extendable for funding size
        });
    }, [searchQuery, selectedCategory, selectedDomain, selectedStatus, sortBy]);

    const stats = {
        total: FUNDING_OPPORTUNITIES.length,
        open: FUNDING_OPPORTUNITIES.filter(o => o.status === "Open" || o.status === "Closing Soon").length,
        closingSoon: FUNDING_OPPORTUNITIES.filter(o => o.status === "Closing Soon").length
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-96" />
                    <Skeleton className="h-4 w-[600px]" />
                </div>
                <div className="flex gap-4 mb-8">
                    <Skeleton className="h-10 w-40 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl space-y-6">
                            <div className="flex justify-between">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-20 w-full rounded-xl" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 flex-1 rounded-xl" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-8 border-b border-gray-200/60">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 shadow-sm">Institutional Access</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock size={12} /> Live Pulse: {stats.open} Opportunities Open
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Funding Discovery <span className="text-gray-400">Hub</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                        Navigate the capital landscape with precision. Discover government grants, institutional funding, and strategic corporate challenges tailored for deep-tech innovators.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[320px]">
                        <InputField
                            icon={Search}
                            placeholder="Search programs, agencies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 hover:border-gray-300 focus:ring-gray-900/5 h-12 shadow-sm transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col gap-6 sticky top-0 z-[10] bg-[#F8F9FA]/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-gray-100 md:flex-row md:items-center">
                <div className="flex items-center gap-2 text-gray-500 min-w-max">
                    <Filter size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                </div>

                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar flex-1">
                    <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer hover:border-gray-300 h-10"
                        >
                            <option value="All">All Categories</option>
                            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                        <select
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer hover:border-gray-300 h-10"
                        >
                            <option value="All">All Domains</option>
                            {domains.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer hover:border-gray-300 h-10"
                        >
                            <option value="All">All Status</option>
                            {statuses.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black"
                        onClick={() => {
                            setSelectedCategory("All");
                            setSelectedDomain("All");
                            setSelectedStatus("All");
                            setSearchQuery("");
                        }}
                    >
                        Reset All
                    </Button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Sort by</span>
                    <button
                        onClick={() => setSortBy(sortBy === "deadline" ? "none" : "deadline")}
                        className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${sortBy === 'deadline' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                    >
                        <Calendar size={14} /> Deadline
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div>
                {filteredOpportunities.length > 0 ? (
                    <StaggerContainer>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredOpportunities.map((opp) => (
                                    <OpportunityCard
                                        key={opp.id}
                                        opportunity={opp}
                                        isSaved={savedOpportunities.includes(opp.id)}
                                        onToggleSave={() => toggleSave(opp.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </StaggerContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <EmptyState
                            icon={AlertCircle}
                            title="No Results Found"
                            description="We couldn't find any opportunities matching your current search or filters. Try adjusting your criteria or reset all filters."
                            action={
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedStatus("All");
                                        setSelectedDomain("All");
                                        setSearchQuery("");
                                    }}
                                >
                                    Reset All Filters
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>

            {/* Institutional Logos / Trusted By (Optional UI Polish) */}
            <div className="pt-20 pb-10 flex flex-col items-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-10">Consolidated Ecosystem Partners</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <span className="text-xl font-black tracking-tighter">MEITY</span>
                    <span className="text-xl font-black tracking-tighter">NITI AAYOG</span>
                    <span className="text-xl font-black tracking-tighter">AICTE</span>
                    <span className="text-xl font-black tracking-tighter">DST INDIA</span>
                    <span className="text-xl font-black tracking-tighter">NASSCOM</span>
                </div>
            </div>
        </div>
    );
}

function OpportunityCard({ opportunity, isSaved, onToggleSave }) {
    const isClosingSoon = opportunity.status === "Closing Soon";

    // Icon mapping based on category
    const CategoryIcon = {
        'Government': Globe,
        'Academic': Building2,
        'Corporate': Building2,
        'Hackathons': Trophy,
        'Grants': Layers,
        'Incubation': Briefcase
    }[opportunity.category] || Globe;

    const statusColors = {
        'Open': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Closing Soon': 'bg-orange-50 text-orange-600 border-orange-100',
        'Upcoming': 'bg-blue-50 text-blue-600 border-blue-100',
        'Closed': 'bg-gray-50 text-gray-400 border-gray-100'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 flex flex-col relative overflow-hidden bg-white p-0">
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isClosingSoon ? 'bg-orange-500' : 'bg-gray-900 group-hover:bg-emerald-500 transition-colors'}`}></div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                            <CategoryIcon size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest border shadow-none ${statusColors[opportunity.status]}`}>
                                {opportunity.status}
                            </Badge>
                            {opportunity.deadline !== "Rolling Basis" && (
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isClosingSoon ? 'text-orange-500' : 'text-gray-400'}`}>
                                    <Clock size={12} /> {opportunity.deadline}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{opportunity.organizer}</p>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-black transition-colors">{opportunity.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 font-medium">{opportunity.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {opportunity.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{tag}</span>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Funding / Benefits</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{opportunity.amount}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Eligibility</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{opportunity.eligibility}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50/50 flex gap-3">
                    <Button
                        onClick={() => window.open(opportunity.link, '_blank')}
                        className="flex-1 h-11 bg-gray-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all border-none"
                    >
                        Apply Now <ArrowUpRight size={14} />
                    </Button>
                    <button
                        onClick={onToggleSave}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all border outline-none active:scale-90 ${isSaved ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-gray-200 text-gray-400 hover:text-black hover:border-gray-300'}`}
                    >
                        {isSaved ? <BookmarkCheck size={18} fill="currentColor" /> : <Bookmark size={18} />}
                    </button>
                </div>
            </Card>
        </motion.div>
    );
}
