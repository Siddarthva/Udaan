const authService = require('./service');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');

const REFRESH_COOKIE = 'refreshToken';

// Cross-site deployments (frontend and API on different hosts) need SameSite=None; Secure.
const cookieConfig = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
};

function setRefreshCookie(res, refreshToken) {
    if (refreshToken) res.cookie(REFRESH_COOKIE, refreshToken, cookieConfig);
}

function clearRefreshCookie(res) {
    const { maxAge, ...options } = cookieConfig; // eslint-disable-line no-unused-vars
    res.clearCookie(REFRESH_COOKIE, options);
}

class AuthController {
    async register(req, res) {
        const { user, accessToken, refreshToken, requiresEmailConfirmation } = await authService.registerUser(req.body);
        setRefreshCookie(res, refreshToken);
        res.status(201).json({
            user,
            accessToken,
            requiresEmailConfirmation,
            message: requiresEmailConfirmation
                ? 'Account created. Please confirm your email address, then sign in.'
                : 'User registered successfully'
        });
    }

    async login(req, res) {
        const { user, accessToken, refreshToken } = await authService.validateUser(req.body.loginInput, req.body.password);
        setRefreshCookie(res, refreshToken);
        res.status(200).json({ user, accessToken, message: 'Login successful' });
    }

    async refresh(req, res) {
        const token = req.cookies?.[REFRESH_COOKIE];
        try {
            const { accessToken, refreshToken, user } = await authService.refreshAccessToken(token);
            setRefreshCookie(res, refreshToken);
            res.status(200).json({ user, accessToken, message: 'Token refreshed successfully' });
        } catch (err) {
            if (err instanceof ApiError && err.statusCode === 401) clearRefreshCookie(res);
            throw err;
        }
    }

    async updateProfile(req, res) {
        const user = await authService.updateProfile(req.authUser, req.body);
        res.status(200).json({ user, message: 'Profile updated successfully' });
    }

    async getCurrentUser(req, res) {
        const user = await authService.getProfile(req.authUser);
        res.status(200).json({ user });
    }

    async checkUsername(req, res) {
        const available = await authService.isUsernameAvailable(req.params.username);
        res.status(200).json({ available });
    }

    async logout(req, res) {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        await authService.revokeSession(token);
        clearRefreshCookie(res);
        res.status(200).json({ message: 'Logged out' });
    }
}

module.exports = new AuthController();
