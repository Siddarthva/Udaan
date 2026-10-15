const { getAdminClient } = require('../../config/supabase');
const { TABLES, cols } = require('../../config/schema');
const { unwrap } = require('../../utils/db');
const { normalizeRole } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');
const { assertUuid } = require('../../utils/db');
const { formatPublicProfile } = require('../auth/profile');

const MAX_LIMIT = 100;

/** Strip characters that carry meaning inside PostgREST filter strings / LIKE patterns. */
function sanitizeTerm(term) {
    return String(term || '').replace(/[%_,()*\\"']/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}

class CommunityService {
    get db() {
        return getAdminClient();
    }

    async getMembers(viewerId, filters = {}) {
        const { role, search, college, company, specialization, sort } = filters;
        const limit = Math.min(Math.max(parseInt(filters.limit, 10) || 50, 1), MAX_LIMIT);

        let query = this.db.from(TABLES.profiles).select(cols('profiles')).neq('id', viewerId);

        if (role && String(role).toLowerCase() !== 'all') {
            const canonical = normalizeRole(role);
            if (!canonical) throw new ApiError(400, 'Invalid role filter');
            query = query.ilike('role', canonical);
        }

        const collegeTerm = sanitizeTerm(college);
        const companyTerm = sanitizeTerm(company);
        const specializationTerm = sanitizeTerm(specialization);
        if (collegeTerm) query = query.ilike('college', `%${collegeTerm}%`);
        if (companyTerm) query = query.ilike('company', `%${companyTerm}%`);
        if (specializationTerm) query = query.ilike('specialization', `%${specializationTerm}%`);

        const term = sanitizeTerm(search);
        if (term) {
            query = query.or(`username.ilike.%${term}%,full_name.ilike.%${term}%,specialization.ilike.%${term}%,company.ilike.%${term}%,college.ilike.%${term}%`);
        }

        query = sort === 'alphabetical'
            ? query.order('full_name', { ascending: true })
            : query.order('created_at', { ascending: false });

        const rows = unwrap(await query.limit(limit), 'Load community members') || [];
        const ids = rows.map((r) => r.id);

        const followState = await this.loadFollowState(viewerId, ids);
        const members = rows.map((row) => ({
            ...formatPublicProfile(row),
            followers_count: followState.counts.get(row.id) || 0,
            is_following: followState.following.has(row.id)
        }));

        if (sort === 'followers') members.sort((a, b) => b.followers_count - a.followers_count);
        return members;
    }

    async getMember(viewerId, memberId) {
        assertUuid(memberId, 'user id');
        const rows = unwrap(
            await this.db.from(TABLES.profiles).select(cols('profiles')).eq('id', memberId).limit(1),
            'Load member'
        );
        if (!rows || rows.length === 0) throw new ApiError(404, 'User not found');

        const followers = unwrap(
            await this.db.from(TABLES.follows).select('follower_id').eq('following_id', memberId), 'Load follower count'
        ) || [];
        const following = unwrap(
            await this.db.from(TABLES.follows).select('following_id').eq('follower_id', memberId), 'Load following count'
        ) || [];
        return {
            ...formatPublicProfile(rows[0]),
            followers_count: followers.length,
            following_count: following.length,
            is_following: followers.some((f) => f.follower_id === viewerId)
        };
    }

    /** Follower counts and the viewer's own follow relationships for the returned members. */
    async loadFollowState(viewerId, ids) {
        const counts = new Map();
        const following = new Set();
        if (ids.length === 0) return { counts, following };

        const followerRows = unwrap(
            await this.db.from(TABLES.follows).select('follower_id, following_id').in('following_id', ids),
            'Load follower counts'
        ) || [];
        followerRows.forEach((row) => {
            counts.set(row.following_id, (counts.get(row.following_id) || 0) + 1);
            if (row.follower_id === viewerId) following.add(row.following_id);
        });
        return { counts, following };
    }
}

module.exports = new CommunityService();
