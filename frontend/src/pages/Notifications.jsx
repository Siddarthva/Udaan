import React, { useEffect } from "react";
import { Bell, CheckCircle, Target, Users, UserPlus, Heart, MessageSquare } from "lucide-react";
import Card from "@/components/Card";
import { useNotificationsQuery, useMarkNotificationsReadMutation } from "@/api/hooks";

export default function Notifications() {
    const { data: notifications = [], isLoading } = useNotificationsQuery();
    const markReadMutation = useMarkNotificationsReadMutation();

    useEffect(() => {
        if (notifications.some(n => !n.read)) {
            markReadMutation.mutate();
        }
    }, [notifications]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_follower':
                return <UserPlus className="w-4 h-4 text-indigo-600" />;
            case 'interest_received':
                return <Heart className="w-4 h-4 text-rose-600" />;
            case 'mentorship_request':
                return <Users className="w-4 h-4 text-emerald-600" />;
            case 'startup_update':
                return <MessageSquare className="w-4 h-4 text-sky-600" />;
            default:
                return <Bell className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Notifications</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Platform notifications, interest alerts, and mentorship updates</p>
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                        <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-700">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">Updates on followers, interest, and mentorship will appear here.</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <Card key={n.id} className={`flex items-start gap-4 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                            <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                                {getNotificationIcon(n.type)}
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 text-xs">{n.actor_name || 'System Alert'}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{n.message}</p>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
