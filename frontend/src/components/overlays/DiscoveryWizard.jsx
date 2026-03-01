import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SearchCode, Target, ListTodo, Calendar, Rocket, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore, useTaskStore, useGovernanceStore } from '../../store/domainStores';
import { Button, Badge } from '../ui';
import toast from 'react-hot-toast';

const STEPS = [
    { id: 'select', title: 'Operational Node', icon: Rocket },
    { id: 'focus', title: 'Discovery Logic', icon: Target },
    { id: 'tasks', title: 'Task Generation', icon: ListTodo },
    { id: 'timeline', title: 'Tempo & Strategy', icon: Calendar }
];

export default function DiscoveryWizard() {
    const { closeOverlay, addNotification } = useUIStore();
    const { projects } = useProjectStore();
    const { addDiscoverySprint } = useTaskStore();
    const { addLog } = useGovernanceStore();
    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        focusAreas: [],
        timeline: 'Standard (4 Weeks)',
        depth: 'Standard'
    });

    const toggleArea = (area) => {
        setFormData(prev => ({
            ...prev,
            focusAreas: prev.focusAreas.includes(area)
                ? prev.focusAreas.filter(a => a !== area)
                : [...prev.focusAreas, area]
        }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        addDiscoverySprint(formData.projectId, formData.focusAreas);
        addLog({
            action: 'Discovery Sprint Initiated',
            user: 'Innovator Node',
            status: 'Success',
            details: `Started deep-dive research for ${formData.projectName} across ${formData.focusAreas.length} nodes.`
        });
        addNotification({
            type: 'DISCOVERY',
            message: `Discovery sprint initialized for ${formData.projectName}.`,
            project: formData.projectName
        });

        toast.success("Operational Deep-Dive Initialized!");
        closeOverlay();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Operational Project Node</label>
                        <div className="grid grid-cols-1 gap-3">
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setFormData({ ...formData, projectId: p.id, projectName: p.title })}
                                    className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${formData.projectId === p.id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <h3 className="text-sm font-black text-gray-900">{p.title}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{p.domain} • {p.stage}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 1:
                const areas = ['Market Dynamics', 'Technology Validation', 'Regulatory Compliance', 'Escalation Risks', 'Competitive Node Analysis'];
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 gap-4">
                        {areas.map(area => (
                            <button
                                key={area}
                                onClick={() => toggleArea(area)}
                                className={`p-6 rounded-[2rem] border-2 text-left flex justify-between items-center transition-all ${formData.focusAreas.includes(area) ? 'border-gray-900 bg-gray-50 shadow-lg shadow-black/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <span className={`text-xs font-black uppercase tracking-widest ${formData.focusAreas.includes(area) ? 'text-gray-900' : 'text-gray-400'}`}>{area}</span>
                                {formData.focusAreas.includes(area) && <CheckCircle2 size={16} className="text-gray-900" />}
                            </button>
                        ))}
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Generated Task Pipeline</h4>
                            <div className="space-y-3">
                                {formData.focusAreas.length === 0 ? (
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center py-10">No focus areas selected</p>
                                ) : (
                                    formData.focusAreas.map((area, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                                            <div className="h-8 w-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-[10px]">T{i + 1}</div>
                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{area} Study</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                        <div className="h-20 w-20 bg-indigo-50 text-indigo-500 rounded-[2.5rem] flex items-center justify-center mx-auto">
                            <Calendar size={32} />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sprint Tempo</label>
                            <div className="flex gap-4">
                                {['Blitz (2W)', 'Standard (4W)', 'Deep (8W)'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData({ ...formData, timeline: t })}
                                        className={`flex-1 h-14 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.timeline === t ? 'border-gray-900 bg-gray-900 text-white shadow-xl' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-[2.5rem] text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Configuration Summary</p>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Target</span>
                                <span className="text-xs font-bold text-gray-900">{formData.projectName || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Focus Nodes</span>
                                <span className="text-xs font-bold text-gray-900">{formData.focusAreas.length}</span>
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
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                            {(() => {
                                const Icon = STEPS[currentStep].icon;
                                return Icon ? <Icon size={24} /> : null;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Discovery Strategy</h2>
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

                <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    <div className="flex gap-4">
                        {currentStep === STEPS.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Deploy Discovery Node
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={currentStep === 0 && !formData.projectId}
                                className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                Continue <ChevronRight size={16} className="ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
