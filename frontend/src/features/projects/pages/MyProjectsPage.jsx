import React, { useState, useEffect } from "react";
import {
    Plus,
    Users,
    ArrowUpRight,
    Settings,
    Briefcase,
    Trash2,
    LinkIcon,
    Image
} from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "@/components/ui";
import { useUIStore } from "@/store/uiStore";
import { AnimatedSection, StaggerContainer } from "@/components/animation/MotionSystem";
import { useStartupStore } from "@/store/startupStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function MyProjectsPage() {
    const { openOverlay } = useUIStore();
    const { startups, fetchStartups, updateStartup, addMember, removeMember } = useStartupStore();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [editingStartup, setEditingStartup] = useState(null);
    const [pitchDeckUrl, setPitchDeckUrl] = useState("");
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("");

    useEffect(() => {
        const loadMyStartups = async () => {
            try {
                await fetchStartups();
            } catch (err) {
                console.error("Error loading startups", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) {
            loadMyStartups();
        }
    }, [user, fetchStartups]);

    const handleUpdatePitchDeck = async (startupId) => {
        try {
            await updateStartup(startupId, { pitch_deck_url: pitchDeckUrl });
            toast.success("Pitch deck link updated successfully!");
            setEditingStartup(null);
        } catch (e) {
            toast.error(e.message || "Failed to update pitch deck.");
        }
    };

    const handleAddMember = async (startupId) => {
        if (!newMemberName.trim()) {
            toast.error("Team member name is required.");
            return;
        }
        try {
            await addMember(startupId, { name: newMemberName, role: newMemberRole || "Team Member" });
            toast.success("Team member added!");
            setNewMemberName("");
            setNewMemberRole("");
            // Refresh startups
            await fetchStartups();
        } catch (e) {
            toast.error(e.message || "Failed to add team member.");
        }
    };

    const handleRemoveMember = async (startupId, memberId) => {
        try {
            await removeMember(startupId, memberId);
            toast.success("Team member removed.");
            // Refresh startups
            await fetchStartups();
        } catch (e) {
            toast.error(e.message || "Failed to remove team member.");
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-12 animate-in fade-in duration-500 bg-[#F8F9FA]/50 min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-[400px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2].map(i => (
                        <div key={i} className="h-[400px] border border-gray-100 rounded-[2.5rem] bg-white" />
                    ))}
                </div>
            </div>
        );
    }

    const myStartups = startups.filter(s => s.owner_id === user?.id);

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen bg-[#F8F9FA]/50">
            {/* Header / Stats Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-200/50">
                <AnimatedSection direction="down" className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-none font-black tracking-widest px-3 py-1 text-[9px] uppercase">Startup Creator Node</Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        My Startups <span className="text-gray-400">Workspace</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
                        Manage your startup profile, edit funding parameters, upload pitch documents, and coordinate team members.
                    </p>
                </AnimatedSection>

                <AnimatedSection direction="left" className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <div className="flex gap-4">
                        <Button
                            onClick={() => openOverlay('VENTURE_WIZARD')}
                            className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:shadow-gray-200/50 border-none transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus size={18} /> Launch New Venture
                        </Button>
                    </div>
                </AnimatedSection>
            </div>

            {/* My Startups Detail List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Active Startups</h2>
                </div>

                <StaggerContainer>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {myStartups.length > 0 ? (
                            myStartups.map((startup) => (
                                <Card key={startup.id} className="p-8 border-none bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <Badge variant="primary" className="bg-gray-50 text-gray-400 border-none font-bold px-3 py-1 text-[9px] uppercase tracking-widest">{startup.domain}</Badge>
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-3">{startup.stage}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{startup.title}</h3>
                                            <p className="text-sm text-gray-400 font-medium leading-relaxed mt-2">{startup.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Funding Goal</p>
                                                <p className="text-base font-black text-gray-900">₹{startup.funding_required} Lakhs</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Capital Raised</p>
                                                <p className="text-base font-black text-gray-900">₹{startup.raised} Lakhs</p>
                                            </div>
                                        </div>

                                        {/* Pitch deck area */}
                                        <div className="space-y-3 p-5 rounded-2xl border border-gray-100 bg-white">
                                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                <LinkIcon size={14} /> Pitch Deck Document
                                            </h4>
                                            {editingStartup === startup.id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={pitchDeckUrl}
                                                        onChange={(e) => setPitchDeckUrl(e.target.value)}
                                                        placeholder="Enter document URL (e.g. Google Drive/Dropbox)"
                                                        className="flex-1 px-3 py-2 border border-gray-100 text-xs rounded-xl focus:border-gray-900 outline-none"
                                                    />
                                                    <Button onClick={() => handleUpdatePitchDeck(startup.id)} className="bg-gray-900 text-white text-[9px] px-4 rounded-xl font-black uppercase">Save</Button>
                                                    <Button onClick={() => setEditingStartup(null)} variant="ghost" className="bg-gray-50 text-gray-400 text-[9px] px-3 rounded-xl font-black uppercase">Cancel</Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    {startup.pitch_deck_url ? (
                                                        <a href={startup.pitch_deck_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline font-medium truncate max-w-[200px]">{startup.pitch_deck_url}</a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">No pitch deck uploaded</span>
                                                    )}
                                                    <Button onClick={() => { setEditingStartup(startup.id); setPitchDeckUrl(startup.pitch_deck_url || ""); }} variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest">Update</Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Team Members List */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                <Users size={14} /> Startup Team Members
                                            </h4>
                                            
                                            {/* Add member form */}
                                            <div className="flex gap-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                                <input
                                                    type="text"
                                                    value={newMemberName}
                                                    onChange={(e) => setNewMemberName(e.target.value)}
                                                    placeholder="Member Name"
                                                    className="flex-1 px-3 py-1.5 border border-gray-100 bg-white text-xs rounded-xl focus:border-gray-900 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={newMemberRole}
                                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                                    placeholder="Role (e.g. CTO)"
                                                    className="w-24 px-3 py-1.5 border border-gray-100 bg-white text-xs rounded-xl focus:border-gray-900 outline-none"
                                                />
                                                <Button onClick={() => handleAddMember(startup.id)} className="bg-gray-900 text-white text-[9px] px-3 rounded-xl font-black uppercase">Add</Button>
                                            </div>

                                            {/* Member rows */}
                                            <div className="space-y-2">
                                                {startup.members && startup.members.length > 0 ? (
                                                    startup.members.map((member) => (
                                                        <div key={member.id} className="flex justify-between items-center bg-gray-50/30 px-4 py-2.5 rounded-xl border border-gray-50">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900">{member.name}</p>
                                                                <p className="text-[10px] text-gray-400 font-semibold uppercase">{member.role}</p>
                                                            </div>
                                                            <button onClick={() => handleRemoveMember(startup.id, member.id)} className="text-gray-300 hover:text-rose-500 transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic pl-1">No custom team members registered yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2">
                                <EmptyState
                                    icon={Briefcase}
                                    title="No Startups Active"
                                    description="Start your journey by launching your first venture node."
                                />
                            </div>
                        )}
                    </div>
                </StaggerContainer>
            </div>
        </div>
    );
}
