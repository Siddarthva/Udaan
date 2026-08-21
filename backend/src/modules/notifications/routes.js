const express = require('express');
const router = express.Router();
const notificationsController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

router.use(authenticate);

router.get('/', asyncHandler(notificationsController.getNotifications.bind(notificationsController)));
router.post('/read', asyncHandler(notificationsController.markAsRead.bind(notificationsController)));
router.patch('/:id/read', asyncHandler(notificationsController.markSingleAsRead.bind(notificationsController)));

module.exports = router;
