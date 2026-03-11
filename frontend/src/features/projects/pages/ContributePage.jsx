import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    Zap,
    Star,
    ChevronRight,
    ArrowUpRight,
    Bookmark,
    BookmarkCheck,
    Briefcase,
    Layers,
    Globe,
    Target,
    PieChart,
    Users,
    Settings,
    TrendingUp,
    Clock,
    AlertCircle,
    X,
    MessageSquare,
    Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "@/components/ui";
import { CONTRIBUTE_PROJECTS } from "@/data/contributeProjects";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * ContributePage: A professional collaboration marketplace for students and innovators.
 */
export default function ContributePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedRole, setSelectedRole] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [savedProjects, setSavedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const domains = ["All", "AgriTech", "HealthTech", "CleanTech", "FinTech", "DeepTech", "AI / ML", "Robotics", "Sustainability", "Security"];
    const roles = ["All", "Developer", "Data Scientist", "Researcher", "Designer", "Business Lead", "Mentor"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        const saved = JSON.parse(localStorage.getItem('udaan_saved_contribute') || '[]');
        setSavedProjects(saved);
        return () => clearTimeout(timer);
    }, []);

    const toggleSave = (id, e) => {
        e?.stopPropagation();
        let newSaved;
        if (savedProjects.includes(id)) {
            newSaved = savedProjects.filter(item => item !== id);
            toast.success("Project removed from watchlist.");
        } else {
            newSaved = [...savedProjects, id];
            toast.success("Project added to your watchlist.");
        }
        setSavedProjects(newSaved);
        localStorage.setItem('udaan_saved_contribute', JSON.stringify(newSaved));
    };

    const filteredProjects = useMemo(() => {
        return CONTRIBUTE_PROJECTS.filter(project => {
            const matchesSearch =
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.problem.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDomain = selectedDomain === "All" || project.domain === selectedDomain;
            const matchesRole = selectedRole === "All" || project.lookingFor.some(r => r.includes(selectedRole));

            return matchesSearch && matchesDomain && matchesRole;
        });
    }, [searchQuery, selectedDomain, selectedRole]);

    const handleApply = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSelectedProject(null);
            toast.success("Application successfully transmitted to the core team!", {
                duration: 4000,
                position: 'top-center'
            });
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] space-y-6 shadow-sm">
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl" />
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
                        <Badge variant="primary" className="bg-blue-50 text-blue-600 border-none font-black tracking-widest px-3 py-1 text-[9px]">Collaboration Portal</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Users size={12} /> Active Teams: {CONTRIBUTE_PROJECTS.length}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Discover & <span className="text-gray-400">Contribute.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Join high-impact projects as a core collaborator, researcher, or specialist. Your next vertical leap starts with a strategic team alignment.
                    </p>
                </div>

                <div className="relative group w-full md:w-96">
                    <InputField
                        icon={Search}
                        placeholder="Search by problem or title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                    />
                </div>
            </AnimatedSection>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 min-w-max">
                    <Filter size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Market Filters</span>
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
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all h-12 min-w-[180px]"
                    >
                        <option value="All">Roles Seeking</option>
                        {roles.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black ml-2"
                        onClick={() => {
                            setSelectedDomain("All");
                            setSelectedRole("All");
                            setSearchQuery("");
                        }}
                    >
                        Reset
                    </Button>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 ml-auto">
                    <Zap className="text-emerald-500" size={16} />
                    <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider">
                        NEW OPPORTUNITIES LIVE
                    </span>
                </div>
            </div>

            {/* Results Grid */}
            <StaggerContainer>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {filteredProjects.map((project) => (
                            <ContributeCard
                                key={project.id}
                                project={project}
                                isSaved={savedProjects.includes(project.id)}
                                onToggleSave={(e) => toggleSave(project.id, e)}
                                onApply={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={AlertCircle}
                        title="No Nodes Found"
                        description="Adjust your search parameters to find matching collaboration nodes."
                    />
                )}
            </StaggerContainer>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                            onClick={() => setSelectedProject(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl p-12"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-4 flex-1">
                                    <Badge className="bg-blue-50 text-blue-600 border-none font-black px-4 py-1 text-[10px] uppercase tracking-widest">Contribute Request</Badge>
                                    <h3 className="text-3xl font-black text-gray-900 leading-tight">Apply to {selectedProject.title}</h3>
                                    <p className="text-sm font-medium text-gray-400">Join the "{selectedProject.domain}" team to solve critical infrastructure bottlenecks.</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="h-12 w-12 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-colors shrink-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleApply} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Role</label>
                                        <select required className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-12 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-900/5 outline-none">
                                            <option value="">Select Role</option>
                                            {selectedProject.lookingFor.map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Availability</label>
                                        <select required className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-12 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-900/5 outline-none">
                                            <option value="">Select Duration</option>
                                            <option value="5-10">5-10 hrs/week</option>
                                            <option value="10-20">10-20 hrs/week</option>
                                            <option value="full">Full intensity</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Why are you joining?</label>
                                    <textarea
                                        required
                                        placeholder="Describe your expertise and how you align with the vision..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-blue-900/5 outline-none min-h-[120px] resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Portfolio / Profile Link</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="url"
                                            placeholder="https://github.com/..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-12 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-blue-900/5 outline-none"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase shadow-2xl disabled:opacity-50"
                                >
                                    {isSubmitting ? "Transmitting..." : "Send Request Node"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Recommendations Section */}
            <div className="space-y-8 pt-10">
                <div className="flex items-center gap-4">
                    <Star className="text-amber-500 fill-amber-500" size={20} />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Recommended for You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CONTRIBUTE_PROJECTS.filter(p => p.recommended).slice(0, 4).map(p => (
                        <Card key={p.id} className="p-6 border-none shadow-sm hover:translate-y-[-4px] transition-all bg-white rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">{p.domain}</p>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">{p.title}</h4>
                            <div className="flex gap-2 mb-4">
                                {p.lookingFor.slice(0, 2).map(r => <span key={r} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-widest">{r}</span>)}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between h-10 px-4 rounded-xl text-[10px] font-black uppercase"
                                onClick={() => setSelectedProject(p)}
                            >
                                Details <ArrowUpRight size={14} />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ContributeCard({ project, isSaved, onToggleSave, onApply }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6 }}
            className="group"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-[0_20px_50px_rgb(0,0,0,0.05)] transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100">
                <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400 border-none">
                        {project.stage}
                    </Badge>
                    <button
                        onClick={onToggleSave}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'text-amber-500' : 'text-gray-300 hover:text-gray-900 bg-gray-50 border border-gray-100 shadow-sm'}`}
                    >
                        {isSaved ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                    </button>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{project.domain}</p>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-black leading-tight mb-3">{project.title}</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-3">{project.problem}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Seeking Experts</p>
                        <div className="flex flex-wrap gap-1.5">
                            {project.lookingFor.map(role => (
                                <span key={role} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 text-blue-600 text-[10px] font-bold rounded-xl border border-blue-100">
                                    <div className="h-1 w-1 bg-blue-400 rounded-full" /> {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50/70 p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-inner">
                        <div className="flex -space-x-1.5">
                            {[1, 2, 3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-200" />)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {project.contributors} Collaborators
                        </span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                    <Button
                        onClick={onApply}
                        className="w-full h-14 bg-gray-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest border-none shadow-xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all"
                    >
                        Request to Contribute <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
