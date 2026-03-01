import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Activity, AlertCircle, FileText, Download, CheckCircle2, Zap, BarChart3, TrendingUp } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useGovernanceStore } from '../../store/domainStores';
import { Badge, Button, Card } from '../ui';
import toast from 'react-hot-toast';

export default function ComplianceConsole() {
    const { closeOverlay } = useUIStore();
    const { complianceChecks, auditLogs } = useGovernanceStore();
    const [isSimulating, setIsSimulating] = useState(false);

    const runSystemHealthCheck = () => {
        setIsSimulating(true);
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 3000)),
            {
                loading: 'Initializing Deep System Scan...',
                success: 'Platform Health: 98.4% - All nodes operational.',
                error: 'Scan interuppted.'
            }
        ).finally(() => setIsSimulating(false));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] bg-gray-900/60 backdrop-blur-xl flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Institutional Header */}
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gray-900 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl ring-4 ring-gray-100">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Governance Console</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3">System Online</Badge>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">• Global Compliance v2.4-stable</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={runSystemHealthCheck}
                            disabled={isSimulating}
                            className="h-14 px-8 bg-gray-900 text-white border-none rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3"
                        >
                            <Activity size={18} className={isSimulating ? 'animate-spin' : ''} /> Run Health Scan
                        </Button>
                        <button onClick={closeOverlay} className="h-14 w-14 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all">
                            <X size={28} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                    {/* High-Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 border-none bg-indigo-50/50 ring-1 ring-indigo-100/50 rounded-[3rem] space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <TrendingUp size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Compliance Score</span>
                            </div>
                            <p className="text-5xl font-black text-indigo-950">98.2<span className="text-lg opacity-40 ml-1">%</span></p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase leading-relaxed font-mono">+0.4% improvement since last audit</p>
                        </Card>
                        <Card className="p-8 border-none bg-rose-50/50 ring-1 ring-rose-100/50 rounded-[3rem] space-y-4">
                            <div className="flex items-center gap-2 text-rose-400">
                                <AlertCircle size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Active Violations</span>
                            </div>
                            <p className="text-5xl font-black text-rose-950">02</p>
                            <p className="text-[10px] font-bold text-rose-400 uppercase leading-relaxed font-mono">Both categorized as MINOR / NON-CRITICAL</p>
                        </Card>
                        <Card className="p-8 border-none bg-emerald-50/50 ring-1 ring-emerald-100/50 rounded-[3rem] space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Data Integrity</span>
                            </div>
                            <p className="text-5xl font-black text-emerald-950">100<span className="text-lg opacity-40 ml-1">%</span></p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase leading-relaxed font-mono">Blockchain audit trail verified 4m ago</p>
                        </Card>
                    </div>

                    {/* Active Compliance Nodes */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-[10px] font-black uppercase text-gray-900 tracking-[0.3em]">Regulatory Alignment Pipeline</h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase text-gray-400 tracking-widest">View History</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {complianceChecks.map(check => (
                                <Card key={check.id} className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${check.priority === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400'}`}>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-gray-900 leading-none">{check.title}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge className="bg-gray-100 text-gray-500 border-none font-black text-[8px] uppercase">{check.status}</Badge>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Due: {check.due}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-gray-50 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                        <Zap size={16} />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Operational Risk Radar Simulation (Placeholder visual) */}
                    <div className="p-10 bg-gray-900 rounded-[3.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="space-y-4 max-w-sm text-center md:text-left">
                                <h3 className="text-2xl font-black text-white leading-tight">Institutional Scenario Pulse</h3>
                                <p className="text-sm text-gray-400 font-medium">Simulate ecosystem shocks and regulatory pivots to assess portfolio resilience.</p>
                                <div className="flex gap-4 pt-4 justify-center md:justify-start">
                                    <Button className="h-12 px-6 bg-white text-gray-900 border-none rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                        Launch Simulation
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-12 text-center">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Liquidity Burn</p>
                                    <p className="text-3xl font-black text-white">4.2<span className="text-base opacity-40 ml-1">mo</span></p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Ecosystem Health</p>
                                    <p className="text-3xl font-black text-emerald-400">OPTIMAL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white" />)}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compliance Team Active Now</p>
                    </div>
                    <Button
                        onClick={() => toast.success("Generating Governance Report...")}
                        className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all"
                    >
                        <Download size={18} /> Download Comprehensive Compliance PDF
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
