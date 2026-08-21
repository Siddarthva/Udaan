const communityService = require('./service');

class CommunityController {
    async getMembers(req, res) {
        const members = await communityService.getMembers(req.query);
        res.status(200).json({ count: members.length, members });
    }

    async searchMembers(req, res) {
        const query = req.query.q || req.query.search || '';
        const members = await communityService.getMembers({ ...req.query, search: query });
        res.status(200).json({ count: members.length, members });
    }
}

module.exports = new CommunityController();
