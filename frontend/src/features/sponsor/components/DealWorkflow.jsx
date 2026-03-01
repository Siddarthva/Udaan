import React, { useState, useEffect } from "react";
import {
    X,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Zap,
    TrendingUp,
    PieChart,
    Gift,
    Package,
    Heart,
    CreditCard,
    FileText,
    Lock,
    AlertCircle,
    Info,
    Calendar,
    Target,
    BarChart3,
    Activity,
    Smartphone,
    Search,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge, InputField } from "../../../components/ui";
import toast from "react-hot-toast";

/**
 * DealWorkflow: A multi-step stepper for institutional investment management.
 */
export default function DealWorkflow({ project, isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [dealConfig, setDealConfig] = useState({
        model: "grant",
        amount: project?.fundingSought || "₹0",
        tenure: "12 Months",
        paymentPlan: "Installments",
        installments: 6,
        valuation: "",
        equity: "",
        terms: "Standard Grant Agreement terms apply. Milestone-based disbursements."
    });

    const [assessment, setAssessment] = useState({
        viability: 4,
        team: 5,
        risk: 2,
        impact: 5
    });

    const totalSteps = 6;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinalize = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(7); // Success Step
            toast.success("Deal Finalized Successfully!");
            // Persist to local storage (simulated)
            const deals = JSON.parse(localStorage.getItem('sponsor_deals') || '[]');
            deals.push({ ...dealConfig, id: `deal_${Date.now()}`, project: project.name, date: new Date().toISOString() });
            localStorage.setItem('sponsor_deals', JSON.stringify(deals));
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            >
                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-[#F8F9FA]/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Deal Stream Execution</p>
                            <h2 className="text-xl font-bold text-gray-900 leading-none">{project?.name} Onboarding</h2>
                        </div>
                    </div>

                    {step < 7 && (
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5, 6].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-gray-900' : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && <Step1Snapshot project={project} onNext={nextStep} />}
                        {step === 2 && <Step2DueDiligence assessment={assessment} setAssessment={setAssessment} onNext={nextStep} />}
                        {step === 3 && <Step3DealStructure config={dealConfig} setConfig={setDealConfig} onNext={nextStep} />}
                        {step === 4 && <Step4Terms config={dealConfig} setConfig={setDealConfig} onNext={nextStep} />}
                        {step === 5 && <Step5PaymentPlan config={dealConfig} setConfig={setDealConfig} onNext={nextStep} />}
                        {step === 6 && <Step6Checkout project={project} config={dealConfig} onFinalize={handleFinalize} loading={loading} />}
                        {step === 7 && <Step7Success project={project} onClose={onClose} />}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {step < 6 && (
                    <div className="px-10 py-8 border-t border-gray-100 bg-white flex justify-between items-center shrink-0">
                        <Button
                            variant="ghost"
                            onClick={step === 1 ? onClose : prevStep}
                            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900"
                        >
                            <ArrowLeft size={16} className="mr-2" /> {step === 1 ? 'Cancel Execution' : 'Back Entry'}
                        </Button>

                        <Button
                            onClick={nextStep}
                            className="bg-gray-900 text-white min-w-[200px] h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-400/20 active:scale-95 transition-all"
                        >
                            {step === 5 ? 'Initiate Disbursement' : 'Continue Process'} <ArrowRight size={18} />
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

const Step1Snapshot = ({ project }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-10"
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                    <Badge variant="outline" className="text-gray-400 font-black tracking-widest uppercase border-gray-100 text-[10px]">Strategic Opportunity</Badge>
                    <h3 className="text-4xl font-bold text-gray-900 leading-tight">Venture Architecture Summary</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">{project?.problem}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Funding Requested</p>
                        <p className="text-2xl font-black text-gray-900">{project?.fundingSought}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Fit Score</p>
                        <p className="text-2xl font-black text-emerald-600">8.4 / 10</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Available Documentation</h4>
                    <div className="flex gap-4">
                        {["Business Deck", "Technical Ledger", "Audit Q4"].map(doc => (
                            <button key={doc} className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all">
                                <FileText size={16} /> {doc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="p-8 border-none bg-gray-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20"><Info size={40} /></div>
                    <div className="space-y-6 relative">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Pre-Check Insight</p>
                            <h4 className="text-lg font-bold">Due Diligence Ready</h4>
                        </div>
                        <ul className="space-y-3">
                            {['Conflict-of-interest check passed', 'Primary KYC verified', 'Institutional node approved'].map((line, i) => (
                                <li key={i} className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    </motion.div>
);

const Step2DueDiligence = ({ assessment, setAssessment }) => {
    const categories = [
        { key: 'viability', label: 'Business Viability', desc: 'Market size, revenue model, and competitive edge.' },
        { key: 'team', label: 'Foundational Team', desc: 'Expertise, leadership, and execution scale.' },
        { key: 'risk', label: 'Risk Indices', desc: 'Regulatory, technical, and market barriers.' },
        { key: 'impact', label: 'Socio-Impact Pulse', desc: 'Sustainability and long-term ecosystem uplift.' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
        >
            <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">Assessment & Evaluation</h3>
                <p className="text-gray-500 font-medium">Quantify the venture across institutional performance vectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map(cat => (
                    <div key={cat.key} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">{cat.label}</h4>
                            <p className="text-xs text-gray-500 font-medium">{cat.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {[1, 2, 3, 4, 5].map(score => (
                                <button
                                    key={score}
                                    onClick={() => setAssessment({ ...assessment, [cat.key]: score })}
                                    className={`h-12 w-full rounded-xl font-black text-xs transition-all ${assessment[cat.key] === score ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'}`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const Step3DealStructure = ({ config, setConfig }) => {
    const models = [
        { id: 'equity', label: 'Equity Investment', icon: PieChart, color: 'text-blue-500 bg-blue-50' },
        { id: 'grant', label: 'Grant / CSR', icon: Gift, color: 'text-emerald-500 bg-emerald-50' },
        { id: 'revenue_share', label: 'Revenue Share', icon: TrendingUp, color: 'text-amber-500 bg-amber-50' },
        { id: 'sponsorship', label: 'Resource Support', icon: Package, color: 'text-indigo-500 bg-indigo-50' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
        >
            <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">Capital Deployment Model</h3>
                <p className="text-gray-500 font-medium">Select the structural framework for this institutional deal.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {models.map(model => (
                    <button
                        key={model.id}
                        onClick={() => setConfig({ ...config, model: model.id })}
                        className={`p-8 rounded-[2rem] flex flex-col items-center gap-6 transition-all border-2 ${config.model === model.id ? 'border-gray-900 bg-gray-50 shadow-2xl' : 'border-transparent bg-white ring-1 ring-gray-100 hover:ring-gray-300'}`}
                    >
                        <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center ${model.color}`}>
                            <model.icon size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900 text-center">{model.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-10 bg-gray-900 rounded-[2.5rem] text-white grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Configuration Ledger</p>
                    <div className="space-y-4">
                        <InputField
                            label="OBLIGATION AMOUNT (INR)"
                            value={config.amount}
                            onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                            className="bg-transparent border-gray-700 text-white placeholder-gray-500"
                        />
                        {config.model === 'equity' && (
                            <div className="flex gap-4">
                                <InputField label="EQUITY %" placeholder="e.g. 5" className="bg-transparent border-gray-700 text-white" />
                                <InputField label="VALUATION" placeholder="Pre-money" className="bg-transparent border-gray-700 text-white" />
                            </div>
                        )}
                        {config.model === 'revenue_share' && (
                            <div className="flex gap-4">
                                <InputField label="SHARE %" placeholder="e.g. 2" className="bg-transparent border-gray-700 text-white" />
                                <InputField label="RETURN CAP" placeholder="e.g. 2.5x" className="bg-transparent border-gray-700 text-white" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center p-8 border border-white/10 rounded-[2rem] bg-white/5">
                    <div className="text-center space-y-2">
                        <TrendingUp className="mx-auto text-emerald-400" size={32} />
                        <p className="text-xl font-bold">Estimated ROI Impact: High</p>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">PROJECTED SUSTAINABLE GROWTH: 24% PA</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Step4Terms = ({ config, setConfig }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-10"
    >
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">Legalities & Governance</h3>
                <p className="text-gray-500 font-medium">Fine-tune the contractual obligations and governance nodes.</p>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50">
                <Search size={14} className="mr-2" /> Auto-Verify Clauses
            </Button>
        </div>

        <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 space-y-8">
            <div className="space-y-6">
                <textarea
                    value={config.terms}
                    onChange={(e) => setConfig({ ...config, terms: e.target.value })}
                    className="w-full h-48 bg-white border border-gray-200 rounded-3xl p-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition-all"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Quarterly Reporting Pulse', 'Milestone-Locked Release', 'Dispute Resolution Hub', 'Confidentiality Matrix'].map(clause => (
                    <div key={clause} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-gray-100 italic text-xs font-bold text-gray-400">
                        <ShieldCheck size={18} className="text-emerald-500" /> {clause} Verified
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const Step5PaymentPlan = ({ config, setConfig }) => {
    const plans = [
        { id: 'One-Time', label: 'Lump Sum Settlement', desc: '100% disbursement upon contract activation.', icon: Zap },
        { id: 'Installments', label: 'Ecosystem Installments', desc: 'Split disbursement over a fixed periodic cycle.', icon: Calendar },
        { id: 'Milestone', label: 'Milestone-Locked', desc: 'Capital released only upon deliverable verification.', icon: Target }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
        >
            <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">Disbursement Strategy</h3>
                <p className="text-gray-500 font-medium">Define the financial flow mechanics and payment frequency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <button
                        key={plan.id}
                        onClick={() => setConfig({ ...config, paymentPlan: plan.id })}
                        className={`p-8 rounded-[2rem] text-left space-y-4 transition-all border-2 ${config.paymentPlan === plan.id ? 'border-gray-900 bg-gray-50 shadow-xl' : 'border-transparent bg-white ring-1 ring-gray-100 hover:ring-gray-300'}`}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${config.paymentPlan === plan.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <plan.icon size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">{plan.label}</h4>
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{plan.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {config.paymentPlan === 'Installments' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-gray-50 rounded-[2.5rem] flex items-center justify-between border border-gray-100">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Repayment/Split Logic</p>
                            <h4 className="text-xl font-bold text-gray-900">Define Cycle Quantity</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            {[3, 6, 12, 18].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setConfig({ ...config, installments: num })}
                                    className={`h-14 w-14 rounded-2xl font-black text-xs transition-all ${config.installments === num ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Step6Checkout = ({ project, config, onFinalize, loading }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-10 space-y-10"
    >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-[3rem] shadow-2xl overflow-hidden relative">
            {/* Razorpay-style Header */}
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Lock size={80} /></div>
                <div className="space-y-1 relative">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Checkout Secure</p>
                    <h4 className="text-xl font-extrabold uppercase tracking-tight italic">Udaan <span className="text-blue-200">Payment.</span></h4>
                </div>
                <div className="text-right relative">
                    <p className="text-[10px] font-black opacity-60 uppercase mb-1">TOTAL OBLIGATION</p>
                    <p className="text-2xl font-black">{config.amount}</p>
                </div>
            </div>

            <div className="p-10 space-y-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Deal Recipient</p>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black">{project?.name?.charAt(0)}</div>
                        <div>
                            <p className="text-sm font-black text-gray-900">{project?.name}</p>
                            <p className="text-[10px] font-bold text-gray-400">{project?.domain}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Select Payment Method</p>
                    <div className="space-y-3">
                        {['Institutional NetBanking', 'Corporate Credit Card', 'Ecosystem Wallet'].map((method, i) => (
                            <button key={method} className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${i === 0 ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`h-6 w-6 rounded-full border-4 ${i === 0 ? 'border-gray-900' : 'border-gray-100'}`} />
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">{method}</span>
                                </div>
                                {i === 1 && <CreditCard size={18} className="text-gray-400" />}
                                {i === 2 && <Smartphone size={18} className="text-gray-400" />}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={onFinalize}
                    disabled={loading}
                    className="w-full h-16 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest border-none shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Processing Securities...
                        </div>
                    ) : (
                        <>Authorize & Dispatch <ArrowRight size={20} /></>
                    )}
                </Button>

                <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase text-gray-300 tracking-[0.2em]">
                    <Lock size={12} /> SECURED VIA QUANTUM ENCRYPTION
                </div>
            </div>
        </div>
    </motion.div>
);

const Step7Success = ({ project, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-8"
    >
        <div className="h-24 w-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 animate-bounce">
            <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none italic">MISSION <span className="text-emerald-500">AUTHORIZED.</span></h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
                The institutional deal for <span className="text-gray-900 font-bold">{project.name}</span> has been executed. The project has been accelerated into the official funding cycle.
            </p>
        </div>
        <div className="flex gap-4 pt-10">
            <Button
                variant="white"
                className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg border-gray-100 flex items-center gap-3"
                onClick={() => toast.success("Downloading Signed Record...")}
            >
                <Download size={18} /> Download Record
            </Button>
            <Button
                onClick={onClose}
                className="h-14 px-10 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-xl transition-all active:scale-95"
            >
                Return to Dashboard
            </Button>
        </div>
    </motion.div>
);
