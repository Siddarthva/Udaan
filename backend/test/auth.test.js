const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { fake, start, stop, api, signup } = require('./helpers/harness');

before(start);
after(stop);
beforeEach(() => fake.reset());

describe('signup', () => {
    test('creates auth user + matching profile (id parity) and returns a session', async () => {
        const u = await signup('MENTOR');
        assert.equal(u.user.role, 'MENTOR');
        assert.equal(u.user.email, u.email);
        assert.ok(u.token);
        const profiles = fake.tables.profiles;
        assert.equal(profiles.length, 1);
        assert.equal(profiles[0].id, u.id);
        assert.ok(fake.users.has(u.id), 'profile id equals auth.users id');
        assert.ok(u.cookies.some((c) => c.startsWith('refreshToken=') && /HttpOnly/i.test(c)));
    });

    test('rejects duplicate email with 409 and creates no second profile', async () => {
        const u = await signup();
        const res = await api('POST', '/auth/register', { body: { email: u.email, password: 'Passw0rd!123', full_name: 'Dup', username: 'dup_user', role: 'INNOVATOR' } });
        assert.equal(res.status, 409);
        assert.equal(fake.tables.profiles.length, 1);
    });

    test('rejects duplicate username with 409 before touching auth', async () => {
        const u = await signup();
        const before = fake.users.size;
        const res = await api('POST', '/auth/register', { body: { email: 'other@example.com', password: 'Passw0rd!123', full_name: 'Other', username: u.username, role: 'INNOVATOR' } });
        assert.equal(res.status, 409);
        assert.equal(fake.users.size, before);
    });

    test('validates payload (400) including role and weak password', async () => {
        const base = { email: 'a@example.com', password: 'Passw0rd!123', full_name: 'A', username: 'valid_name', role: 'INNOVATOR' };
        assert.equal((await api('POST', '/auth/register', { body: { ...base, role: 'ADMIN' } })).status, 400);
        assert.equal((await api('POST', '/auth/register', { body: { ...base, password: 'short' } })).status, 400);
        assert.equal((await api('POST', '/auth/register', { body: { ...base, username: 'a!' } })).status, 400);
        assert.equal((await api('POST', '/auth/register', { body: { ...base, email: 'nope' } })).status, 400);
    });

    test('normalizes legacy / lowercase roles to canonical roles', async () => {
        const u = await signup('investor');
        assert.equal(u.user.role, 'SPONSOR');
        assert.equal(fake.tables.profiles[0].role, 'SPONSOR');
    });

    test('profile creation failure rolls back the auth user and does not report success', async () => {
        fake.failNext('profiles', 'upsert');
        const res = await api('POST', '/auth/register', { body: { email: 'p@example.com', password: 'Passw0rd!123', full_name: 'P', username: 'partial_user', role: 'INNOVATOR' } });
        assert.equal(res.status, 500);
        assert.equal(fake.users.size, 0, 'orphan auth user removed');
        assert.equal(fake.tables.profiles.length, 0);
    });
});

describe('login', () => {
    test('logs in with email', async () => {
        const u = await signup();
        const res = await api('POST', '/auth/login', { body: { loginInput: u.email, password: u.password } });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.id, u.id);
        assert.ok(res.body.accessToken);
    });

    test('logs in with username', async () => {
        const u = await signup();
        const res = await api('POST', '/auth/login', { body: { loginInput: u.username, password: u.password } });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.id, u.id);
    });

    test('legacy `email` field still works as the identifier', async () => {
        const u = await signup();
        const res = await api('POST', '/auth/login', { body: { email: u.email, password: u.password } });
        assert.equal(res.status, 200);
    });

    test('wrong password is rejected - there is no local-token fallback for existing profiles', async () => {
        const u = await signup();
        const byEmail = await api('POST', '/auth/login', { body: { loginInput: u.email, password: 'wrong-password' } });
        const byName = await api('POST', '/auth/login', { body: { loginInput: u.username, password: 'wrong-password' } });
        assert.equal(byEmail.status, 401);
        assert.equal(byName.status, 401);
        assert.equal(byEmail.body.accessToken, undefined);
    });

    test('unknown username and wrong password produce the same message (no enumeration)', async () => {
        const u = await signup();
        const a = await api('POST', '/auth/login', { body: { loginInput: 'no_such_user', password: 'x' } });
        const b = await api('POST', '/auth/login', { body: { loginInput: u.username, password: 'bad' } });
        assert.equal(a.status, 401);
        assert.equal(a.body.error, b.body.error);
    });

    test('forged / self-signed tokens are rejected by protected routes', async () => {
        const u = await signup();
        const res = await api('GET', '/auth/me', { token: 'eyJhbGciOiJIUzI1NiJ9.forged.token' });
        assert.equal(res.status, 401);
        const noToken = await api('GET', '/auth/me');
        assert.equal(noToken.status, 401);
        assert.ok(u.token);
    });

    test('a missing profile for an existing auth user is created once, idempotently', async () => {
        const u = await signup();
        fake.tables.profiles = [];
        const first = await api('GET', '/auth/me', { token: u.token });
        const second = await api('GET', '/auth/me', { token: u.token });
        assert.equal(first.status, 200);
        assert.equal(second.status, 200);
        assert.equal(fake.tables.profiles.length, 1);
        assert.equal(first.body.user.completion_percentage < 80, true);
        assert.equal(first.body.user.profile_completed, false);
    });
});

