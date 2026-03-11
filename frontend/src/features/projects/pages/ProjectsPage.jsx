import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Flame, Search, Filter, ArrowUpRight, Grid3X3, List } from "lucide-react";
import { GLOBAL_PROJECTS as projectsData } from "@/data/projects";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import { useUIStore } from "@/store/uiStore";

export default function ProjectsPage() {
    const { openOverlay } = useUIStore();
    const [domainFilter, setDomainFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = useMemo(() => {
        return projectsData
            .filter(p =>
                (domainFilter === "All" || p.domain === domainFilter) &&
                (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => b.trending_score - a.trending_score);
    }, [domainFilter, searchQuery]);

    return (
        <div className="pb-20">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
                <AnimatedSection direction="down" className="flex-1">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">Discover.</h1>
                    <p className="text-gray-500 text-xl max-w-xl font-medium">Explore the boundaries of what's possible in the ecosystem.</p>
                </AnimatedSection>

                <AnimatedSection direction="left" className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Filter by keyword..."
                            className="w-full pl-14 pr-6 h-14 rounded-2xl bg-white border border-transparent focus:border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] focus:shadow-xl outline-none transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="white" className="h-14 w-14 p-0 rounded-2xl">
                            <Filter size={20} />
                        </Button>
                        <Button variant="primary" className="h-14 px-8 rounded-2xl shadow-2xl">
                            Apply
                        </Button>
                    </div>
                </AnimatedSection>
            </header>

            {/* Categories */}
            <AnimatedSection direction="up" delay={0.2} className="mb-16">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {["All", "AgriTech", "HealthTech", "CleanTech", "FinTech", "DeepTech"].map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setDomainFilter(cat)}
                            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${domainFilter === cat
                                ? "bg-[#2F2F2F] border-[#2F2F2F] text-white shadow-2xl scale-105"
                                : "bg-white border-transparent text-gray-400 hover:text-black hover:shadow-lg"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </AnimatedSection>

            <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, idx) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="h-full"
                            >
                                <Card className="p-0 border-none h-full flex flex-col group hover:translate-y-[-8px]">
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={project.image}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                            alt={project.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                                        <div className="absolute top-6 left-6 flex gap-2">
                                            {idx === 0 && (
                                                <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl backdrop-blur-md">
                                                    <Flame size={14} fill="white" /> Trending
                                                </div>
                                            )}
                                            <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                                                {project.domain}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                            <div className="text-white">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{project.stage}</p>
                                                <h3 className="font-serif text-2xl font-bold tracking-tight">{project.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => openOverlay('DOSSIER_VIEWER', project)}
                                                className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-gray-900 hover:text-white"
                                            >
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-gray-500 text-sm leading-relaxed mb-10 flex-1 line-clamp-3">
                                            {project.description}
                                        </p>

                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => openOverlay('DOSSIER_VIEWER', { ...project, title: `${project.title} - Blueprint & Roadmap` })}
                                                variant="white" className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-gray-100"
                                            >
                                                Blueprint
                                            </Button>
                                            <Button
                                                onClick={() => openOverlay('DEAL_WIZARD', project)}
                                                className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white border-none shadow-xl active:scale-95 transition-all"
                                            >
                                                Invest
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </StaggerContainer>

            {filteredProjects.length === 0 && (
                <AnimatedSection direction="up" className="text-center py-40">
                    <div className="h-32 w-32 bg-gray-100 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
                        <Search size={48} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-4">No results in this coordinate.</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">Try adjusting your filters or search keywords to find other nodes.</p>
                </AnimatedSection>
            )}
        </div>
    );
}
