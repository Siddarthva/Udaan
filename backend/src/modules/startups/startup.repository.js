const db = require('../../config/db');

class StartupRepository {
    // Startups CRUD
    async findAll(filters = {}) {
        let query = db('startups')
            .leftJoin('users', 'users.id', 'startups.owner_id')
            .select('startups.*', 'users.name as owner_name', 'users.email as owner_email', 'users.linkedin_url', 'users.whatsapp_number');

        if (filters.domain && filters.domain !== 'All') {
            query = query.where('startups.domain', filters.domain);
        }
        if (filters.stage && filters.stage !== 'All') {
            query = query.where('startups.stage', filters.stage);
        }
        if (filters.search) {
            const searchPattern = `%${filters.search.toLowerCase()}%`;
            query = query.where((builder) => {
                builder.whereRaw('LOWER(startups.title) LIKE ?', [searchPattern])
                       .orWhereRaw('LOWER(startups.description) LIKE ?', [searchPattern]);
            });
        }

        return query.orderBy('startups.created_at', 'desc');
    }

    async findById(id) {
        const startup = await db('startups')
            .leftJoin('users', 'users.id', 'startups.owner_id')
            .select('startups.*', 'users.name as owner_name', 'users.email as owner_email', 'users.linkedin_url', 'users.whatsapp_number')
            .where('startups.id', id)
            .first();

        if (!startup) return null;

        // Fetch members and documents
        const members = await db('startup_members').where({ startup_id: id });
        const documents = await db('startup_documents').where({ startup_id: id });

        return {
            ...startup,
            members,
            documents
        };
    }

    async create(startupData) {
        const [startup] = await db('startups').insert(startupData).returning('*');
        return startup;
    }

    async update(id, updateData) {
        const [startup] = await db('startups').where({ id }).update(updateData).returning('*');
        return startup;
    }

    // Startup Members
    async addMember(memberData) {
        const [member] = await db('startup_members').insert(memberData).returning('*');
        return member;
    }

    async removeMember(startupId, memberId) {
        return db('startup_members').where({ startup_id: startupId, id: memberId }).del();
    }

    // Mentor Requests
    async createMentorRequest(requestData) {
        const [req] = await db('mentor_requests').insert(requestData).returning('*');
        return req;
    }

    async findMentorRequestsForUser(userId, role) {
        if (role === 'Mentor') {
            // Mentor sees requests they sent
            return db('mentor_requests')
                .join('startups', 'startups.id', 'mentor_requests.startup_id')
                .select('mentor_requests.*', 'startups.title as startup_title', 'startups.domain')
                .where({ mentor_id: userId });
        } else {
            // Founder sees requests received on their startups
            return db('mentor_requests')
                .join('startups', 'startups.id', 'mentor_requests.startup_id')
                .join('users', 'users.id', 'mentor_requests.mentor_id')
                .select('mentor_requests.*', 'startups.title as startup_title', 'users.name as mentor_name', 'users.email as mentor_email', 'users.linkedin_url', 'users.whatsapp_number')
                .where('startups.owner_id', userId);
        }
    }

    async updateMentorRequestStatus(requestId, status) {
        const [req] = await db('mentor_requests').where({ id: requestId }).update({ status, updated_at: new Date() }).returning('*');
        return req;
    }

    // Investor Interest
    async createInvestorInterest(interestData) {
        const [interest] = await db('investor_interest').insert(interestData).returning('*');
        return interest;
    }

    async findInvestorInterestsForUser(userId, role) {
        if (role === 'Investor' || role === 'Sponsor') {
            // Investor sees interest they expressed
            return db('investor_interest')
                .join('startups', 'startups.id', 'investor_interest.startup_id')
                .select('investor_interest.*', 'startups.title as startup_title', 'startups.domain')
                .where({ investor_id: userId });
        } else {
            // Founder sees interest on their startups
            return db('investor_interest')
                .join('startups', 'startups.id', 'investor_interest.startup_id')
                .join('users', 'users.id', 'investor_interest.investor_id')
                .select('investor_interest.*', 'startups.title as startup_title', 'users.name as investor_name', 'users.email as investor_email', 'users.linkedin_url', 'users.whatsapp_number')
                .where('startups.owner_id', userId);
        }
    }

    // Saved Startups (Watchlist)
    async saveStartup(userId, startupId) {
        // Toggle saved startup: if exists delete, else insert
        const existing = await db('saved_startups').where({ user_id: userId, startup_id: startupId }).first();
        if (existing) {
            await db('saved_startups').where({ user_id: userId, startup_id: startupId }).del();
            return { saved: false };
        } else {
            await db('saved_startups').insert({ user_id: userId, startup_id: startupId });
            return { saved: true };
        }
    }

    async getSavedStartups(userId) {
        return db('saved_startups')
            .join('startups', 'startups.id', 'saved_startups.startup_id')
            .leftJoin('users', 'users.id', 'startups.owner_id')
            .select('startups.*', 'users.name as owner_name', 'users.email as owner_email', 'users.linkedin_url', 'users.whatsapp_number')
            .where('saved_startups.user_id', userId);
    }
}

module.exports = new StartupRepository();
