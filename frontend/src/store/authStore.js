import { create } from 'zustand';
import authService from '../services/authService';

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    setSession: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading: false,
        error: null
    }),

    signup: async ({ name, email, password, role }) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.register({ name, email, password, role });
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
            const data = await authService.login(email, password);
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
            await authService.logout();
        } catch (e) {
            console.error('Logout error on server', e);
        }
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
        try {
            const user = await authService.getCurrentUser();
            set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            });
        } catch (err) {
            // If fetching me fails, they are not logged in
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },

    // Alias for compatibility
    loadUserFromStorage: async () => {
        await get().loadUserFromLocalStorage();
    },

    updateProfile: async (updates) => {
        try {
            const response = await authService.updateProfile(updates);
            set({ user: response.user });
            return response.user;
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to update profile';
            throw new Error(msg);
        }
    }
}));
