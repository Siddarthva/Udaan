// In development fall back to the local API; in production require VITE_API_URL or use same-origin /api (reverse proxy).
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000/api" : "/api");

const env = {
    apiUrl,
    appName: import.meta.env.VITE_APP_NAME || "UDAAN",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    uploadLimit: Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 10485760
};

export default env;
