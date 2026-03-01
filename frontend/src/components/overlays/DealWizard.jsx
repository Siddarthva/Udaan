import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BadgeDollarSign, LayoutGrid, ScrollText, CalendarDays, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore, useFundingStore, useGovernanceStore } from '../../store/domainStores';
import { Button, Badge, InputField } from '../ui';
import toast from 'react-hot-toast';

const STEPS = [
    { id: 'select', title: 'Target Selection', icon: LayoutGrid },
    { id: 'mode', title: 'Funding Mode', icon: BadgeDollarSign },
    { id: 'structure', title: 'Deal Structure', icon: ScrollText },
    { id: 'schedule', title: 'Capital Lifecycle', icon: CalendarDays },
    { id: 'review', title: 'Institutional Agreement', icon: CheckCircle2 }
];

export default function DealWizard() {
    const { closeOverlay, addNotification } = useUIStore();
    const { projects } = useProjectStore();
    const { initiateDeal } = useFundingStore();
    const { addLog } = useGovernanceStore();
    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        type: 'Equity',
        amount: 50,
        equity: 5,
        terms: 'Bullet Repayment',
        installments: 12,
        milestones: 4
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const deal = {
            ...formData,
            id: `deal_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Proposed'
        };

        initiateDeal(deal);
        addLog({
            action: 'Funding Deal Proposed',
            user: 'Sponsor Node',
            status: 'Success',
            details: `Proposed ₹${formData.amount}L deal for ${formData.projectName} (${formData.type}).`
        });
        addNotification({
            type: 'CAPITAL',
            message: `New funding proposal sent to ${formData.projectName}.`,
            project: formData.projectName
        });

        toast.success("Funding Protocol Initiated!");
        closeOverlay();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Select Institutional Project</label>
                        <div className="grid grid-cols-1 gap-3">
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setFormData({ ...formData, projectId: p.id, projectName: p.title })}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${formData.projectId === p.id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{p.title}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.domain} • {p.stage}</p>
                                        </div>
                                        <ArrowRight size={18} className={formData.projectId === p.id ? 'text-gray-900' : 'text-gray-200'} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 1:
                const modes = [
                    { id: 'Equity', desc: 'Ownership stake in venture' },
                    { id: 'Grant', desc: 'Non-dilutive institutional support' },
                    { id: 'CSR', desc: 'Social responsibility capital' },
                    { id: 'Revenue Share', desc: 'Return on future earnings' }
                ];
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        {modes.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setFormData({ ...formData, type: mode.id })}
                                className={`w-full p-6 rounded-3xl border-2 text-left flex items-start gap-4 transition-all ${formData.type === mode.id ? 'border-gray-900 bg-gray-50 shadow-lg shadow-black/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${formData.type === mode.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <BadgeDollarSign size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">{mode.id}</p>
                                    <p className="text-[10px] font-medium text-gray-400">{mode.desc}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Investment Quantum (Lakhs)</label>
                            <div className="flex items-center gap-6">
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    step="10"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                                    className="flex-1 accent-gray-900"
                                />
                                <div className="h-14 w-32 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black">
                                    ₹{formData.amount}L
                                </div>
                            </div>
                        </div>
                        {formData.type === 'Equity' && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Equity Stake (%)</label>
                                <InputField
                                    type="number"
                                    value={formData.equity}
                                    onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                                    className="h-14 rounded-2xl font-bold"
                                />
                            </div>
                        )}
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="p-8 bg-indigo-50/50 rounded-[3rem] border border-indigo-100/50 space-y-6">
                            <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest text-center">Capital Disbursement Nodes</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Installments</label>
                                    <select
                                        value={formData.installments}
                                        onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                                        className="w-full h-12 bg-white rounded-xl border border-indigo-200 px-4 text-xs font-bold outline-none"
                                    >
                                        <option value="1">Lump Sum</option>
                                        <option value="6">6 Months</option>
                                        <option value="12">12 Months (Standard)</option>
                                        <option value="24">24 Months</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Audit Milestones</label>
                                    <select
                                        value={formData.milestones}
                                        onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                                        className="w-full h-12 bg-white rounded-xl border border-indigo-200 px-4 text-xs font-bold outline-none"
                                    >
                                        <option value="2">2 Gates</option>
                                        <option value="4">4 Gates (Quarterly)</option>
                                        <option value="8">8 Gates</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                        <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                            <ScrollText size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Consolidated Agreement</h3>

                        <div className="bg-white border border-gray-100 rounded-[3rem] p-8 text-left space-y-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[80px] -mr-16 -mt-16" />
                            <div className="relative">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Draft Proposal Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase">Target Project</span>
                                        <span className="text-xs font-bold text-gray-900">{formData.projectName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase">Capital Pool</span>
                                        <span className="text-xs font-bold text-gray-900">₹{formData.amount}L</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase">Mechanism</span>
                                        <Badge className="bg-gray-900 text-white font-black text-[8px] uppercase border-none">{formData.type}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] font-medium text-gray-400 px-8 leading-relaxed">By deploying, you initiate a legal binding offer under ecosystem governance protocols.</p>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                            {(() => {
                                const Icon = STEPS[currentStep].icon;
                                return Icon ? <Icon size={24} /> : null;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Funding Protocol</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
                        </div>
                    </div>
                    <button onClick={closeOverlay} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="h-1.5 w-full bg-gray-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        className="h-full bg-gray-900"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-10 no-scrollbar min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    {currentStep === 0 && !formData.projectId ? (
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Select target project to proceed</div>
                    ) : null}

                    <div className="flex gap-4">
                        {currentStep === STEPS.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Deploy Agreement
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={currentStep === 0 && !formData.projectId}
                                className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                Next Strategy <ChevronRight size={16} className="ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
