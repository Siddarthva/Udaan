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
    Wallet,
    Banknote,
    CalendarCheck,
    Receipt,
    CreditCard,
    ExternalLink,
    ShieldAlert,
    Download,
    Eye,
    Landmark,
    ArrowRightCircle,
    FileCheck,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, Skeleton, EmptyState, InputField } from "../../../components/ui";
import { PORTFOLIO_HEALTH, INVESTMENT_POSITIONS, CAPITAL_LIFECYCLE } from "../../../data/portfolio";
import { LEDGER_RECORDS, FINANCIAL_REPORTS } from "../../../data/ledger";
import { IMPACT_METRICS, RISK_INDEX } from "../../../data/impact";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";
import { useUIStore } from "../../../store/uiStore";
import toast from "react-hot-toast";

/**
 * PortfolioImpactPage: Institutional Capital Management System.
 * Fully loaded with Capital Lifecycle, Investment Positions, Financial Ledger, and ESG Intelligence.
 */
export default function PortfolioImpactPage() {
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // overview, positions, accounting, risk
    const [searchQuery, setSearchQuery] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredPositions = INVESTMENT_POSITIONS.filter(pos =>
        pos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pos.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSettlePayment = () => {
        setProcessingPayment(true);
        setTimeout(() => {
            setProcessingPayment(false);
            setShowPaymentModal(false);
            toast.success("Capital Disbursed Successfully. Ledger Updated.", {
                icon: '💰',
                style: { background: '#064E3B', color: '#fff' }
            });
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-[400px]" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] border border-gray-100" />)}
                </div>
                <div className="h-[600px] bg-white rounded-[3rem] border border-gray-100" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Portfolio Command Layer - Header */}
            <AnimatedSection direction="down" className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-950 text-emerald-400 border-none px-4 py-1.5 font-black tracking-[0.2em] text-[10px] uppercase">Institutional Fund I</Badge>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100">
                            <ShieldCheck size={12} className="text-emerald-500" /> Compliance: 100% Verified
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Capital <span className="text-gray-400">OS.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        End-to-end portfolio command center for institutional capital, impact auditing, and risk mitigation.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portfolio Health (PHI)</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-black text-gray-900">{PORTFOLIO_HEALTH.index}</span>
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest">{PORTFOLIO_HEALTH.trend}</Badge>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-100" />
                        <div className="flex gap-2">
                            {Object.entries(PORTFOLIO_HEALTH.metrics).map(([key, val]) => (
                                <div key={key} title={key} className="w-1.5 h-10 bg-gray-50 rounded-full relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900" style={{ height: `${val}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        className="h-16 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-2xl shadow-gray-200 border-none hover:scale-[1.02] transition-all"
                        onClick={() => openOverlay('SCENARIO_SIMULATOR')}
                    >
                        <Zap size={18} /> Scenario Radar
                    </Button>
                </div>
            </AnimatedSection>

            {/* Global Context Tabs */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-200/50 pb-2">
                {[
                    { id: 'overview', label: 'Command Suite', icon: Activity },
                    { id: 'positions', label: 'Investment positions', icon: Landmark },
                    { id: 'accounting', label: 'Financial Ledger', icon: Wallet },
                    { id: 'impact', label: 'Impact Engine', icon: Globe }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-gray-900' : 'text-gray-300 group-hover:text-gray-400'} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Capital Lifecycle Visualization */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {CAPITAL_LIFECYCLE.map((item, i) => (
                                <Card key={i} className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm space-y-4 hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-12 -mt-12 opacity-50`} />
                                    <div className="relative space-y-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.stage}</p>
                                        <h3 className="text-3xl font-black text-gray-900 leading-none">{item.amount}</h3>
                                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "70%" }}
                                                className={`h-full bg-gray-900 rounded-full`}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                            <div className="xl:col-span-2 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">High-Priority Allocations</h2>
                                    <Button
                                        onClick={() => openOverlay('IMPACT_MAP')}
                                        variant="ghost" className="text-[10px] font-black uppercase text-gray-400 tracking-widest active:text-gray-900 transition-colors"
                                    >
                                        See Strategy Map
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {INVESTMENT_POSITIONS.slice(0, 2).map(pos => (
                                        <PositionCard key={pos.id} position={pos} onOpenDossier={() => openOverlay('DOSSIER_VIEWER', { ...pos, title: `${pos.name} - Continuous Dossier` })} />
                                    ))}
                                </div>
                            </div>

                            {/* Risk & Compliance Overlay */}
                            <div className="space-y-10">
                                <section className="space-y-6">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Risk Trajectory</h2>
                                    <Card className="p-10 border-none bg-gray-900 text-white rounded-[3rem] shadow-2xl space-y-10">
                                        <div className="space-y-8">
                                            {RISK_INDEX.slice(0, 3).map((risk, i) => (
                                                <div key={i} className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">{risk.type} Exposure</p>
                                                        <Badge className="bg-white/10 text-white border-none font-black text-[8px] uppercase">{risk.status}</Badge>
                                                    </div>
                                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${risk.level}%` }}
                                                            className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            onClick={() => openOverlay('COMPLIANCE_CONSOLE')}
                                            className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border-none rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                        >
                                            Governance & Compliance Node
                                        </Button>
                                    </Card>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'positions' && (
                    <motion.div
                        key="positions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h2 className="text-xl font-bold text-gray-900">Institutional Exposure Map</h2>
                            <div className="flex gap-4">
                                <InputField
                                    icon={Search}
                                    placeholder="Filter positions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border-gray-200 h-12 rounded-2xl w-80"
                                />
                                <Button variant="secondary" className="h-12 rounded-2xl px-6 bg-white border-gray-200 flex items-center gap-2 font-black text-[10px] uppercase">
                                    <Filter size={14} /> Allocation Filters
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredPositions.map(pos => (
                                <PositionCard key={pos.id} position={pos} onOpenDossier={() => openOverlay('DOSSIER_VIEWER', { ...pos, title: `${pos.name} - Position Audit` })} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'accounting' && (
                    <motion.div
                        key="accounting"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 p-10 border-none bg-white rounded-[3rem] shadow-sm space-y-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-gray-900">Capital Flow Ledger</h3>
                                    <Button
                                        onClick={() => openOverlay('DOSSIER_VIEWER', { title: 'IFRS-17 Compliance Statement', status: 'Certified', findings: 'The consolidated financial statement meets all International Financial Reporting Standards for institutional venture hubs.' })}
                                        variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 active:bg-gray-50 transition-all"
                                    >
                                        <Download size={14} className="mr-2" /> Export IFRS Statement
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">
                                                <th className="pb-6">Reference</th>
                                                <th className="pb-6">Project Position</th>
                                                <th className="pb-6">Classification</th>
                                                <th className="pb-6">Amount</th>
                                                <th className="pb-6 text-right">Settlement</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {LEDGER_RECORDS.map(record => (
                                                <tr key={record.id} className="group hover:bg-gray-50 transition-colors">
                                                    <td className="py-6 text-[10px] font-black text-gray-400 font-mono uppercase">{record.receipt}</td>
                                                    <td className="py-6 font-bold text-gray-900 text-sm">{record.project}</td>
                                                    <td className="py-6">
                                                        <Badge className={`border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5 ${record.type === 'Outflow' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            {record.category}
                                                        </Badge>
                                                    </td>
                                                    <td className={`py-6 font-black text-sm ${record.type === 'Outflow' ? 'text-gray-900' : 'text-emerald-600'}`}>
                                                        {record.type === 'Outflow' ? '-' : '+'}{record.amount}
                                                    </td>
                                                    <td className="py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{record.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            <div className="space-y-8">
                                <Card className="p-10 border-none bg-indigo-900 text-white rounded-[3rem] shadow-2xl space-y-8">
                                    <h4 className="text-xl font-bold">Funding Pipeline Overview</h4>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Deployed Capital', val: FINANCIAL_REPORTS.totalCapitalDeployed },
                                            { label: 'Realized Returns', val: FINANCIAL_REPORTS.totalReturnsRealized },
                                            { label: 'Avg Monthly Burn', val: FINANCIAL_REPORTS.burnRateAvg }
                                        ].map((stat, i) => (
                                            <div key={i} className="space-y-2">
                                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{stat.label}</p>
                                                <p className="text-2xl font-black text-white">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => openOverlay('COMPLIANCE_CONSOLE')}
                                        variant="white"
                                        className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-2xl text-[10px] font-black uppercase"
                                    >
                                        Liquidity Forecast Suite
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'impact' && (
                    <motion.div
                        key="impact"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-12"
                    >
                        <Card className="p-10 border-none bg-white rounded-[3.5rem] shadow-sm space-y-12">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional ESG Audit</p>
                                <h3 className="text-4xl font-black text-gray-900 leading-none">Social Uplift <span className="text-gray-400">Index.</span></h3>
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Beneficiaries</p>
                                    <p className="text-4xl font-black text-gray-900">{IMPACT_METRICS.beneficiaries}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ESG Score</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-4xl font-black text-gray-900">{IMPACT_METRICS.esgStatus.score}</p>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">{IMPACT_METRICS.esgStatus.trend}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase text-gray-900 tracking-[0.2em]">Verified SDG Alignment</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {IMPACT_METRICS.sdgAlignment.map(sdg => (
                                        <div key={sdg.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl bg-${sdg.color}-500/10 flex items-center justify-center text-${sdg.color}-500`}>
                                                    <span className="font-black text-xs">{sdg.id}</span>
                                                </div>
                                                <p className="text-xs font-bold text-gray-900">{sdg.label}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-gray-900">{sdg.score}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-8">
                            <Card className="p-10 border-none bg-emerald-950 text-white rounded-[3.5rem] shadow-sm space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/50 blur-[80px] rounded-full -mr-32 -mt-32" />
                                <div className="relative space-y-8">
                                    <h4 className="text-2xl font-bold">Climate Action Ledger</h4>
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-white/10 rounded-[2rem] flex items-center justify-center text-white">
                                                <Globe size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Total Carbon Offset</p>
                                                <p className="text-3xl font-black text-white font-mono">{IMPACT_METRICS.carbonReduction}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-100 leading-relaxed italic">"Our current portfolio is sequestering carbon at a rate of 12.5k tons annually, exceeding institutional targets by 18%."</p>
                                    </div>
                                    <Button variant="white" className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-2xl text-[10px] font-black uppercase">
                                        Generate GRI-Compliant Export
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Initiation Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl p-10">
                            <div className="space-y-6">
                                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Banknote size={32} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Authorize Disbursement</h3>
                                    <p className="text-sm font-medium text-gray-400">Initiate Tranche settlement for AgriDrone AI (Series A).</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center font-mono">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Due</span>
                                    <span className="text-xl font-black text-gray-900">₹10.5 L</span>
                                </div>
                                <Button
                                    className="w-full h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase shadow-xl disabled:opacity-50"
                                    onClick={handleSettlePayment}
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? "Securing Transaction..." : "Confirm & Release Funds"}
                                </Button>
                                <Button variant="ghost" className="w-full h-10 text-[10px] font-black uppercase text-gray-400" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Scenario Simulation Modal */}
            <AnimatePresence>
                {showScenarioModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowScenarioModal(false)} />
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-[#0A0D10] text-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl border border-white/5 p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] px-3 py-1">REAL-TIME SIMULATION</Badge>
                                        <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">Nexus v4.0</span>
                                    </div>
                                    <h3 className="text-4xl font-black leading-none italic tracking-tight">Portfolio <span className="text-white/40 font-normal">Stress Test.</span></h3>
                                    <p className="text-white/60 text-sm font-medium leading-relaxed">Adjust macro-economic variables to visualize portfolio elasticity and capital burn rates.</p>
                                    <div className="space-y-6 pt-6">
                                        {['Inflation Coefficient', 'Market Volatility', 'Regulatory Friction'].map((par, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <span>{par}</span>
                                                    <span>Normal</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full relative">
                                                    <div className="h-full bg-emerald-500 rounded-full w-1/3 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                                    <div className="absolute top-1/2 left-1/3 h-4 w-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xl border-4 border-emerald-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-[3rem] p-8 border border-white/5 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Projected PHI Impact</p>
                                        <h4 className="text-6xl font-black text-emerald-400">88.4</h4>
                                        <p className="text-xs text-white/60 leading-relaxed italic">Portfolio remains highly resilient under current stress parameters. No liquidation events predicted.</p>
                                    </div>
                                    <Button className="w-full h-14 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl border-none shadow-xl shadow-emerald-500/20" onClick={() => setShowScenarioModal(false)}>Apply Scenario</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PositionCard({ position, onOpenDossier }) {
    const riskLevels = {
        Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Medium: "bg-amber-50 text-amber-600 border-amber-100",
        High: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <motion.div layout whileHover={{ y: -8 }} className="group">
            <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[3.5rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-bl-[100px] -mr-20 -mt-20 group-hover:bg-gray-100 transition-colors duration-500" />

                <div className="relative space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-gray-900 text-white border-none font-black px-2 py-0.5 text-[8px] uppercase tracking-widest">{position.model}</Badge>
                                <Badge className={`border-none font-black px-2 py-0.5 text-[8px] uppercase tracking-widest ${riskLevels[position.risk]}`}>{position.risk} RISK</Badge>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-black">{position.name}</h3>
                        </div>
                        <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:rotate-12">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current valuation</p>
                            <p className="text-lg font-black text-gray-900">{position.valuation}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ROI Estimate</p>
                            <p className="text-lg font-black text-emerald-600">{position.roi}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Capital lifecycle: {position.lifecycle}</p>
                            <p className="text-[10px] font-black text-gray-900">{position.disbursed} / {position.committed}</p>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "60%" }}
                                className="h-full bg-gray-900 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-gray-400" />
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Next Critical Node</span>
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{position.nextMilestone}</p>
                    </div>

                    <div className="pt-6 mt-auto border-t border-gray-50 flex items-center justify-between">
                        <Badge variant="outline" className={`border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 ${position.compliance === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {position.compliance}
                        </Badge>
                        <Button
                            onClick={onOpenDossier}
                            variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 flex items-center gap-2 active:bg-gray-50 transition-all"
                        >
                            <Eye size={14} /> Full Dossier
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
