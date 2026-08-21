import axios from "axios";
import env from "@/config/env";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
    baseURL: env.apiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Attach access token from store or localStorage to Authorization header
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken || localStorage.getItem("accessToken");
        if (token && typeof token === "string" && token !== "undefined" && token !== "null" && token.trim()) {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handle expired/invalid tokens by rotating them
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // Circuit Breaker: Never retry auth lifecycle endpoints or requests that already retried
        const isAuthEndpoint = originalRequest.url && (
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register") ||
            originalRequest.url.includes("/auth/refresh") ||
            originalRequest.url.includes("/auth/logout")
        );

        if (isAuthEndpoint || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${env.apiUrl}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken, user } = refreshResponse.data;
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                }
                useAuthStore.getState().setSession(user, accessToken);

                processQueue(null, accessToken);
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                
                // Direct state reset without triggering POST /auth/logout
                localStorage.removeItem("accessToken");
                useAuthStore.setState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
