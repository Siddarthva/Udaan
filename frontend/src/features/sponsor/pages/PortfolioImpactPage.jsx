import React, { useState, useEffect } from "react";
import {
    Activity,
    PieChart,
    TrendingUp,
    Target,
    Zap,
    Users,
    ArrowUpRight,
    AlertCircle,
    ShieldCheck,
    Globe,
    Clock,
    BarChart3,
    Search,
    Filter,
    ChevronRight,
    Award,
    Heart,
    ZapOff,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../../components/ui";
import { PORTFOLIO_PROJECTS, PORTFOLIO_HERO_STATS } from "../../../data/portfolioProjects";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import toast from "react-hot-toast";

/**
 * PortfolioImpactPage: A professional investment management dashboard for sponsors.
 * Displays active investments, impact metrics, and performance analytics.
 */
export default function PortfolioImpactPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");

    const domains = ["All", "CleanTech", "AgriTech", "HealthTech", "Sustainability", "FinTech"];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredProjects = PORTFOLIO_PROJECTS.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDomain = selectedDomain === "All" || project.domain === selectedDomain;
        return matchesSearch && matchesDomain;
    });

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl h-24" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
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
                        <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-none font-black tracking-widest px-3 py-1 text-[9px]">Strategic Portfolio</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <ShieldCheck size={12} /> Institutional Oversight Active
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Portfolio <span className="text-gray-400">& Impact.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track the pulse of your deployed capital. Monitor real-world impact, social outcomes, and ESG performance across your supported innovation network.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all"
                        onClick={() => toast.success("Generating Executive Portfolio Report...")}
                    >
                        <PieChart size={18} /> Executive Review
                    </Button>
                </div>
            </AnimatedSection>

            {/* Hero Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <SummaryStatCard icon={BarChart3} label="Capital Deployed" value={PORTFOLIO_HERO_STATS.totalCapital} color="blue" />
                <SummaryStatCard icon={Zap} label="Active Projects" value={PORTFOLIO_HERO_STATS.activeProjects} color="emerald" />
                <SummaryStatCard icon={Users} label="Beneficiaries" value={PORTFOLIO_HERO_STATS.beneficiaries} color="indigo" />
                <SummaryStatCard icon={Globe} label="Sustainability" value={PORTFOLIO_HERO_STATS.sustainabilityScore} color="amber" />
                <SummaryStatCard icon={TrendingUp} label="Avg. Growth" value={PORTFOLIO_HERO_STATS.growthRate} color="rose" />
                <SummaryStatCard icon={Award} label="Innov. Index" value={PORTFOLIO_HERO_STATS.innovationIndex} color="sky" />
            </div>

            {/* Main Portfolio Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Projects Column */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Active Allocations</h2>
                            <Badge variant="outline" className="bg-white border-gray-100 text-[10px] font-bold text-gray-400">{filteredProjects.length} PROJECTS</Badge>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-gray-500 tracking-wider focus:outline-none focus:ring-4 focus:ring-gray-900/5"
                            >
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <StaggerContainer>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredProjects.map((project) => (
                                <PortfolioCard key={project.id} project={project} />
                            ))}
                        </div>
                    </StaggerContainer>
                </div>

                {/* Impact & Risk Analytics Column */}
                <div className="space-y-12">
                    {/* Risk Attention Panel */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Risk Mitigation</h2>
                            <AlertCircle size={16} className="text-rose-500" />
                        </div>
                        <Card className="p-8 border-none bg-rose-50/50 rounded-[2.5rem] ring-1 ring-rose-100/50 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-[50px] rounded-full -mr-10 -mt-10" />

                            <div className="relative space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Active Alerts</p>
                                    <h4 className="text-lg font-bold text-rose-950">High Attention Nodes</h4>
                                </div>

                                <div className="space-y-4">
                                    <AttentionItem
                                        title="FinGuard"
                                        issue="Regulatory Compliance Pivot"
                                        urgency="High"
                                    />
                                    <AttentionItem
                                        title="MedAssist AI"
                                        issue="Phase 2 Deployment Delay"
                                        urgency="Medium"
                                    />
                                    <AttentionItem
                                        title="Eco-Grow"
                                        issue="Supply Chain Optimization"
                                        urgency="Low"
                                    />
                                </div>

                                <Button className="w-full h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-none hover:bg-rose-700 shadow-xl shadow-rose-200">
                                    Schedule Portfolio Review
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Impact Distribution */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">ESG Distribution</h2>
                        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm space-y-8">
                            <div className="space-y-6">
                                <ImpactProgressBar label="Environmental Integrity" value={78} color="bg-emerald-500" />
                                <ImpactProgressBar label="Social Uplift Index" value={92} color="bg-indigo-500" />
                                <ImpactProgressBar label="Economic Sustenance" value={64} color="bg-amber-500" />
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Verified Q1 2026</span>
                                <Button variant="ghost" size="sm" className="h-4 p-0 font-black text-gray-900 hover:bg-transparent">
                                    Audit Data <ExternalLink size={12} className="ml-1" />
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Success Highlights */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Operational Excellence</h2>
                        <Card className="p-8 border-none bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
                            <Heart className="text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold">52K+ Beneficiaries</h4>
                                <p className="text-indigo-200 text-sm leading-relaxed font-medium">Your portfolio has reached over 50,000 direct beneficiaries across 5 Indian states this quarter.</p>
                            </div>
                            <Button variant="white" className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                View Impact Map
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryStatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        indigo: "text-indigo-600 bg-indigo-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        rose: "text-rose-600 bg-rose-50/50",
        sky: "text-sky-600 bg-sky-50/50"
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

function PortfolioCard({ project }) {
    const riskColors = {
        'Low': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Medium': 'bg-amber-50 text-amber-600 border-amber-100',
        'High': 'bg-rose-50 text-rose-600 border-rose-100'
    };

    return (
        <motion.div layout whileHover={{ y: -8 }} className="group">
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[3rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-gray-100 transition-colors duration-500" />

                <div className="relative space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="primary" className="bg-gray-100 text-gray-500 border-none font-bold px-3 py-1 text-[9px] uppercase tracking-widest">{project.domain}</Badge>
                                <Badge className={`border-none font-black px-2 py-0.5 text-[8px] uppercase tracking-widest ${riskColors[project.riskLevel]}`}>
                                    {project.riskLevel} Risk
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-black leading-tight">{project.name}</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Sponsorship Deployed</span>
                            <span className="text-gray-900">{project.fundingProvided}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Impact Reach</span>
                                <span className="text-[10px] font-black text-gray-900">{project.progress}% Towards Target</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gray-900 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-gray-400" />
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Major Milestone Achievement</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed italic line-clamp-2">"{project.achievements}"</p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Audited {project.lastUpdate}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                            Management Suite <ArrowUpRight size={14} className="ml-1" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function AttentionItem({ title, issue, urgency }) {
    const colors = {
        High: "text-rose-600 bg-rose-100",
        Medium: "text-amber-600 bg-amber-100",
        Low: "text-blue-600 bg-blue-100"
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-white/40 rounded-2xl border border-white/50 group-hover:bg-white/60 transition-colors">
            <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${urgency === 'High' ? 'bg-rose-500 animate-pulse' : 'bg-gray-300'}`} />
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    <Badge className={`text-[8px] font-black uppercase border-none px-2 py-0.5 ${colors[urgency]}`}>{urgency}</Badge>
                </div>
                <p className="text-[10px] font-medium text-gray-500">{issue}</p>
            </div>
        </div>
    );
}

function ImpactProgressBar({ label, value, color }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-black text-gray-900">{value}%</p>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}
