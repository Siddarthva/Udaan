import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { useGenerateBioMutation } from "@/api/hooks";
import { Sparkles, Loader2, User, GraduationCap, Link } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
    const { user, updateProfile } = useAuth();
    const generateBioMutation = useGenerateBioMutation();

    const [fullName, setFullName] = useState(user?.full_name || user?.name || "");
    const [username, setUsername] = useState(user?.username || "");
    const [role, setRole] = useState(user?.role?.toLowerCase() || "innovator");
    const [bio, setBio] = useState(user?.bio || "");
    const [college, setCollege] = useState(user?.college || "");
    const [specialization, setSpecialization] = useState(user?.specialization || "");
    const [company, setCompany] = useState(user?.company || "");
    const [designation, setDesignation] = useState(user?.designation || "");
    const [location, setLocation] = useState(user?.location || "");
    const [githubUrl, setGithubUrl] = useState(user?.github_url || "");
    const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || "");
    const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || "");
    const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp_number || "");
    const [skillsText, setSkillsText] = useState(Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || "");
    const [saving, setSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || user.name || "");
            setUsername(user.username || "");
            setRole(user.role?.toLowerCase() || "innovator");
            setBio(user.bio || "");
            setCollege(user.college || "");
            setSpecialization(user.specialization || "");
            setCompany(user.company || "");
            setDesignation(user.designation || "");
            setLocation(user.location || "");
            setGithubUrl(user.github_url || "");
            setLinkedinUrl(user.linkedin_url || "");
            setPortfolioUrl(user.portfolio_url || "");
            setWhatsappNumber(user.whatsapp_number || "");
            setSkillsText(Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "");
        }
    }, [user]);

    const handleGenerateBio = async () => {
        try {
            const generatedBio = await generateBioMutation.mutateAsync({
                name: fullName || user?.name,
                role: role,
                skills: skillsText || "technology and venture building"
            });
            setBio(generatedBio);
            toast.success("Bio generated with AI!");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to generate AI bio");
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFieldErrors({});
        try {
            const skillsArr = skillsText.split(",").map(s => s.trim()).filter(Boolean);
            await updateProfile({
                full_name: fullName,
                username,
                role: role.toUpperCase(),
                bio,
                college,
                specialization,
                company,
                designation,
                location,
                github_url: githubUrl,
                linkedin_url: linkedinUrl,
                portfolio_url: portfolioUrl,
                whatsapp_number: whatsappNumber,
                skills: skillsArr
            });
            toast.success("Settings & profile updated successfully!");
        } catch (err) {
            setFieldErrors(err.fields || {});
            toast.error(err.message || "Failed to update settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Account Settings</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage your personal profile details, role, and professional background</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
                <Card className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <User size={18} /> Account Information & Role
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            error={fieldErrors.full_name}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
                        <Input
                            label="Username"
                            error={fieldErrors.username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe_dev"
                        />
                    </div>

                    <Input
                        label="Email Address"
                        value={user?.email || ""}
                        disabled
                        hint="Email address is bound to Supabase Auth and cannot be directly edited."
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700">Account Role</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["innovator", "mentor", "sponsor"].map((r) => {
                                const isSelected = role === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`p-3 rounded-lg border text-center font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                                            isSelected
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {r}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                <Card className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap size={18} /> Academic & Work Experience
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="College / University"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            placeholder="Stanford University"
                        />
                        <Input
                            label="Specialization / Field"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            placeholder="Computer Science"
                        />
                        <Input
                            label="Company / Organization"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="QuantumCore Inc."
                        />
                        <Input
                            label="Designation / Role Title"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Lead Architect"
                        />
                    </div>

                    <Input
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="San Francisco, CA"
                    />

                    <Input
                        label="Skills (comma separated)"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="AI, Quantum Computing, Product Strategy"
                    />

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="block text-xs font-semibold text-gray-700">Biography</label>
                            <button
                                type="button"
                                onClick={handleGenerateBio}
                                disabled={generateBioMutation.isPending}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                {generateBioMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                                Generate with AI
                            </button>
                        </div>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Brief description of your expertise and background..."
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 h-28 resize-none"
                        />
                    </div>
                </Card>

                <Card className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Link size={18} /> Contact & External Links
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="LinkedIn Profile URL"
                            error={fieldErrors.linkedin_url}
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.in/in/username"
                        />
                        <Input
                            label="GitHub Profile URL"
                            error={fieldErrors.github_url}
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username"
                        />
                        <Input
                            label="Portfolio Website"
                            error={fieldErrors.portfolio_url}
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            placeholder="https://myportfolio.com"
                        />
                        <Input
                            label="WhatsApp Contact Number"
                            error={fieldErrors.whatsapp_number}
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            placeholder="+1 555 123 4567"
                        />
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="px-6 h-10">
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Saving Changes...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
