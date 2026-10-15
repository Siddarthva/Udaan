const dotenv = require('dotenv');
dotenv.config();

const env = {
    port: parseInt(process.env.PORT || '8000', 10),
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    supabase: {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY || ''
    },
    upload: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10)
    },
    api: {
        prefix: process.env.API_PREFIX || '/api'
    }
};

const PLACEHOLDER = /your-|example\.com|changeme/i;

/** Returns the list of missing / placeholder required variables. */
function findMissing() {
    const required = {
        SUPABASE_URL: env.supabase.url,
        SUPABASE_ANON_KEY: env.supabase.anonKey,
        SUPABASE_SERVICE_ROLE_KEY: env.supabase.serviceRoleKey
    };
    return Object.entries(required)
        .filter(([, value]) => !value || PLACEHOLDER.test(value))
        .map(([name]) => name);
}

function validateEnv() {
    const missing = findMissing();
    if (missing.length > 0) {
        console.error(`[ENV] Missing or placeholder required environment variables: ${missing.join(', ')}`);
        console.error('[ENV] Copy backend/.env.example to backend/.env and fill in real values.');
        process.exit(1);
    }

    console.log(`[ENV] PORT=${env.port} NODE_ENV=${env.env} CLIENT_URL=${env.clientUrl} API_PREFIX=${env.api.prefix}`);
}

module.exports = env;
module.exports.validateEnv = validateEnv;
module.exports.findMissing = findMissing;
