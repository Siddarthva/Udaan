import React from "react";
import { Bell, Target, Users, UserPlus, Heart, MessageSquare, CheckCheck } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useNotificationsQuery, useMarkNotificationsReadMutation, useMarkNotificationReadMutation } from "@/api/hooks";
import { errorMessage } from "@/api/axios";
import toast from "react-hot-toast";

function iconFor(type) {
    switch (type) {
        case "new_follower":
            return <UserPlus className="w-4 h-4 text-indigo-600" />;
        case "investment_interest":
            return <Heart className="w-4 h-4 text-rose-600" />;
        case "mentorship_request":
        case "team_added":
            return <Users className="w-4 h-4 text-emerald-600" />;
        case "message_request":
        case "request_accepted":
        case "request_rejected":
            return <MessageSquare className="w-4 h-4 text-sky-600" />;
        case "startup_update":
            return <Target className="w-4 h-4 text-amber-600" />;
        default:
            return <Bell className="w-4 h-4 text-gray-600" />;
    }
}

export default function Notifications() {
    const { data, isLoading, isError, error, refetch } = useNotificationsQuery();
    const markAll = useMarkNotificationsReadMutation();
    const markOne = useMarkNotificationReadMutation();

    const notifications = data?.notifications || [];
    const unread = data?.unread_count || 0;

    const handleMarkAll = async () => {
        try {
            await markAll.mutateAsync();
        } catch (err) {
            toast.error(errorMessage(err, "Failed to mark notifications as read"));
        }
    };

    const handleMarkOne = async (n) => {
        if (n.read) return;
        try {
            await markOne.mutateAsync(n.id);
        } catch (err) {
            toast.error(errorMessage(err, "Failed to mark notification as read"));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Notifications</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {unread > 0 ? `${unread} unread` : "You're all caught up"}
                    </p>
                </div>
                {unread > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={markAll.isPending}>
                        <CheckCheck size={14} className="mr-1.5" /> Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-500">Loading notifications...</div>
                ) : isError ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-red-200 space-y-3">
                        <p className="text-sm font-semibold text-red-700">Couldn't load notifications</p>
                        <p className="text-xs text-gray-500">{errorMessage(error)}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                        <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-700">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">Updates on followers, interest, and mentorship will appear here.</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <Card
                            key={n.id}
                            onClick={() => handleMarkOne(n)}
                            className={`flex items-start gap-4 transition-colors ${!n.read ? "bg-indigo-50/30 cursor-pointer" : ""}`}
                        >
                            <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                                {iconFor(n.type)}
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 text-xs">{n.actor_name || "UDAAN"}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{n.message}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
