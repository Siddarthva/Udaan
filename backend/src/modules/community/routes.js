const express = require('express');
const router = express.Router();
const communityController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

router.use(authenticate);

router.get('/', asyncHandler(communityController.getMembers.bind(communityController)));
router.get('/search', asyncHandler(communityController.searchMembers.bind(communityController)));
router.get('/:id', asyncHandler(communityController.getMember.bind(communityController)));

module.exports = router;
