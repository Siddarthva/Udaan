const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');
const { registerValidator, loginValidator, profileValidator } = require('../../middleware/validation');
const env = require('../../config/env');

const router = express.Router();

// Brute-force protection for credential endpoints (production only, like the global limiter).
const credentialLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => !env.isProduction,
    message: { error: 'Too many attempts, please try again later.' }
});

router.post('/register', credentialLimiter, registerValidator, asyncHandler((req, res) => authController.register(req, res)));
router.post('/login', credentialLimiter, loginValidator, asyncHandler((req, res) => authController.login(req, res)));
router.post('/refresh', asyncHandler((req, res) => authController.refresh(req, res)));
router.post('/logout', asyncHandler((req, res) => authController.logout(req, res)));

router.get('/check-username/:username', asyncHandler((req, res) => authController.checkUsername(req, res)));

router.get('/me', authenticate, asyncHandler((req, res) => authController.getCurrentUser(req, res)));
router.get('/profile', authenticate, asyncHandler((req, res) => authController.getCurrentUser(req, res)));
router.patch('/profile', authenticate, profileValidator, asyncHandler((req, res) => authController.updateProfile(req, res)));
router.put('/profile', authenticate, profileValidator, asyncHandler((req, res) => authController.updateProfile(req, res)));

module.exports = router;
