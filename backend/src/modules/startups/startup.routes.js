const express = require('express');
const startupController = require('./startup.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Public Discovery
router.get('/', startupController.listStartups);
router.get('/:id', startupController.getDetails);

// Protected Actions
router.post('/launch', authenticate, startupController.launchStartup);
router.patch('/:id', authenticate, startupController.updateStartup);

// Members Management
router.post('/:id/members', authenticate, startupController.addMember);
router.delete('/:id/members/:memberId', authenticate, startupController.removeMember);

// Investor Relations
router.post('/:id/express-interest', authenticate, startupController.expressInterest);
router.post('/:id/save', authenticate, startupController.saveStartup);
router.get('/relations/saved', authenticate, startupController.getSavedStartups);
router.get('/relations/interests', authenticate, startupController.getInvestorInterests);

// Mentor Relations
router.post('/:id/mentor-request', authenticate, startupController.sendMentorRequest);
router.get('/relations/mentor-requests', authenticate, startupController.getMentorRequests);
router.patch('/relations/mentor-requests/:id', authenticate, startupController.updateMentorRequestStatus);

module.exports = router;
