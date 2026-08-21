const messagesService = require('./service');

class MessagesController {
    async getConversations(req, res) {
        const conversations = await messagesService.getConversations(req.user.id);
        res.status(200).json({ conversations });
    }

    async getMessageRequests(req, res) {
        const requests = await messagesService.getMessageRequests(req.user.id);
        res.status(200).json({ requests });
    }

    async updateRequestStatus(req, res) {
        console.log('Request ID:', req.params.id);
        console.log('User:', req.user?.id);
        console.log('Body:', req.body);

        const result = await messagesService.updateRequestStatus(req.user.id, req.params.id, req.body);
        res.status(200).json({
            request: result.request,
            conversation: result.conversation || null,
            message: `Request ${result.request?.status}`
        });
    }

    async getMessageHistory(req, res) {
        const messages = await messagesService.getMessageHistory(req.user.id, req.params.id);
        res.status(200).json({ messages });
    }

    async sendMessage(req, res) {
        const message = await messagesService.sendMessage(req.user.id, req.body);
        res.status(201).json({ message });
    }

    async markAsRead(req, res) {
        const result = await messagesService.markAsRead(req.user.id, req.params.id);
        res.status(200).json(result);
    }
}

module.exports = new MessagesController();
