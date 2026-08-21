const { supabase } = require('../../config/supabase');
const ApiError = require('../../utils/ApiError');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class FollowService {
    async followUser(followerId, targetUserId) {
        if (!UUID_REGEX.test(targetUserId)) {
            throw new ApiError(400, 'Invalid user ID. Must be a valid UUID');
        }

        if (followerId === targetUserId) {
            throw new ApiError(400, 'Cannot follow yourself');
        }

        // Try standard follows schema (follower_id, following_id) with fallback for target_id
        let existing = null;
        const { data: ex1, error: err1 } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', followerId)
            .eq('following_id', targetUserId)
            .maybeSingle();

        if (!err1 && ex1) {
            existing = ex1;
        } else if (err1 && err1.code === '42703') {
            const { data: ex2 } = await supabase
                .from('follows')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetUserId)
                .maybeSingle();
            existing = ex2;
        }

        if (existing) return existing;

        let data = null;
        let error = null;

        const { data: res1, error: insertErr1 } = await supabase
            .from('follows')
            .insert({ follower_id: followerId, following_id: targetUserId })
            .select()
            .single();

        if (!insertErr1) {
            data = res1;
        } else if (insertErr1.code === '42703') {
            const { data: res2, error: insertErr2 } = await supabase
                .from('follows')
                .insert({ follower_id: followerId, target_id: targetUserId, target_type: 'user' })
                .select()
                .single();
            data = res2;
            error = insertErr2;
        } else {
            error = insertErr1;
        }

        if (error) throw new ApiError(500, error.message || 'Failed to follow user');

        await supabase
            .from('notifications')
            .insert([{
                user_id: targetUserId,
                actor_id: followerId,
                type: 'new_follower',
                message: 'started following you',
                read: false
            }]);

        return data;
    }

    async unfollowUser(followerId, targetUserId) {
        if (!UUID_REGEX.test(targetUserId)) {
            throw new ApiError(400, 'Invalid user ID. Must be a valid UUID');
        }

        const { error: err1 } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', targetUserId);

        if (err1 && err1.code === '42703') {
            await supabase
                .from('follows')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetUserId);
        }

        return { success: true };
    }

    async followStartup(followerId, startupId) {
        if (!UUID_REGEX.test(startupId)) {
            throw new ApiError(400, 'Invalid startup ID. Must be a valid UUID');
        }

        return this.followUser(followerId, startupId);
    }

    async unfollowStartup(followerId, startupId) {
        if (!UUID_REGEX.test(startupId)) {
            throw new ApiError(400, 'Invalid startup ID. Must be a valid UUID');
        }

        return this.unfollowUser(followerId, startupId);
    }

    async getFollowers(userId) {
        let follows = [];
        const { data: f1, error: err1 } = await supabase
            .from('follows')
            .select('follower_id, profiles:follower_id(*)')
            .or(`following_id.eq.${userId},target_id.eq.${userId}`);

        if (!err1 && f1) {
            follows = f1;
        } else {
            const { data: f2 } = await supabase
                .from('follows')
                .select('follower_id, profiles:follower_id(*)')
                .eq('follower_id', userId);
            follows = f2 || [];
        }

        return (follows || []).map(f => f.profiles).filter(Boolean);
    }

    async getFollowing(userId) {
        let userFollows = [];
        const { data: f1, error: err1 } = await supabase
            .from('follows')
            .select('following_id, profiles:following_id(*)')
            .eq('follower_id', userId);

        if (!err1 && f1) {
            userFollows = f1;
        } else {
            const { data: f2 } = await supabase
                .from('follows')
                .select('target_id, profiles:target_id(*)')
                .eq('follower_id', userId);
            userFollows = (f2 || []).map(item => ({ following_id: item.target_id, profiles: item.profiles }));
        }

        const users = (userFollows || []).map(f => f.profiles).filter(Boolean);
        return { users, startups: [] };
    }
}

module.exports = new FollowService();
