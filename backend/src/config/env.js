const dotenv = require('dotenv');
dotenv.config();

const env = {
    port: parseInt(process.env.PORT || '8000', 10),
    env: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    jwt: {
        secret: process.env.JWT_SECRET || 'udaan_jwt_secret_key_2026',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'udaan_refresh_secret_key_2026'
    },
    supabase: {
        url: process.env.SUPABASE_URL || 'https://vmaeoglebmtdczsgiehe.supabase.co',
        anonKey: process.env.SUPABASE_ANON_KEY || 'sb_publishable_9v5m7MT3VHRbkRkwe5MysQ_kBydyWcu',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY || ''
    },
    upload: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
        path: process.env.UPLOAD_PATH || 'uploads'
    },
    api: {
        prefix: process.env.API_PREFIX || '/api'
    }
};

function validateEnv() {
    const required = ['port', 'clientUrl'];
    const missing = [];

    if (!env.port) missing.push('PORT');
    if (!env.clientUrl) missing.push('CLIENT_URL');

    if (missing.length > 0) {
        console.error(`❌ [ENV VALIDATION ERROR]: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    console.log(`
    =========================================
    ✅ [ENVIRONMENT LOADED & VALIDATED]
    • PORT       : ${env.port}
    • NODE_ENV   : ${env.env}
    • CLIENT_URL : ${env.clientUrl}
    • API_PREFIX : ${env.api.prefix}
    • SUPABASE   : ${env.supabase.url ? 'Connected (' + env.supabase.url.substring(0, 30) + '...)' : 'Not Configured'}
    =========================================
    `);
}

module.exports = env;
module.exports.validateEnv = validateEnv;
