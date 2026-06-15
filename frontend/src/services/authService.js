import api from "../api/axios";

class AuthService {
    async login(email, password) {
        const response = await api.post("/auth/login", { email, password });
        return response.data; // { user, accessToken }
    }

    async register(userData) {
        const response = await api.post("/auth/register", userData);
        return response.data; // { user, accessToken }
    }

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    }

    async getCurrentUser() {
        const response = await api.get("/auth/me");
        return response.data.user;
    }

    async updateProfile(profileData) {
        const response = await api.patch("/auth/profile", profileData);
        return response.data;
    }
}

export default new AuthService();
