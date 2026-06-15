import React, { useState, useEffect } from "react";
import {
    Activity,
    Target,
    Zap,
    Users,
    Clock,
    Plus,
    BarChart3,
    ArrowUpRight,
    Briefcase
} from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "@/components/ui";
import { useStartupStore } from "@/store/startupStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { AnimatedSection } from "@/components/animation/MotionSystem";
import mentorService from "@/services/mentorService";
import startupService from "@/services/startupService";
import toast from "react-hot-toast";

export default function InnovatorDashboard() {
    const { user } = useAuthStore();
    const { startups, fetchStartups } = useStartupStore();
    const { openOverlay } = useUIStore();
    const [isLoading, setIsLoading] = useState(true);
    const [mentorRequests, setMentorRequests] = useState([]);
    const [investorInterests, setInvestorInterests] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                await fetchStartups();
                const requests = await mentorService.fetchRequests();
                const interests = await startupService.getInvestorInterests(user?.id, 'Innovator');
                setMentorRequests(requests || []);
                setInvestorInterests(interests || []);
            } catch (err) {
                console.error("Error loading dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user, fetchStartups]);

    const handleAcceptMentor = async (requestId) => {
        try {
            await mentorService.updateRequestStatus(requestId, 'accepted');
            toast.success("Mentorship request accepted!");
            // Refresh requests
            const requests = await mentorService.fetchRequests();
            setMentorRequests(requests || []);
        } catch (e) {
            toast.error(e.message || "Failed to update status");
        }
    };

    const handleDeclineMentor = async (requestId) => {
        try {
            await mentorService.updateRequestStatus(requestId, 'rejected');
            toast.success("Mentorship request declined.");
            // Refresh requests
            const requests = await mentorService.fetchRequests();
            setMentorRequests(requests || []);
        } catch (e) {
            toast.error(e.message || "Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-[400px]" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
                <div className="h-[400px] bg-white rounded-[3rem]" />
            </div>
        );
    }

    const myStartups = startups.filter(s => s.owner_id === user?.id);
    const totalRaisedVal = myStartups.reduce((acc, s) => acc + parseFloat(s.raised || 0), 0);

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 shadow-sm">Founder Core active</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Live Sync Active</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Ecosystem Pulse, <span className="text-gray-400">{user?.name?.split(' ')[0] || 'Founder'}.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track your startup's momentum, manage your profile details, and review connections from investors and mentors.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => openOverlay('VENTURE_WIZARD')}
                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all active:scale-95 cursor-pointer"
                    >
                        <Plus size={18} /> Launch New Venture
                    </Button>
                </div>
            </AnimatedSection>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} label="Total Capital Raised" value={`₹${totalRaisedVal.toLocaleString()}L`} delta="Direct Sync" color="emerald" />
                <StatCard icon={Briefcase} label="My Startups" value={myStartups.length.toString()} delta="Active Nodes" color="blue" />
                <StatCard icon={Users} label="Mentor Connections" value={mentorRequests.filter(r => r.status === 'accepted').length.toString()} delta="Connected" color="indigo" />
                <StatCard icon={Target} label="Investor Interests" value={investorInterests.length.toString()} delta="Expressed" color="amber" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Startups List */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">My Startups</h2>
                    </div>

                    <div className="space-y-6">
                        {myStartups.length > 0 ? (
                            myStartups.map(startup => (
                                <StartupRow key={startup.id} startup={startup} />
                            ))
                        ) : (
                            <EmptyState
                                icon={Briefcase}
                                title="No Startups Active"
                                description="Start your journey by defining your startup profile."
                            />
                        )}
                    </div>

                    {/* Mentor Guidance Requests */}
                    <div className="space-y-6 pt-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Mentorship Requests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mentorRequests.filter(r => r.status === 'pending').length > 0 ? (
                                mentorRequests.filter(r => r.status === 'pending').map(req => (
                                    <Card key={req.id} className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm space-y-6 border border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                                                {req.mentor_name?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{req.mentor_name}</p>
                                                <h4 className="text-sm font-bold text-gray-900">Mentorship Proposal</h4>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] uppercase">New</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">"{req.message}"</p>
                                        <div className="flex gap-3 pt-2">
                                            <Button onClick={() => handleAcceptMentor(req.id)} className="flex-1 h-10 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Accept</Button>
                                            <Button onClick={() => handleDeclineMentor(req.id)} variant="ghost" className="flex-1 h-10 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest">Decline</Button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 font-medium col-span-2">No pending mentorship requests received.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Investor Interest Sidebar */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Investor Interest</h2>
                        <div className="space-y-4">
                            {investorInterests.length > 0 ? (
                                investorInterests.map(interest => (
                                    <Card key={interest.id} className="p-5 rounded-[2rem] bg-white ring-1 ring-gray-100 shadow-sm flex gap-4">
                                        <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {interest.investor_name?.[0]}
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Investor: {interest.investor_name}</p>
                                            <h4 className="text-xs font-bold leading-tight">Expressed Interest in {interest.startup_title}</h4>
                                            {interest.notes && <p className="text-[11px] text-gray-500 leading-relaxed font-mono">"{interest.notes}"</p>}
                                            <div className="pt-2 flex flex-col gap-1 text-[10px] text-gray-400 font-medium">
                                                {interest.investor_email && <span>Email: {interest.investor_email}</span>}
                                                {interest.linkedin_url && <span>LinkedIn: {interest.linkedin_url}</span>}
                                                {interest.whatsapp_number && <span>WhatsApp: {interest.whatsapp_number}</span>}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 font-medium">No investor interest expressed yet.</p>
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
        <Card className="p-6 border-none bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                    </div>
                    <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[9px] uppercase">{delta}</Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function StartupRow({ startup }) {
    return (
        <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center gap-8 group">
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all transform group-hover:rotate-6">
                <BarChart3 size={24} />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{startup.title}</h3>
                    <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[8px] uppercase tracking-[0.2em]">{startup.stage}</Badge>
                </div>
                <p className="text-xs text-gray-500 font-medium line-clamp-2">{startup.description}</p>
                <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Domain: {startup.domain}</span>
                    <span>•</span>
                    <span>Funding Sought: ₹{startup.funding_required}L</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-xs font-bold text-gray-500">Active Node</Badge>
            </div>
        </Card>
    );
}
