import React from "react";
import { motion } from "framer-motion";
import { Bell, Zap, MessageSquare, Target, UserPlus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const MOCK_NOTIFS = [
    { id: 1, type: "funding", title: "New Funding Milestone", desc: "EcoSphere just hit 50% of their funding goal!", time: "2m ago", icon: Target, color: "text-blue-600 bg-blue-50" },
    { id: 2, type: "message", title: "New Message", desc: "Sarah Chen sent you a strategy document.", time: "15m ago", icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
    { id: 3, type: "system", title: "Node Update", desc: "Your project views increased by 40% this week.", time: "1h ago", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { id: 4, type: "network", title: "New Follower", desc: "Marco Rossi followed your innovation journey.", time: "3h ago", icon: UserPlus, color: "text-green-600 bg-green-50" },
];

export default function NotificationsPage() {
    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-12">
                <h1 className="font-serif text-5xl font-bold tracking-tight">Alerts</h1>
                <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest text-gray-400">Mark all as read</Button>
            </div>

            <div className="space-y-4">
                {MOCK_NOTIFS.map((n, i) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-6 border-none hover:shadow-lg transition-all cursor-pointer group">
                            <div className="flex gap-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                                    <n.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-lg">{n.title}</h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{n.time}</span>
                                    </div>
                                    <p className="text-gray-500">{n.desc}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
