import React from 'react';
import { motion } from 'framer-motion';
import { X, Globe, MapPin, Zap, Target, ShieldCheck, Activity } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/domainStores';
import { Badge, Button } from '@/components/ui';

export default function ImpactMap() {
    const { closeOverlay } = useUIStore();
    const { projects } = useProjectStore();

    // Mock geographic clusters
    const clusters = [
        { name: 'Bangalore Innovation Hub', projects: projects.slice(0, 3) },
        { name: 'Hyderabad Deep-Tech Node', projects: projects.slice(3, 5) },
        { name: 'Pune Clean-Energy Cluster', projects: [] }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] bg-gray-900/60 backdrop-blur-2xl flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-6xl bg-[#0F1115] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/10"
            >
                {/* HUD Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-indigo-500 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Globe size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Impact Strategy Analytics</h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Geospatial Capital Allocation Map</p>
                        </div>
                    </div>
                    <button onClick={closeOverlay} className="h-12 w-12 hover:bg-white/5 rounded-2xl flex items-center justify-center transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Metrics */}
                    <div className="w-80 border-r border-white/5 p-10 space-y-12 overflow-y-auto no-scrollbar">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Density</label>
                            <p className="text-4xl font-black text-white">{projects.length}</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase">Active Nodes</p>
                        </div>
                        <div className="space-y-8">
                            {['AgriTech', 'CleanTech', 'HealthTech'].map(sector => (
                                <div key={sector} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{sector}</p>
                                        <p className="text-xs font-black text-white">42%</p>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '42%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-10">
                            <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-4">
                                <Activity size={24} className="text-indigo-400" />
                                <p className="text-[10px] font-black text-gray-400 uppercase leading-relaxed">System scan suggests increasing allocation to Tier-2 clusters.</p>
                            </Card>
                        </div>
                    </div>

                    {/* Center: The Map (Simulated with visual flair) */}
                    <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#1a1d23_0%,_#0f1115_100%)] overflow-hidden">
                        {/* Grid lines */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Simulated Nodes */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative h-[500px] w-[500px]">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{
                                            duration: 3 + i,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute h-4 w-4 bg-indigo-500 rounded-full blur-sm"
                                        style={{
                                            top: `${20 + i * 15}%`,
                                            left: `${30 + i * 10}%`
                                        }}
                                    />
                                ))}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                                    <Globe size={180} className="text-white/5 animate-pulse" />
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">National Core Active</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* HUD Elements */}
                        <div className="absolute bottom-10 left-10 p-6 bg-[#1a1d23]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] w-64 space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-indigo-400" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Cluster</p>
                            </div>
                            <h4 className="text-sm font-bold text-white">Pune Smart-Energy Node</h4>
                            <p className="text-[10px] text-gray-500 font-medium">8 Ventures • 4 CSR Grants • 12 Mentors</p>
                        </div>
                    </div>

                    {/* Right Panel: Clusters */}
                    <div className="w-96 border-l border-white/5 p-10 space-y-10 overflow-y-auto no-scrollbar">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cluster Intelligence</h3>
                        <div className="space-y-4">
                            {clusters.map((cluster, i) => (
                                <div key={i} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{cluster.name}</h4>
                                        <Badge className="bg-indigo-500/10 text-indigo-400 border-none text-[8px] font-black">ACTIVE</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {cluster.projects.length > 0 ? (
                                            cluster.projects.map(p => (
                                                <div key={p.id} className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                                                    <span>{p.title}</span>
                                                    <span className="text-gray-700">₹{p.target}L</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[9px] text-gray-700 italic">No direct ventures in this node.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Analysis Area */}
                <div className="p-10 bg-white/5 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Network Stability</p>
                            <p className="text-2xl font-black text-white">99.8%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ecosystem Density</p>
                            <p className="text-2xl font-black text-indigo-400">HIGH</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="h-12 px-6 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all">
                            Refresh HUD
                        </Button>
                        <Button className="h-14 px-10 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                            Export Geospatial Analytics
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
