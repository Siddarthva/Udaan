const communityService = require('./service');

class CommunityController {
    async getMembers(req, res) {
        const members = await communityService.getMembers(req.user.id, req.query);
        res.status(200).json({ count: members.length, members });
    }

    async getMember(req, res) {
        const member = await communityService.getMember(req.user.id, req.params.id);
        res.status(200).json({ member });
    }

    async searchMembers(req, res) {
        const search = req.query.q || req.query.search || '';
        const members = await communityService.getMembers(req.user.id, { ...req.query, search });
        res.status(200).json({ count: members.length, members });
    }
}

module.exports = new CommunityController();
