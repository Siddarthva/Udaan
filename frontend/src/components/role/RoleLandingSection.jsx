import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Shield, Users, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export const RoleLandingSection = () => {
    const [activeTab, setActiveTab] = useState("innovators");
    const navigate = useNavigate();

    const segments = {
        innovators: {
            title: "Build the Future",
            subtitle: "For Innovators",
            icon: Rocket,
            color: "text-blue-500",
            bgClass: "bg-blue-50",
            description: "Transform your visionary ideas into funded, scaled startups. Connect with world-class mentors and secure flash funding without the bureaucracy.",
            cta: "Launch Startup",
            imgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
        },
        sponsors: {
            title: "Fund the Future",
            subtitle: "For Sponsors",
            icon: Shield,
            color: "text-emerald-500",
            bgClass: "bg-emerald-50",
            description: "Access a curated pipeline of vetted, high-growth potential startups. Evaluate opportunities with AI-driven insights and escrow-backed security.",
            cta: "Explore Opportunities",
            imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
        },
        mentors: {
            title: "Guide the Future",
            subtitle: "For Mentors",
            icon: Users,
            color: "text-purple-500",
            bgClass: "bg-purple-50",
            description: "Share your expertise with the next generation of founders. Help ambitious teams navigate challenges and achieve true product-market fit. Build your legacy.",
            cta: "Join as Mentor",
            imgUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
        }
    };

    const activeData = segments[activeTab];

    return (
        <section className="py-32 px-4 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-5xl font-bold mb-6">Choose Your Orbit</h2>
                    <p className="text-xl text-gray-600">A multi-sided ecosystem designed for absolute synergy.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-gray-100 p-2 rounded-2xl gap-2">
                        {Object.keys(segments).map((key) => {
                            const segment = segments[key];
                            const Icon = segment.icon;
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`relative px-8 py-4 rounded-xl flex items-center gap-3 font-bold text-sm transition-all duration-300 ${isActive ? "text-[#2F2F2F]" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 bg-white rounded-xl shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={18} className={isActive ? segment.color : ""} />
                                        {segment.subtitle}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="relative bg-[#F9F9F7] rounded-[3rem] p-12 md:p-20 overflow-hidden min-h-[500px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="grid md:grid-cols-2 gap-16 items-center w-full z-10 relative"
                        >
                            <div className="space-y-8">
                                <span className={`inline-block px-4 py-1.5 rounded-full ${activeData.bgClass} ${activeData.color} text-xs font-black uppercase tracking-widest`}>
                                    {activeData.subtitle}
                                </span>
                                <h3 className="font-serif text-5xl md:text-6xl font-bold text-[#2F2F2F] leading-tight">
                                    {activeData.title}
                                </h3>
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    {activeData.description}
                                </p>
                                <Button
                                    onClick={() => navigate("/auth")}
                                    className="h-16 px-10 text-lg rounded-2xl bg-[#2F2F2F] text-white hover:scale-105 transition-transform group flex items-center gap-4"
                                >
                                    {activeData.cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                            <div className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    src={activeData.imgUrl}
                                    alt={activeData.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
