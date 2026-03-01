import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, TrendingDown, Target, Activity, ShieldCircle, PieChart } from 'lucide-react';
import { Button, Card, Badge } from '../ui';

export default function ScenarioSimulator({ onClose }) {
    const [marketShift, setMarketShift] = useState(0);
    const [liquidityStress, setLiquidityStress] = useState(20);
    const [impactMultiplier, setImpactMultiplier] = useState(1);

    const projectedROI = (28.4 + (marketShift * 0.5) - (liquidityStress * 0.1)).toFixed(1);
    const impactScore = (85 * impactMultiplier).toFixed(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-2xl" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="relative bg-white w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.4)] flex flex-col md:flex-row"
            >
                {/* Lateral Control Panel */}
                <div className="w-full md:w-[380px] bg-gray-900 p-12 flex flex-col gap-12 text-white">
                    <div className="space-y-4">
                        <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <Zap size={28} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-tight">Scenario Radar</h2>
                        <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-widest">Global Market Stress Test Engine v2.4</p>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Market Alpha Shift</label>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-2 py-0.5 text-[10px]">{marketShift > 0 ? '+' : ''}{marketShift}%</Badge>
                            </div>
                            <input
                                type="range" min="-20" max="20" value={marketShift}
                                onChange={(e) => setMarketShift(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Liquidity Friction</label>
                                <Badge className="bg-rose-500/10 text-rose-400 border-none px-2 py-0.5 text-[10px]">{liquidityStress}%</Badge>
                            </div>
                            <input
                                type="range" min="0" max="100" value={liquidityStress}
                                onChange={(e) => setLiquidityStress(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESG Impact Gearing</label>
                                <Badge className="bg-blue-500/10 text-blue-400 border-none px-2 py-0.5 text-[10px]">x{impactMultiplier.toFixed(1)}</Badge>
                            </div>
                            <div className="flex gap-2">
                                {[1, 1.5, 2, 3].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setImpactMultiplier(m)}
                                        className={`flex-1 h-10 rounded-xl text-[10px] font-black transition-all ${impactMultiplier === m ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        x{m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <Button className="w-full h-14 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl border-none">
                            Execute Stress Test
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white">
                            Discard Simulation
                        </Button>
                    </div>
                </div>

                {/* Main Results Engine */}
                <div className="flex-1 bg-white p-12 flex flex-col gap-12 overflow-y-auto no-scrollbar">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-gray-100 text-gray-400 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em]">Projection Hub</Badge>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Activity size={12} className="text-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Real-time Compute Engine Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-10 border-none bg-gray-50 rounded-[3rem] space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-bl-[100px] -mr-16 -mt-16 transition-all group-hover:bg-emerald-200/50" />
                            <div className="relative space-y-4">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Projected Annual ROI</p>
                                <div className="flex items-end gap-3">
                                    <h4 className="text-6xl font-black text-gray-900 tracking-tighter">{projectedROI}%</h4>
                                    <TrendingUp className="text-emerald-500 mb-2" size={24} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">+4.2% from Baseline</p>
                            </div>
                        </Card>

                        <Card className="p-10 border-none bg-gray-50 rounded-[3rem] space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-bl-[100px] -mr-16 -mt-16 transition-all group-hover:bg-blue-200/50" />
                            <div className="relative space-y-4">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Institutional Impact Score</p>
                                <div className="flex items-end gap-3">
                                    <h4 className="text-6xl font-black text-gray-900 tracking-tighter">{impactScore} <span className="text-2xl text-gray-400 italic">/ 100</span></h4>
                                    <Target className="text-blue-500 mb-2" size={24} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Classified: Platinum Tier</p>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Portfolio Exposure Map</h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Reset Model</Button>
                        </div>

                        <div className="space-y-6">
                            {[
                                { name: 'CleanTech Series A', weight: 40, risk: 'Low', color: 'emerald' },
                                { name: 'AgriTech Seed Node', weight: 25, risk: 'Medium', color: 'amber' },
                                { name: 'DeepTech Quantum Core', weight: 35, risk: 'High', color: 'rose' }
                            ].map((p, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                                            <Badge className={`bg-${p.color}-50 text-${p.color}-600 border-none text-[8px] uppercase font-black`}>{p.risk} Risk</Badge>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.weight}% Allocation</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${p.weight}%` }}
                                            className={`h-full bg-${p.color}-500 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-10 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-6">
                            <div className="h-14 w-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShieldCircle size={24} />
                            </div>
                            <div>
                                <h5 className="font-black text-indigo-900 uppercase text-[10px] tracking-widest mb-1">Compliance Intelligence Advisory</h5>
                                <p className="text-xs font-medium text-indigo-700 leading-relaxed">System detects no regulatory breaches under current parameters.</p>
                            </div>
                        </div>
                        <ChevronRight className="text-indigo-300 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ChevronRight({ className, size = 20 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
    )
}
