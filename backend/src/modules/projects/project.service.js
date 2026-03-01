const projectRepo = require('./project.repository');

/**
 * Projects Service Layer: Business logic for ecosystem actions 💡
 * Handles project creation requirements, status updates, and verification.
 */
class ProjectService {
    async createProject(userId, projectData) {
        // Enforce basic ecosystem rules
        if (!projectData.title || !projectData.domain) {
            throw new Error('Project title and domain are required to launch a node.');
        }

        return projectRepo.create({
            owner_id: userId,
            ...projectData,
            raised: 0.0,
            trending_score: 100, // new projects start with a baseline momentum
            created_at: new Date()
        });
    }

    async getProjectDiscovery(filters) {
        return projectRepo.findAll(filters);
    }

    async getProjectDetails(id) {
        const project = await projectRepo.findById(id);
        if (!project) throw new Error('Project coordinate not found in the innovation network.');
        return project;
    }
}

module.exports = new ProjectService();
