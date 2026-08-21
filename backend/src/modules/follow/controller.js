const followService = require('./service');

class FollowController {
    async followUser(req, res) {
        const result = await followService.followUser(req.user.id, req.params.id);
        res.status(201).json({ follow: result, message: 'Successfully followed user' });
    }

    async unfollowUser(req, res) {
        const result = await followService.unfollowUser(req.user.id, req.params.id);
        res.status(200).json({ result, message: 'Successfully unfollowed user' });
    }

    async followStartup(req, res) {
        const result = await followService.followStartup(req.user.id, req.params.id);
        res.status(201).json({ follow: result, message: 'Successfully followed startup' });
    }

    async unfollowStartup(req, res) {
        const result = await followService.unfollowStartup(req.user.id, req.params.id);
        res.status(200).json({ result, message: 'Successfully unfollowed startup' });
    }

    async getFollowers(req, res) {
        const followers = await followService.getFollowers(req.user.id);
        res.status(200).json({ followers });
    }

    async getFollowing(req, res) {
        const following = await followService.getFollowing(req.user.id);
        res.status(200).json({ following });
    }
}

module.exports = new FollowController();
