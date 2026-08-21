const { supabase } = require('../../config/supabase');
const ApiError = require('../../utils/ApiError');

class NotificationsService {
    async getNotifications(userId) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*, actor:actor_id(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new ApiError(500, error.message || 'Failed to fetch notifications');

        return (data || []).map(n => ({
            ...n,
            actor_name: n.actor?.full_name || 'User',
            actor_avatar: n.actor?.profile_picture || null
        }));
    }

    async markSingleAsRead(userId, notificationId) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)
            .eq('user_id', userId);

        if (error) throw new ApiError(500, error.message || 'Failed to mark notification as read');
        return { success: true };
    }

    async markAllAsRead(userId) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId);

        if (error) throw new ApiError(500, error.message || 'Failed to mark notifications as read');
        return { success: true };
    }
}

module.exports = new NotificationsService();
