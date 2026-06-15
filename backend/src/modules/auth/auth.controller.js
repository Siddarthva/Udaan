const authService = require('./auth.service');
const authRepo = require('./auth.repository');

/**
 * Auth Controller Layer: Handles HTTP request and response 🌐
 * Interacts with Service layer to execute registration, login, logout.
 */
class AuthController {
    /**
     * POST /api/auth/register
     */
    async register(req, res) {
        try {
            const { email, password, role, name } = req.body;
            const newUser = await authService.registerUser({ email, password, role, name });
            const { accessToken, refreshToken } = authService.generateTokens(newUser);

            await authRepo.updateRefreshToken(newUser.id, refreshToken);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Exclude password from response
            const { password_hash, refresh_token, ...userData } = newUser;
            res.status(201).json({
                user: userData,
                accessToken,
                message: 'User registered successfully'
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * POST /api/auth/login
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService.validateUser(email, password);
            const { accessToken, refreshToken } = authService.generateTokens(user);

            // 1. Store Refresh Token in DB or Cookies
            await authRepo.updateRefreshToken(user.id, refreshToken);

            // 2. Set HTTP-only Cookie for Refresh Token
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // 3. Return Access Token & User Info
            const { password_hash, refresh_token, ...userData } = user;
            res.status(200).json({
                user: userData,
                accessToken,
                message: 'Login successful'
            });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }

    /**
     * POST /api/auth/refresh
     */
    async refresh(req, res) {
        try {
            const token = req.cookies.refreshToken;
            const { accessToken, refreshToken, user } = await authService.refreshAccessToken(token);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { password_hash, refresh_token: rToken, ...userData } = user;
            res.status(200).json({
                user: userData,
                accessToken,
                message: 'Token refreshed successfully'
            });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }

    /**
     * PATCH /api/auth/profile
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updatedUser = await authService.updateProfile(userId, req.body);
            
            const { password_hash, refresh_token, ...userData } = updatedUser;
            res.status(200).json({
                user: userData,
                message: 'Profile updated successfully'
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * GET /api/auth/me
     */
    async getCurrentUser(req, res) {
        try {
            // Find current detailed user record from database
            const user = await authRepo.findById(req.user.id);
            if (!user) return res.status(401).json({ error: 'User not found' });
            
            const { password_hash, refresh_token, ...userData } = user;
            res.json({ user: userData });
        } catch (err) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
}

module.exports = new AuthController();
