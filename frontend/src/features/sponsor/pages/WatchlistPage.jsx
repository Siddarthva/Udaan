import React, { useState, useEffect } from "react";
import {
    Star,
    AlertCircle,
    Search,
    Mail,
    Linkedin,
    PhoneCall,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Button, Badge, InputField, Skeleton, EmptyState } from "@/components/ui";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import { useInvestorStore } from "@/store/investorStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function WatchlistPage() {
    const { user } = useAuthStore();
    const { watchlist, fetchWatchlist, toggleSaveStartup } = useInvestorStore();
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadWatchlist = async () => {
            try {
                await fetchWatchlist();
            } catch (err) {
                console.error("Error loading watchlist", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) {
            loadWatchlist();
        }
    }, [user, fetchWatchlist]);

    const handleRemove = async (id, e) => {
        e?.stopPropagation();
        try {
            await toggleSaveStartup(id);
            toast.success("Removed from watchlist");
        } catch (err) {
            toast.error(err.message || "Failed to remove item.");
        }
    };

    const filteredWatchlist = watchlist.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 border border-gray-100 rounded-[2.5rem] bg-white p-8 space-y-6" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header Section */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-rose-50 text-rose-600 border-none font-black tracking-widest px-3 py-1 text-[9px] uppercase">Strategic Watchlist</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Star size={12} /> Priority Monitoring Enabled
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Shortlisted <span className="text-gray-400">Ventures.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Actively monitor shortlisted high-potential projects, review traction metrics, and access direct founder connection credentials.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <InputField
                            icon={Search}
                            placeholder="Find tracked startups..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 h-14 rounded-2xl focus:shadow-xl transition-all"
                        />
                    </div>
                </div>
            </AnimatedSection>

            {/* Results Grid */}
            <StaggerContainer>
                {filteredWatchlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWatchlist.map((item) => (
                            <WatchlistCard
                                key={item.id}
                                item={item}
                                onRemove={(e) => handleRemove(item.id, e)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Star}
                        title="Your Watchlist is Empty"
                        description="Begin discovery to find high-impact projects and shortlist them for active monitoring."
                        action={
                            <Link to="/sponsor/discover">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    Start Discovery
                                </Button>
                            </Link>
                        }
                    />
                )}
            </StaggerContainer>
        </div>
    );
}

function WatchlistCard({ item, onRemove }) {
    return (
        <Card className="h-full border-none shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col p-8 rounded-[2.5rem] bg-white ring-1 ring-gray-100 relative overflow-hidden">
            <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400 border-none">
                                {item.stage}
                            </Badge>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{item.title}</h3>
                        </div>
                        <button
                            onClick={onRemove}
                            className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <p className="text-sm font-medium text-gray-400 leading-relaxed line-clamp-3">"{item.description}"</p>

                    <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-2 text-xs font-semibold text-gray-600">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Founder Contact details</p>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <a href={`mailto:${item.owner_email}`} className="hover:underline text-gray-700">{item.owner_email}</a>
                        </div>
                        {item.linkedin_url && (
                            <div className="flex items-center gap-2">
                                <Linkedin size={14} className="text-[#0077B5]" />
                                <a href={item.linkedin_url} target="_blank" rel="noreferrer" className="hover:underline text-[#0077B5]">LinkedIn Profile</a>
                            </div>
                        )}
                        {item.whatsapp_number && (
                            <div className="flex items-center gap-2">
                                <PhoneCall size={14} className="text-[#25D366]" />
                                <a href={`https://wa.me/${item.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-[#25D366]">WhatsApp Connection</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Domain: {item.domain}</span>
                    <span>Goal: ₹{item.funding_required}L</span>
                </div>
            </div>
        </Card>
    );
}
