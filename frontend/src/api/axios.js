import axios from "axios";
import env from "@/config/env";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
    baseURL: env.apiUrl,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

// The access token lives in the auth store (mirrored to localStorage); the refresh token is an httpOnly cookie.
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

const AUTH_LIFECYCLE_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

// One refresh at a time: concurrent 401s wait on the same promise instead of each triggering a refresh.
let refreshPromise = null;

function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${env.apiUrl}/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
                useAuthStore.getState().setSession(res.data.user, res.data.accessToken);
                return res.data.accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        // Only an expired/invalid session (401) triggers a refresh. 403 is an authorization decision and is final.
        if (!original || error.response?.status !== 401) return Promise.reject(error);

        const isLifecycleCall = AUTH_LIFECYCLE_PATHS.some((p) => original.url?.includes(p));
        if (isLifecycleCall || original._retry) return Promise.reject(error);
        original._retry = true;

        try {
            const token = await refreshSession();
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
        } catch {
            useAuthStore.getState().clearSession();
            return Promise.reject(error);
        }
    }
);

/** Extracts the most useful message from an axios error. */
export function errorMessage(err, fallback = "Something went wrong") {
    return err?.response?.data?.error || err?.message || fallback;
}

export default api;
