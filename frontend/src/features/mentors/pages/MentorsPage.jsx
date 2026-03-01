import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    BookOpen,
    Mail,
    ExternalLink,
    Award,
    ChevronRight,
    Star,
    Clock,
    UserCheck,
    Briefcase,
    Zap,
    GraduationCap,
    FlaskConical,
    X,
    Bookmark,
    BookmarkCheck,
    ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState, Modal } from "../../../components/ui";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import { MENTORS } from "../../../data/mentors";
import toast from "react-hot-toast";

/**
 * MentorsPage: A professional academic mentor directory.
 * Features: High-fidelity filtering, faculty profiles, and mentorship tracking.
 */
export default function MentorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [savedMentors, setSavedMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);

    const domains = ["All", "AI / NLP", "Computer Vision", "Cloud", "Data Science", "Security", "Software Engineering", "Animation / Graphics"];
    const types = ["All", "Class Coordinator", "Project Guide", "Research Mentor", "Course Instructor"];

    useEffect(() => {
        // Simulate API loading
        const timer = setTimeout(() => setIsLoading(false), 800);

        // Load saved mentors from localStorage
        const saved = JSON.parse(localStorage.getItem('udaan_saved_mentors') || '[]');
        setSavedMentors(saved);

        return () => clearTimeout(timer);
    }, []);

    const toggleSave = (id, e) => {
        e?.stopPropagation();
        let newSaved;
        if (savedMentors.includes(id)) {
            newSaved = savedMentors.filter(item => item !== id);
            toast.success("Mentor removed from saved list.");
        } else {
            newSaved = [...savedMentors, id];
            toast.success("Mentor saved to your directory.");
        }
        setSavedMentors(newSaved);
        localStorage.setItem('udaan_saved_mentors', JSON.stringify(newSaved));
    };

    const filteredMentors = useMemo(() => {
        return MENTORS.filter(mentor => {
            const matchesSearch =
                mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDomain = selectedDomain === "All" || mentor.expertise.some(e => e.includes(selectedDomain));
            const matchesType = selectedType === "All" || mentor.role === selectedType;

            return matchesSearch && matchesDomain && matchesType;
        });
    }, [searchQuery, selectedDomain, selectedType]);

    // Grouping for the featured section
    const coordinator = MENTORS.find(m => m.isCoordinator);
    const regularMentors = filteredMentors.filter(m => !m.isCoordinator);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2rem] space-y-6 shadow-sm">
                            <Skeleton className="h-20 w-20 rounded-2xl" />
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <AnimatedSection direction="down">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="primary" className="bg-gray-100 text-gray-900 border-none font-black tracking-widest px-3 py-1 text-[9px]">Intellectual Capital</Badge>
                            <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] ml-2">Mentor Directory</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                            Find Your <span className="text-gray-400">Mentor.</span>
                        </h1>
                        <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                            Connect with distinguished faculty members and industry experts specializing in software engineering, AI, computer vision, and specialized project guidance.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group w-full sm:w-80">
                            <InputField
                                icon={Search}
                                placeholder="Search by name or expertise..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                            />
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Coordinator Showcase */}
            {coordinator && selectedDomain === "All" && selectedType === "All" && !searchQuery && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Star className="text-amber-500 fill-amber-500" size={20} />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Featured Leadership</h2>
                    </div>
                    <AnimatedSection direction="up">
                        <div
                            onClick={() => setSelectedMentor(coordinator)}
                            className="group relative bg-[#2F2F2F] text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl hover:shadow-gray-200/20 transition-all duration-500 cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />

                            <div className="relative flex flex-col md:flex-row items-center gap-10">
                                <div className="h-32 w-32 md:h-48 md:w-48 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl font-serif font-black backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                    {coordinator.initials}
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                            <Badge className="bg-amber-400 text-amber-950 border-none px-4 py-1 font-black">Class Coordinator</Badge>
                                            <Badge className="bg-white/10 text-white border-white/10 px-4 py-1 font-bold">Software Engineering</Badge>
                                            <Badge className="bg-white/10 text-white border-white/10 px-4 py-1 font-bold">Project Management</Badge>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight">{coordinator.name}</h3>
                                        <p className="text-white/60 text-lg font-medium max-w-2xl leading-relaxed">
                                            Experienced academic leader specializing in guiding student cohorts through complex engineering principles and large-scale project lifecycles.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                        <Button className="bg-white text-gray-900 px-8 h-12 rounded-xl font-black text-xs uppercase hover:bg-gray-100">
                                            Request Guidance
                                        </Button>
                                        <Button variant="ghost" className="text-white hover:bg-white/10 border-white/20 h-12 px-6 rounded-xl text-xs font-bold">
                                            View Schedule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            )}

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-6 sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 min-w-max">
                    <Filter size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Directory Filters</span>
                </div>

                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-3 no-scrollbar flex-1">
                    <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all cursor-pointer h-12 min-w-[180px]"
                    >
                        <option value="All">All Expertise Domains</option>
                        {domains.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all cursor-pointer h-12 min-w-[180px]"
                    >
                        <option value="All">All Roles</option>
                        {types.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black ml-2"
                        onClick={() => {
                            setSelectedDomain("All");
                            setSelectedType("All");
                            setSearchQuery("");
                        }}
                    >
                        Reset
                    </Button>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm ml-auto">
                    <UserCheck className="text-emerald-500" size={16} />
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        {filteredMentors.length} ACTIVE MENTORS
                    </span>
                </div>
            </div>

            {/* Results Grid */}
            <StaggerContainer>
                {filteredOptions(regularMentors, coordinator).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredOptions(regularMentors, coordinator).map((mentor) => (
                            <MentorCard
                                key={mentor.id}
                                mentor={mentor}
                                isSaved={savedMentors.includes(mentor.id)}
                                onToggleSave={(e) => toggleSave(mentor.id, e)}
                                onClick={() => setSelectedMentor(mentor)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Zap}
                        title="No Matching Mentors"
                        description="Adjust your expertise or role filters to find specialized guidance nodes."
                    />
                )}
            </StaggerContainer>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <MentorDetailModal
                        mentor={selectedMentor}
                        onClose={() => setSelectedMentor(null)}
                        isSaved={savedMentors.includes(selectedMentor.id)}
                        onToggleSave={(e) => toggleSave(selectedMentor.id, e)}
                    />
                )}
            </AnimatePresence>
        </div>
    );

    function filteredOptions(regular, coordinator) {
        if (selectedType === "Class Coordinator") return [coordinator].filter(Boolean);
        if (selectedDomain !== "All" || selectedType !== "All" || searchQuery) {
            return filteredMentors;
        }
        return regular;
    }
}

