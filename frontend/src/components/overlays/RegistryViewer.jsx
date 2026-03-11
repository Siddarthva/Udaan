import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Database, Search, Filter, ShieldCheck, Users, Briefcase, BadgeDollarSign, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore, useFundingStore, useAuthStore } from '@/store/domainStores';
import { Badge, InputField, Card } from '@/components/ui';

export default function RegistryViewer() {
    const { closeOverlay, openOverlay } = useUIStore();
    const { projects } = useProjectStore();
    const { deals } = useFundingStore();
    const [activeTab, setActiveTab] = useState('projects'); // projects, users, deals
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = [
        { id: 'projects', label: 'Global Projects', icon: Briefcase, count: projects.length },
        { id: 'users', label: 'Ecosystem Users', icon: Users, count: 42 }, // Mock user count
        { id: 'deals', label: 'Active Funding', icon: BadgeDollarSign, count: deals.length }
    ];

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDeals = deals.filter(d =>
        d.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] bg-gray-900/40 backdrop-blur-xl flex justify-end"
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                className="w-full max-w-5xl bg-[#F8F9FA] h-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                            <Database size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Institutional Registry</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Ecosystem Data Node</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={closeOverlay} className="h-12 w-12 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Sub-header Controls */}
                <div className="px-10 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`h-12 px-6 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl translate-y-[-2px]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 max-w-sm ml-8">
                        <InputField
                            icon={Search}
                            placeholder="Filter registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border-gray-100 h-12 text-xs font-bold rounded-2xl"
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    {activeTab === 'projects' && (
                        <div className="space-y-4">
                            {filteredProjects.map(p => (
                                <Card key={p.id} className="p-6 border-none bg-white hover:shadow-xl transition-all group rounded-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[1.2rem] overflow-hidden">
                                                <img src={p.image} className="h-full w-full object-cover" alt={p.title} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900">{p.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge className="bg-gray-100 text-gray-500 border-none text-[8px] font-black uppercase">{p.domain}</Badge>
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none text-[8px] font-black uppercase">{p.stage}</Badge>
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2">• Founder: {p.founder}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => openOverlay('DOSSIER_VIEWER', p)}
                                            variant="ghost" className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 flex items-center gap-2"
                                        >
                                            View Node <ArrowUpRight size={16} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'deals' && (
                        <div className="space-y-4">
                            {filteredDeals.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                                        <BadgeDollarSign size={40} />
                                    </div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No active funding deals in registry</p>
                                </div>
                            ) : (
                                filteredDeals.map(d => (
                                    <Card key={d.id} className="p-8 border-none bg-white rounded-[2.5rem] space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Deal ID: {d.id}</p>
                                                <h3 className="text-xl font-black text-gray-900">{d.projectName}</h3>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase px-4 py-1">{d.status}</Badge>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Quantum</p>
                                                <p className="text-sm font-black text-gray-900">₹{d.amount}L</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Mechanism</p>
                                                <p className="text-sm font-black text-gray-900">{d.type}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Terms</p>
                                                <p className="text-sm font-black text-gray-900">{d.terms}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Agreement</p>
                                                <p className="text-xs font-bold text-gray-400 italic underline">View SEC-12</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="grid grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Card key={i} className="p-6 border-none bg-white rounded-3xl flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 text-sm">U{i}</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">Ecosystem Node {i}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role: {['Innovator', 'Mentor', 'Sponsor'][i % 3]}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Analysis Area */}
                <div className="p-8 bg-gray-900 text-white rounded-t-[3rem]">
                    <div className="flex justify-between items-center px-6">
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Capital Allocated</p>
                                <p className="text-2xl font-black tabular-nums">₹1,442.20L</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">System Capacity</p>
                                <p className="text-2xl font-black tabular-nums">92.4%</p>
                            </div>
                        </div>
                        <Button className="h-14 px-10 bg-white text-gray-900 border-none rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                            Export Full Registry Report
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
