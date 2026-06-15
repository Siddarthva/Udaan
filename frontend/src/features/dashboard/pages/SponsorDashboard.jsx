import React, { useState, useEffect } from "react";
import {
    Activity,
    Target,
    Zap,
    Users,
    Clock,
    TrendingUp,
    Briefcase,
    Shield,
    Star,
    Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Button, Badge, Skeleton, EmptyState } from "@/components/ui";
import { useInvestorStore } from "@/store/investorStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { AnimatedSection } from "@/components/animation/MotionSystem";

export default function SponsorDashboard() {
    const { user } = useAuthStore();
    const { watchlist, interests, fetchWatchlist, fetchInvestorInterests } = useInvestorStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSponsorData = async () => {
            try {
                await fetchWatchlist();
                await fetchInvestorInterests();
            } catch (err) {
                console.error("Error loading sponsor data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadSponsorData();
        }
    }, [user, fetchWatchlist, fetchInvestorInterests]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Executive Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-950 text-emerald-400 border-none px-4 py-1.5 font-black tracking-[0.2em] text-[10px] uppercase">Investor Portal Active</Badge>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100">
                            <Shield size={12} className="text-emerald-500" /> Watchlist Tracked
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Investor <span className="text-gray-400">Dashboard.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Identify high-potential startups, save targets to your watchlist, and express funding interest to founders directly.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link to="/sponsor/discover">
                        <Button className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-emerald-200 transition-all border-none active:scale-95 cursor-pointer">
                            <Search size={18} /> Discover Startups
                        </Button>
                    </Link>
                </div>
            </AnimatedSection>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Star} label="Watchlist Size" value={watchlist.length.toString()} delta="Saved Startups" color="blue" />
                <StatCard icon={Zap} label="Expressed Interests" value={interests.length.toString()} delta="Founder Contacts" color="emerald" />
                <StatCard icon={Users} label="Target Domain Coverage" value="AgriTech, HealthTech, FinTech" delta="Broad Portfolio" color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Watchlist Section */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Saved Startups Watchlist</h2>
                    </div>

                    <div className="space-y-6">
                        {watchlist.length > 0 ? (
                            watchlist.map((startup) => (
                                <SavedStartupRow key={startup.id} startup={startup} />
                            ))
                        ) : (
                            <EmptyState
                                icon={Star}
                                title="Watchlist Empty"
                                description="Start saving startups during discovery to track them here."
                            />
                        )}
                    </div>
                </div>

                {/* Expressed Interest sidebar */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">My Expressed Interests</h2>
                        <div className="space-y-4">
                            {interests.length > 0 ? (
                                interests.map((interest) => (
                                    <Card key={interest.id} className="p-6 border-none bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center gap-6">
                                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                            <Zap size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900">{interest.startup_title}</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{interest.domain}</p>
                                            {interest.notes && <p className="text-xs text-gray-500 font-medium italic mt-1">"{interest.notes}"</p>}
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 font-medium">No interests expressed yet.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, delta, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50",
        emerald: "text-emerald-600 bg-emerald-50/50",
        amber: "text-amber-600 bg-amber-50/50",
        indigo: "text-indigo-600 bg-indigo-50/50"
    };

    return (
        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                    </div>
                    <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[9px] uppercase tracking-widest">{delta}</Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight leading-none">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function SavedStartupRow({ startup }) {
    return (
        <Card className="p-8 border-none bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <Briefcase size={20} />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{startup.title}</h3>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">{startup.stage}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 font-medium line-clamp-1">{startup.description}</p>
                    <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>Domain: {startup.domain}</span>
                        <span>•</span>
                        <span>Founder: {startup.owner_name}</span>
                    </div>
                </div>
            </div>
            <Link to="/sponsor/discover">
                <Button variant="outline" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase">View Details</Button>
            </Link>
        </Card>
    );
}
