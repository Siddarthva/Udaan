import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Briefcase, Users, Star, Target, CheckCircle, Clock, TrendingUp, Sparkles, UserCheck, Activity, DollarSign, PieChart, ShieldCheck } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useStartup } from "@/hooks/useStartup";
import { useMentor } from "@/hooks/useMentor";
import { useInvestor } from "@/hooks/useInvestor";
import { useTrendingStartupsQuery, useActivityFeedQuery } from "@/api/hooks";
import { formatCurrency } from "@/utils/helpers";

export default function Dashboard() {
    const { user } = useAuth();
    const { startups, fetchStartups } = useStartup();
    const { requests, fetchMentorRequests } = useMentor();
    const { watchlist, interests, fetchWatchlist, fetchInvestorInterests } = useInvestor();
    const { data: trendingStartups = [], isError: trendingError } = useTrendingStartupsQuery();
    const { data: activities = [], isError: activityError } = useActivityFeedQuery();
    
    const [loading, setLoading] = useState(true);
    const role = user?.role || "Innovator";

    // Computed server-side from the persisted profile.
    const completionPercentage = user?.completion_percentage ?? 0;

    useEffect(() => {
        const loadDashboard = async () => {
            if (role === "Innovator") {
                await Promise.all([fetchStartups({ owner: "me" }), fetchMentorRequests()]);
            } else if (role === "Mentor") {
                await fetchMentorRequests();
            } else if (role === "Sponsor") {
                await Promise.all([fetchWatchlist(), fetchInvestorInterests()]);
            }
            setLoading(false);
        };
        if (user) loadDashboard();
    }, [user, role, fetchStartups, fetchMentorRequests, fetchWatchlist, fetchInvestorInterests]);

    if (loading) return <Loader fullScreen text="Loading SaaS Dashboard..." />;

    const myStartups = startups.filter((s) => s.owner_id === user?.id);
    const totalRaised = myStartups.reduce((acc, s) => acc + Number(s.funding_received || 0), 0);
    const totalRequired = myStartups.reduce((acc, s) => acc + Number(s.funding_required || 0), 0);
    const overallProgress = Math.min(100, totalRequired > 0 ? Math.round((totalRaised / totalRequired) * 100) : 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {role} Ecosystem Control Center
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        Welcome back, {user?.name?.split(" ")[0] || "User"}.
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/settings">
                        <Button variant="outline" size="sm">
                            <Sparkles size={16} className="mr-1.5 text-amber-500" /> AI Generator
                        </Button>
                    </Link>
                    {role === "Innovator" && (
                        <Link to="/projects">
                            <Button size="sm">
                                <Plus size={16} className="mr-1.5" /> Manage Startups
                            </Button>
                        </Link>
                    )}
                    {role !== "Innovator" && (
                        <Link to="/discover">
                            <Button size="sm">
                                <Search size={16} className="mr-1.5" /> Discover Ventures
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Profile Completion Bar */}
            <Card className="bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Profile Completeness</h3>
                            <p className="text-xs text-gray-500">Complete your bio, college, and social links to maximize ecosystem trust</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-64 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-indigo-900">{completionPercentage}% Completed</span>
                            <Link to="/settings" className="text-indigo-600 hover:underline">Complete profile &rarr;</Link>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </Card>

            {/* FOUNDER DASHBOARD */}
            {role === "Innovator" && (
                <div className="space-y-6">
                    {/* Analytics Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-emerald-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Funding Received</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRaised)}</p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Across your startups</span>
                        </Card>

                        <Card className="border-l-4 border-l-indigo-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Funding Target Progress</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{overallProgress}%</p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${overallProgress}%` }} />
                            </div>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining Goal</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(Math.max(0, totalRequired - totalRaised))}</p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Capital needed</span>
                        </Card>

                        <Card className="border-l-4 border-l-amber-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Startups</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{myStartups.length}</p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Launched ventures</span>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Startups List */}
                        <div className="lg:col-span-2 space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Venture Funding Breakdown</h2>
                            {myStartups.length > 0 ? (
                                <div className="space-y-3">
                                    {myStartups.map((s) => {
                                        const r = Number(s.funding_received || 0);
                                        const req = Number(s.funding_required || 0);
                                        const prog = s.funding_progress ?? 0;
                                        return (
                                            <Card key={s.id} className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base">{s.title}</h3>
                                                        <span className="text-xs text-indigo-600 font-medium">{s.domain} • {s.stage}</span>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                                                        {prog}% of goal
                                                    </span>
                                                </div>

                                                <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>

                                                <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                                                    <div className="flex justify-between font-semibold text-gray-700">
                                                        <span>Received: {formatCurrency(r)}</span>
                                                        <span>Target: {formatCurrency(req)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${prog}%` }} />
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="text-center py-8 text-gray-500 text-xs">
                                    No active startups. Click "Manage Startups" to launch a venture.
                                </Card>
                            )}
                        </div>

                        {/* Live Activity Feed */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-indigo-600" /> Platform Activity Feed
                            </h2>
                            <Card className="space-y-3 p-4">
                                {activityError ? <p className="text-xs text-red-600">Could not load activity.</p> : activities.length === 0 ? <p className="text-xs text-gray-400">No activity yet.</p> : null}
                                {activities.slice(0, 5).map((act) => (
                                    <div key={act.id} className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100 last:border-none last:pb-0 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 truncate">{act.title}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{act.user_name} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* INVESTOR & MENTOR DASHBOARD */}
            {role !== "Innovator" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {role === "Sponsor" ? (
                            <>
                                <Card className="border-l-4 border-l-indigo-500">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Watchlist Saved</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{watchlist.length}</p>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Saved startups</span>
                                </Card>
                                <Card className="border-l-4 border-l-purple-500">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interests Expressed</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{interests.length}</p>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Sent to founders</span>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Card className="border-l-4 border-l-indigo-500">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Proposals Sent</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{requests.length}</p>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Mentorship proposals</span>
                                </Card>
                                <Card className="border-l-4 border-l-emerald-500">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accepted</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{requests.filter((r) => r.status === "accepted").length}</p>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">By founders</span>
                                </Card>
                            </>
                        )}
                        <Card className="border-l-4 border-l-amber-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Completeness</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{completionPercentage}%</p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">Of your profile</span>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Trending Startups Grid */}
                        <div className="lg:col-span-2 space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-indigo-600" /> Most engaged startups
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {trendingError && <p className="text-xs text-red-600 col-span-2">Could not load startups.</p>}
                                {!trendingError && trendingStartups.length === 0 && <p className="text-xs text-gray-400 col-span-2">No startups have been launched yet.</p>}
                                {trendingStartups.slice(0, 4).map((ts) => (
                                    <Card key={ts.id} className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base">{ts.title}</h3>
                                                <span className="text-xs text-indigo-600 font-medium">{ts.domain}</span>
                                            </div>
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded" title="Saves + sponsor interest + mentor proposals">
                                                {ts.engagement} engagement
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">{ts.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Live Activity Feed */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-indigo-600" /> Platform Activity Feed
                            </h2>
                            <Card className="space-y-3 p-4">
                                {activityError ? <p className="text-xs text-red-600">Could not load activity.</p> : activities.length === 0 ? <p className="text-xs text-gray-400">No activity yet.</p> : null}
                                {activities.slice(0, 5).map((act) => (
                                    <div key={act.id} className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100 last:border-none last:pb-0 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 truncate">{act.title}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{act.user_name} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
