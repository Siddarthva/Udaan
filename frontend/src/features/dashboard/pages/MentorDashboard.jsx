import React, { useState, useEffect } from "react";
import {
    Activity,
    Shield,
    Users,
    Zap,
    TrendingUp,
    Search,
    Cpu,
    Briefcase,
    CheckCircle2,
    Clock,
    UserCheck,
    Calendar,
    Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Button, Badge, Skeleton, EmptyState } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { useMentorStore } from "@/store/mentorStore";
import { useUIStore } from "@/store/uiStore";
import { AnimatedSection } from "@/components/animation/MotionSystem";

export default function MentorDashboard() {
    const { user } = useAuthStore();
    const { requests, fetchMentorRequests } = useMentorStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMentorData = async () => {
            try {
                await fetchMentorRequests();
            } catch (err) {
                console.error("Error loading mentor data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadMentorData();
        }
    }, [user, fetchMentorRequests]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[500px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header */}
            <AnimatedSection direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-200/50">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-indigo-900 text-white border-none font-black tracking-widest px-4 py-1.5 text-[10px] uppercase">Senior Mentor Console</Badge>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Shield size={12} className="text-indigo-500" /> Live Connection Node Active
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 leading-none">
                        Mentor Oversight, <span className="text-gray-400">{user?.name?.split(' ')[0] || 'Dr. Sarah'}.</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Track your mentorship requests, review startup details, and coordinate validation support for high-impact innovation ventures.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/discover">
                        <Button className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all cursor-pointer">
                            <Search size={18} /> Browse Startups
                        </Button>
                    </Link>
                </div>
            </AnimatedSection>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Users} label="Total Requests Sent" value={requests.length.toString()} delta="Active Sprints" color="blue" />
                <StatCard icon={CheckCircle2} label="Approved Connections" value={requests.filter(r => r.status === 'accepted').length.toString()} delta="Connected" color="emerald" />
                <StatCard icon={Zap} label="Pending Reviews" value={requests.filter(r => r.status === 'pending').length.toString()} delta="Awaiting Founders" color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Requests List */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Sent Mentorship Proposals</h2>
                    </div>

                    <div className="space-y-6">
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <MentorRequestRow key={req.id} req={req} />
                            ))
                        ) : (
                            <EmptyState
                                icon={Target}
                                title="No Proposals Active"
                                description="Browse startup profiles and submit a proposal to initiate mentorship connection."
                            />
                        )}
                    </div>
                </div>

                {/* Profile Card Sidebar */}
                <div className="space-y-10">
                    <Card className="p-8 border-none bg-white rounded-[3rem] shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Mentor Profile</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                                {user?.name?.[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-base">{user?.name}</h4>
                                <p className="text-xs text-gray-400 font-semibold">{user?.email}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {user?.bio || "Ex-Google. Helping startups navigate technical bottlenecks and scale architecture node operations."}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-gray-50">
                            {user?.linkedin_url && (
                                <div className="text-[11px] text-gray-500 font-medium">
                                    <span className="font-bold text-gray-900">LinkedIn:</span> {user.linkedin_url}
                                </div>
                            )}
                            {user?.whatsapp_number && (
                                <div className="text-[11px] text-gray-500 font-medium">
                                    <span className="font-bold text-gray-900">WhatsApp:</span> {user.whatsapp_number}
                                </div>
                            )}
                        </div>
                    </Card>
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

function MentorRequestRow({ req }) {
    const statusColors = {
        pending: "bg-amber-50 text-amber-600",
        accepted: "bg-emerald-50 text-emerald-600",
        rejected: "bg-rose-50 text-rose-600"
    };

    return (
        <Card className="p-6 border-none bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <Briefcase size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-gray-900">{req.startup_title}</h4>
                        <Badge className={`${statusColors[req.status]} border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5`}>
                            {req.status}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Proposal: "{req.message}"</p>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Sent: {new Date(req.created_at).toLocaleDateString()}</span>
        </Card>
    );
}
