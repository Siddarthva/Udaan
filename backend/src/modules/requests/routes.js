const express = require('express');
const router = express.Router();
const requestsController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { messageRequestValidator } = require('../../middleware/validation');

router.use(authenticate);

// Accept legacy payload keys (`type`, `recipient_id`) from older clients.
const normalizeLegacyKeys = (req, res, next) => {
    const body = req.body || {};
    req.body = {
        ...body,
        receiver_id: body.receiver_id || body.recipient_id,
        request_type: body.request_type || body.type || 'general'
    };
    next();
};

router.post('/', normalizeLegacyKeys, messageRequestValidator, asyncHandler(requestsController.createRequest.bind(requestsController)));
router.get('/', asyncHandler(requestsController.getRequests.bind(requestsController)));
router.patch('/:id/accept', asyncHandler(requestsController.acceptRequest.bind(requestsController)));
router.patch('/:id/reject', asyncHandler(requestsController.rejectRequest.bind(requestsController)));

module.exports = router;
