const messagesService = require('../messages/service');

// Unified request endpoints delegate to the messaging service so there is exactly one implementation
// of request creation / acceptance (no competing logic, no duplicate conversations).
class RequestsController {
    async createRequest(req, res) {
        const request = await messagesService.createRequest(req.user.id, req.body);
        res.status(201).json({ message: 'Request sent successfully', request });
    }

    async getRequests(req, res) {
        const requests = await messagesService.getRequests(req.user.id, req.query.status);
        res.status(200).json({ requests });
    }

    async acceptRequest(req, res) {
        const result = await messagesService.respondToRequest(req.user.id, req.params.id, 'accept');
        res.status(200).json({ message: 'Request accepted', ...result });
    }

    async rejectRequest(req, res) {
        const result = await messagesService.respondToRequest(req.user.id, req.params.id, 'reject');
        res.status(200).json({ message: 'Request rejected', ...result });
    }
}

module.exports = new RequestsController();
