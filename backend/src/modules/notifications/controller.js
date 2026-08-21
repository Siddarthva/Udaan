const notificationsService = require('./service');

class NotificationsController {
    async getNotifications(req, res) {
        const notifications = await notificationsService.getNotifications(req.user.id);
        res.status(200).json({ notifications });
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
