const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const clientOptions = {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
};

let adminClient = null;

/**
 * Privileged client (service role) for all database access. Authorization is enforced
 * in the service layer using the identity verified by the auth middleware.
 * Never send this client or its key to the browser.
 */
function getAdminClient() {
    if (!adminClient) {
        if (!env.supabase.url || !env.supabase.serviceRoleKey) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured');
        }
        adminClient = createClient(env.supabase.url, env.supabase.serviceRoleKey, clientOptions);
    }
    return adminClient;
}

/**
 * A fresh, stateless client for Supabase Auth calls (signUp / signInWithPassword / refresh).
 * A new instance is used per call so one user's session can never leak into another request.
 */
function getAuthClient() {
    if (!env.supabase.url || !env.supabase.anonKey) {
        throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be configured');
    }
    return createClient(env.supabase.url, env.supabase.anonKey, clientOptions);
}

// Lazy proxy so `require` never throws at import time (startup validation reports problems clearly).
const supabase = new Proxy({}, {
    get(_target, prop) {
        const client = getAdminClient();
        const value = client[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    }
});

module.exports = { supabase, getAdminClient, getAuthClient };
