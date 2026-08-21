import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User, Mail, Shield, Briefcase, Settings, Users, UserPlus, Layers, Activity, ShieldCheck, GraduationCap, Building2, MessageSquare } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useFollowersQuery, useFollowingQuery, useStartupsQuery, useCommunityMembersQuery, useFollowUserMutation } from "@/api/hooks";
import { requestsApi } from "@/api/api";
import toast from "react-hot-toast";

export default function Profile() {
    const { id: paramId } = useParams();
    const { user: currentUser } = useAuth();

    const isOwnProfile = !paramId || paramId === currentUser?.id;

    // Fetch target user if viewing public profile
    const { data: members = [] } = useCommunityMembersQuery();
    const publicMember = members.find(m => m.id === paramId);

    const profileUser = isOwnProfile ? currentUser : (publicMember || {
        id: paramId,
        name: "Ecosystem Member",
        full_name: "Ecosystem Member",
        email: "member@udaan.io",
        role: "Innovator",
        college: "Ecosystem University",
        company: "UDAAN Venture",
        bio: "Passionate entrepreneur and innovator building the future."
    });

    const [activeTab, setActiveTab] = useState("overview");
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");
    const [sending, setSending] = useState(false);

    const { data: followers = [] } = useFollowersQuery();
    const { data: following = { users: [], startups: [] } } = useFollowingQuery();
    const { data: startups = [] } = useStartupsQuery();
    const followUserMutation = useFollowUserMutation();

    const followedUserIds = new Set((following.users || []).map(u => u.id));
    const isFollowing = followedUserIds.has(profileUser?.id);

    const userStartups = startups.filter(s => s.owner_id === profileUser?.id);

    const handleFollow = async () => {
        try {
            await followUserMutation.mutateAsync(profileUser.id);
            toast.success("User followed");
        } catch (e) {
            toast.error("Failed to follow user");
        }
    };

    const handleSendMessageSubmit = async (e) => {
        e.preventDefault();
        if (!initialMessage.trim()) return;

        setSending(true);
        try {
            await requestsApi.create({
                receiver_id: profileUser.id,
                type: 'general',
                initial_message: initialMessage
            });
            toast.success(`Message request sent to ${profileUser.full_name || profileUser.name}`);
            setMessageModalOpen(false);
            setInitialMessage("");
        } catch (err) {
            toast.error(err.message || "Failed to send request");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {isOwnProfile ? "My Profile" : `${profileUser?.full_name || profileUser?.name}'s Profile`}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">Account identity, network connections, and active ventures</p>
                </div>
                {isOwnProfile ? (
                    <Link to="/settings">
                        <Button variant="outline" size="sm">
                            <Settings size={14} className="mr-1.5" /> Edit Settings
                        </Button>
                    </Link>
                ) : (
                    <div className="flex gap-2">
                        <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={handleFollow}>
                            <UserPlus size={14} className="mr-1.5" /> {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button size="sm" onClick={() => setMessageModalOpen(true)}>
                            <MessageSquare size={14} className="mr-1.5" /> Message Request
                        </Button>
                    </div>
                )}
            </div>

            <Card className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                            {(profileUser?.full_name || profileUser?.name)?.[0] || "U"}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-xl font-bold text-gray-900">{profileUser?.full_name || profileUser?.name}</h2>
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <p className="text-xs text-gray-500">{profileUser?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded border border-indigo-100">
                                    Role: {profileUser?.role || "Innovator"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                        <div>
                            <p className="text-lg font-bold text-gray-900">{isOwnProfile ? followers.length : (profileUser?.followers_count || 12)}</p>
                            <p className="text-[10px] uppercase font-semibold text-gray-400">Followers</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div>
                            <p className="text-lg font-bold text-gray-900">{isOwnProfile ? ((following.users?.length || 0) + (following.startups?.length || 0)) : 8}</p>
                            <p className="text-[10px] uppercase font-semibold text-gray-400">Following</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div>
                            <p className="text-lg font-bold text-gray-900">{userStartups.length}</p>
                            <p className="text-[10px] uppercase font-semibold text-gray-400">Startups</p>
                        </div>
                    </div>
                </div>

                {/* Profile Navigation Tabs */}
                <div className="flex border-b border-gray-200 text-xs font-semibold text-gray-500 gap-6">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                            activeTab === "overview" ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent hover:text-gray-900"
                        }`}
                    >
                        <User className="w-4 h-4" /> Overview
                    </button>
                    {isOwnProfile && (
                        <>
                            <button
                                onClick={() => setActiveTab("followers")}
                                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                                    activeTab === "followers" ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent hover:text-gray-900"
                                }`}
                            >
                                <Users className="w-4 h-4" /> Followers ({followers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("following")}
                                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                                    activeTab === "following" ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent hover:text-gray-900"
                                }`}
                            >
                                <UserPlus className="w-4 h-4" /> Following ({(following.users?.length || 0) + (following.startups?.length || 0)})
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setActiveTab("startups")}
                        className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                            activeTab === "startups" ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent hover:text-gray-900"
                        }`}
                    >
                        <Layers className="w-4 h-4" /> Startups ({userStartups.length})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="space-y-4 text-xs">
                        <div>
                            <p className="font-semibold text-gray-400 uppercase text-[10px]">Bio</p>
                            <p className="font-medium text-gray-800 mt-1">{profileUser?.bio || "Passionate entrepreneur and innovator building the future."}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-400 uppercase text-[10px]">College / University</p>
                                <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> {profileUser?.college || "Ecosystem University"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-400 uppercase text-[10px]">Company / Organization</p>
                                <p className="font-medium text-gray-900 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> {profileUser?.company || "UDAAN Venture"}
                                </p>
                            </div>
                        </div>

                        {/* Skill Pill Chips */}
                        <div>
                            <p className="font-semibold text-gray-400 uppercase text-[10px] mb-1.5">Featured Skills & Expertise</p>
                            <div className="flex flex-wrap gap-1.5">
                                {(Array.isArray(profileUser?.skills) ? profileUser.skills : ['Venture Building', 'Product Strategy', 'Growth']).map((skill, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "followers" && (
                    <div className="space-y-3">
                        {followers.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center">No followers yet.</p>
                        ) : (
                            followers.map(f => (
                                <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                            {f.full_name?.charAt(0) || f.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{f.full_name || f.name}</p>
                                            <p className="text-[10px] text-gray-500">{f.role || 'Member'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "following" && (
                    <div className="space-y-3">
                        {((following.users || []).length === 0 && (following.startups || []).length === 0) ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center">Not following anyone yet.</p>
                        ) : (
                            <>
                                {(following.users || []).map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                {u.full_name?.charAt(0) || u.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{u.full_name || u.name}</p>
                                                <p className="text-[10px] text-gray-500">{u.role || 'User'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(following.startups || []).map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 bg-indigo-50/40 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                                {s.startup_name?.charAt(0) || s.title?.charAt(0) || "S"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{s.startup_name || s.title}</p>
                                                <p className="text-[10px] text-indigo-600 font-semibold">{s.industry || s.domain} Startup</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "startups" && (
                    <div className="space-y-3">
                        {userStartups.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center">No startups launched yet.</p>
                        ) : (
                            userStartups.map(s => (
                                <div key={s.id} className="p-4 border border-gray-200 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-gray-900">{s.title}</h3>
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">{s.stage}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">{s.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </Card>

            {/* Message Request Modal */}
            <Modal
                isOpen={messageModalOpen}
                onClose={() => setMessageModalOpen(false)}
                title={`Send Request: ${profileUser?.full_name || profileUser?.name}`}
            >
                <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                    <p className="text-xs text-gray-600">
                        Send a message request to <strong>{profileUser?.full_name || profileUser?.name}</strong>. Messaging unlocks once they accept.
                    </p>
                    <textarea
                        placeholder="Introduce yourself and state your collaboration intent..."
                        value={initialMessage}
                        onChange={(e) => setInitialMessage(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setMessageModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={sending}>
                            {sending ? "Sending..." : "Send Message Request"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
