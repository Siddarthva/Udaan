const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware 🔐
 * Validates the token and attaches the user data to the request object.
 */
module.exports = function authenticate(req, res, next) {
    // In production, also check HTTP-only cookies if preferred
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret-access-token-123');
        req.user = decoded; // Contains id, email, role, etc.
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired access token' });
    }
};
