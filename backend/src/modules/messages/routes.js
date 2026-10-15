const express = require('express');
const router = express.Router();
const messagesController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { messageValidator } = require('../../middleware/validation');

router.use(authenticate);

router.get('/conversations', asyncHandler(messagesController.getConversations.bind(messagesController)));
router.get('/requests', asyncHandler(messagesController.getMessageRequests.bind(messagesController)));
router.patch('/request/:id', asyncHandler(messagesController.updateRequestStatus.bind(messagesController)));
router.post('/send', messageValidator, asyncHandler(messagesController.sendMessage.bind(messagesController)));
router.patch('/:id/read', asyncHandler(messagesController.markAsRead.bind(messagesController)));
router.get('/:id', asyncHandler(messagesController.getMessageHistory.bind(messagesController)));

module.exports = router;
