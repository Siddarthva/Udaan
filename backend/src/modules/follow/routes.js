const express = require('express');
const router = express.Router();
const followController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

router.use(authenticate);

router.post('/user/:id', asyncHandler(followController.followUser.bind(followController)));
router.delete('/user/:id', asyncHandler(followController.unfollowUser.bind(followController)));

router.post('/startup/:id', asyncHandler(followController.followStartup.bind(followController)));
router.delete('/startup/:id', asyncHandler(followController.unfollowStartup.bind(followController)));

router.get('/followers', asyncHandler(followController.getFollowers.bind(followController)));
router.get('/following', asyncHandler(followController.getFollowing.bind(followController)));

module.exports = router;
