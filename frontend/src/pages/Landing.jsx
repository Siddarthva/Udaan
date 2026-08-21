import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
            {/* Minimal Header */}
            <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-900 text-white font-bold rounded-lg flex items-center justify-center text-sm">
                        U
                    </div>
                    <span className="font-bold text-gray-900 text-base tracking-tight">UDAAN</span>
                </div>
                <Button onClick={() => navigate("/auth")} size="sm">
                    Access Portal <ArrowRight size={14} className="ml-1" />
                </Button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-gray-200">
                    Startup Crowdfunding Platform
                </span>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                    The operating system for startup launch & funding.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Connect visionaries with mentors and investors. Build ventures, secure funding, and scale high-impact startup ecosystems.
                </p>
                <div className="flex gap-3">
                    <Button onClick={() => navigate("/auth")} size="lg">
                        Get Started <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-20 text-left w-full">
                    <Card className="space-y-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-900 border border-gray-200">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Structured Ventures</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Launch startups with funding milestones, pitch deck attachments, and team member management.
                        </p>
                    </Card>

                    <Card className="space-y-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-900 border border-gray-200">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Verified Connections</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Role-based portal for founders, accredited sponsors, and senior academic mentors.
                        </p>
                    </Card>

                    <Card className="space-y-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-900 border border-gray-200">
                            <Target size={20} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Direct Capital Tracking</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Track saved startup watchlists and express allocation interest directly to founders.
                        </p>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} UDAAN Platform. All rights reserved.
            </footer>
        </div>
    );
}
