const env = {
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    appName: import.meta.env.VITE_APP_NAME || "UDAAN",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    uploadLimit: Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 10485760
};

export default env;
