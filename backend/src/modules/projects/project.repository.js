const db = require('../../config/db');

/**
 * Projects Repository Layer 🐘
 * Handles DB queries for startup creation, analytics, and discovery.
 */
class ProjectRepository {
    async findAll(filters = {}) {
        let query = db('projects').select('*');

        if (filters.domain) query = query.where({ domain: filters.domain });
        if (filters.stage) query = query.where({ stage: filters.stage });

        return query.orderBy('trending_score', 'desc');
    }

    async findById(id) {
        return db('projects').where({ id }).first();
    }

    async create(projectData) {
        const [project] = await db('projects').insert(projectData).returning('*');
        return project;
    }

    async update(id, updateData) {
        return db('projects').where({ id }).update(updateData).returning('*');
    }
}

module.exports = new ProjectRepository();
