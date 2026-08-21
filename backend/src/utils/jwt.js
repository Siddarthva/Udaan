const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateTokens(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: '30d' });
    return { accessToken, refreshToken };
}

function verifyToken(token) {
    try {
        return jwt.verify(token, env.jwt.secret);
    } catch (e) {
        try {
            return jwt.verify(token, env.jwt.refreshSecret);
        } catch (err) {
            return null;
        }
    }
}

module.exports = {
    generateTokens,
    verifyToken
};
