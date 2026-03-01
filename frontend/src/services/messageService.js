import { delay, db } from "./mockDb";

/**
 * MessageService (Simulated API) 📬
 * Manages user communication and conversation history.
 */
class MessageService {
    /**
     * GET /api/messages
     */
    async getUserConversations(userId) {
        await delay(1200);
        const data = db.getData();
        const convos = data.messages.filter(m => m.senderId === userId || m.receiverId === userId);
        return convos;
    }

    /**
     * POST /api/messages
     */
    async sendMessage(senderId, recipientId, content) {
        await delay(800);
        const data = db.getData();
        const msg = {
            id: "m" + Date.now(),
            senderId,
            recipientId,
            content,
            timestamp: new Date().toISOString(),
            status: "sent"
        };
        data.messages.push(msg);
        db.saveData(data);
        return msg;
    }
}

/**
 * NotificationService (Simulated API) 🔔
 * Manages real-time ecosystem alerts and unread badges.
 */
class NotificationService {
    /**
     * GET /api/notifications
     */
    async fetchUserAlerts(userId) {
        await delay(1500);
        const data = db.getData();
        const alerts = data.notifications.filter(n => n.userId === userId);
        return alerts;
    }

    /**
     * PATCH /api/notifications/:id/read
     */
    async markAsRead(id) {
        await delay(300);
        const data = db.getData();
        const index = data.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            data.notifications[index].read = true;
            db.saveData(data);
        }
        return { success: true };
    }
}

export const messageService = new MessageService();
export const notificationService = new NotificationService();
