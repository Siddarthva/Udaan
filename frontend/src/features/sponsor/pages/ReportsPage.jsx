import React, { useState, useEffect } from "react";
import {
    FileText,
    Download,
    Printer,
    RefreshCcw,
    Search,
    Filter,
    Clock,
    Zap,
    CheckCircle2,
    AlertCircle,
    Plus,
    Layers,
    BarChart3,
    PieChart,
    Target,
    ShieldCheck,
    ArrowUpRight,
    ChevronRight,
    SearchCode,
    Share2,
    Calendar,
    Settings,
    MoreVertical,
    FileSearch,
    Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "../../../components/ui";
import { SPONSOR_REPORTS, SCHEDULED_REPORTS } from "../../../data/reportsData";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * ReportsPage: A centralized sponsorship intelligence center for audits and documentation.
 * Features report generation, document management, and scheduled reviews.
 */
export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Performance", "Impact", "Financial", "Strategic"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredReports = SPONSOR_REPORTS.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || report.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[300px] border border-gray-100 rounded-[2.5rem] bg-white" />
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
                        <Badge variant="primary" className="bg-gray-100 text-gray-900 border-none font-black tracking-widest px-3 py-1 text-[9px]">Documentation Suite</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock size={12} /> Sync: Real-time Audit
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Intel <span className="text-gray-400">Hub.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Access and manage comprehensive sponsorship reports, performance audits, and strategic market intelligence for executive review and compliance.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Button
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all"
                        onClick={() => toast.success("Opening Automated Reporting Suite...")}
                    >
                        <Plus size={18} /> New Request Pipeline
                    </Button>
                </div>
            </AnimatedSection>

            {/* Main Reports Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Search & Categories Sidebar */}
                <div className="xl:col-span-1 space-y-10">
                    <div className="space-y-6">
                        <div className="relative group">
                            <InputField
                                icon={Search}
                                placeholder="Find dossier items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 px-4">Dossier Categories</h2>
                            <div className="space-y-1.5">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                        <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0 translate-x-[-10px] hover:opacity-100 hover:translate-x-0 transition-all'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scheduled Reports */}
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 px-4">Audit Roadmap</h2>
                        <Card className="p-8 border-none bg-indigo-50/50 rounded-[2.5rem] ring-1 ring-indigo-100 space-y-6">
                            <div className="space-y-4">
                                {SCHEDULED_REPORTS.map((report, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="h-1 w-1 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">{report.date}</p>
                                            <p className="text-[11px] font-bold text-indigo-950 leading-tight">{report.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full h-10 bg-white/40 hover:bg-white text-indigo-900 rounded-xl text-[9px] font-black uppercase border-indigo-100">
                                View Full Cycle
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="xl:col-span-3 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Intelligence Catalog</h2>
                            <Badge variant="outline" className="bg-white border-gray-100 text-[10px] font-bold text-gray-400 capitalize">{selectedCategory} NODE</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-900">
                                <RefreshCcw size={14} className="mr-2" /> Refresh Cycle
                            </Button>
                            <Button variant="white" size="sm" className="h-10 w-10 p-0 rounded-xl border-gray-100">
                                <Settings size={14} className="text-gray-400" />
                            </Button>
                        </div>
                    </div>

                    <StaggerContainer>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredReports.map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                            {filteredReports.length === 0 && (
                                <div className="lg:col-span-2">
                                    <EmptyState
                                        icon={FileSearch}
                                        title="No Intelligence Nodes Found"
                                        description="Adjust your filters or dossier search to find specific documentation."
                                    />
                                </div>
                            )}
                        </div>
                    </StaggerContainer>
                </div>
            </div>
        </div>
    );
}

function ReportCard({ report }) {
    const statusColors = {
        'Finalized': 'bg-emerald-50 text-emerald-600',
        'Published': 'bg-indigo-50 text-indigo-600',
        'Audited': 'bg-blue-50 text-blue-600',
        'Internal': 'bg-amber-50 text-amber-600'
    };

    const categoryIcons = {
        'Performance': BarChart3,
        'Impact': Target,
        'Financial': ShieldCheck,
        'Strategic': Zap
    };

    const Icon = categoryIcons[report.category] || FileText;

    const handleDownload = (e) => {
        e.stopPropagation();
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: `Authenticating & Downloading ${report.title}...`,
                success: `${report.title} downloaded successfully.`,
                error: 'Transmission failed. Secure your link and try again.',
            },
            { position: 'bottom-center' }
        );
    };

    return (
        <motion.div layout whileHover={{ y: -6 }} className="group">
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[3rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-gray-100 transition-colors duration-500" />

                <div className="relative space-y-8 h-full flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className={`border-none font-black px-2 py-0.5 text-[8px] uppercase tracking-widest ${statusColors[report.status]}`}>
                                    {report.status}
                                </Badge>
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{report.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-black leading-tight line-clamp-2">{report.title}</h3>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:rotate-12 duration-500`}>
                            <Icon size={20} />
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-400 leading-relaxed line-clamp-3 mb-auto">
                        {report.summary}
                    </p>

                    <div className="space-y-4 pt-6 mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {report.highlights.slice(0, 2).map((h, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> {h.split(' ').slice(0, 4).join(' ')}...
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{report.date}</span>
                                <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                <span className="text-[11px] font-bold">{report.fileSize}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleDownload}
                                    className="h-11 w-11 p-0 bg-gray-900 text-white rounded-xl shadow-xl hover:shadow-gray-200/50 border-none group/btn active:scale-95 transition-all"
                                >
                                    <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
                                </Button>
                                <Button
                                    variant="white"
                                    className="h-11 w-11 p-0 rounded-xl border-gray-100 shadow-sm active:scale-95 transition-all"
                                    onClick={(e) => { e.stopPropagation(); toast.success("Opening node share suite..."); }}
                                >
                                    <Share2 size={18} className="text-gray-400" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
