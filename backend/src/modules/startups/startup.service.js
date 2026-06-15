const startupRepo = require('./startup.repository');

class StartupService {
    async createStartup(userId, startupData) {
        if (!startupData.title || !startupData.domain) {
            throw new Error('Startup title and domain are required.');
        }

        return startupRepo.create({
            owner_id: userId,
            title: startupData.title,
            description: startupData.description || '',
            domain: startupData.domain,
            stage: startupData.stage || 'Idea',
            funding_required: parseFloat(startupData.funding_required) || 0,
            raised: parseFloat(startupData.raised) || 0,
            pitch_deck_url: startupData.pitch_deck_url || '',
            image_urls: startupData.image_urls ? JSON.stringify(startupData.image_urls) : null,
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    async updateStartup(userId, id, updateData) {
        const startup = await startupRepo.findById(id);
        if (!startup) throw new Error('Startup not found');
        if (startup.owner_id !== userId) throw new Error('Unauthorized update access');

        const updates = {
            title: updateData.title || startup.title,
            description: updateData.description !== undefined ? updateData.description : startup.description,
            domain: updateData.domain || startup.domain,
            stage: updateData.stage || startup.stage,
            funding_required: updateData.funding_required !== undefined ? parseFloat(updateData.funding_required) : startup.funding_required,
            raised: updateData.raised !== undefined ? parseFloat(updateData.raised) : startup.raised,
            pitch_deck_url: updateData.pitch_deck_url !== undefined ? updateData.pitch_deck_url : startup.pitch_deck_url,
            updated_at: new Date()
        };

        if (updateData.image_urls) {
            updates.image_urls = JSON.stringify(updateData.image_urls);
        }

        return startupRepo.update(id, updates);
    }

    async listStartups(filters) {
        const list = await startupRepo.findAll(filters);
        return list.map(s => {
            if (s.image_urls && typeof s.image_urls === 'string') {
                try {
                    s.image_urls = JSON.parse(s.image_urls);
                } catch (e) {
                    s.image_urls = [];
                }
            }
            return s;
        });
    }

    async getStartupDetails(id) {
        const startup = await startupRepo.findById(id);
        if (!startup) throw new Error('Startup not found');
        if (startup.image_urls && typeof startup.image_urls === 'string') {
            try {
                startup.image_urls = JSON.parse(startup.image_urls);
            } catch (e) {
                startup.image_urls = [];
            }
        }
        return startup;
    }

    async addMember(userId, startupId, memberData) {
        const startup = await startupRepo.findById(startupId);
        if (!startup) throw new Error('Startup not found');
        if (startup.owner_id !== userId) throw new Error('Unauthorized');

        return startupRepo.addMember({
            startup_id: startupId,
            name: memberData.name,
            role: memberData.role || 'Member',
            avatar_url: memberData.avatar_url || '',
            created_at: new Date()
        });
    }

    async removeMember(userId, startupId, memberId) {
        const startup = await startupRepo.findById(startupId);
        if (!startup) throw new Error('Startup not found');
        if (startup.owner_id !== userId) throw new Error('Unauthorized');

        return startupRepo.removeMember(startupId, memberId);
    }

    async expressInterest(investorId, startupId, notes) {
        return startupRepo.createInvestorInterest({
            investor_id: investorId,
            startup_id: startupId,
            notes: notes || '',
            status: 'expressed',
            created_at: new Date()
        });
    }

    async getInvestorInterests(userId, role) {
        return startupRepo.findInvestorInterestsForUser(userId, role);
    }

    async saveStartup(userId, startupId) {
        return startupRepo.saveStartup(userId, startupId);
    }

    async getSavedStartups(userId) {
        const list = await startupRepo.getSavedStartups(userId);
        return list.map(s => {
            if (s.image_urls && typeof s.image_urls === 'string') {
                try {
                    s.image_urls = JSON.parse(s.image_urls);
                } catch (e) {
                    s.image_urls = [];
                }
            }
            return s;
        });
    }

    async sendMentorRequest(mentorId, startupId, message) {
        return startupRepo.createMentorRequest({
            mentor_id: mentorId,
            startup_id: startupId,
            message,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    async getMentorRequests(userId, role) {
        return startupRepo.findMentorRequestsForUser(userId, role);
    }

    async updateMentorRequestStatus(userId, requestId, status) {
        // Find if this user is the owner of the startup associated with this request
        const request = await db('mentor_requests')
            .join('startups', 'startups.id', 'mentor_requests.startup_id')
            .select('mentor_requests.*', 'startups.owner_id')
            .where('mentor_requests.id', requestId)
            .first();
            
        if (!request) throw new Error('Mentor request not found');
        if (request.owner_id !== userId) throw new Error('Unauthorized: only startup owner can manage request states');

        return startupRepo.updateMentorRequestStatus(requestId, status);
    }
}

// Simple local db helper for updateRequestStatus
const db = require('../../config/db');

module.exports = new StartupService();
