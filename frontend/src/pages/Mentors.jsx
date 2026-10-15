import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, GraduationCap, Building2, Check, X } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import { useCommunityMembersQuery } from "@/api/hooks";
import { errorMessage } from "@/api/axios";
import { useMentor } from "@/hooks/useMentor";
import toast from "react-hot-toast";

export default function Mentors() {
    const [searchQuery, setSearchQuery] = useState("");
    const { requests, error: requestsError, fetchMentorRequests, updateRequestStatus } = useMentor();
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const { data: mentors = [], isLoading, isError, error, refetch } = useCommunityMembersQuery({
        role: "mentor",
        search: searchQuery
    });

    useEffect(() => {
        fetchMentorRequests().finally(() => setRequestsLoading(false));
    }, [fetchMentorRequests]);

    const decide = async (request, status) => {
        setBusyId(request.id);
        try {
            await updateRequestStatus(request.id, status);
            toast.success(`Mentorship request ${status}`);
        } catch (err) {
            toast.error(errorMessage(err, "Failed to update request"));
        } finally {
            setBusyId(null);
        }
    };

    const pending = requests.filter((r) => r.status === "pending");
    const decided = requests.filter((r) => r.status !== "pending");

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Mentors</h1>
                <p className="text-xs text-gray-500 mt-0.5">Registered mentors, and mentorship proposals for your startups</p>
            </div>

            {/* Mentorship proposals received on my startups */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mentorship proposals</h2>
                {requestsLoading ? (
                    <Loader text="Loading proposals..." />
                ) : requestsError ? (
                    <Card className="text-xs text-red-700 border-red-200 flex items-center justify-between">
                        <span>Couldn't load proposals: {requestsError}</span>
                        <Button variant="outline" size="sm" onClick={() => fetchMentorRequests()}>Try again</Button>
                    </Card>
                ) : requests.length === 0 ? (
                    <Card className="text-center py-6 text-gray-500 text-xs">
                        No mentorship proposals yet. Mentors can propose from the startup discovery page.
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {[...pending, ...decided].map((r) => (
                            <Card key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-xs text-gray-500">
                                        <strong className="text-gray-900">{r.requester_name || r.requester_username || "A mentor"}</strong>
                                        {" "}for <strong className="text-gray-900">{r.startup_title || "your startup"}</strong>
                                    </p>
                                    {r.message && <p className="text-xs text-gray-600 italic">"{r.message}"</p>}
                                </div>
                                {r.status === "pending" ? (
                                    <div className="flex gap-2 shrink-0">
                                        <Button size="sm" disabled={busyId === r.id} onClick={() => decide(r, "accepted")}>
                                            <Check size={14} className="mr-1" /> Accept
                                        </Button>
                                        <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => decide(r, "rejected")}>
                                            <X size={14} className="mr-1" /> Decline
                                        </Button>
                                    </div>
                                ) : (
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${r.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                                        {r.status}
                                    </span>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Mentor directory (real MENTOR profiles) */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mentor directory</h2>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <Input
                        icon={Search}
                        placeholder="Search mentors by name, username, college, company or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <Loader text="Loading mentors..." />
                ) : isError ? (
                    <Card className="text-center py-8 space-y-3 border-red-200">
                        <p className="text-sm font-semibold text-red-700">Couldn't load mentors</p>
                        <p className="text-xs text-gray-500">{errorMessage(error)}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
                    </Card>
                ) : mentors.length === 0 ? (
                    <Card className="text-center py-10 text-gray-500 text-xs">
                        {searchQuery ? "No mentors match your search." : "No mentors have joined yet."}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mentors.map((m) => (
                            <Card key={m.id} className="space-y-3 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{m.full_name}</h3>
                                        <p className="text-xs font-semibold text-gray-500">
                                            @{m.username}{m.designation ? ` • ${m.designation}` : ""}
                                        </p>
                                    </div>
                                    {m.specialization && (
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                                            {m.specialization}
                                        </span>
                                    )}
                                    {m.bio && <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{m.bio}</p>}
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                                    <div className="space-y-1 text-gray-500 font-medium min-w-0">
                                        {m.college && <div className="flex items-center gap-1.5 truncate"><GraduationCap size={14} /> {m.college}</div>}
                                        {m.company && <div className="flex items-center gap-1.5 truncate"><Building2 size={14} /> {m.company}</div>}
                                    </div>
                                    <Link to={`/profile/${m.id}`}>
                                        <Button size="sm" variant="outline">View profile</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
