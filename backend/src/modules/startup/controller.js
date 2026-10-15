const startupService = require('./service');

class StartupController {
    async listStartups(req, res) {
        const startups = await startupService.listStartups(req.query, req.user.id);
        res.status(200).json({ count: startups.length, startups });
    }

    async getTrendingStartups(req, res) {
        const startups = await startupService.getTrendingStartups();
        res.status(200).json({ count: startups.length, startups });
    }

    async getStartupAnalytics(req, res) {
        const analytics = await startupService.getStartupAnalytics(req.user.id, req.params.id);
        res.status(200).json({ analytics });
    }

    async getDetails(req, res) {
        const startup = await startupService.getStartupDetails(req.params.id);
        res.status(200).json({ startup });
    }

    async launchStartup(req, res) {
        // founder_id always comes from the authenticated identity, never from the request body.
        const startup = await startupService.createStartup(req.user.id, req.body);
        res.status(201).json({ message: 'Startup launched successfully', startup });
    }

    async updateStartup(req, res) {
        const startup = await startupService.updateStartup(req.user.id, req.params.id, req.body);
        res.status(200).json({ message: 'Startup updated successfully', startup });
    }

    async simulateInvestment(req, res) {
        const transaction = await startupService.simulateInvestment(req.user.id, req.params.id, req.body);
        res.status(200).json({ message: 'Simulated funding completed (demo only, nothing was charged or saved)', transaction });
    }

    async getActivityFeed(req, res) {
        const activities = await startupService.getActivityFeed();
        res.status(200).json({ activities });
    }

    async addMember(req, res) {
        const member = await startupService.addMember(req.user.id, req.params.id, req.body);
        res.status(201).json({ message: 'Member added successfully', member });
    }

    async removeMember(req, res) {
        await startupService.removeMember(req.user.id, req.params.id, req.params.memberId);
        res.status(200).json({ message: 'Member removed successfully' });
    }

    async expressInterest(req, res) {
        const interest = await startupService.expressInterest(req.user.id, req.params.id, req.body.message ?? req.body.notes);
        res.status(201).json({ message: 'Interest expressed successfully', interest });
    }

    async getInvestorInterests(req, res) {
        const interests = await startupService.getInterests(req.user);
        res.status(200).json({ interests });
    }

    async saveStartup(req, res) {
        const result = await startupService.toggleSave(req.user.id, req.params.id);
        res.status(200).json({
            message: result.saved ? 'Startup saved to watchlist' : 'Startup removed from watchlist',
            saved: result.saved
        });
    }

    async getSavedStartups(req, res) {
        const saved = await startupService.getSavedStartups(req.user.id);
        res.status(200).json({ saved });
    }

    async sendMentorRequest(req, res) {
        const request = await startupService.sendMentorRequest(req.user.id, req.params.id, req.body.message);
        res.status(201).json({ message: 'Mentorship request sent successfully', request });
    }

    async getMentorRequests(req, res) {
        const requests = await startupService.getMentorRequests(req.user);
        res.status(200).json({ requests });
    }

    async updateMentorRequestStatus(req, res) {
        const request = await startupService.updateMentorRequestStatus(req.user.id, req.params.id, req.body.status);
        res.status(200).json({ message: `Request ${request.status}`, request });
    }

    async createUpdate(req, res) {
        const update = await startupService.createStartupUpdate(req.user.id, req.params.id, req.body);
        res.status(201).json({ message: 'Update posted successfully', update });
    }

    async deleteUpdate(req, res) {
        await startupService.deleteStartupUpdate(req.user.id, req.params.id);
        res.status(200).json({ message: 'Update deleted successfully' });
    }

    async getUpdates(req, res) {
        const updates = await startupService.getStartupUpdates(req.params.id);
        res.status(200).json({ updates });
    }
}

module.exports = new StartupController();
