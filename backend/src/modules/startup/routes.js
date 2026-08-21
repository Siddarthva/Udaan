const express = require('express');
const startupController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { startupValidator, memberValidator } = require('../../middleware/validation');

const router = express.Router();

// Discovery & Trending
router.get('/', asyncHandler((req, res) => startupController.listStartups(req, res)));
router.get('/trending', asyncHandler((req, res) => startupController.getTrendingStartups(req, res)));
router.get('/activity', asyncHandler((req, res) => startupController.getActivityFeed(req, res)));

// Investor & Mentor Relations List Routes (Must come BEFORE /:id to prevent route parameter collision)
router.get('/relations/saved', authenticate, asyncHandler((req, res) => startupController.getSavedStartups(req, res)));
router.get('/relations/interests', authenticate, asyncHandler((req, res) => startupController.getInvestorInterests(req, res)));
router.get('/relations/mentor-requests', authenticate, asyncHandler((req, res) => startupController.getMentorRequests(req, res)));
router.patch('/relations/mentor-requests/:id', authenticate, asyncHandler((req, res) => startupController.updateMentorRequestStatus(req, res)));

// Startup Updates & Analytics
router.delete('/updates/:id', authenticate, asyncHandler((req, res) => startupController.deleteUpdate(req, res)));
router.get('/:id/updates', asyncHandler((req, res) => startupController.getUpdates(req, res)));
router.post('/:id/updates', authenticate, asyncHandler((req, res) => startupController.createUpdate(req, res)));
router.get('/:id/analytics', authenticate, asyncHandler((req, res) => startupController.getStartupAnalytics(req, res)));

// Startup Detail & Launch
router.get('/:id', asyncHandler((req, res) => startupController.getDetails(req, res)));
router.post('/launch', authenticate, startupValidator, asyncHandler((req, res) => startupController.launchStartup(req, res)));
router.patch('/:id', authenticate, startupValidator, asyncHandler((req, res) => startupController.updateStartup(req, res)));

// Members Management
router.post('/:id/members', authenticate, memberValidator, asyncHandler((req, res) => startupController.addMember(req, res)));
router.delete('/:id/members/:memberId', authenticate, asyncHandler((req, res) => startupController.removeMember(req, res)));

// Actions on Specific Startup
router.post('/:id/invest', authenticate, asyncHandler((req, res) => startupController.investInStartup(req, res)));
router.post('/:id/express-interest', authenticate, asyncHandler((req, res) => startupController.expressInterest(req, res)));
router.post('/:id/save', authenticate, asyncHandler((req, res) => startupController.saveStartup(req, res)));
router.post('/:id/mentor-request', authenticate, asyncHandler((req, res) => startupController.sendMentorRequest(req, res)));

module.exports = router;
