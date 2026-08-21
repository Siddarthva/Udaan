import React, { useState } from "react";
import { Search, BookOpen, GraduationCap, Mail, Linkedin } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { DOMAINS } from "@/utils/constants";

// Mentor dataset
const MENTORS = [
    {
        id: "m1",
        name: "Dr. Aris Thorne",
        designation: "Professor of Artificial Intelligence",
        institution: "IIT Bombay",
        domain: "DeepTech",
        experience: "15+ Years",
        bio: "Specializing in neural networks, autonomous agents, and deep learning infrastructure.",
        publications: 34
    },
    {
        id: "m2",
        name: "Dr. Elena Rostova",
        designation: "Head of Clean Energy Research",
        institution: "IISc Bangalore",
        domain: "CleanTech",
        experience: "12+ Years",
        bio: "Expert in battery chemistry, solar photovoltaics, and sustainable grid integration.",
        publications: 28
    },
    {
        id: "m3",
        name: "Prof. Vikramaditya Sen",
        designation: "Chair of Financial Technologies",
        institution: "IIM Ahmedabad",
        domain: "FinTech",
        experience: "18+ Years",
        bio: "Focusing on algorithmic trading systems, decentralized finance protocols, and monetary policy.",
        publications: 42
    },
    {
        id: "m4",
        name: "Dr. Meera Nambiar",
        designation: "Director of AgTech Innovation",
        institution: "TNAU Coimbatore",
        domain: "AgriTech",
        experience: "10+ Years",
        bio: "Precision farming expert with emphasis on IoT soil telemetry and automated crop diagnostics.",
        publications: 19
    }
];

export default function Mentors() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [selectedMentor, setSelectedMentor] = useState(null);

    const filteredMentors = MENTORS.filter((m) => {
        const matchSearch =
            !searchQuery ||
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.bio.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDomain = selectedDomain === "All" || m.domain === selectedDomain;
        return matchSearch && matchDomain;
    });

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Faculty & Academic Mentors</h1>
                <p className="text-xs text-gray-500 mt-0.5">Directory of senior researchers and mentors supporting startup ventures</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="md:col-span-2">
                    <Input
                        icon={Search}
                        placeholder="Search mentors by name, institution, or domain..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    {DOMAINS.map((d) => (
                        <option key={d} value={d}>Specialization: {d}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMentors.map((m) => (
                    <Card key={m.id} className="space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{m.name}</h3>
                                    <p className="text-xs font-semibold text-gray-500">{m.designation}</p>
                                </div>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                                    {m.domain}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{m.bio}</p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                                <GraduationCap size={14} /> {m.institution}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setSelectedMentor(m)}>
                                View Dossier
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Mentor Modal */}
            <Modal
                isOpen={!!selectedMentor}
                onClose={() => setSelectedMentor(null)}
                title={selectedMentor?.name}
            >
                {selectedMentor && (
                    <div className="space-y-4 text-xs">
                        <div>
                            <p className="font-semibold text-gray-900">{selectedMentor.designation}</p>
                            <p className="text-gray-500">{selectedMentor.institution} • {selectedMentor.experience}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                            <p className="font-semibold text-gray-700 uppercase text-[10px]">Academic Profile</p>
                            <p className="text-gray-600">{selectedMentor.bio}</p>
                            <p className="text-gray-500 pt-1 font-medium">Peer-Reviewed Publications: {selectedMentor.publications}</p>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedMentor(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
