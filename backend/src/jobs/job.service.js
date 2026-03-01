/**
 * Background Jobs & Queueing Engine ⚡
 * Using BullMQ for robust processing behind the scenes.
 * Backed by Redis to handle email logic, notifications, and analytics.
 */

const { Queue, Worker } = require('bullmq');
const redisClient = require('../config/redis');

// Creating Queues
const emailQueue = new Queue('EMAIL_QUEUE', { connection: redisClient });
const notificationQueue = new Queue('NOTIFICATION_QUEUE', { connection: redisClient });

/**
 * Service to add items to the background worker queues.
 */
class JobService {
    async queueEmail(to, type, payload) {
        await emailQueue.add(`email-${type}-${to}`, { to, type, payload });
        console.log(`[JOB QUEUED]: Email scheduled to ${to}`);
    }

    async queuePushNotification(userId, message) {
        await notificationQueue.add(`push-${userId}`, { userId, message });
        console.log(`[JOB QUEUED]: Notification scheduled for ${userId}`);
    }
}

// In a production environment, Workers would be running as a separate service
module.exports = new JobService();
