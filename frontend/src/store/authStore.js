import { create } from 'zustand';
import { authApi } from '../api/api';

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    setSession: (user, accessToken) => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
        set({
            user,
            accessToken: accessToken || null,
            isAuthenticated: !!user,
            isLoading: false,
            error: null
        });
    },

    signup: async ({ name, email, password, role }) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authApi.register({ name, email, password, role });
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            set({
                user: data.user,
                accessToken: data.accessToken,
                isAuthenticated: true,
                isLoading: false
            });
            return data.user;
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Signup failed';
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authApi.login(email, password);
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            set({
                user: data.user,
                accessToken: data.accessToken,
                isAuthenticated: true,
                isLoading: false
            });
            return data.user;
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Login failed';
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch (e) {
            // Ignore error if already logged out or session expired
        }
        localStorage.removeItem('accessToken');
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    },

    loadUserFromLocalStorage: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem('accessToken') || get().accessToken;
        
        if (!token) {
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
            return;
        }

        try {
            const user = await authApi.getCurrentUser();
            set({
                user,
                accessToken: token,
                isAuthenticated: !!user,
                isLoading: false
            });
        } catch (err) {
            localStorage.removeItem('accessToken');
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    loadUserFromStorage: async () => {
        await get().loadUserFromLocalStorage();
    },

    updateProfile: async (updates) => {
        try {
            const response = await authApi.updateProfile(updates);
            set({ user: response.user });
            return response.user;
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to update profile';
            throw new Error(msg);
        }
    }
}));
