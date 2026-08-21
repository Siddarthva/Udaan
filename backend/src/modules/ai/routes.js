const express = require('express');
const router = express.Router();
const aiController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

router.use(authenticate);

router.post('/bio', asyncHandler(aiController.generateBio.bind(aiController)));
router.post('/startup-description', asyncHandler(aiController.generateStartupDescription.bind(aiController)));
router.post('/startup-name', asyncHandler(aiController.generateStartupNames.bind(aiController)));
router.post('/elevator-pitch', asyncHandler(aiController.generateElevatorPitch.bind(aiController)));

module.exports = router;
