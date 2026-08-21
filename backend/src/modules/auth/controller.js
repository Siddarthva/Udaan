const authService = require('./service');
const env = require('../../config/env');

const cookieConfig = {
    httpOnly: true,
    secure: env.env === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

class AuthController {
    async register(req, res) {
        const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
        res.cookie('refreshToken', refreshToken, cookieConfig);
        res.status(201).json({ user, accessToken, message: 'User registered successfully' });
    }

    async login(req, res) {
        const loginInput = req.body.loginInput || req.body.email;
        const { user, accessToken, refreshToken } = await authService.validateUser(loginInput, req.body.password);
        res.cookie('refreshToken', refreshToken, cookieConfig);
        res.status(200).json({ user, accessToken, message: 'Login successful' });
    }

    async refresh(req, res) {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        const { accessToken, refreshToken, user } = await authService.refreshAccessToken(token);
        res.cookie('refreshToken', refreshToken, cookieConfig);
        res.status(200).json({ user, accessToken, message: 'Token refreshed successfully' });
    }

    async updateProfile(req, res) {
        const user = await authService.updateProfile(req.user.id, req.body);
        res.status(200).json({ user, message: 'Profile updated successfully' });
    }

    async getCurrentUser(req, res) {
        const user = await authService.getProfile(req.user.id, req.user);
        res.status(200).json({ user });
    }

    async checkUsername(req, res) {
        const { username } = req.params;
        const available = await authService.checkUsernameAvailability(username);
        res.status(200).json({ available });
    }

    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out from current session' });
    }
}

module.exports = new AuthController();
