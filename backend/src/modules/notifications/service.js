const { getAdminClient } = require('../../config/supabase');
const { TABLES, cols } = require('../../config/schema');
const { unwrap } = require('../../utils/db');
const { isUuid } = require('../../utils/db');
const ApiError = require('../../utils/ApiError');
const { loadPublicProfiles } = require('../common/profiles');

class NotificationsService {
    get db() {
        return getAdminClient();
    }

    /**
     * Creates a notification as a side effect of another successful operation.
     * A failure here must not undo the primary action, but it is always logged, never silently dropped.
     */
    async notify(userId, actorId, type, message) {
        if (!userId || userId === actorId) return null;
        const { data, error } = await this.db
            .from(TABLES.notifications)
            .insert({ user_id: userId, actor_id: actorId, type, message, is_read: false })
            .select('id')
            .maybeSingle();
        if (error) {
            console.error(`[NOTIFY] Failed to create '${type}' notification for ${userId}: ${error.message} (code ${error.code})`);
            return null;
        }
        return data;
    }

    async getNotifications(userId) {
        const rows = unwrap(
            await this.db.from(TABLES.notifications).select(cols('notifications'))
                .eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
            'Load notifications'
        ) || [];

        const actors = await loadPublicProfiles(rows.map((n) => n.actor_id));
        const notifications = rows.map((n) => {
            const actor = actors.get(n.actor_id);
            return {
                ...n,
                read: Boolean(n.is_read),
                actor_name: actor?.full_name || actor?.username || null,
                actor_avatar: actor?.avatar_url || null
            };
        });
        return { notifications, unread_count: notifications.filter((n) => !n.read).length };
    }

    async markSingleAsRead(userId, notificationId) {
        if (!isUuid(notificationId)) throw new ApiError(400, 'Invalid notification id');
        const rows = unwrap(
            await this.db.from(TABLES.notifications).update({ is_read: true })
                .eq('id', notificationId).eq('user_id', userId).select('id'),
            'Mark notification read'
        );
        if (!rows || rows.length === 0) throw new ApiError(404, 'Notification not found');
        return { success: true };
    }

    async markAllAsRead(userId) {
        unwrap(
            await this.db.from(TABLES.notifications).update({ is_read: true }).eq('user_id', userId).eq('is_read', false),
            'Mark notifications read'
        );
        return { success: true };
    }
}

module.exports = new NotificationsService();
