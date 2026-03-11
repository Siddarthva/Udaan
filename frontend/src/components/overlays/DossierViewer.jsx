import React from 'react';
import { motion } from 'framer-motion';
import { X, FileSearch, Download, Share2, ShieldCheck, Zap, Target, Activity } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

export default function DossierViewer({ data, onClose }) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8"
        >
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                            <FileSearch size={32} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{data.status || 'Verified'}</Badge>
                                <span className="h-1.5 w-1.5 bg-gray-200 rounded-full" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ref: {data.id || 'DOS-772'}</p>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{data.title || 'Institutional Intelligence Dossier'}</h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="white" className="h-14 w-14 p-0 rounded-2xl border-gray-100 shadow-sm hover:bg-gray-50">
                            <Download size={20} className="text-gray-400" />
                        </Button>
                        <Button variant="white" className="h-14 w-14 p-0 rounded-2xl border-gray-100 shadow-sm hover:bg-gray-50">
                            <Share2 size={20} className="text-gray-400" />
                        </Button>
                        <button onClick={onClose} className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-10 bg-gray-50/30">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Major Analysis Block */}
                        <div className="lg:col-span-2 space-y-10">
                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-2">
                                    <Target size={14} className="text-gray-900" /> Executive Summary
                                </h3>
                                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
                                    <p className="text-gray-600 font-medium leading-relaxed text-lg italic">
                                        "{data.findings || 'Comprehensive cross-node validation confirms high scalability and institutional alignment for this innovation track.'}"
                                    </p>
                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opportunity Delta</p>
                                            <p className="text-xl font-black text-emerald-600">{data.opportunity || 'High Potential'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Index</p>
                                            <p className="text-xl font-black text-gray-900">{data.riskFlags || 0} Critical Flags</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Strategic Actions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 border-none bg-white rounded-[2rem] shadow-sm space-y-4">
                                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Activity size={20} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Scale Deployment</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">Initiate horizontal scaling across secondary institutional nodes immediately.</p>
                                    </Card>
                                    <Card className="p-8 border-none bg-white rounded-[2rem] shadow-sm space-y-4">
                                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Compliance Sync</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">Verify IFRS 17 alignment and trigger regulatory reporting cycle.</p>
                                    </Card>
                                </div>
                            </section>
                        </div>

                        {/* Side Stats */}
                        <div className="space-y-10">
                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Metrics Node</h3>
                                <Card className="p-10 border-none bg-gray-900 text-white rounded-[3rem] shadow-2xl space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Innovation Score</p>
                                        <div className="flex items-end gap-3">
                                            <span className="text-5xl font-black italic">8.9</span>
                                            <span className="text-gray-400 font-bold mb-1">/ 10</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="space-y-4 text-center">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Public Interest</p>
                                        <div className="flex justify-between items-center text-xs font-bold px-4">
                                            <span>Institutional</span>
                                            <div className="h-1 w-20 bg-emerald-400 rounded-full" />
                                            <span>Global</span>
                                        </div>
                                    </div>
                                    <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest mt-4">
                                        Recalibrate Edge Node
                                    </Button>
                                </Card>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-10 bg-white border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white" />)}
                        </div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Validated by 3 Core Analysts</p>
                    </div>
                    <Button
                        onClick={onClose}
                        className="h-14 px-12 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Close Dossier
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
