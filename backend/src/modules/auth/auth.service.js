const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRepo = require('./auth.repository');

/**
 * Auth Service Layer: Business logic for authentication flow ⚡
 * Handles token generation, role verification, and password hashing.
 */
class AuthService {
    async registerUser(userData) {
        const { email, password, role, name } = userData;

        // 1. Check if user already exists
        const existingUser = await authRepo.findByEmail(email);
        if (existingUser) throw new Error('User with this email already exists');

        // 2. Hash Password
        const saltRounds = parseInt(process.env.BCRYPT_SALT || '10');
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Save to Repository
        return authRepo.createUser({
            email,
            password_hash: passwordHash,
            role,
            name,
            verified: false,
            created_at: new Date()
        });
    }

    async validateUser(email, password) {
        const user = await authRepo.findByEmail(email);
        if (!user) throw new Error('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) throw new Error('Invalid email or password');

        return user;
    }

    generateTokens(user) {
        const payload = { id: user.id, email: user.email, role: user.role };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET || 'access-secret',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET || 'refresh-secret',
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }
}

module.exports = new AuthService();
