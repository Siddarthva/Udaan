import React from "react";
import { useAuthStore } from "@/store/authStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Globe, Linkedin, Edit3, Grid, Bookmark, ArrowUpRight, Share2 } from "lucide-react";
import { GLOBAL_PROJECTS as projectsData } from "@/data/projects";

export default function ProfilePage() {
    const { user } = useAuthStore();

    const userProjects = projectsData.filter(p => p.founder === user?.name).slice(0, 3);

    return (
        <div className="pb-20 max-w-5xl mx-auto">
            <div className="relative mb-32">
                {/* Cover */}
                <div className="h-64 md:h-80 bg-gradient-to-r from-[#CBD4CE] to-[#F7F7F3] rounded-[3rem] shadow-sm"></div>

                {/* Profile Info Overlay */}
                <div className="absolute -bottom-20 left-0 w-full px-8 md:px-12 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-end gap-8">
                        <div className="h-40 w-40 bg-white p-2 rounded-[2.5rem] shadow-xl">
                            <div className="h-full w-full bg-[#2F2F2F] text-white rounded-[2rem] flex items-center justify-center text-5xl font-serif">
                                {user?.name?.[0]}
                            </div>
                        </div>
                        <div className="pb-4 text-[#2F2F2F]">
                            <h1 className="font-serif text-4xl font-bold mb-1 tracking-tight">{user?.name}</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{user?.handle || "@udaan_user"}</p>
                        </div>
                    </div>
                    <div className="pb-4 flex gap-4">
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200">
                            <Share2 size={18} className="mr-2" /> Share
                        </Button>
                        <Button className="h-12 px-6 rounded-xl shadow-lg">
                            <Edit3 size={18} className="mr-2" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mt-40">
                {/* Left Col: Info */}
                <div className="space-y-8">
                    <Card className="p-8 border-none text-[#2F2F2F]">
                        <h3 className="text-xl font-bold mb-6">About</h3>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {user?.bio || "Add a bio from Settings to personalize your profile."}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Globe size={18} />
                                <span className="text-sm font-medium">udaan.io/innovation</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <Linkedin size={18} />
                                <span className="text-sm font-medium">linkedin.com/in/user</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-none bg-[#2F2F2F] text-white">
                        <h3 className="text-xl font-bold mb-4">Ecosystem Stats</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-3xl font-bold">12</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Projects</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">1.2k</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Network</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Col: Content Tabs/Grids */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <div className="flex gap-8">
                                <button className="flex items-center gap-2 font-bold text-black border-b-2 border-black pb-4 -mb-[18px]">
                                    <Grid size={18} /> My Projects
                                </button>
                                <button className="flex items-center gap-2 font-bold text-gray-400 hover:text-black transition-colors">
                                    <Bookmark size={18} /> Bookmarks
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {userProjects.length > 0 ? (
                                userProjects.map((p) => (
                                    <Card key={p.id} className="p-6 border-none hover:shadow-lg transition-all cursor-pointer group text-[#2F2F2F]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors">{p.title}</h4>
                                                <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                                            </div>
                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-[#2F2F2F] group-hover:text-white transition-all">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                                    <Grid size={32} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-medium">No projects launched yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
