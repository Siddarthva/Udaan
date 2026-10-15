const followService = require('./service');

class FollowController {
    async followUser(req, res) {
        const { follow, created } = await followService.followUser(req.user.id, req.params.id);
        res.status(created ? 201 : 200).json({
            follow,
            message: created ? 'Successfully followed user' : 'Already following this user'
        });
    }

    async unfollowUser(req, res) {
        const result = await followService.unfollowUser(req.user.id, req.params.id);
        res.status(200).json({ result, message: 'Successfully unfollowed user' });
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
