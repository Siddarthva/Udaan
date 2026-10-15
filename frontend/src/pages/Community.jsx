import React, { useState, useEffect } from "react";
import { Search, UserPlus, Check, MessageSquare, ShieldCheck, Briefcase, GraduationCap, Building2, MapPin, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { useCommunityMembersQuery, useFollowUserMutation, useUnfollowUserMutation } from "@/api/hooks";
import { errorMessage } from "@/api/axios";
import { requestsApi } from "@/api/api";
import toast from "react-hot-toast";

export default function Community() {
    const [selectedRole, setSelectedRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("recent");

    // Message Request Modal
    const [messageModalUser, setMessageModalUser] = useState(null);
    const [initialMessage, setInitialMessage] = useState("");
    const [sending, setSending] = useState(false);

    // Debounce the search box so typing does not fire a request per keystroke.
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const { data: members = [], isLoading, isError, error, refetch } = useCommunityMembersQuery({
        role: selectedRole,
        search: debouncedSearch,
        sort: sortOption
    });

    const followUserMutation = useFollowUserMutation();
    const unfollowUserMutation = useUnfollowUserMutation();

    const handleToggleFollow = async (member) => {
        try {
            if (member.is_following) {
                await unfollowUserMutation.mutateAsync(member.id);
                toast.success(`Unfollowed ${member.full_name}`);
            } else {
                await followUserMutation.mutateAsync(member.id);
                toast.success(`Following ${member.full_name}`);
            }
        } catch (e) {
            toast.error(errorMessage(e, "Could not update follow"));
        }
    };

    const handleSendRequestSubmit = async (e) => {
        e.preventDefault();
        if (!messageModalUser || !initialMessage.trim()) return;

        setSending(true);
        try {
            await requestsApi.create({
                receiver_id: messageModalUser.id,
                request_type: 'general',
                initial_message: initialMessage
            });
            toast.success(`Message request sent to ${messageModalUser.full_name}`);
            setMessageModalUser(null);
            setInitialMessage("");
        } catch (err) {
            toast.error(errorMessage(err, "Failed to send request"));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Ecosystem Community</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Discover founders, mentors, sponsors, and venture collaborators</p>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex border-b border-gray-200 text-xs font-semibold text-gray-500 gap-6 bg-white px-4 pt-3 rounded-lg border">
                {['all', 'innovator', 'mentor', 'sponsor'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`pb-3 capitalize transition-colors border-b-2 ${
                            selectedRole === role ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent hover:text-gray-900"
                        }`}
                    >
                        {role === 'all' ? 'All Members' : `${role}s`}
                    </button>
                ))}
            </div>

            {/* Search & Sort Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="md:col-span-3">
                    <Input
                        icon={Search}
                        placeholder="Search community by name, skill, college or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    <option value="followers">Sort: Most Followed</option>
                    <option value="recent">Sort: Recently Joined</option>
                    <option value="alphabetical">Sort: Alphabetical</option>
                </select>
            </div>

            {/* Member Cards Grid */}
            {isLoading ? (
                <Loader text="Loading Community Members..." />
            ) : isError ? (
                <Card className="text-center py-10 space-y-3 border-red-200">
                    <p className="text-sm font-semibold text-red-700">Couldn't load community members</p>
                    <p className="text-xs text-gray-500">{errorMessage(error)}</p>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
                </Card>
            ) : members.length === 0 ? (
                <Card className="text-center py-12 text-gray-400 text-xs">
                    No community members found matching your search query.
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {members.map((member) => {
                        const isFollowing = member.is_following;
                        return (
                            <Card key={member.id} className="flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    member.full_name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-bold text-gray-900 text-sm">{member.full_name}</h3>
                                                </div>
                                                <p className="text-xs text-indigo-600 font-medium capitalize">{(member.role || "").toLowerCase()} <span className="text-gray-400 font-normal">@{member.username}</span></p>
                                            </div>
                                        </div>

                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
                                            {member.followers_count} follower{member.followers_count === 1 ? "" : "s"}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 line-clamp-2">{member.bio}</p>

                                    {/* College / Company details */}
                                    <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        {member.college && (
                                            <div className="flex items-center gap-1.5">
                                                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate">{member.college}</span>
                                            </div>
                                        )}
                                        {member.company && (
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate">{member.company}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skill Pill Chips */}
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {(member.skills || []).slice(0, 4).map((skill, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded-md border border-gray-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleToggleFollow(member)}
                                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors ${
                                            isFollowing ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {isFollowing ? <Check size={12} /> : <UserPlus size={12} />}
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                    <button
                                        onClick={() => setMessageModalUser(member)}
                                        className="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <MessageSquare size={12} /> Message
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Message Request Modal */}
            <Modal
                isOpen={!!messageModalUser}
                onClose={() => setMessageModalUser(null)}
                title={`Send Request: ${messageModalUser?.full_name}`}
            >
                <form onSubmit={handleSendRequestSubmit} className="space-y-4">
                    <p className="text-xs text-gray-600">
                        Send a message request to <strong>{messageModalUser?.full_name}</strong>. Messaging will unlock once they accept.
                    </p>
                    <textarea
                        placeholder="Introduce yourself and state your collaboration intent..."
                        value={initialMessage}
                        onChange={(e) => setInitialMessage(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setMessageModalUser(null)}>Cancel</Button>
                        <Button type="submit" disabled={sending}>
                            {sending ? "Sending..." : "Send Message Request"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
