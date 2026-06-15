const startupService = require('./startup.service');

class StartupController {
    async listStartups(req, res) {
        try {
            const { domain, stage, search } = req.query;
            const startups = await startupService.listStartups({ domain, stage, search });
            res.status(200).json({ count: startups.length, startups });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getDetails(req, res) {
        try {
            const startup = await startupService.getStartupDetails(req.params.id);
            res.status(200).json({ startup });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    async launchStartup(req, res) {
        try {
            const userId = req.user.id;
            const newStartup = await startupService.createStartup(userId, req.body);
            res.status(201).json({
                message: 'Startup launched successfully',
                startup: newStartup
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async updateStartup(req, res) {
        try {
            const userId = req.user.id;
            const updated = await startupService.updateStartup(userId, req.params.id, req.body);
            res.status(200).json({
                message: 'Startup updated successfully',
                startup: updated
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async addMember(req, res) {
        try {
            const userId = req.user.id;
            const member = await startupService.addMember(userId, req.params.id, req.body);
            res.status(201).json({
                message: 'Member added successfully',
                member
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async removeMember(req, res) {
        try {
            const userId = req.user.id;
            await startupService.removeMember(userId, req.params.id, req.params.memberId);
            res.status(200).json({ message: 'Member removed successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async expressInterest(req, res) {
        try {
            const investorId = req.user.id;
            const { notes } = req.body;
            const interest = await startupService.expressInterest(investorId, req.params.id, notes);
            res.status(201).json({
                message: 'Interest expressed successfully',
                interest
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getInvestorInterests(req, res) {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const interests = await startupService.getInvestorInterests(userId, role);
            res.status(200).json({ interests });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async saveStartup(req, res) {
        try {
            const userId = req.user.id;
            const result = await startupService.saveStartup(userId, req.params.id);
            res.status(200).json({
                message: result.saved ? 'Startup saved to watchlist' : 'Startup removed from watchlist',
                saved: result.saved
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getSavedStartups(req, res) {
        try {
            const userId = req.user.id;
            const saved = await startupService.getSavedStartups(userId);
            res.status(200).json({ saved });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async sendMentorRequest(req, res) {
        try {
            const mentorId = req.user.id;
            const { message } = req.body;
            const request = await startupService.sendMentorRequest(mentorId, req.params.id, message);
            res.status(201).json({
                message: 'Mentorship request sent successfully',
                request
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getMentorRequests(req, res) {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const requests = await startupService.getMentorRequests(userId, role);
            res.status(200).json({ requests });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async updateMentorRequestStatus(req, res) {
        try {
            const userId = req.user.id;
            const { status } = req.body; // 'accepted' or 'rejected'
            const request = await startupService.updateMentorRequestStatus(userId, req.params.id, status);
            res.status(200).json({
                message: `Request status updated to ${status}`,
                request
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new StartupController();
