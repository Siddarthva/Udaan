const redisClient = require('../config/redis');

/**
 * Cache Service ⚡
 * Handles Redis-based operations for fast data retrieval and temporary storage.
 */
class CacheService {
    async set(key, value, expirySeconds = 3600) {
        try {
            const data = typeof value === 'string' ? value : JSON.stringify(value);
            await redisClient.set(key, data, { EX: expirySeconds });
        } catch (err) {
            console.error('[CACHE SET ERROR]:', err.message);
        }
    }

    async get(key) {
        try {
            const data = await redisClient.get(key);
            if (!data) return null;
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } catch (err) {
            console.error('[CACHE GET ERROR]:', err.message);
            return null;
        }
    }

    async incrementCounter(key) {
        return redisClient.incr(key);
    }

    async delete(key) {
        return redisClient.del(key);
    }
}

module.exports = new CacheService();
