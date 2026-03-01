const projectService = require('./project.service');

/**
 * Projects Controller: Handles HTTP requests for startup discovery/creation 🌐
 */
class ProjectController {
    /**
     * GET /api/projects
     */
    async listProjects(req, res) {
        try {
            const { domain, stage } = req.query;
            const projects = await projectService.getProjectDiscovery({ domain, stage });
            res.status(200).json({ count: projects.length, projects });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * POST /api/projects
     */
    async launchNode(req, res) {
        try {
            // User must be authenticated to launch a project
            const userId = req.user.id;
            const newProject = await projectService.createProject(userId, req.body);
            res.status(201).json({
                message: 'Innovation node successfully added to the ecosystem',
                project: newProject
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * GET /api/projects/:id
     */
    async getDetails(req, res) {
        try {
            const project = await projectService.getProjectDetails(req.params.id);
            res.status(200).json({ project });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
}

module.exports = new ProjectController();
