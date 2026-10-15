import React, { useState, useEffect } from "react";
import { Search, Bookmark, BookmarkCheck, Mail, Heart, ExternalLink, DollarSign } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import InvestmentModal from "@/components/InvestmentModal";
import { useAuth } from "@/hooks/useAuth";
import { useStartup } from "@/hooks/useStartup";
import { useInvestor } from "@/hooks/useInvestor";
import { useMentor } from "@/hooks/useMentor";
import { errorMessage } from "@/api/axios";
import { formatCurrency } from "@/utils/helpers";
import { DOMAINS, STAGES } from "@/utils/constants";
import toast from "react-hot-toast";

export default function Discover() {
    const { user } = useAuth();
    const { startups, error: startupsError, fetchStartups } = useStartup();
    const { watchlist, fetchWatchlist, toggleSaveStartup, expressInterest } = useInvestor();
    const { sendMentorshipRequest } = useMentor();

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedStage, setSelectedStage] = useState("All");

    // Modal states
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
    const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
    const [interestNotes, setInterestNotes] = useState("");
    const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
    const [mentorMessage, setMentorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            await fetchStartups();
            if (user?.role === "Sponsor") {
                await fetchWatchlist();
            }
            setLoading(false);
        };
        if (user) load();
    }, [user, fetchStartups, fetchWatchlist]);

    if (loading) return <Loader fullScreen text="Loading Marketplace..." />;

    const savedIds = new Set(watchlist.map((w) => w.id));

    const handleToggleBookmark = async (startupId) => {
        try {
            const saved = await toggleSaveStartup(startupId);
            toast.success(saved ? "Added to watchlist" : "Removed from watchlist");
        } catch (e) {
            toast.error(errorMessage(e, "Failed to update watchlist"));
        }
    };

    const handleExpressInterestSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStartup) return;
        setSubmitting(true);
        try {
            await expressInterest(selectedStartup.id, interestNotes);
            toast.success(`Capital interest expressed to ${selectedStartup.title}`);
            setIsInterestModalOpen(false);
            setInterestNotes("");
        } catch (e) {
            toast.error(errorMessage(e, "Failed to submit interest"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleMentorRequestSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStartup) return;
        setSubmitting(true);
        try {
            await sendMentorshipRequest(selectedStartup.id, mentorMessage);
            toast.success(`Mentorship proposal submitted to ${selectedStartup.title}`);
            setIsMentorModalOpen(false);
            setMentorMessage("");
        } catch (e) {
            toast.error(errorMessage(e, "Failed to send proposal"));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStartups = startups.filter((s) => {
        const matchSearch =
            !searchQuery ||
            s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.owner_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDomain = selectedDomain === "All" || s.domain === selectedDomain;
        const matchStage = selectedStage === "All" || s.stage === selectedStage;
        return matchSearch && matchDomain && matchStage;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Discover Startups</h1>
                <p className="text-xs text-gray-500 mt-0.5">Explore active ecosystem ventures seeking funding, mentorship, and collaborators</p>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="md:col-span-2">
                    <Input
                        icon={Search}
                        placeholder="Search startups by name, founder or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    {DOMAINS.map((d) => (
                        <option key={d} value={d}>Domain: {d}</option>
                    ))}
                </select>
                <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    {STAGES.map((s) => (
                        <option key={s} value={s}>Stage: {s}</option>
                    ))}
                </select>
            </div>

            {/* Startups Grid */}
            {filteredStartups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStartups.map((s) => {
                        const isBookmarked = savedIds.has(s.id);
                                        return (
                            <Card key={s.id} className="flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                                                {s.domain}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-500">{s.stage}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {user?.role === "Sponsor" && (
                                                <button
                                                    onClick={() => handleToggleBookmark(s.id)}
                                                    className="text-gray-400 hover:text-gray-900 cursor-pointer"
                                                    title={isBookmarked ? "Remove Bookmark" : "Save to Watchlist"}
                                                >
                                                    {isBookmarked ? (
                                                        <BookmarkCheck size={18} className="text-gray-900 fill-gray-900" />
                                                    ) : (
                                                        <Bookmark size={18} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                                            {s.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-xs font-medium">
                                        <span className="text-gray-500">Funding goal</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(s.funding_required)}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] text-gray-500">
                                            <span>Received {formatCurrency(s.funding_received)}</span>
                                            <span>{s.funding_progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${s.funding_progress}%` }} />
                                        </div>
                                    </div>
                                    {s.owner_name && <p className="text-[11px] text-gray-500">Founder: <strong className="text-gray-700">{s.owner_name}</strong></p>}

                                    {s.pitch_deck_url && (
                                        <a
                                            href={s.pitch_deck_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                                        >
                                            Pitch Deck <ExternalLink size={12} />
                                        </a>
                                    )}

                                    <div className="flex gap-2">
                                        {user?.role === "Sponsor" && (
                                            <Button
                                                size="sm"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => { setSelectedStartup(s); setIsInvestmentModalOpen(true); }}
                                            >
                                                <DollarSign size={14} className="mr-1" /> Funding demo
                                            </Button>
                                        )}
                                        {user?.role === "Sponsor" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => { setSelectedStartup(s); setIsInterestModalOpen(true); }}
                                            >
                                                <Mail size={14} className="mr-1" /> Express interest
                                            </Button>
                                        )}
                                        {user?.role === "Mentor" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => { setSelectedStartup(s); setIsMentorModalOpen(true); }}
                                            >
                                                <Heart size={14} className="mr-1" /> Guidance
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                startupsError ? (
                    <Card className="text-center py-10 space-y-3 border-red-200">
                        <p className="text-sm font-semibold text-red-700">Couldn't load startups</p>
                        <p className="text-xs text-gray-500">{startupsError}</p>
                        <Button variant="outline" size="sm" onClick={() => fetchStartups()}>Try again</Button>
                    </Card>
                ) : (
                    <Card className="text-center py-12 text-gray-500 text-xs">
                        {startups.length === 0 ? "No startups have been launched yet." : "No startups matched your search filter criteria."}
                    </Card>
                )
            )}

            {/* Investment Modal */}
            <InvestmentModal
                isOpen={isInvestmentModalOpen}
                onClose={() => setIsInvestmentModalOpen(false)}
                startup={selectedStartup}
            />

            {/* Express Interest Modal */}
            <Modal
                isOpen={isInterestModalOpen}
                onClose={() => setIsInterestModalOpen(false)}
                title={`Express Interest: ${selectedStartup?.title}`}
            >
                <form onSubmit={handleExpressInterestSubmit} className="space-y-4">
                    <p className="text-xs text-gray-600">
                        Send a message to the founder <strong>{selectedStartup?.owner_name || ""}</strong> expressing your interest. This is recorded and the founder is notified.
                    </p>
                    <textarea
                        placeholder="State allocation commitment or request a term sheet meeting..."
                        value={interestNotes}
                        onChange={(e) => setInterestNotes(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 h-28 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsInterestModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Send Interest"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Offer Mentorship Modal */}
            <Modal
                isOpen={isMentorModalOpen}
                onClose={() => setIsMentorModalOpen(false)}
                title={`Offer Guidance: ${selectedStartup?.title}`}
            >
                <form onSubmit={handleMentorRequestSubmit} className="space-y-4">
                    <p className="text-xs text-gray-600">
                        Propose mentorship or technical advisorship to startup founder.
                    </p>
                    <textarea
                        placeholder="Detail your domain background and proposed mentorship scope..."
                        value={mentorMessage}
                        onChange={(e) => setMentorMessage(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 h-28 resize-none"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsMentorModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Sending..." : "Submit Proposal"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