function MentorCard({ mentor, isSaved, onToggleSave, onClick }) {
    const availabilityColors = {
        'Available': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Busy': 'bg-rose-50 text-rose-600 border-rose-100',
        'Research Mode': 'bg-indigo-50 text-indigo-600 border-indigo-100'
    };

    const RoleIcon = {
        'Class Coordinator': GraduationCap,
        'Project Guide': Briefcase,
        'Research Mentor': FlaskConical,
        'Course Instructor': BookOpen
    }[mentor.role] || UserCheck;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8 }}
            onClick={onClick}
            className="group cursor-pointer"
        >
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100">
                <div className="flex justify-between items-start mb-8">
                    <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-2xl font-serif font-black text-gray-900 border border-gray-100 group-hover:scale-110 group-hover:bg-gray-900 group-hover:text-white transition-all duration-700 shadow-sm">
                        {mentor.initials}
                    </div>
                    <button
                        onClick={onToggleSave}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'text-amber-500 drop-shadow-md' : 'text-gray-300 hover:text-gray-900'}`}
                    >
                        {isSaved ? <BookmarkCheck size={24} fill="currentColor" /> : <Bookmark size={24} />}
                    </button>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 ${availabilityColors[mentor.availability]}`}>
                                {mentor.availability}
                            </Badge>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">• {mentor.role}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-black">{mentor.name}</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1">{mentor.title}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {mentor.expertise.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 group-hover:bg-gray-100 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 group-hover:text-black transition-colors">
                        <BookOpen size={16} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900">
                            {mentor.courses.length} Active Courses
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                        View Node <ArrowUpRight size={12} className="ml-1" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

function MentorDetailModal({ mentor, onClose, isSaved, onToggleSave }) {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Left Profile Section */}
                <div className="w-full md:w-[320px] bg-gray-50 p-12 flex flex-col items-center border-r border-gray-100 text-center">
                    <div className="h-32 w-32 bg-gray-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-serif font-black shadow-2xl mb-8">
                        {mentor.initials}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">{mentor.title}</p>

                    <div className="w-full space-y-4">
                        <Button
                            className="w-full h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase"
                            onClick={() => window.location.href = `mailto:${mentor.email}`}
                        >
                            <Mail size={16} /> Contact Mentor
                        </Button>
                        <Button
                            variant="white"
                            className="w-full h-12 border-gray-200 text-gray-900 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase"
                            onClick={onToggleSave}
                        >
                            {isSaved ? <BookmarkCheck className="text-amber-500" size={16} /> : <Bookmark size={16} />}
                            {isSaved ? "Saved" : "Save for Projects"}
                        </Button>
                    </div>
                </div>

                {/* Right Content Section */}
                <div className="flex-1 p-12 space-y-10 overflow-y-auto max-h-[80vh]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="success" className="bg-emerald-50 text-emerald-700 font-bold px-3">{mentor.availability}</Badge>
                                <span className="h-1 w-1 bg-gray-300 rounded-full mx-1"></span>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{mentor.role}</span>
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 pt-2">Scholarly Profile</h4>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-10 w-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-bold text-gray-900">Background & Philosophy</h5>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            {mentor.bio}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-900">
                                <Award className="text-amber-500" size={20} />
                                <h5 className="font-bold">Expertise Nodes</h5>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mentor.expertise.map(exp => (
                                    <span key={exp} className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-lg border border-gray-200">
                                        {exp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-900">
                                <BookOpen className="text-blue-500" size={20} />
                                <h5 className="font-bold">Active Courses</h5>
                            </div>
                            <ul className="space-y-2">
                                {mentor.courses.map(course => (
                                    <li key={course} className="text-xs font-medium text-gray-500 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full" />
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Guidance Focus</p>
                            <p className="text-sm font-bold text-blue-900">Open to Final Year Projects & Research Collaboration</p>
                        </div>
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <Zap size={20} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
