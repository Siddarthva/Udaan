const projectRepo = require('../projects/project.repository');
const cacheService = require('../../services/cache.service');

/**
 * Discovery Engine 🔍
 * Optimized for startup matching, trending feeds, and search functionality.
 */
class DiscoveryService {
    /**
     * Gets a trending feed of projects.
     * Caches the result in Redis for performance.
     */
    async getTrendingFeed(limit = 10) {
        const cacheKey = `discovery:trending:${limit}`;
        const cachedResults = await cacheService.get(cacheKey);

        if (cachedResults) {
            console.log('[CACHE HIT]: Serving trending feed from Redis');
            return cachedResults;
        }

        console.log('[CACHE MISS]: Querying PostgreSQL for trending projects');
        const projects = await projectRepo.findAll(); // Sorting by trending_score
        const results = projects.slice(0, limit);

        // Cache for 10 minutes to maintain performance
        await cacheService.set(cacheKey, results, 600);
        return results;
    }

    /**
     * Matches innovators with potential mentors/investors based on domain.
     */
    async getTargetedMatches(userId, role) {
        // Logic to correlate profile tags/domain with targeted entities
        return { message: "Personalized matching engine under development" };
    }
}

module.exports = new DiscoveryService();