describe('session lifecycle', () => {
    test('/auth/me returns the persisted profile (session restoration)', async () => {
        const u = await signup('SPONSOR');
        const res = await api('GET', '/auth/me', { token: u.token });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.username, u.username);
        assert.equal(res.body.user.role, 'SPONSOR');
        assert.equal(res.body.user.email, u.email);
    });

    test('refresh rotates tokens using the cookie; invalid refresh is 401 and clears the cookie', async () => {
        const u = await signup();
        const cookie = u.cookies[0].split(';')[0];
        const ok = await api('POST', '/auth/refresh', { cookie });
        assert.equal(ok.status, 200);
        assert.ok(ok.body.accessToken);

        const reuse = await api('POST', '/auth/refresh', { cookie }); // old refresh token was rotated
        assert.equal(reuse.status, 401);
        assert.ok(reuse.cookies.some((c) => c.startsWith('refreshToken=;')));

        const none = await api('POST', '/auth/refresh');
        assert.equal(none.status, 401);
    });

    test('logout revokes the session and clears the cookie; it is safe with an expired token', async () => {
        const u = await signup();
        const out = await api('POST', '/auth/logout', { token: u.token });
        assert.equal(out.status, 200);
        assert.equal((await api('GET', '/auth/me', { token: u.token })).status, 401);
        const again = await api('POST', '/auth/logout', { token: u.token });
        assert.equal(again.status, 200);
    });
});

describe('profile', () => {
    test('updates supported fields and persists them', async () => {
        const u = await signup();
        const res = await api('PATCH', '/auth/profile', { token: u.token, body: { bio: 'Builder', college: 'IIT', skills: ['js', 'sql'], location: 'Pune' } });
        assert.equal(res.status, 200);
        assert.equal(res.body.user.bio, 'Builder');
        assert.deepEqual(res.body.user.skills, ['js', 'sql']);
        assert.equal(fake.tables.profiles[0].college, 'IIT');
        const me = await api('GET', '/auth/me', { token: u.token });
        assert.equal(me.body.user.location, 'Pune');
    });

    test('rejects unknown/unsafe fields (id, email) and invalid URLs', async () => {
        const u = await signup();
        assert.equal((await api('PATCH', '/auth/profile', { token: u.token, body: { id: 'x' } })).status, 400);
        assert.equal((await api('PATCH', '/auth/profile', { token: u.token, body: { linkedin_url: 'javascript:alert(1)' } })).status, 400);
        assert.equal((await api('PATCH', '/auth/profile', { token: u.token, body: {} })).status, 400);
    });

    test('enforces username uniqueness but allows keeping your own', async () => {
        const a = await signup();
        const b = await signup();
        const taken = await api('PATCH', '/auth/profile', { token: b.token, body: { username: a.username } });
        assert.equal(taken.status, 409);
        const same = await api('PATCH', '/auth/profile', { token: a.token, body: { username: a.username, bio: 'x' } });
        assert.equal(same.status, 200);
        const chk = await api('GET', `/auth/check-username/${a.username}`);
        assert.equal(chk.body.available, false);
        assert.equal((await api('GET', '/auth/check-username/brand_new_name')).body.available, true);
    });

    test('a skipped profile stays incomplete and no identity is fabricated', async () => {
        const u = await signup();
        const me = await api('GET', '/auth/me', { token: u.token });
        assert.equal(me.body.user.profile_completed, false);
        assert.equal(me.body.user.bio, '');
        assert.equal(me.body.user.college, '');
    });
});

describe('auth service outage', () => {
    test('a network failure talking to Supabase Auth is a 502, not a bad-credentials 401', async () => {
        const u = await signup();
        const original = fake.auth.signInWithPassword;
        fake.auth.signInWithPassword = async () => ({ data: { user: null, session: null }, error: { message: 'fetch failed', status: 0, name: 'AuthRetryableFetchError' } });
        try {
            const res = await api('POST', '/auth/login', { body: { loginInput: u.email, password: u.password } });
            assert.equal(res.status, 502);
        } finally {
            fake.auth.signInWithPassword = original;
        }
    });
});
