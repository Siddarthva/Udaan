const express = require('express');
const startupController = require('./controller');
const authenticate = require('../../middleware/auth');
const { allowedRoles } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { startupCreateValidator, startupUpdateValidator } = require('../../middleware/validation');
const { ROLES } = require('../../utils/constants');

const router = express.Router();
const h = (name) => asyncHandler((req, res) => startupController[name](req, res));

router.use(authenticate);

// Discovery
router.get('/', h('listStartups'));
router.get('/trending', h('getTrendingStartups'));
router.get('/activity', h('getActivityFeed'));

// Relation lists (declared before /:id so they are not captured as an id)
router.get('/relations/saved', h('getSavedStartups'));
router.get('/relations/interests', allowedRoles([ROLES.SPONSOR, ROLES.INNOVATOR]), h('getInvestorInterests'));
router.get('/relations/mentor-requests', allowedRoles([ROLES.MENTOR, ROLES.INNOVATOR]), h('getMentorRequests'));
router.patch('/relations/mentor-requests/:id', allowedRoles([ROLES.INNOVATOR]), h('updateMentorRequestStatus'));

// Startup updates
router.delete('/updates/:id', h('deleteUpdate'));
router.get('/:id/updates', h('getUpdates'));
router.post('/:id/updates', h('createUpdate'));
router.get('/:id/analytics', h('getStartupAnalytics'));

// Startup CRUD
router.post('/launch', allowedRoles([ROLES.INNOVATOR]), startupCreateValidator, h('launchStartup'));
router.get('/:id', h('getDetails'));
router.patch('/:id', allowedRoles([ROLES.INNOVATOR]), startupUpdateValidator, h('updateStartup'));

// Team
router.post('/:id/members', allowedRoles([ROLES.INNOVATOR]), h('addMember'));
router.delete('/:id/members/:memberId', allowedRoles([ROLES.INNOVATOR]), h('removeMember'));

// Actions on a specific startup
router.post('/:id/invest', allowedRoles([ROLES.SPONSOR]), h('simulateInvestment'));
router.post('/:id/express-interest', allowedRoles([ROLES.SPONSOR]), h('expressInterest'));
router.post('/:id/save', h('saveStartup'));
router.post('/:id/mentor-request', allowedRoles([ROLES.MENTOR]), h('sendMentorRequest'));

module.exports = router;
