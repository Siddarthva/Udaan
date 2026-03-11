import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Target, Cpu, Users, BadgeDollarSign, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore, useGovernanceStore } from '@/store/domainStores';
import { Button, InputField, Badge } from '@/components/ui';
import toast from 'react-hot-toast';

const STEPS = [
    { id: 'identity', title: 'Venture Identity', icon: Rocket },
    { id: 'domain', title: 'Domain & Impact', icon: Target },
    { id: 'tech', title: 'Technology Level', icon: Cpu },
    { id: 'team', title: 'Team & Capital', icon: Users },
    { id: 'review', title: 'Institutional Review', icon: AlertTriangle }
];

export default function VentureWizard() {
    const { closeOverlay, addNotification } = useUIStore();
    const { addProject } = useProjectStore();
    const { addLog } = useGovernanceStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: 'AgriTech',
        stage: 'Seed',
        trl: 'Level 4',
        teamSize: 1,
        fundingNeeded: 50,
        riskProfile: 'Medium'
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const newProject = {
            ...formData,
            id: `proj_${Date.now()}`,
            founder: 'Current User',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
            trending_score: 0,
            equity: 10,
            target: formData.fundingNeeded
        };

        addProject(newProject);
        addLog({
            action: 'Venture Creation',
            user: 'Innovator Node',
            status: 'Success',
            details: `New venture "${formData.title}" initialized in the ecosystem.`
        });
        addNotification({
            type: 'SUCCESS',
            message: `Venture "${formData.title}" successfully registered.`,
            project: formData.title
        });

        toast.success("Venture Node Initialized!");
        closeOverlay();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Project Name</label>
                            <InputField
                                placeholder="E.g. Lunar Core"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-14 rounded-2xl border-gray-100 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Executive Summary</label>
                            <textarea
                                placeholder="Core mission and objective..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-4 h-32 rounded-2xl border border-gray-100 focus:border-gray-900 outline-none transition-all font-medium text-sm resize-none"
                            />
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            {['AgriTech', 'HealthTech', 'CleanTech', 'FinTech', 'DeepTech', 'EdTech'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFormData({ ...formData, domain: cat })}
                                    className={`h-16 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-widest ${formData.domain === cat ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 hover:border-gray-200 text-gray-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] text-center">Current Technology Readiness</p>
                            <div className="flex justify-between items-center px-4">
                                {[3, 4, 5, 6, 7].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setFormData({ ...formData, trl: `Level ${lvl}` })}
                                        className={`h-12 w-12 rounded-xl flex items-center justify-center font-black transition-all ${formData.trl === `Level ${lvl}` ? 'bg-gray-900 text-white scale-110' : 'bg-white text-gray-400 border border-gray-100'}`}
                                    >
                                        L{lvl}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 font-medium text-center italic">Level {formData.trl.split(' ')[1]} indicates prototype validation in laboratory/relevant environment.</p>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Funding Goal (EMI)</label>
                                <InputField
                                    type="number"
                                    placeholder="50"
                                    value={formData.fundingNeeded}
                                    onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                                    className="h-14 rounded-2xl font-bold"
                                />
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Amount in Lakhs (₹)</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Initial Team Size</label>
                                <InputField
                                    type="number"
                                    placeholder="3"
                                    value={formData.teamSize}
                                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                                    className="h-14 rounded-2xl font-bold"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-4">
                        <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ecosystem Ready</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Your venture identity is compliant with institutional standards. Ready for ecosystem deployment.</p>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Project</span>
                                <span className="text-sm font-bold text-gray-900">{formData.title || 'Untitled'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Capital Request</span>
                                <span className="text-sm font-bold text-gray-900">₹{formData.fundingNeeded}L</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Risk Index</span>
                                <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[8px] uppercase">{formData.riskProfile}</Badge>
                            </div>
                        </div>
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
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                            {(() => {
                                const Icon = STEPS[currentStep].icon;
                                return Icon ? <Icon size={24} /> : null;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Launch Venture</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
                        </div>
                    </div>
                    <button onClick={closeOverlay} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        className="h-full bg-gray-900"
                    />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-10 no-scrollbar min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {currentStep === STEPS.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Deploy to Ecosystem
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Continue <ChevronRight size={16} className="ml-2" />
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
