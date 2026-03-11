import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MessageSquare, Heart, Share2, MoreHorizontal, Plus } from "lucide-react";
import postsData from "@/data/feedPosts";

export default function FeedPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="font-serif text-5xl font-bold tracking-tight mb-2">Community</h1>
                    <p className="text-gray-500 text-lg uppercase tracking-widest text-xs font-bold">Insights from the forefront of innovation</p>
                </div>
                <Button className="h-14 px-8 rounded-2xl shadow-xl flex items-center gap-2">
                    <Plus size={20} /> Share Insight
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {["All", "Founders", "Mentors", "Investors"].map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border-2 ${activeFilter === f
                            ? "bg-[#2F2F2F] border-[#2F2F2F] text-white shadow-xl"
                            : "bg-white border-transparent text-gray-500 hover:bg-gray-50 shadow-sm"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Posts List */}
            <div className="space-y-8">
                {postsData.map((post, i) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-0 overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-[#CBD4CE] rounded-[1.25rem] flex items-center justify-center font-bold text-lg">
                                            {post.author?.[0] || "U"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{post.author}</h4>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{post.role || "Innovator"}</p>
                                        </div>
                                    </div>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    {post.content}
                                </p>

                                {post.image && (
                                    <div className="mb-8 rounded-[2rem] overflow-hidden">
                                        <img src={post.image} alt="Post content" className="w-full object-cover max-h-[400px]" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-8">
                                        <button className="flex items-center gap-2 group">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl group-hover:bg-red-50 text-gray-400 group-hover:text-red-500 transition-colors">
                                                <Heart size={20} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-red-500 transition-colors uppercase tracking-widest">{post.likes || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-2 group">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <MessageSquare size={20} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-blue-500 transition-colors uppercase tracking-widest">{post.comments || 0}</span>
                                        </button>
                                    </div>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-black transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
