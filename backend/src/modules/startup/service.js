const { getAdminClient } = require('../../config/supabase');
const { TABLES, STATUS, cols } = require('../../config/schema');
const { unwrap, assertUuid, toApiError } = require('../../utils/db');
const { mapStageToDb, mapStageToClient, ROLES } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');
const { loadPublicProfiles } = require('../common/profiles');
const notificationsService = require('../notifications/service');

const STARTUP_COLUMNS = cols('startups');
const MAX_LIST = 100;

function sanitizeTerm(term) {
    return String(term || '').replace(/[%_,()*\\"']/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}

/** Shapes a startups row for the API. `raised` is kept as an alias of funding_received for older clients. */
function formatStartup(row, owner) {
    const required = Number(row.funding_required) || 0;
    const received = Number(row.funding_received) || 0;
    return {
        id: row.id,
        owner_id: row.founder_id,
        founder_id: row.founder_id,
        title: row.title,
        description: row.description || '',
        domain: row.domain,
        stage: mapStageToClient(row.stage),
        status: row.status ?? null,
        funding_required: required,
        funding_received: received,
        raised: received,
        funding_progress: required > 0 ? Math.min(100, Math.round((received / required) * 100)) : 0,
        team_size: row.team_size ?? null,
        pitch_deck_url: row.pitch_deck_url || '',
        logo_url: row.logo_url || '',
        owner_name: owner?.full_name || owner?.username || null,
        owner_username: owner?.username || null,
        linkedin_url: owner?.linkedin_url || '',
        created_at: row.created_at || null
    };
}

class StartupService {
    get db() {
        return getAdminClient();
    }

    // ---------- reads ----------

    async loadStartupRow(startupId) {
        assertUuid(startupId, 'startup id');
        const rows = unwrap(
            await this.db.from(TABLES.startups).select(STARTUP_COLUMNS).eq('id', startupId).limit(1),
            'Load startup'
        );
        if (!rows || rows.length === 0) throw new ApiError(404, 'Startup not found');
        return rows[0];
    }

    assertOwner(startup, userId) {
        if (startup.founder_id !== userId) throw new ApiError(403, 'Only the startup owner can perform this action');
    }

    async listStartups(filters = {}, viewerId = null) {
        let query = this.db.from(TABLES.startups).select(STARTUP_COLUMNS);

        if (filters.owner === 'me') {
            if (!viewerId) throw new ApiError(401, 'Authentication required');
            query = query.eq('founder_id', viewerId);
        } else if (filters.owner) {
            query = query.eq('founder_id', assertUuid(filters.owner, 'owner id'));
        }
        if (filters.domain && filters.domain !== 'All') query = query.eq('domain', filters.domain);
        if (filters.stage && filters.stage !== 'All') {
            const stage = mapStageToDb(filters.stage);
            if (!stage) throw new ApiError(400, 'Invalid stage filter');
            query = query.eq('stage', stage);
        }
        const term = sanitizeTerm(filters.search);
        if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);

        const rows = unwrap(await query.order('created_at', { ascending: false }).limit(MAX_LIST), 'List startups') || [];
        const owners = await loadPublicProfiles(rows.map((r) => r.founder_id));
        return rows.map((r) => formatStartup(r, owners.get(r.founder_id)));
    }

    async getMembers(startupId) {
        const rows = unwrap(
            await this.db.from(TABLES.startupMembers).select(cols('startupMembers')).eq('startup_id', startupId),
            'Load startup members'
        ) || [];
        const profiles = await loadPublicProfiles(rows.map((m) => m.user_id));
        return rows.map((m) => {
            const p = profiles.get(m.user_id);
            return {
                id: m.id,
                user_id: m.user_id,
                name: p?.full_name || p?.username || null,
                username: p?.username || null,
                avatar_url: p?.avatar_url || null,
                role: m.role
            };
        });
    }

    async getStartupDetails(startupId) {
        const row = await this.loadStartupRow(startupId);
        const owners = await loadPublicProfiles([row.founder_id]);
        const members = await this.getMembers(startupId);
        return { ...formatStartup(row, owners.get(row.founder_id)), members };
    }

    // ---------- writes ----------

    buildStartupColumns(payload) {
        const out = {};
        if (payload.title !== undefined) out.title = payload.title;
        if (payload.description !== undefined) out.description = payload.description;
        if (payload.domain !== undefined) out.domain = payload.domain;
        if (payload.stage !== undefined) {
            const stage = mapStageToDb(payload.stage);
            if (!stage) throw new ApiError(400, 'Invalid stage');
            out.stage = stage;
        }
        if (payload.funding_required !== undefined) out.funding_required = payload.funding_required;
        if (payload.team_size !== undefined) out.team_size = payload.team_size;
        if (payload.pitch_deck_url !== undefined) out.pitch_deck_url = payload.pitch_deck_url;
        if (payload.logo_url !== undefined) out.logo_url = payload.logo_url;
        return out;
    }

    async createStartup(founderId, payload) {
        const row = { ...this.buildStartupColumns(payload), founder_id: founderId };
        const created = unwrap(
            await this.db.from(TABLES.startups).insert(row).select(STARTUP_COLUMNS).single(),
            'Create startup'
        );

        // Two independent writes are not atomic: if the membership row fails, remove the startup we just created.
        const member = await this.db.from(TABLES.startupMembers).insert({ startup_id: created.id, user_id: founderId, role: 'Founder' });
        if (member.error) {
            console.error(`[STARTUP] Founder membership insert failed for ${created.id}: ${member.error.message}; rolling back startup`);
            const rollback = await this.db.from(TABLES.startups).delete().eq('id', created.id);
            if (rollback.error) console.error(`[STARTUP] Rollback of startup ${created.id} failed: ${rollback.error.message}`);
            throw toApiError(member.error, 'Create startup membership');
        }
        return this.getStartupDetails(created.id);
    }

    async updateStartup(userId, startupId, payload) {
        const startup = await this.loadStartupRow(startupId);
        this.assertOwner(startup, userId);

        const changes = this.buildStartupColumns(payload);
        if (Object.keys(changes).length === 0) throw new ApiError(400, 'No updatable fields supplied');

        unwrap(await this.db.from(TABLES.startups).update(changes).eq('id', startupId).eq('founder_id', userId), 'Update startup');
        return this.getStartupDetails(startupId);
    }

    async addMember(userId, startupId, { user_id, username, role }) {
        const startup = await this.loadStartupRow(startupId);
        this.assertOwner(startup, userId);

        let memberUserId = user_id;
        if (!memberUserId && username) {
            const found = unwrap(
                await this.db.from(TABLES.profiles).select('id').eq('username', String(username).trim().toLowerCase()).limit(1),
                'Find member'
            );
            if (!found || found.length === 0) throw new ApiError(404, 'No registered user with that username');
            memberUserId = found[0].id;
        }
        if (!memberUserId) throw new ApiError(400, 'A registered username or user_id is required');
        assertUuid(memberUserId, 'user id');
        if (!role || !String(role).trim()) throw new ApiError(400, 'Role is required');

        const existing = unwrap(
            await this.db.from(TABLES.startupMembers).select('id').eq('startup_id', startupId).eq('user_id', memberUserId).limit(1),
            'Check member'
        );
        if (existing && existing.length > 0) throw new ApiError(409, 'This user is already on the team');

        const created = unwrap(
            await this.db.from(TABLES.startupMembers)
                .insert({ startup_id: startupId, user_id: memberUserId, role: String(role).trim() })
                .select(cols('startupMembers')).single(),
            'Add member'
        );
        await notificationsService.notify(memberUserId, userId, 'team_added', `added you to ${startup.title}`);
        const members = await this.getMembers(startupId);
        return members.find((m) => m.id === created.id) || created;
    }

    async removeMember(userId, startupId, memberId) {
        const startup = await this.loadStartupRow(startupId);
        this.assertOwner(startup, userId);
        assertUuid(memberId, 'member id');

        const rows = unwrap(
            await this.db.from(TABLES.startupMembers).select('id, user_id').eq('id', memberId).eq('startup_id', startupId).limit(1),
            'Load member'
        );
        if (!rows || rows.length === 0) throw new ApiError(404, 'Team member not found');
        if (rows[0].user_id === startup.founder_id) throw new ApiError(400, 'The founder cannot be removed from the team');

        unwrap(await this.db.from(TABLES.startupMembers).delete().eq('id', memberId).eq('startup_id', startupId), 'Remove member');
        return { success: true };
    }

    // ---------- saved startups ----------

    async toggleSave(userId, startupId) {
        await this.loadStartupRow(startupId);
        const existing = unwrap(
            await this.db.from(TABLES.savedStartups).select('startup_id').eq('user_id', userId).eq('startup_id', startupId).limit(1),
            'Check saved startup'
        );
        if (existing && existing.length > 0) {
            unwrap(await this.db.from(TABLES.savedStartups).delete().eq('user_id', userId).eq('startup_id', startupId), 'Unsave startup');
            return { saved: false };
        }
        const inserted = await this.db.from(TABLES.savedStartups).insert({ user_id: userId, startup_id: startupId });
        if (inserted.error && inserted.error.code !== '23505') throw toApiError(inserted.error, 'Save startup');
        return { saved: true };
    }

    async getSavedStartups(userId) {
        const saved = unwrap(
            await this.db.from(TABLES.savedStartups).select('startup_id').eq('user_id', userId),
            'Load saved startups'
        ) || [];
        if (saved.length === 0) return [];
        const rows = unwrap(
            await this.db.from(TABLES.startups).select(STARTUP_COLUMNS).in('id', saved.map((s) => s.startup_id)),
            'Load saved startup details'
        ) || [];
        const owners = await loadPublicProfiles(rows.map((r) => r.founder_id));
        return rows.map((r) => formatStartup(r, owners.get(r.founder_id)));
    }

    // ---------- sponsor interest ----------

    async expressInterest(sponsorId, startupId, message) {
        const startup = await this.loadStartupRow(startupId);
        if (startup.founder_id === sponsorId) throw new ApiError(400, 'You cannot express interest in your own startup');

        const existing = unwrap(
            await this.db.from(TABLES.investorInterest).select('id')
                .eq('startup_id', startupId).eq('investor_id', sponsorId).limit(1),
            'Check existing interest'
        );
        if (existing && existing.length > 0) throw new ApiError(409, 'You have already expressed interest in this startup');

        const row = { startup_id: startupId, investor_id: sponsorId };
        if (message) row.message = message;
        const created = unwrap(
            await this.db.from(TABLES.investorInterest).insert(row).select(cols('investorInterest')).single(),
            'Express interest'
        );
        await notificationsService.notify(startup.founder_id, sponsorId, 'investment_interest', `expressed interest in ${startup.title}`);
        return created;
    }

    /** Sponsors see their own interests; innovators see interest received on their startups. */
    async getInterests(user) {
        let rows;
        if (user.role === ROLES.SPONSOR) {
            rows = unwrap(
                await this.db.from(TABLES.investorInterest).select(cols('investorInterest')).eq('investor_id', user.id)
                    .order('created_at', { ascending: false }),
                'Load interests'
            ) || [];
        } else if (user.role === ROLES.INNOVATOR) {
            const mine = unwrap(await this.db.from(TABLES.startups).select('id').eq('founder_id', user.id), 'Load own startups') || [];
            if (mine.length === 0) return [];
            rows = unwrap(
                await this.db.from(TABLES.investorInterest).select(cols('investorInterest')).in('startup_id', mine.map((s) => s.id))
                    .order('created_at', { ascending: false }),
                'Load interests'
            ) || [];
        } else {
            return [];
        }
        return this.decorateRelations(rows, 'investor_id');
    }

    // ---------- mentorship ----------

    async sendMentorRequest(mentorId, startupId, message) {
        const startup = await this.loadStartupRow(startupId);
        if (startup.founder_id === mentorId) throw new ApiError(400, 'You cannot mentor your own startup');

        const existing = unwrap(
            await this.db.from(TABLES.mentorRequests).select('id, status')
                .eq('startup_id', startupId).eq('mentor_id', mentorId).eq('status', STATUS.PENDING).limit(1),
            'Check existing mentor request'
        );
        if (existing && existing.length > 0) throw new ApiError(409, 'You already have a pending mentorship request for this startup');

        const row = { startup_id: startupId, mentor_id: mentorId, status: STATUS.PENDING };
        if (message) row.message = message;
        const created = unwrap(
            await this.db.from(TABLES.mentorRequests).insert(row).select(cols('mentorRequests')).single(),
            'Send mentorship request'
        );
        await notificationsService.notify(startup.founder_id, mentorId, 'mentorship_request', `offered mentorship for ${startup.title}`);
        return created;
    }

    /** Mentors see requests they sent; innovators see requests received for their startups. */
    async getMentorRequests(user) {
        let rows;
        if (user.role === ROLES.MENTOR) {
            rows = unwrap(
                await this.db.from(TABLES.mentorRequests).select(cols('mentorRequests')).eq('mentor_id', user.id)
                    .order('created_at', { ascending: false }),
                'Load mentor requests'
            ) || [];
        } else if (user.role === ROLES.INNOVATOR) {
            const mine = unwrap(await this.db.from(TABLES.startups).select('id').eq('founder_id', user.id), 'Load own startups') || [];
            if (mine.length === 0) return [];
            rows = unwrap(
                await this.db.from(TABLES.mentorRequests).select(cols('mentorRequests')).in('startup_id', mine.map((s) => s.id))
                    .order('created_at', { ascending: false }),
                'Load mentor requests'
            ) || [];
        } else {
            return [];
        }
        return this.decorateRelations(rows, 'mentor_id');
    }

    async updateMentorRequestStatus(userId, requestId, status) {
        assertUuid(requestId, 'request id');
        const nextStatus = ['accept', 'accepted'].includes(status) ? STATUS.ACCEPTED
            : ['reject', 'rejected', 'decline', 'declined'].includes(status) ? STATUS.REJECTED : null;
        if (!nextStatus) throw new ApiError(400, 'Status must be accepted or rejected');

        const found = unwrap(
            await this.db.from(TABLES.mentorRequests).select(cols('mentorRequests')).eq('id', requestId).limit(1),
            'Load mentor request'
        );
        const request = found && found[0];
        if (!request) throw new ApiError(404, 'Mentorship request not found');

        const startup = await this.loadStartupRow(request.startup_id);
        this.assertOwner(startup, userId);
        if (request.status !== STATUS.PENDING) throw new ApiError(409, `This request was already ${request.status}`);

        const updated = unwrap(
            await this.db.from(TABLES.mentorRequests).update({ status: nextStatus })
                .eq('id', requestId).eq('status', STATUS.PENDING).select(cols('mentorRequests')),
            'Update mentor request'
        );
        if (!updated || updated.length === 0) throw new ApiError(409, 'This request was already handled');

        await notificationsService.notify(
            request.mentor_id, userId,
            nextStatus === STATUS.ACCEPTED ? 'request_accepted' : 'request_rejected',
            `${nextStatus === STATUS.ACCEPTED ? 'accepted' : 'declined'} your mentorship request for ${startup.title}`
        );
        const [decorated] = await this.decorateRelations(updated, 'mentor_id');
        return decorated;
    }

    /** Adds startup title and the counterpart's public profile to mentor_requests / investor_interest rows. */
    async decorateRelations(rows, actorColumn) {
        if (rows.length === 0) return [];
        const startups = unwrap(
            await this.db.from(TABLES.startups).select('id, title').in('id', [...new Set(rows.map((r) => r.startup_id))]),
            'Load startups'
        ) || [];
        const titles = new Map(startups.map((s) => [s.id, s.title]));
        const profiles = await loadPublicProfiles(rows.map((r) => r[actorColumn]));
        return rows.map((r) => {
            const actor = profiles.get(r[actorColumn]);
            return {
                ...r,
                startup_title: titles.get(r.startup_id) || null,
                requester_id: r[actorColumn],
                requester_name: actor?.full_name || actor?.username || null,
                requester_username: actor?.username || null
            };
        });
    }

    // ---------- startup updates ----------

    async canPostUpdate(userId, startup) {
        if (startup.founder_id === userId) return true;
        const rows = unwrap(
            await this.db.from(TABLES.startupMembers).select('id').eq('startup_id', startup.id).eq('user_id', userId).limit(1),
            'Check membership'
        );
        return Boolean(rows && rows.length > 0);
    }

    async createStartupUpdate(userId, startupId, { content }) {
        const startup = await this.loadStartupRow(startupId);
        if (!(await this.canPostUpdate(userId, startup))) throw new ApiError(403, 'Only team members can post updates');
        const text = String(content || '').trim();
        if (!text) throw new ApiError(400, 'Update content is required');
        if (text.length > 5000) throw new ApiError(400, 'Update content is too long');

        return unwrap(
            await this.db.from(TABLES.startupUpdates).insert({ startup_id: startupId, author_id: userId, content: text })
                .select(cols('startupUpdates')).single(),
            'Post update'
        );
    }

    async getStartupUpdates(startupId) {
        await this.loadStartupRow(startupId);
        const rows = unwrap(
            await this.db.from(TABLES.startupUpdates).select(cols('startupUpdates'))
                .eq('startup_id', startupId).order('created_at', { ascending: false }).limit(50),
            'Load updates'
        ) || [];
        const authors = await loadPublicProfiles(rows.map((r) => r.author_id));
        return rows.map((r) => ({ ...r, author_name: authors.get(r.author_id)?.full_name || null }));
    }

    async deleteStartupUpdate(userId, updateId) {
        assertUuid(updateId, 'update id');
        const found = unwrap(
            await this.db.from(TABLES.startupUpdates).select(cols('startupUpdates')).eq('id', updateId).limit(1),
            'Load update'
        );
        if (!found || found.length === 0) throw new ApiError(404, 'Update not found');
        const startup = await this.loadStartupRow(found[0].startup_id);
        if (found[0].author_id !== userId && startup.founder_id !== userId) {
            throw new ApiError(403, 'Only the author or the startup owner can delete this update');
        }
        unwrap(await this.db.from(TABLES.startupUpdates).delete().eq('id', updateId), 'Delete update');
        return { success: true };
    }

    // ---------- discovery signals (derived from persisted rows only) ----------

    async countByStartup(table, startupIds) {
        const counts = new Map();
        if (startupIds.length === 0) return counts;
        const rows = unwrap(await this.db.from(table).select('startup_id').in('startup_id', startupIds), 'Count startup signals') || [];
        rows.forEach((r) => counts.set(r.startup_id, (counts.get(r.startup_id) || 0) + 1));
        return counts;
    }

    /** Ranks recent startups by real engagement counts (saves + sponsor interest + mentor requests). No synthetic scores. */
    async getTrendingStartups() {
        const startups = await this.listStartups({});
        const ids = startups.map((s) => s.id);
        const [saved, interests, mentors] = await Promise.all([
            this.countByStartup(TABLES.savedStartups, ids),
            this.countByStartup(TABLES.investorInterest, ids),
            this.countByStartup(TABLES.mentorRequests, ids)
        ]);
        return startups.map((s) => {
            const metrics = {
                saved: saved.get(s.id) || 0,
                interests: interests.get(s.id) || 0,
                mentor_requests: mentors.get(s.id) || 0
            };
            return { ...s, metrics, engagement: metrics.saved + metrics.interests + metrics.mentor_requests };
        }).sort((a, b) => b.engagement - a.engagement).slice(0, 12);
    }

    async getStartupAnalytics(userId, startupId) {
        const startup = await this.loadStartupRow(startupId);
        this.assertOwner(startup, userId);
        const [saved, interests, mentors] = await Promise.all([
            this.countByStartup(TABLES.savedStartups, [startupId]),
            this.countByStartup(TABLES.investorInterest, [startupId]),
            this.countByStartup(TABLES.mentorRequests, [startupId])
        ]);
        const formatted = formatStartup(startup);
        return {
            startup_id: startupId,
            title: startup.title,
            funding: {
                required: formatted.funding_required,
                received: formatted.funding_received,
                remaining: Math.max(0, formatted.funding_required - formatted.funding_received),
                progress_percentage: formatted.funding_progress
            },
            metrics: {
                saved: saved.get(startupId) || 0,
                interests: interests.get(startupId) || 0,
                mentor_requests: mentors.get(startupId) || 0
            }
        };
    }

    /** Recent platform activity built from persisted startups and startup updates. */
    async getActivityFeed() {
        const startups = unwrap(
            await this.db.from(TABLES.startups).select('id, title, founder_id, created_at').order('created_at', { ascending: false }).limit(10),
            'Load activity'
        ) || [];
        const updates = unwrap(
            await this.db.from(TABLES.startupUpdates).select('id, startup_id, author_id, content, created_at')
                .order('created_at', { ascending: false }).limit(10),
            'Load activity'
        ) || [];
        const titles = new Map(startups.map((s) => [s.id, s.title]));
        const missing = [...new Set(updates.map((u) => u.startup_id).filter((id) => !titles.has(id)))];
        if (missing.length > 0) {
            const extra = unwrap(await this.db.from(TABLES.startups).select('id, title').in('id', missing), 'Load activity') || [];
            extra.forEach((s) => titles.set(s.id, s.title));
        }
        const people = await loadPublicProfiles([...startups.map((s) => s.founder_id), ...updates.map((u) => u.author_id)]);

        const activities = [
            ...startups.map((s) => ({
                id: `startup-${s.id}`,
                type: 'startup_launched',
                title: `Launched ${s.title}`,
                user_name: people.get(s.founder_id)?.full_name || null,
                timestamp: s.created_at
            })),
            ...updates.map((u) => ({
                id: `update-${u.id}`,
                type: 'startup_update',
                title: `Update from ${titles.get(u.startup_id) || 'a startup'}: ${String(u.content).slice(0, 80)}`,
                user_name: people.get(u.author_id)?.full_name || null,
                timestamp: u.created_at
            }))
        ];
        return activities.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)).slice(0, 15);
    }

    // ---------- funding (simulation only) ----------

    /**
     * Simulated funding commitment. The schema has no transaction ledger, so nothing is persisted and
     * startups.funding_received is NEVER modified. The response is explicitly labelled as a simulation.
     */
    async simulateInvestment(sponsorId, startupId, { amount, payment_method, accepted_terms }) {
        const startup = await this.loadStartupRow(startupId);
        if (startup.founder_id === sponsorId) throw new ApiError(400, 'You cannot fund your own startup');

        const value = Number(amount);
        if (!Number.isFinite(value) || value <= 0) throw new ApiError(400, 'A positive amount is required');
        if (!['UPI', 'CARD', 'NETBANKING'].includes(String(payment_method || '').toUpperCase())) {
            throw new ApiError(400, 'Choose a simulated payment method');
        }
        if (accepted_terms !== true) throw new ApiError(400, 'You must accept the demo terms');

        return {
            simulated: true,
            persisted: false,
            reference: `SIM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e4).toString().padStart(4, '0')}`,
            amount: value,
            payment_method: String(payment_method).toUpperCase(),
            startup: { id: startup.id, title: startup.title },
            notice: 'Demo only: no payment was processed and no funding totals were changed. Use "Express interest" to record real interest.'
        };
    }
}

module.exports = new StartupService();
