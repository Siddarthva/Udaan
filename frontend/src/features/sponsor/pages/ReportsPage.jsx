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
    Target as LucideTarget,
    ShieldCheck,
    ArrowUpRight,
    ChevronRight,
    SearchCode,
    Share2,
    Calendar,
    Settings,
    MoreVertical,
    FileSearch,
    Package,
    History,
    FileSpreadsheet,
    MessageSquare,
    Eye,
    CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "@/components/ui";
import { STRATEGIC_DOSSIERS, INTEL_ALERTS, INTEL_REQUESTS } from "@/data/dossiers";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import { useUIStore } from "@/store/uiStore";
import toast from "react-hot-toast";

/**
 * Intel Hub: Strategic Intelligence & Governance System.
 * Transform from a simple reports viewer to an institutional decision engine.
 */
export default function ReportsPage() {
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Performance", "Financial", "Impact", "Risk & Compliance", "Strategic"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredDossiers = STRATEGIC_DOSSIERS.filter(dos => {
        const matchesSearch = dos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dos.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || dos.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] border border-gray-100" />)}
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
                        <Badge variant="primary" className="bg-gray-900 text-white border-none font-black tracking-widest px-4 py-1.5 text-[10px] uppercase">Intelligence Node Alpha</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-emerald-500" /> Secure Audit Trail Active
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Intel <span className="text-gray-400">Hub.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Actionable intelligence, governance dossiers, and executive decision-making tools for institutional oversight.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="h-16 px-8 border-gray-200 text-gray-900 rounded-[2rem] flex items-center gap-3 font-black text-xs uppercase hover:bg-white transition-all shadow-sm"
                        onClick={() => openOverlay('IMPACT_MAP')}
                    >
                        <Globe size={18} /> Ecosystem Mapping
                    </Button>
                    <Button
                        className="h-16 px-8 bg-gray-900 text-white rounded-[2rem] flex items-center gap-3 font-black text-xs uppercase shadow-2xl shadow-gray-200 border-none hover:scale-[1.02] transition-all"
                        onClick={() => openOverlay('DISCOVERY_WIZARD')}
                    >
                        <Plus size={18} /> New Request Pipeline
                    </Button>
                </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Lateral Control Panel */}
                <div className="xl:col-span-1 space-y-10">
                    <div className="space-y-6">
                        <div className="relative group">
                            <InputField
                                icon={Search}
                                placeholder="Search dossiers, projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border-gray-100 h-16 rounded-[2rem] focus:shadow-2xl focus:shadow-black/5 transition-all text-sm font-bold"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 px-6">Intelligence streams</h2>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full flex items-center justify-between px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-2' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                        <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pending Requests Pipeline */}
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 px-6">Request Pipeline</h2>
                        <Card className="p-10 border-none bg-indigo-50/50 rounded-[3rem] ring-1 ring-indigo-100/50 space-y-8">
                            <div className="space-y-6">
                                {INTEL_REQUESTS.map((req, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black font-mono text-indigo-400 uppercase tracking-widest">{req.status}</p>
                                            <Badge className="bg-white text-indigo-900 border-none font-black text-[8px] uppercase">{req.date}</Badge>
                                        </div>
                                        <p className="text-sm font-bold text-indigo-950 leading-tight">{req.type}</p>
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{req.project}</p>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={() => openOverlay('AUDIT_DRAWER')}
                                className="w-full h-12 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase border-indigo-100 shadow-sm hover:shadow-lg transition-all"
                            >
                                View Full Backlog
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Intelligence Stream */}
                <div className="xl:col-span-3 space-y-10">
                    {/* Live Alerts Node */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {INTEL_ALERTS.map(alert => (
                            <div key={alert.id} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col gap-4 group hover:border-gray-900 transition-all shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${alert.severity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                                        <AlertCircle size={16} />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{alert.time}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{alert.type} Alert</p>
                                    <p className="text-xs font-bold text-gray-500 leading-relaxed">{alert.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-6">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-gray-900">Dossier Catalog</h2>
                            <Badge className="bg-gray-100 text-gray-400 border-none px-4 py-1 font-black text-[9px] uppercase tracking-widest">{selectedCategory} Stream</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => openOverlay('AUDIT_DRAWER')}
                                variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white border-gray-100 shadow-sm"
                            >
                                <History size={20} className="text-gray-400" />
                            </Button>
                        </div>
                    </div>

                    <StaggerContainer>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {filteredDossiers.map(dos => (
                                <DossierCard key={dos.id} dossier={dos} onOpen={() => openOverlay('DOSSIER_VIEWER', dos)} />
                            ))}
                        </div>
                    </StaggerContainer>
                </div>
            </div>
        </div>
    );
}

function DossierCard({ dossier, onOpen }) {
    const statusColors = {
        'Verified': 'bg-emerald-50 text-emerald-600',
        'Under Review': 'bg-amber-50 text-amber-600',
        'Draft': 'bg-gray-50 text-gray-400',
        'Published': 'bg-indigo-50 text-indigo-600'
    };

    return (
        <motion.div layout whileHover={{ y: -8 }} className="group">
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-10 rounded-[4rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-bl-[120px] -mr-24 -mt-24 group-hover:bg-gray-100 transition-colors duration-500" />

                <div className="relative space-y-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className={`border-none font-black px-3 py-1 text-[8px] uppercase tracking-widest ${statusColors[dossier.status]}`}>
                                    {dossier.status}
                                </Badge>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{dossier.category}</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-black">
                                {dossier.title}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Associated: {dossier.project}</p>
                        </div>
                        <div className="h-14 w-14 bg-gray-900 text-white rounded-[1.5rem] shadow-xl flex items-center justify-center transform group-hover:rotate-12 transition-all">
                            <FileSearch size={24} />
                        </div>
                    </div>

                    {/* Intelligence Extraction Block */}
                    <div className="space-y-6">
                        <div className="p-6 bg-[#F8F9FA] rounded-[2.5rem] border border-gray-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" />
                                <span className="text-[9px] font-black uppercase text-gray-900 tracking-widest">Actionable Insights</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed italic line-clamp-2">"{dossier.findings}"</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Opportunity: {dossier.opportunity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 ${dossier.riskFlags > 0 ? 'bg-rose-500 animate-pulse' : 'bg-gray-300'} rounded-full`} />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Risk Flags: {dossier.riskFlags}</span>
                                </div>
                            </div>
                        </div>

                        {/* Executive Decision Panel */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-2">
                                <CheckSquare size={14} className="text-gray-900" />
                                <span className="text-[9px] font-black uppercase text-gray-900 tracking-widest">Recommended Actions</span>
                            </div>
                            <p className="px-2 text-xs font-black text-gray-900 underline decoration-indigo-500 decoration-2 underline-offset-4">{dossier.actions}</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2].map(i => <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-100" />)}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Sarah Chen</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Lead Partner</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={onOpen}
                                variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-gray-50 hover:bg-gray-900 hover:text-white transition-all"
                            >
                                <Eye size={18} />
                            </Button>
                            <Button
                                onClick={onOpen}
                                className="h-12 px-6 rounded-2xl bg-gray-900 text-white border-none text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200"
                            >
                                Full Dossier
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
