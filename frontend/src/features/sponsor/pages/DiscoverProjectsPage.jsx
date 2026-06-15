import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    ArrowUpRight,
    Layers,
    Zap,
    TrendingUp,
    Bookmark,
    BookmarkCheck,
    Activity,
    Target,
    AlertCircle,
    Mail,
    Linkedin,
    PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "@/components/ui";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import toast from "react-hot-toast";

import { useStartupStore } from "@/store/startupStore";
import { useInvestorStore } from "@/store/investorStore";
import { useMentorStore } from "@/store/mentorStore";
import { useAuthStore } from "@/store/authStore";

export default function DiscoverProjectsPage() {
    const { user } = useAuthStore();
    const { startups, fetchStartups } = useStartupStore();
    const { watchlist, toggleSaveStartup, expressInterest } = useInvestorStore();
    const { sendMentorshipRequest } = useMentorStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedStage, setSelectedStage] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [showMentorModal, setShowMentorModal] = useState(false);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [notes, setNotes] = useState("");
    const [mentorMessage, setMentorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const domains = ["All", "AgriTech", "CleanTech", "FinTech", "HealthTech", "DeepTech"];
    const stages = ["All", "Idea", "Prototype", "MVP", "Seed", "Scale"];

    useEffect(() => {
        const loadDiscoverData = async () => {
            try {
                await fetchStartups();
            } catch (err) {
                console.error("Error loading startups", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDiscoverData();
    }, [fetchStartups]);

    const toggleWatchlist = async (startup, e) => {
        e?.stopPropagation();
        try {
            const isSaved = await toggleSaveStartup(startup.id);
            toast.success(isSaved ? "Saved to watchlist" : "Removed from watchlist");
        } catch (err) {
            toast.error(err.message || "Action failed.");
        }
    };

    const handleOpenInterest = (startup, e) => {
        e?.stopPropagation();
        setSelectedStartup(startup);
        setNotes("");
        setShowInterestModal(true);
    };

    const handleOpenMentor = (startup, e) => {
        e?.stopPropagation();
        setSelectedStartup(startup);
        setMentorMessage("");
        setShowMentorModal(true);
    };

    const submitInterest = async () => {
        if (!selectedStartup) return;
        setIsSubmitting(true);
        try {
            await expressInterest(selectedStartup.id, notes);
            toast.success("Interest expressed successfully! Contact details are unlocked.");
            setShowInterestModal(false);
            setSelectedStartup(null);
        } catch (err) {
            toast.error(err.message || "Failed to submit interest.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitMentor = async () => {
        if (!selectedStartup) return;
        setIsSubmitting(true);
        try {
            await sendMentorshipRequest(selectedStartup.id, mentorMessage);
            toast.success("Mentorship request sent successfully!");
            setShowMentorModal(false);
            setSelectedStartup(null);
        } catch (err) {
            toast.error(err.message || "Failed to send mentorship request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = useMemo(() => {
        return startups.filter(project => {
            const matchesSearch =
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDomain = selectedDomain === "All" || project.domain === selectedDomain;
            const matchesStage = selectedStage === "All" || project.stage === selectedStage;

            return matchesSearch && matchesDomain && matchesStage;
        });
    }, [startups, searchQuery, selectedDomain, selectedStage]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[350px] border border-gray-100 rounded-[2.5rem] bg-white" />
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
                        <Badge variant="primary" className="bg-gray-900 text-white border-none font-black tracking-widest px-3 py-1 text-[9px] uppercase">Ecosystem Discovery</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Activity size={12} /> Live stream connection
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Ecosystem <span className="text-gray-400">Startups.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Explore launch-ready startup profiles, filter by industry domains or development stages, and initiate advisor or funding requests directly.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-96">
                        <InputField
                            icon={Search}
                            placeholder="Search startups, solutions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                        />
                    </div>
                </div>
            </AnimatedSection>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 min-w-max">
                    <Filter size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Search Filter Node</span>
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
                                currentUser={user}
                                isInWatchlist={watchlist.some(w => w.id === project.id)}
                                onToggleWatchlist={(e) => toggleWatchlist(project, e)}
                                onExpressInterest={(e) => handleOpenInterest(project, e)}
                                onMentorRequest={(e) => handleOpenMentor(project, e)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={AlertCircle}
                        title="No Startups Match"
                        description="Adjust your search query or domain filter metrics to explore other active startup nodes."
                    />
                )}
            </StaggerContainer>

            {/* Interest Modal */}
            <AnimatePresence>
                {showInterestModal && selectedStartup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Express Funding Interest</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Add a brief note explaining your allocation guidelines or contact terms. The founder will receive your profile and contact credentials immediately.</p>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Type negotiation notes or support guidelines..."
                                className="w-full p-4 h-28 border border-gray-100 focus:border-gray-900 rounded-xl text-sm outline-none resize-none font-medium"
                            />
                            <div className="flex gap-4">
                                <Button onClick={submitInterest} disabled={isSubmitting} className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest border-none">
                                    {isSubmitting ? "Submitting..." : "Express Interest"}
                                </Button>
                                <Button onClick={() => setShowInterestModal(false)} variant="ghost" className="flex-1 h-12 bg-gray-50 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mentor Request Modal */}
            <AnimatePresence>
                {showMentorModal && selectedStartup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Send Mentorship Proposal</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Outline the validation areas (e.g. tech stack, growth, regulatory compliance) you'd like to guide the founder in.</p>
                            <textarea
                                value={mentorMessage}
                                onChange={(e) => setMentorMessage(e.target.value)}
                                placeholder="Write proposal message..."
                                className="w-full p-4 h-28 border border-gray-100 focus:border-gray-900 rounded-xl text-sm outline-none resize-none font-medium"
                            />
                            <div className="flex gap-4">
                                <Button onClick={submitMentor} disabled={isSubmitting} className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest border-none">
                                    {isSubmitting ? "Sending..." : "Submit Proposal"}
                                </Button>
                                <Button onClick={() => setShowMentorModal(false)} variant="ghost" className="flex-1 h-12 bg-gray-50 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SponsorProjectCard({ project, currentUser, isInWatchlist, onToggleWatchlist, onExpressInterest, onMentorRequest }) {
    const isInvestor = currentUser?.role === 'Sponsor' || currentUser?.role === 'Investor';
    const isMentor = currentUser?.role === 'Mentor';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100 relative overflow-hidden text-[#1A1F23]">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400 border-none">
                            {project.stage}
                        </Badge>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{project.domain}</p>
                    </div>
                    {isInvestor && (
                        <button
                            onClick={onToggleWatchlist}
                            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isInWatchlist ? 'text-amber-500 bg-amber-50/50' : 'text-gray-300 hover:text-gray-900 bg-gray-50'}`}
                        >
                            {isInWatchlist ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                        </button>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-black">
                        {project.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed line-clamp-3">
                        {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Funding Sought</p>
                            <p className="text-sm font-black text-gray-900">₹{project.funding_required} Lakhs</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ecosystem Status</p>
                            <div className="flex items-center justify-end gap-2">
                                <Zap className="text-emerald-500" size={14} />
                                <p className="text-sm font-black text-gray-900">Active Node</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details Card */}
                    <div className="space-y-3 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Founder Contact Channels</p>
                        <div className="space-y-2 text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                <a href={`mailto:${project.owner_email}`} className="hover:underline text-gray-700">{project.owner_email}</a>
                            </div>
                            {project.linkedin_url && (
                                <div className="flex items-center gap-2">
                                    <Linkedin size={14} className="text-[#0077B5]" />
                                    <a href={project.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline text-[#0077B5]">LinkedIn Profile</a>
                                </div>
                            )}
                            {project.whatsapp_number && (
                                <div className="flex items-center gap-2">
                                    <PhoneCall size={14} className="text-[#25D366]" />
                                    <a href={`https://wa.me/${project.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-[#25D366]">WhatsApp Connection</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                    {isInvestor && (
                        <Button
                            onClick={onExpressInterest}
                            className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all cursor-pointer"
                        >
                            Express Interest <ArrowUpRight size={14} />
                        </Button>
                    )}
                    {isMentor && (
                        <Button
                            onClick={onMentorRequest}
                            className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all cursor-pointer"
                        >
                            Request Mentorship <ArrowUpRight size={14} />
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
