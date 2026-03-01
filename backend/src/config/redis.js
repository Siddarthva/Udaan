const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('❌ [REDIS ERROR]: Failed to connect to Redis', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('⚡ [CACHE CONNECTED]: Redis Active');
    } catch (err) {
        console.error('❌ [REDIS CONNECTION FAILED]: Ensure Redis server is active');
    }
})();

module.exports = redisClient;
