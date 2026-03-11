import React, { useState } from "react";
import { User, Shield, Bell, CreditCard, Lock, Eye, Key } from "lucide-react";
import { Card, Button, InputField, ToggleSwitch } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// Helper component for a Settings Section grouping
const SettingsSection = ({ title, description, children }) => (
    <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 last:border-0 items-start">
        <div className="w-full md:w-1/3 shrink-0">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-6">
            {children}
        </div>
    </div>
);

export default function SettingsPage() {
    const { user, updateProfile } = useAuthStore();
    const [fullName, setFullName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [stealthMode, setStealthMode] = useState(false);
    const [discovery, setDiscovery] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [alerts, setAlerts] = useState(true);

    const firstName = fullName.split(" ").filter(Boolean).slice(0, -1).join(" ") || fullName;
    const lastName = fullName.split(" ").filter(Boolean).slice(-1).join(" ");

    const handleFirstNameChange = (value) => {
        const nextName = [value, lastName].filter(Boolean).join(" ").trim();
        setFullName(nextName);
    };

    const handleLastNameChange = (value) => {
        const nextName = [firstName, value].filter(Boolean).join(" ").trim();
        setFullName(nextName);
    };

    const handleSaveProfile = () => {
        const cleanedName = fullName.trim();
        const cleanedEmail = email.trim();

        if (!cleanedName || !cleanedEmail) {
            toast.error("Name and email are required.");
            return;
        }

        updateProfile({
            name: cleanedName,
            email: cleanedEmail,
            bio: bio.trim(),
        });
        toast.success("Profile updated successfully.");
    };

    return (
        <div className="max-w-[1000px] mx-auto w-full pb-24">
            <PageHeader
                title="Settings"
                description="Manage your account preferences, security, and notification settings."
                action={
                    <div className="flex gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="primary">Save Changes</Button>
                    </div>
                }
            />

            <Card noPadding className="border-gray-200">
                <div className="divide-y divide-gray-100 px-6 sm:px-10">

                    {/* Profile Settings */}
                    <SettingsSection
                        title="Profile Overview"
                        description="Update your basic profile information and visibility settings."
                    >
                        <div className="grid gap-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <InputField label="First Name" value={firstName} onChange={(e) => handleFirstNameChange(e.target.value)} />
                                <InputField label="Last Name" value={lastName} onChange={(e) => handleLastNameChange(e.target.value)} />
                            </div>
                            <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} hint="We will email you to verify passing changes." />
                            <InputField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell others what you are building." />
                            <div className="pt-2 flex justify-end">
                                <Button variant="secondary" size="sm" onClick={handleSaveProfile}>Update Profile</Button>
                            </div>
                        </div>

                        <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-5">
                            <ToggleSwitch
                                checked={stealthMode}
                                onChange={setStealthMode}
                                label="Stealth Mode"
                                description="Hide your active projects from general browsing."
                            />
                            <div className="w-full h-[1px] bg-gray-200"></div>
                            <ToggleSwitch
                                checked={discovery}
                                onChange={setDiscovery}
                                label="Discovery Index"
                                description="List profile in 'Rising Creators' directory."
                            />
                        </div>
                    </SettingsSection>

                    {/* Security Settings */}
                    <SettingsSection
                        title="Security"
                        description="Ensure your account stays secure and review authentication methods."
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-md text-gray-600"><Lock size={18} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Password</p>
                                        <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm">Change Password</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-md text-gray-600"><Shield size={18} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                                        <p className="text-xs text-gray-500">{twoFactor ? "Enabled via Authenticator" : "Not enabled"}</p>
                                    </div>
                                </div>
                                <Button
                                    variant={twoFactor ? "outline" : "secondary"}
                                    size="sm"
                                    onClick={() => setTwoFactor(!twoFactor)}
                                >
                                    {twoFactor ? "Manage 2FA" : "Enable 2FA"}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-md text-gray-600"><Key size={18} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">API Access</p>
                                        <p className="text-xs text-gray-500">Manage developer endpoints and keys</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm">Manage API Keys</Button>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Notification Preferences */}
                    <SettingsSection
                        title="Notifications"
                        description="Decide what you want to be notified about and how."
                    >
                        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-5">
                            <ToggleSwitch
                                checked={alerts}
                                onChange={setAlerts}
                                label="System Alerts & Deal Flow"
                                description="Critical updates regarding project funding, views, or new mentorship assignments."
                            />
                            <div className="flex justify-end pt-2">
                                <Button variant="outline" size="sm">Detailed Notification Preferences</Button>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Billing */}
                    <SettingsSection
                        title="Billing & Subscription"
                        description="Manage the Creator Pro seat and current billing cycles."
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border border-gray-200 rounded-lg bg-white shadow-sm gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-gray-100 rounded-md text-gray-600 shrink-0"><CreditCard size={18} /></div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900">Creator Pro Plan</p>
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide">Active</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">₹4,999 / month — Renews on Oct 5</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full sm:w-auto shrink-0">Manage Billing</Button>
                        </div>
                    </SettingsSection>
                </div>
            </Card>
        </div>
    );
}
