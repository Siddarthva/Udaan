import React, { useState, useEffect } from "react";
import { Plus, Trash2, LinkIcon, Users, Upload } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useStartup } from "@/hooks/useStartup";
import { DOMAINS, STAGES } from "@/utils/constants";
import toast from "react-hot-toast";

export default function Projects() {
    const { user } = useAuth();
    const { startups, fetchStartups, createStartup, updateStartup, addMember, removeMember, uploadPitchDeck } = useStartup();
    const [loading, setLoading] = useState(true);

    // Modal state for Launch Venture
    const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchForm, setLaunchForm] = useState({
        title: "",
        description: "",
        domain: "AgriTech",
        stage: "Seed",
        funding_required: 50
    });

    // Pitch deck update state
    const [editingStartup, setEditingStartup] = useState(null);
    const [pitchDeckUrl, setPitchDeckUrl] = useState("");

    // Team member state
    const [memberName, setMemberName] = useState("");
    const [memberRole, setMemberRole] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                await fetchStartups();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) load();
    }, [user, fetchStartups]);

    const handleLaunchSubmit = async (e) => {
        e.preventDefault();
        if (!launchForm.title.trim() || !launchForm.description.trim()) {
            toast.error("Venture name and description are required.");
            return;
        }
        setIsLaunching(true);
        try {
            await createStartup({
                title: launchForm.title,
                description: launchForm.description,
                domain: launchForm.domain,
                stage: launchForm.stage,
                funding_required: parseFloat(launchForm.funding_required) || 0,
                raised: 0,
                pitch_deck_url: ""
            });
            toast.success("Startup launched successfully!");
            setIsLaunchModalOpen(false);
            setLaunchForm({ title: "", description: "", domain: "AgriTech", stage: "Seed", funding_required: 50 });
        } catch (err) {
            toast.error(err.message || "Failed to launch startup.");
        } finally {
            setIsLaunching(false);
        }
    };

    const handleSavePitchDeckUrl = async (startupId) => {
        try {
            await updateStartup(startupId, { pitch_deck_url: pitchDeckUrl });
            toast.success("Pitch deck link updated!");
            setEditingStartup(null);
        } catch (err) {
            toast.error(err.message || "Failed to update pitch deck.");
        }
    };

    const handleUploadFile = async (startupId, file) => {
        if (!file) return;
        const toastId = toast.loading("Uploading document to storage...");
        try {
            await uploadPitchDeck(startupId, file);
            toast.success("Document uploaded successfully!", { id: toastId });
            setEditingStartup(null);
            await fetchStartups();
        } catch (err) {
            toast.error(err.message || "Failed to upload document.", { id: toastId });
        }
    };

    const handleAddTeamMember = async (startupId) => {
        if (!memberName.trim()) {
            toast.error("Member name is required.");
            return;
        }
        try {
            await addMember(startupId, { name: memberName, role: memberRole || "Team Member" });
            toast.success("Team member added!");
            setMemberName("");
            setMemberRole("");
            await fetchStartups();
        } catch (err) {
            toast.error(err.message || "Failed to add team member.");
        }
    };

    const handleRemoveTeamMember = async (startupId, memberId) => {
        try {
            await removeMember(startupId, memberId);
            toast.success("Team member removed.");
            await fetchStartups();
        } catch (err) {
            toast.error(err.message || "Failed to remove team member.");
        }
    };

    if (loading) return <Loader fullScreen text="Loading Startups..." />;

    const myStartups = startups.filter((s) => s.owner_id === user?.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">My Startups</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage startup profiles, pitch decks, and team members</p>
                </div>
                <Button onClick={() => setIsLaunchModalOpen(true)}>
                    <Plus size={16} className="mr-1.5" /> Launch Venture
                </Button>
            </div>

            {/* Startups List */}
            {myStartups.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {myStartups.map((s) => (
                        <Card key={s.id} className="space-y-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded mr-2">
                                        {s.domain}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-500">{s.stage}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{s.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase">Goal</p>
                                    <p className="font-bold text-gray-900 mt-0.5">₹{s.funding_required} Lakhs</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase">Raised</p>
                                    <p className="font-bold text-gray-900 mt-0.5">₹{s.raised} Lakhs</p>
                                </div>
                            </div>

                            {/* Pitch Deck Manager */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-xs">
                                <p className="font-semibold text-gray-700 flex items-center gap-1.5">
                                    <LinkIcon size={14} /> Pitch Deck Document
                                </p>
                                {editingStartup === s.id ? (
                                    <div className="space-y-2 pt-1">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Paste URL (e.g. Google Drive)"
                                                value={pitchDeckUrl}
                                                onChange={(e) => setPitchDeckUrl(e.target.value)}
                                            />
                                            <Button size="sm" onClick={() => handleSavePitchDeckUrl(s.id)}>Save</Button>
                                        </div>
                                        <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center bg-white cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept=".pdf,.ppt,.pptx,.doc,.docx"
                                                onChange={(e) => handleUploadFile(s.id, e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
                                                <Upload size={14} /> Upload PDF/PPT
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingStartup(null)} className="w-full">
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        {s.pitch_deck_url ? (
                                            <a href={s.pitch_deck_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium truncate max-w-[200px]">
                                                View Document
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">No pitch deck uploaded</span>
                                        )}
                                        <Button variant="outline" size="sm" onClick={() => { setEditingStartup(s.id); setPitchDeckUrl(s.pitch_deck_url || ""); }}>
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Team Member Manager */}
                            <div className="space-y-2 text-xs">
                                <p className="font-semibold text-gray-700 flex items-center gap-1.5">
                                    <Users size={14} /> Team Members
                                </p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Name"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Role (e.g. CTO)"
                                        value={memberRole}
                                        onChange={(e) => setMemberRole(e.target.value)}
                                    />
                                    <Button size="sm" onClick={() => handleAddTeamMember(s.id)}>Add</Button>
                                </div>

                                <div className="space-y-1 pt-1">
                                    {s.members && s.members.length > 0 ? (
                                        s.members.map((m) => (
                                            <div key={m.id} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                                                <span><strong className="text-gray-900">{m.name}</strong> ({m.role})</span>
                                                <button onClick={() => handleRemoveTeamMember(s.id, m.id)} className="text-gray-400 hover:text-red-600 cursor-pointer">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic">No custom team members registered.</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12 text-gray-500 text-sm">
                    No startups active. Click "Launch Venture" to create your startup profile.
                </Card>
            )}

            {/* Launch Modal */}
            <Modal
                isOpen={isLaunchModalOpen}
                onClose={() => setIsLaunchModalOpen(false)}
                title="Launch New Venture"
            >
                <form onSubmit={handleLaunchSubmit} className="space-y-4">
                    <Input
                        label="Venture Name"
                        placeholder="E.g. Lunar Core"
                        value={launchForm.title}
                        onChange={(e) => setLaunchForm({ ...launchForm, title: e.target.value })}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700">Executive Summary</label>
                        <textarea
                            placeholder="Describe core mission..."
                            value={launchForm.description}
                            onChange={(e) => setLaunchForm({ ...launchForm, description: e.target.value })}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 h-24 resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Domain</label>
                            <select
                                value={launchForm.domain}
                                onChange={(e) => setLaunchForm({ ...launchForm, domain: e.target.value })}
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                {DOMAINS.slice(1).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Stage</label>
                            <select
                                value={launchForm.stage}
                                onChange={(e) => setLaunchForm({ ...launchForm, stage: e.target.value })}
                                className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                {STAGES.slice(1).map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        type="number"
                        label="Funding Goal (Lakhs ₹)"
                        placeholder="50"
                        value={launchForm.funding_required}
                        onChange={(e) => setLaunchForm({ ...launchForm, funding_required: e.target.value })}
                        required
                    />

                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsLaunchModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLaunching}>
                            {isLaunching ? "Launching..." : "Launch Venture"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
