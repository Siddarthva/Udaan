const { getAdminClient } = require('../../config/supabase');
const { TABLES } = require('../../config/schema');
const { unwrap, assertUuid } = require('../../utils/db');
const ApiError = require('../../utils/ApiError');
const { loadPublicProfiles, profileExists } = require('../common/profiles');
const notificationsService = require('../notifications/service');

class FollowService {
    get db() {
        return getAdminClient();
    }

    async findFollow(followerId, targetId) {
        const rows = unwrap(
            await this.db.from(TABLES.follows).select('follower_id, following_id')
                .eq('follower_id', followerId).eq('following_id', targetId).limit(1),
            'Check follow'
        );
        return rows && rows.length > 0 ? rows[0] : null;
    }

    async followUser(followerId, targetUserId) {
        assertUuid(targetUserId, 'user id');
        if (followerId === targetUserId) throw new ApiError(400, 'You cannot follow yourself');
        if (!(await profileExists(targetUserId))) throw new ApiError(404, 'User not found');

        const existing = await this.findFollow(followerId, targetUserId);
        if (existing) return { follow: existing, created: false };

        const result = await this.db.from(TABLES.follows)
            .insert({ follower_id: followerId, following_id: targetUserId })
            .select('follower_id, following_id').single();

        // A concurrent request may have inserted the same pair first; the unique constraint makes that a no-op for us.
        if (result.error && result.error.code === '23505') {
            return { follow: await this.findFollow(followerId, targetUserId), created: false };
        }
        const follow = unwrap(result, 'Follow user');

        await notificationsService.notify(targetUserId, followerId, 'new_follower', 'started following you');
        return { follow, created: true };
    }

    async unfollowUser(followerId, targetUserId) {
        assertUuid(targetUserId, 'user id');
        unwrap(
            await this.db.from(TABLES.follows).delete().eq('follower_id', followerId).eq('following_id', targetUserId),
            'Unfollow user'
        );
        return { success: true };
    }

    async getFollowers(userId) {
        const rows = unwrap(
            await this.db.from(TABLES.follows).select('follower_id').eq('following_id', userId),
            'Load followers'
        ) || [];
        const profiles = await loadPublicProfiles(rows.map((r) => r.follower_id));
        return rows.map((r) => profiles.get(r.follower_id)).filter(Boolean);
    }

    async getFollowing(userId) {
        const rows = unwrap(
            await this.db.from(TABLES.follows).select('following_id').eq('follower_id', userId),
            'Load following'
        ) || [];
        const profiles = await loadPublicProfiles(rows.map((r) => r.following_id));
        return { users: rows.map((r) => profiles.get(r.following_id)).filter(Boolean) };
    }
}

module.exports = new FollowService();
