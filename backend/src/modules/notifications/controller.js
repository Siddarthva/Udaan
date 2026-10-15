const notificationsService = require('./service');

class NotificationsController {
    async getNotifications(req, res) {
        const { notifications, unread_count } = await notificationsService.getNotifications(req.user.id);
        res.status(200).json({ notifications, unread_count });
    }

    async markSingleAsRead(req, res) {
        const result = await notificationsService.markSingleAsRead(req.user.id, req.params.id);
        res.status(200).json({ result, message: 'Notification marked as read' });
    }

    async markAsRead(req, res) {
        const result = await notificationsService.markAllAsRead(req.user.id);
        res.status(200).json({ result, message: 'Notifications marked as read' });
    }
}

module.exports = new NotificationsController();
