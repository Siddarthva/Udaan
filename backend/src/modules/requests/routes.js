const express = require('express');
const router = express.Router();
const requestsController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

router.use(authenticate);

router.post('/', asyncHandler(requestsController.createRequest.bind(requestsController)));
router.get('/', asyncHandler(requestsController.getRequests.bind(requestsController)));
router.patch('/:id/accept', asyncHandler(requestsController.acceptRequest.bind(requestsController)));
router.patch('/:id/reject', asyncHandler(requestsController.rejectRequest.bind(requestsController)));

module.exports = router;
