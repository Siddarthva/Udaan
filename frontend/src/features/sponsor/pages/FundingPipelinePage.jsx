import React, { useState, useEffect } from "react";
import {
    Plus,
    TrendingUp,
    Users,
    CreditCard,
    PieChart,
    ArrowUpRight,
    Settings,
    Search,
    Filter,
    Layers,
    Clock,
    Zap,
    Trophy,
    Briefcase,
    ChevronRight,
    MessageCircle,
    Activity,
    Calendar,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ClipboardList,
    MoreVertical,
    MoveRight,
    BarChart3,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../../components/ui";
import { useUIStore } from "../../../store/uiStore";
import { FUNDING_PIPELINE } from "../../../data/fundingPipeline";
import { SPONSOR_STATS } from "../../../data/sponsorProjects";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * FundingPipelinePage: A CRM-like deal flow manager for sponsors and grant committees.
 */
export default function FundingPipelinePage() {
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [pipelineItems, setPipelineItems] = useState(FUNDING_PIPELINE);

    const stages = ["New Leads", "Under Review", "Due Diligence", "Approved", "Declined"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleMoveStage = (id, newStage) => {
        setPipelineItems(prev => prev.map(item =>
            item.id === id ? { ...item, stage: newStage, lastInteraction: "Just Now", progress: newStage === 'Approved' ? 100 : item.progress + 10 } : item
        ));
        toast.success(`Moved to ${newStage}`);
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="min-w-[320px] h-[600px] border border-gray-100 rounded-[2.5rem] bg-white p-8 space-y-6">
                            <Skeleton className="h-6 w-3/4 rounded-full" />
                            {[1, 2].map(j => <Skeleton key={j} className="h-48 w-full rounded-2xl" />)}
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
                        <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-none font-black tracking-widest px-3 py-1 text-[9px]">Deal Flow Management</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <BarChart3 size={12} /> Live Pipeline Active
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Funding <span className="text-gray-400">Pipeline.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track and manage investment deal flow through standard institutional stages from initial lead to final disbursement approval.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all"
                        onClick={() => toast.success("Opening New Allocation Suite...")}
                    >
                        <Plus size={18} /> Add Deal Node
                    </Button>
                </div>
            </AnimatedSection>

            {/* Pipeline Columns */}
            <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar -mx-4 px-4 h-[calc(100vh-320px)]">
                {stages.map((stage) => (
                    <div key={stage} className="flex flex-col gap-6 min-w-[340px]">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${stageColors(stage)}`} />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">{stage}</h3>
                                <Badge variant="outline" className="text-[10px] font-bold text-gray-400 bg-gray-50 border-none">
                                    {pipelineItems.filter(p => p.stage === stage).length}
                                </Badge>
                            </div>
                            <Button
                                onClick={() => openOverlay('DEAL_WIZARD', { stage })}
                                variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-300 hover:text-gray-900 active:scale-95 transition-all"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {pipelineItems.filter(p => p.stage === stage).map((item) => (
                                    <PipelineCard
                                        key={item.id}
                                        item={item}
                                        onMove={handleMoveStage}
                                        nextStage={stages[stages.indexOf(stage) + 1]}
                                    />
                                ))}
                                {pipelineItems.filter(p => p.stage === stage).length === 0 && (
                                    <div className="border border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center opacity-50">
                                        <Layers className="text-gray-300 mb-2" size={24} />
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Empty Stage Node</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    function stageColors(stage) {
        switch (stage) {
            case "New Leads": return "bg-blue-400";
            case "Under Review": return "bg-sky-400";
            case "Due Diligence": return "bg-amber-400";
            case "Approved": return "bg-emerald-400";
            case "Declined": return "bg-rose-400";
            default: return "bg-gray-300";
        }
    }
}

function PipelineCard({ item, onMove, nextStage }) {
    const riskColors = {
        'Very Low': 'text-emerald-500 bg-emerald-50',
        'Low': 'text-blue-500 bg-blue-50',
        'Medium': 'text-amber-500 bg-amber-50',
        'High': 'text-rose-500 bg-rose-50',
        'N/A': 'text-gray-400 bg-gray-50'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            whileHover={{ y: -4 }}
        >
            <Card className="p-6 border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 rounded-[2rem] bg-white ring-1 ring-gray-100 relative group overflow-hidden">
                <div className="space-y-6 relative">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-black">
                                {item.projectName}
                            </h4>
                            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.1em]">
                                REQUEST: {item.requestedAmount}
                            </p>
                        </div>
                        <Button
                            onClick={() => toast.success("Advanced node controls active.")}
                            variant="ghost" className="h-8 w-8 p-0 rounded-lg text-gray-300 group-hover:text-gray-900 transition-colors active:scale-90"
                        >
                            <MoreVertical size={16} />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Flow Progress</span>
                            <span className="text-[10px] font-black text-gray-900">{item.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${item.stage === 'Approved' ? 'bg-emerald-500' : item.stage === 'Declined' ? 'bg-rose-400' : 'bg-gray-900'}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
                        <div className="space-y-1 border-r border-gray-50 pr-4">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Risk Index</p>
                            <Badge className={`border-none font-bold px-2 py-0.5 text-[8px] ${riskColors[item.riskRating] || 'bg-gray-100 text-gray-400'}`}>
                                {item.riskRating}
                            </Badge>
                        </div>
                        <div className="space-y-1 pl-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Interaction</p>
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-gray-300" />
                                <span className="text-[10px] font-bold text-gray-900">{item.lastInteraction}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 group-hover:text-black transition-colors">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900">Reviewer: {item.reviewer}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 italic line-clamp-2">"{item.notes}"</p>
                    </div>

                    {nextStage && item.stage !== 'Approved' && item.stage !== 'Declined' && (
                        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                onClick={() => onMove(item.id, nextStage)}
                                className="w-full h-10 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border-none flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                Advance Flow <MoveRight size={14} />
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
