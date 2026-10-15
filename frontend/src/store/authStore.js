import { create } from "zustand";
import { authApi } from "../api/api";
import { mapRoleToClient } from "../utils/roles";

const TOKEN_KEY = "accessToken";
const SESSION_FLAG = "udaan_has_session";

function readStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
    } catch {
        // Storage can be unavailable (private mode); the in-memory session still works.
    }
}

/** Single place where an API user becomes the UI user (role label, display name). */
export function normalizeUser(apiUser) {
    if (!apiUser) return null;
    return {
        ...apiUser,
        name: apiUser.full_name || apiUser.username || "",
        role: mapRoleToClient(apiUser.role)
    };
}

const errorMessage = (err, fallback) => err?.response?.data?.error || err?.message || fallback;

// Guards against double initialization (React StrictMode, re-renders) and refresh races.
let initPromise = null;

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: readStorage(TOKEN_KEY),
    isAuthenticated: false,
    isLoading: true,
    error: null,

    setSession: (apiUser, accessToken) => {
        writeStorage(TOKEN_KEY, accessToken);
        writeStorage(SESSION_FLAG, "1");
        set({ user: normalizeUser(apiUser), accessToken: accessToken || null, isAuthenticated: !!apiUser, isLoading: false, error: null });
    },

    clearSession: () => {
        writeStorage(TOKEN_KEY, null);
        writeStorage(SESSION_FLAG, null);
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    },

    signup: async ({ full_name, username, email, password, role }) => {
        set({ error: null });
        try {
            const data = await authApi.register({ full_name, username, email, password, role });
            if (data.accessToken) {
                get().setSession(data.user, data.accessToken);
            }
            return { user: normalizeUser(data.user), requiresEmailConfirmation: !!data.requiresEmailConfirmation, message: data.message };
        } catch (err) {
            const msg = errorMessage(err, "Signup failed");
            set({ error: msg });
            throw new Error(msg);
        }
    },

    login: async ({ loginInput, password }) => {
        set({ error: null });
        try {
            const data = await authApi.login(loginInput, password);
            get().setSession(data.user, data.accessToken);
            return get().user;
        } catch (err) {
            const msg = errorMessage(err, "Login failed");
            set({ error: msg });
            throw new Error(msg);
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.warn("Logout request failed; clearing local session anyway:", errorMessage(err, ""));
        }
        get().clearSession();
    },

    /**
     * Restores the session on page load: validates the stored access token with /auth/me
     * (the axios interceptor transparently refreshes an expired one once). With no token, a single
     * refresh is attempted only if this browser previously held a session.
     */
    initialize: () => {
        if (!initPromise) initPromise = get()._runInitialize();
        return initPromise;
    },

    _runInitialize: async () => {
        set({ isLoading: true });
        try {
            if (get().accessToken) {
                const user = await authApi.getCurrentUser();
                // The interceptor may have rotated the token while loading the profile.
                set({ user: normalizeUser(user), isAuthenticated: true, isLoading: false });
                return;
            }
            if (readStorage(SESSION_FLAG)) {
                const data = await authApi.refresh();
                get().setSession(data.user, data.accessToken);
                return;
            }
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                get().clearSession();
                return;
            }
            // Network / server error: keep the stored token so a transient failure does not log the user out.
            console.error("Session restore failed:", errorMessage(err, ""));
            set({ error: errorMessage(err, "Could not reach the server"), isLoading: false, isAuthenticated: false });
            return;
        }
        set({ isLoading: false });
    },

    updateProfile: async (updates) => {
        try {
            const response = await authApi.updateProfile(updates);
            set({ user: normalizeUser(response.user) });
            return get().user;
        } catch (err) {
            const fields = err?.response?.data?.errors;
            const error = new Error(errorMessage(err, "Failed to update profile"));
            error.fields = Array.isArray(fields) ? Object.fromEntries(fields.map((f) => [f.field, f.message])) : {};
            throw error;
        }
    }
}));
