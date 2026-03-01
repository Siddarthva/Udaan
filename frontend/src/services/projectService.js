import { delay, db } from "./mockDb";

/**
 * ProjectService (Simulated API) 🏗️
 * Handles CRUD operations for innovation nodes/projects.
 * Simulates real REST API behavior using Promises.
 */
class ProjectService {
    /**
     * GET /api/projects
     */
    async fetchAll(filters = {}) {
        await delay(1000); // Simulate network round-trip

        const data = db.getData();
        let projects = [...data.projects];

        if (filters.domain) projects = projects.filter(p => p.domain === filters.domain);
        if (filters.status) projects = projects.filter(p => p.status === filters.status);
        if (filters.search) {
            const query = filters.search.toLowerCase();
            projects = projects.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        }

        return projects;
    }

    /**
     * GET /api/projects/:id
     */
    async fetchById(id) {
        await delay(600);
        const data = db.getData();
        const project = data.projects.find(p => p.id === id);
        if (!project) throw new Error("Innovation Node not found.");
        return project;
    }

    /**
     * POST /api/projects
     */
    async create(projectData, ownerId) {
        await delay(1500); // Simulate processing time

        const data = db.getData();
        const newProject = {
            id: "p" + Date.now(),
            ownerId,
            status: "Idea",
            raised: 0.0,
            trending_score: 100,
            createdAt: new Date().toISOString(),
            ...projectData,
        };

        data.projects.push(newProject);
        db.saveData(data);

        return newProject;
    }

    /**
     * PATCH /api/projects/:id
     */
    async update(id, updateData) {
        await delay(1200);
        const data = db.getData();
        const index = data.projects.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Cannot find node for update.");

        const updated = { ...data.projects[index], ...updateData, updatedAt: new Date().toISOString() };
        data.projects[index] = updated;
        db.saveData(data);

        return updated;
    }

    /**
     * DELETE /api/projects/:id
     */
    async delete(id) {
        await delay(800);
        const data = db.getData();
        data.projects = data.projects.filter(p => p.id !== id);
        db.saveData(data);
        return { success: true };
    }
}

export default new ProjectService();
