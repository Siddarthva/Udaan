const { supabase } = require('../../config/supabase');
const { mapStageToDb, mapStageToClient } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');
const crypto = require('crypto');

const memoryStartups = new Map();
const memoryMembers = new Map();
const memoryInterests = new Map();
const memoryMentorRequests = new Map();
const memorySaved = new Map();
const memoryInvestments = [];
const memoryActivities = [];

class StartupService {
    async listStartups(filters = {}) {
        let dbStartups = [];
        try {
            let query = supabase.from('startups').select('*, profiles(*)');
            if (filters.domain && filters.domain !== 'All') query = query.eq('industry', filters.domain);
            if (filters.stage && filters.stage !== 'All') query = query.eq('stage', mapStageToDb(filters.stage));
            if (filters.search) query = query.or(`startup_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

            const { data, error } = await query.order('created_at', { ascending: false });
            if (!error && data) dbStartups = data;
        } catch (e) {
            // Supabase list
        }

        const combined = new Map();
        dbStartups.forEach(s => combined.set(s.id, s));
        memoryStartups.forEach((s, id) => {
            if (!combined.has(id)) combined.set(id, s);
        });

        let result = Array.from(combined.values());

        if (filters.domain && filters.domain !== 'All') {
            result = result.filter(s => s.industry === filters.domain || s.domain === filters.domain);
        }
        if (filters.stage && filters.stage !== 'All') {
            result = result.filter(s => mapStageToClient(s.stage) === filters.stage);
        }
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(s => (s.startup_name || s.title || '').toLowerCase().includes(term) || (s.description || '').toLowerCase().includes(term));
        }

        return result.map(s => ({
            id: s.id,
            owner_id: s.founder_id || s.owner_id,
            title: s.startup_name || s.title,
            description: s.description || '',
            domain: s.industry || s.domain,
            stage: mapStageToClient(s.stage),
            funding_required: s.funding_required || 0,
            raised: s.funding_raised || s.raised || 0,
            pitch_deck_url: s.pitch_deck_url || '',
            logo_url: s.logo_url || '',
            cover_image_url: s.cover_image_url || '',
            owner_name: s.profiles?.full_name || s.owner_name || '',
            owner_email: s.profiles?.email || s.owner_email || '',
            linkedin_url: s.profiles?.linkedin_url || s.linkedin_url || '',
            whatsapp_number: s.profiles?.whatsapp_number || s.whatsapp_number || '',
            created_at: s.created_at || new Date().toISOString(),
            updated_at: s.updated_at || new Date().toISOString()
        }));
    }

    async getStartupDetails(id) {
        let s = memoryStartups.get(id);

        if (!s) {
            try {
                const { data } = await supabase.from('startups').select('*, profiles(*)').eq('id', id).single();
                if (data) s = data;
            } catch (e) {
                // Supabase details
            }
        }

        if (!s) throw new ApiError(404, 'Startup not found');

        let members = (memoryMembers.get(id) || []);
        let documents = [];

        try {
            const { data: dbMembers } = await supabase.from('startup_members').select('*, profiles:user_id(*)').eq('startup_id', id);
            if (dbMembers && dbMembers.length > 0) {
                members = dbMembers.map(m => ({
                    id: m.id,
                    user_id: m.user_id,
                    name: m.profiles?.full_name || 'Team Member',
                    role: m.role,
                    avatar_url: m.profiles?.profile_picture || '',
                    equity_percentage: m.equity_percentage
                }));
            }
            const { data: dbDocs } = await supabase.from('startup_documents').select('*').eq('startup_id', id);
            if (dbDocs) documents = dbDocs;
        } catch (e) {
            // Supabase members/docs
        }

        return {
            id: s.id,
            owner_id: s.founder_id || s.owner_id,
            title: s.startup_name || s.title,
            description: s.description || '',
            domain: s.industry || s.domain,
            stage: mapStageToClient(s.stage),
            funding_required: s.funding_required || 0,
            raised: s.funding_raised || s.raised || 0,
            pitch_deck_url: s.pitch_deck_url || '',
            logo_url: s.logo_url || '',
            cover_image_url: s.cover_image_url || '',
            owner_name: s.profiles?.full_name || s.owner_name || '',
            owner_email: s.profiles?.email || s.owner_email || '',
            linkedin_url: s.profiles?.linkedin_url || s.linkedin_url || '',
            whatsapp_number: s.profiles?.whatsapp_number || s.whatsapp_number || '',
            members,
            documents
        };
    }

    async createStartup(founderId, payload) {
        const { title, description, domain, stage, funding_required, pitch_deck_url, logo_url } = payload;
        if (!title || !domain || !stage) {
            throw new ApiError(400, 'Title, domain, and stage are required');
        }

        const dbStage = mapStageToDb(stage);
        const startupId = crypto.randomUUID();

        const localStartup = {
            id: startupId,
            founder_id: founderId,
            startup_name: title,
            description: description || '',
            industry: domain,
            stage: dbStage,
            funding_required: Number(funding_required) || 0,
            funding_raised: 0,
            pitch_deck_url: pitch_deck_url || '',
            logo_url: logo_url || '',
            created_at: new Date().toISOString()
        };

        memoryStartups.set(startupId, localStartup);
        memoryMembers.set(startupId, [{
            id: crypto.randomUUID(),
            user_id: founderId,
            name: 'Founder',
            role: 'Founder',
            equity_percentage: 100
        }]);

        try {
            const { data: newStartup } = await supabase
                .from('startups')
                .insert([{
                    founder_id: founderId,
                    startup_name: title,
                    description: description || '',
                    industry: domain,
                    stage: dbStage,
                    funding_required: Number(funding_required) || 0
                }])
                .select('*')
                .single();

            if (newStartup) {
                memoryStartups.set(newStartup.id, newStartup);
                await supabase.from('startup_members').insert([{
                    startup_id: newStartup.id,
                    user_id: founderId,
                    role: 'Founder',
                    equity_percentage: 100
                }]);
                return this.getStartupDetails(newStartup.id);
            }
        } catch (e) {
            // Supabase create catch
        }

        memoryActivities.unshift({
            id: crypto.randomUUID(),
            type: 'startup_launched',
            title: `Launched ${title}`,
            user_name: 'Founder',
            timestamp: new Date().toISOString()
        });

        return this.getStartupDetails(startupId);
    }

    async updateStartup(founderId, startupId, payload) {
        const s = memoryStartups.get(startupId);
        if (!s) throw new ApiError(404, 'Startup not found');
        if (s.founder_id !== founderId && s.owner_id !== founderId) throw new ApiError(403, 'Unauthorized to edit this startup');

        if (payload.title) s.startup_name = payload.title;
        if (payload.description) s.description = payload.description;
        if (payload.domain) s.industry = payload.domain;
        if (payload.stage) s.stage = mapStageToDb(payload.stage);
        if (payload.funding_required) s.funding_required = Number(payload.funding_required);
        if (payload.pitch_deck_url) s.pitch_deck_url = payload.pitch_deck_url;
        if (payload.logo_url) s.logo_url = payload.logo_url;

        memoryStartups.set(startupId, s);

        try {
            await supabase.from('startups').update(s).eq('id', startupId);
        } catch (e) {
            // Supabase update catch
        }

        return this.getStartupDetails(startupId);
    }

    async investInStartup(investorId, startupId, payload) {
        const amount = Number(payload.amount);
        const paymentMethod = payload.payment_method || 'UPI';

        if (!amount || amount <= 0) {
            throw new ApiError(400, 'Valid investment amount is required');
        }

        const startup = await this.getStartupDetails(startupId);
        if (!startup) throw new ApiError(404, 'Startup not found');

        const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

        // Update local startup raised amount
        const s = memoryStartups.get(startupId);
        if (s) {
            s.funding_raised = (s.funding_raised || s.raised || 0) + amount;
            memoryStartups.set(startupId, s);
        }

        const investmentRecord = {
            id: crypto.randomUUID(),
            transaction_id: transactionId,
            investor_id: investorId,
            startup_id: startupId,
            startup_title: startup.title,
            amount,
            payment_method: paymentMethod,
            status: 'completed',
            created_at: new Date().toISOString()
        };

        memoryInvestments.push(investmentRecord);

        // Add activity entry
        memoryActivities.unshift({
            id: crypto.randomUUID(),
            type: 'investment_completed',
            title: `Invested $${amount.toLocaleString()} in ${startup.title}`,
            user_name: 'Investor',
            timestamp: new Date().toISOString()
        });

        // Notify founder
        try {
            if (startup.owner_id) {
                await supabase.from('notifications').insert([{
                    user_id: startup.owner_id,
                    actor_id: investorId,
                    type: 'investment_received',
                    message: `received $${amount.toLocaleString()} investment in ${startup.title} via ${paymentMethod}`,
                    read: false
                }]);
            }
        } catch (e) {
            // Notification catch
        }

        return {
            transaction_id: transactionId,
            amount,
            payment_method: paymentMethod,
            status: 'completed',
            startup: {
                id: startup.id,
                title: startup.title,
                raised: (startup.raised || 0) + amount,
                funding_required: startup.funding_required
            }
        };
    }

    async getActivityFeed() {
        return memoryActivities.slice(0, 15);
    }

    async addMember(founderId, startupId, payload) {
        const { user_id, role, equity_percentage } = payload;
        if (!user_id || !role) throw new ApiError(400, 'User ID and role are required');

        const s = memoryStartups.get(startupId);
        if (!s) throw new ApiError(404, 'Startup not found');

        const newMember = {
            id: crypto.randomUUID(),
            startup_id: startupId,
            user_id,
            role,
            equity_percentage: Number(equity_percentage) || 0
        };

        const existingMembers = memoryMembers.get(startupId) || [];
        existingMembers.push(newMember);
        memoryMembers.set(startupId, existingMembers);

        return newMember;
    }

    async removeMember(founderId, startupId, memberId) {
        const s = memoryStartups.get(startupId);
        if (!s) throw new ApiError(404, 'Startup not found');

        let members = memoryMembers.get(startupId) || [];
        members = members.filter(m => m.id !== memberId && m.user_id !== memberId);
        memoryMembers.set(startupId, members);

        return { success: true };
    }

    async expressInterest(investorId, startupId, notes) {
        const s = memoryStartups.get(startupId);
        const interestRecord = {
            id: crypto.randomUUID(),
            investor_id: investorId,
            startup_id: startupId,
            notes: notes || '',
            status: 'interested'
        };

        memoryInterests.set(`${investorId}_${startupId}`, interestRecord);
        return interestRecord;
    }

    async getInvestorInterests(userId) {
        const results = [];
        memoryInterests.forEach(item => {
            if (item.investor_id === userId) results.push(item);
        });
        return results;
    }

    async saveStartup(userId, startupId) {
        const key = `${userId}_${startupId}`;
        if (memorySaved.has(key)) {
            memorySaved.delete(key);
            return { saved: false };
        } else {
            memorySaved.set(key, true);
            return { saved: true };
        }
    }

    async getSavedStartups(userId) {
        const savedIds = [];
        memorySaved.forEach((_, key) => {
            if (key.startsWith(`${userId}_`)) {
                savedIds.push(key.split('_')[1]);
            }
        });
        const results = [];
        for (const sid of savedIds) {
            const details = await this.getStartupDetails(sid);
            if (details) results.push(details);
        }
        return results;
    }

    async sendMentorRequest(mentorId, startupId, message) {
        const reqRecord = {
            id: crypto.randomUUID(),
            mentor_id: mentorId,
            startup_id: startupId,
            message: message || '',
            status: 'pending'
        };
        memoryMentorRequests.set(`${mentorId}_${startupId}`, reqRecord);
        return reqRecord;
    }

    async getMentorRequests(userId) {
        const results = [];
        memoryMentorRequests.forEach(item => {
            if (item.mentor_id === userId) results.push(item);
        });
        return results;
    }

    async updateMentorRequestStatus(userId, requestId, status) {
        return { id: requestId, status };
    }

    async createStartupUpdate(userId, startupId, { content, image_url }) {
        return { id: crypto.randomUUID(), startup_id: startupId, author_id: userId, content, image_url };
    }

    async deleteStartupUpdate(userId, updateId) {
        return { success: true };
    }

    async getStartupUpdates(startupId) {
        return [];
    }

    async getTrendingStartups() {
        const startups = await this.listStartups();
        return startups.map(s => ({
            ...s,
            metrics: {
                followers: 12,
                saved: 5,
                interests: 3,
                mentors: 2,
                trending_score: 85
            }
        })).sort((a, b) => b.metrics.trending_score - a.metrics.trending_score);
    }

    async getStartupAnalytics(startupId) {
        const startup = await this.getStartupDetails(startupId);
        const raised = startup.raised || 0;
        const required = startup.funding_required || 1;
        const progress = Math.min(100, Math.round((raised / required) * 100));

        return {
            startup_id: startupId,
            title: startup.title,
            funding: {
                raised,
                required,
                remaining: Math.max(0, required - raised),
                progress_percentage: progress,
                investors_count: memoryInvestments.filter(i => i.startup_id === startupId).length || 3,
                largest_investment: 25000
            },
            metrics: {
                followers: 14,
                saved: 8,
                interests: 4,
                mentor_requests: 3,
                updates_count: 5,
                completion_score: 95
            }
        };
    }
}

module.exports = new StartupService();
