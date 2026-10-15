import React, { useEffect, useState } from "react";
import { Trash2, User, ExternalLink } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useInvestor } from "@/hooks/useInvestor";
import { formatCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function Watchlist() {
    const { user } = useAuth();
    const { watchlist, error, fetchWatchlist, toggleSaveStartup } = useInvestor();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchWatchlist().finally(() => setLoading(false));
    }, [user, fetchWatchlist]);

    const handleRemoveFromWatchlist = async (startupId) => {
        try {
            await toggleSaveStartup(startupId);
            toast.success("Removed from watchlist");
        } catch (e) {
            toast.error(e?.response?.data?.error || "Failed to update watchlist");
        }
    };

    if (loading) return <Loader fullScreen text="Loading Watchlist..." />;

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">My Watchlist</h1>
                <p className="text-xs text-gray-500 mt-0.5">Tracked ventures saved for investment consideration</p>
            </div>

            {error ? (
                <Card className="text-center py-10 space-y-3 border-red-200">
                    <p className="text-sm font-semibold text-red-700">Couldn't load your watchlist</p>
                    <p className="text-xs text-gray-500">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => fetchWatchlist()}>Try again</Button>
                </Card>
            ) : watchlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {watchlist.map((s) => (
                        <Card key={s.id} className="space-y-4 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded mr-2">
                                            {s.domain}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-500">{s.stage}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromWatchlist(s.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                        title="Remove from Watchlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{s.description}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">Funding goal</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(s.funding_required)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">Received</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(s.funding_received)} ({s.funding_progress}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${s.funding_progress}%` }} />
                                    </div>
                                </div>

                                {s.owner_name && (
                                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                        <User size={12} /> Founder: <strong className="text-gray-900">{s.owner_name}</strong>
                                    </p>
                                )}

                                {s.pitch_deck_url && (
                                    <a
                                        href={s.pitch_deck_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        View Pitch Deck <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12 text-gray-500 text-xs">
                    No ventures in your saved watchlist. Discover startups to bookmark candidates.
                </Card>
            )}
        </div>
    );
}
