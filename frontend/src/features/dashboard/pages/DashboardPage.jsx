import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../auth/context/AuthContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { TrendingUp, Target, ArrowUpRight, Zap, Users, Plus, LayoutGrid, Calendar } from "lucide-react";
import { AnimatedSection, StaggerContainer } from "../../../components/animation/MotionSystem";

const StatCard = ({ label, val, icon: Icon, color, delay }) => (
    <AnimatedSection delay={delay} direction="up" className="h-full">
        <Card className="p-8 h-full border-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-700 bg-white group cursor-pointer">
            <div className="flex items-center justify-between mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color}`}>
                    <Icon size={24} />
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight size={18} />
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                <p className="text-4xl font-bold font-serif text-[#2F2F2F]">{val}</p>
            </div>
        </Card>
    </AnimatedSection>
);

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="pb-20">
            {/* Welcome Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 px-2">
                <AnimatedSection direction="down" className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#2F2F2F]">
                        Hello, <span className="text-gray-400/50">{user?.name?.split(' ')[0]}.</span>
                    </h1>
                    <p className="text-gray-500 text-xl max-w-xl mt-4 leading-relaxed font-medium">
                        Your venture trajectory is currently <span className="text-[#2F2F2F] italic">exceeding projections</span> by 12%.
                    </p>
                </AnimatedSection>

                <AnimatedSection direction="left" className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 group flex items-center gap-2">
                        <Calendar size={18} className="text-gray-400 group-hover:text-black transition-colors" /> Schedules
                    </Button>
                    <Button className="h-14 px-8 rounded-2xl bg-[#2F2F2F] shadow-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                        <Plus size={20} /> Launch New Node
                    </Button>
                </AnimatedSection>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <StatCard label="Network Score" val="942" icon={Target} color="text-blue-600 bg-blue-50" delay={0.1} />
                <StatCard label="Ecosystem" val="12.4k" icon={Users} color="text-purple-600 bg-purple-50" delay={0.2} />
                <StatCard label="Active Nodes" val="13" icon={Zap} color="text-amber-600 bg-amber-50" delay={0.3} />
                <StatCard label="Growth Rate" val="+24%" icon={TrendingUp} color="text-green-600 bg-green-50" delay={0.4} />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                <AnimatedSection className="lg:col-span-2" delay={0.5}>
                    <Card className="p-10 h-[450px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] bg-white overflow-hidden relative group">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-bold text-[#2F2F2F] mb-1">Performance Trajectory</h3>
                                <p className="text-sm font-medium text-gray-400">Momentum audit for Q1 2026</p>
                            </div>
                            <div className="flex gap-2">
                                {['D', 'W', 'M', 'Y'].map(t => (
                                    <button key={t} className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all ${t === 'M' ? 'bg-[#2F2F2F] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-center relative overflow-hidden h-[250px]">
                            <svg className="w-full h-full px-4" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#2F2F2F" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#2F2F2F" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    d="M0,80 Q50,70 100,50 T150,65 T200,45 T250,55 T300,30 T350,40 T400,15"
                                    fill="none"
                                    stroke="#2F2F2F"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                />
                                <motion.path
                                    d="M0,80 Q50,70 100,50 T150,65 T200,45 T250,55 T300,30 T350,40 T400,15 V100 H0 Z"
                                    fill="url(#chartGradient)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 1.5 }}
                                />
                            </svg>
                            <div className="absolute inset-x-8 bottom-8 flex justify-between">
                                {['JAN', 'FEB', 'MAR', 'APR'].map(m => (
                                    <span key={m} className="text-[9px] font-black text-gray-400 tracking-widest">{m}</span>
                                ))}
                            </div>
                        </div>
                    </Card>
                </AnimatedSection>

                <AnimatedSection delay={0.6}>
                    <Card className="p-10 h-[450px] border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] bg-[#2F2F2F] text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                            <LayoutGrid size={200} />
                        </div>
                        <div className="h-24 w-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10 group-hover:rotate-12 transition-all">
                            <Target size={40} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold mb-4 italic">Next Milestone</h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-[200px]">
                            Secure the 'Lead Mentor' badge by sharing 3 more insights this week.
                        </p>
                        <Button className="w-full h-14 bg-white text-[#2F2F2F] font-bold rounded-2xl hover:bg-gray-100 transition-all">
                            View Roadmap
                        </Button>
                    </Card>
                </AnimatedSection>
            </div>
        </div>
    );
}
