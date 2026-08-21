const requestsService = require('./service');

class RequestsController {
    async createRequest(req, res) {
        const request = await requestsService.createRequest(req.user.id, req.body);
        res.status(201).json({ message: 'Request sent successfully', request });
    }

    async getRequests(req, res) {
        const requests = await requestsService.getRequests(req.user.id, req.query.status);
        res.status(200).json({ requests });
    }

    async acceptRequest(req, res) {
        const result = await requestsService.acceptRequest(req.user.id, req.params.id);
        res.status(200).json({ message: 'Request accepted', ...result });
    }

    async rejectRequest(req, res) {
        const result = await requestsService.rejectRequest(req.user.id, req.params.id);
        res.status(200).json({ message: 'Request rejected', ...result });
    }
}

module.exports = new RequestsController();
