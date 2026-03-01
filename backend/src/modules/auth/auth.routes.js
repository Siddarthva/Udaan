const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

/**
 * Auth Routes 🔐
 * Mapping paths to controller methods.
 */

// Public Paths
router.post('/register', authController.register);
router.post('/login', authController.login);

// Private Paths (Protected by middleware)
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, (req, res) => {
    // 1. Clear Cookies
    res.clearCookie('refreshToken');
    // 2. Clear from DB (Optional: Invalidate Token)
    res.json({ message: 'Logged out from current session' });
});

module.exports = router;
