const express = require('express');
const authController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { registerValidator, loginValidator, profileValidator } = require('../../middleware/validation');

const router = express.Router();

router.post('/register', registerValidator, asyncHandler((req, res) => authController.register(req, res)));
router.post('/login', loginValidator, asyncHandler((req, res) => authController.login(req, res)));
router.post('/refresh', asyncHandler((req, res) => authController.refresh(req, res)));

router.get('/check-username/:username', asyncHandler((req, res) => authController.checkUsername(req, res)));

router.get('/me', authenticate, asyncHandler((req, res) => authController.getCurrentUser(req, res)));
router.get('/profile', authenticate, asyncHandler((req, res) => authController.getCurrentUser(req, res)));
router.patch('/profile', authenticate, profileValidator, asyncHandler((req, res) => authController.updateProfile(req, res)));
router.put('/profile', authenticate, profileValidator, asyncHandler((req, res) => authController.updateProfile(req, res)));
router.post('/logout', authenticate, asyncHandler((req, res) => authController.logout(req, res)));

module.exports = router;
