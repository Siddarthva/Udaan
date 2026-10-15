process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.CLIENT_URL = 'http://localhost:5173';

const http = require('http');
const { FakeSupabase } = require('./fakeSupabase');

const fake = new FakeSupabase();

// Route every `config/supabase` import to the in-memory fake (test-only substitution).
const supabaseModulePath = require.resolve('../../src/config/supabase');
require.cache[supabaseModulePath] = {
    id: supabaseModulePath,
    filename: supabaseModulePath,
    loaded: true,
    exports: { supabase: fake, getAdminClient: () => fake, getAuthClient: () => fake }
};

const app = require('../../src/app');
const morganSilence = process.env.DEBUG_TESTS ? null : (app._router.stack = app._router.stack.filter((l) => l.name !== 'logger'));

let server;
let baseUrl;

async function start() {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
}

async function stop() {
    await new Promise((resolve) => server.close(resolve));
}

/** Minimal JSON HTTP client. Returns { status, body, cookies }. */
async function api(method, path, { token, body, cookie } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (cookie) headers.Cookie = cookie;
    const res = await fetch(`${baseUrl}/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    let parsed = null;
    const text = await res.text();
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
    const setCookie = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
    return { status: res.status, body: parsed, cookies: setCookie };
}

let counter = 0;

/** Registers a user through the real API and returns credentials + identity. */
async function signup(role = 'INNOVATOR', overrides = {}) {
    counter += 1;
    const payload = {
        email: `user${counter}_${Date.now()}@example.com`,
        password: 'Passw0rd!123',
        full_name: `Test User ${counter}`,
        username: `user_${counter}_${Math.floor(Math.random() * 1e6)}`,
        role,
        ...overrides
    };
    const res = await api('POST', '/auth/register', { body: payload });
    if (res.status !== 201) throw new Error(`signup failed: ${res.status} ${JSON.stringify(res.body)}`);
    return { ...payload, id: res.body.user.id, token: res.body.accessToken, cookies: res.cookies, user: res.body.user };
}

module.exports = { fake, start, stop, api, signup };

// Keep test output readable; set DEBUG_TESTS=1 to see server logs.
if (!process.env.DEBUG_TESTS) {
    console.error = () => {};
    console.log = () => {};
}
