import { delay, db } from "./mockDb";

/**
 * AuthService (Simulated API) 🔐
 * This layer handles production-style Auth workflows using local storage.
 * All functions return Promises to mimic Axios / Fetch behavior.
 */
class AuthService {
    /**
     * POST /api/auth/login
     */
    async login(email, role, fullName) {
        await delay(1200); // Simulate network round-trip

        const data = db.getData();
        const user = data.users[role.toLowerCase()] || {};

        // In Sandbox mode, we use the provided name for the session.
        const sessionUser = {
            ...user,
            email: email || user.email,
            name: fullName || user.name || "User",
            role: role
        };

        const session = {
            user: sessionUser,
            token: "mock-jwt-token-" + Date.now(),
            expiresAt: Date.now() + 86400000 // 24H
        };

        localStorage.setItem("udaan_session", JSON.stringify(session));
        return session;
    }

    /**
     * GET /api/auth/me
     */
    async getCurrentUser() {
        await delay(500);
        const session = JSON.parse(localStorage.getItem("udaan_session"));
        return session || null;
    }

    /**
     * POST /api/auth/logout
     */
    async logout() {
        await delay(400);
        localStorage.removeItem("udaan_session");
        return { success: true };
    }

    /**
     * POST /api/auth/register
     */
    async register(userData) {
        await delay(1500);
        const data = db.getData();
        const newUser = {
            id: "u" + Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        data.users[newUser.id] = newUser;
        db.saveData(data);

        return this.login(userData.email, userData.role);
    }
}

export default new AuthService();
