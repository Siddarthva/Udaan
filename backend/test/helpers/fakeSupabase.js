/**
 * In-memory stand-in for the parts of supabase-js the backend uses (query builder + auth).
 * TEST ONLY. It enforces the same error semantics as PostgREST that the services depend on:
 * unique violations (23505), `.single()` cardinality errors (PGRST116) and column projection.
 */
const crypto = require('crypto');

const UNIQUE = {
    profiles: [['id'], ['username']],
    follows: [['follower_id', 'following_id']],
    startup_members: [['startup_id', 'user_id']],
    saved_startups: [['user_id', 'startup_id']]
};

const DEFAULTS = {
    startups: () => ({ funding_received: 0, status: 'active' }),
    notifications: () => ({ is_read: false })
};

function matchesLike(value, pattern) {
    const re = new RegExp('^' + String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*') + '$', 'i');
    return re.test(String(value ?? ''));
}

function parseOr(expr) {
    return expr.split(',').map((term) => {
        const [column, op, ...rest] = term.split('.');
        return { column, op, value: rest.join('.') };
    });
}

class Query {
    constructor(db, table) {
        this.db = db;
        this.table = table;
        this.filters = [];
        this.orFilters = null;
        this.action = 'select';
        this.payload = null;
        this.options = {};
        this.orderBy = null;
        this.max = null;
        this.projection = '*';
        this.returning = false;
        this.cardinality = null;
    }

    select(columns = '*') {
        if (this.action === 'select') this.projection = columns;
        else { this.returning = true; this.projection = columns; }
        return this;
    }
    insert(rows) { this.action = 'insert'; this.payload = rows; return this; }
    update(values) { this.action = 'update'; this.payload = values; return this; }
    upsert(rows, options = {}) { this.action = 'upsert'; this.payload = rows; this.options = options; return this; }
    delete() { this.action = 'delete'; return this; }
    eq(column, value) { this.filters.push((r) => r[column] === value); return this; }
    neq(column, value) { this.filters.push((r) => r[column] !== value); return this; }
    in(column, values) { this.filters.push((r) => values.includes(r[column])); return this; }
    ilike(column, pattern) { this.filters.push((r) => matchesLike(r[column], pattern)); return this; }
    or(expr) { this.orFilters = parseOr(expr); return this; }
    order(column, { ascending = true } = {}) { this.orderBy = { column, ascending }; return this; }
    limit(n) { this.max = n; return this; }
    single() { this.cardinality = 'single'; return this; }
    maybeSingle() { this.cardinality = 'maybe'; return this; }

    then(resolve, reject) {
        return Promise.resolve().then(() => this.run()).then(resolve, reject);
    }

    matches(row) {
        if (!this.filters.every((f) => f(row))) return false;
        if (this.orFilters) {
            return this.orFilters.some(({ column, op, value }) =>
                op === 'ilike' ? matchesLike(row[column], value) : String(row[column]) === value);
        }
        return true;
    }

    project(row) {
        if (this.projection === '*' || !this.projection) return { ...row };
        const out = {};
        this.projection.split(',').map((c) => c.trim()).filter(Boolean).forEach((c) => { out[c] = row[c]; });
        return out;
    }

    finish(rows) {
        let data = rows.map((r) => this.project(r));
        if (this.cardinality === 'single') {
            if (data.length !== 1) return { data: null, error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' } };
            return { data: data[0], error: null };
        }
        if (this.cardinality === 'maybe') {
            if (data.length > 1) return { data: null, error: { code: 'PGRST116', message: 'multiple rows returned' } };
            return { data: data[0] || null, error: null };
        }
        return { data, error: null };
    }

    violatesUnique(candidate, ignoreRow) {
        for (const keys of UNIQUE[this.table] || []) {
            const clash = this.db.tables[this.table].find((r) => r !== ignoreRow && keys.every((k) => r[k] !== undefined && r[k] === candidate[k]));
            if (clash) return true;
        }
        return false;
    }

    run() {
        const injected = this.db.takeFailure(this.table, this.action);
        if (injected) return { data: null, error: injected };

        const rows = this.db.tables[this.table];
        if (!rows) return { data: null, error: { code: '42P01', message: `relation "${this.table}" does not exist` } };

        if (this.action === 'select') {
            let result = rows.filter((r) => this.matches(r));
            if (this.orderBy) {
                const { column, ascending } = this.orderBy;
                result = [...result].sort((a, b) => (a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0) * (ascending ? 1 : -1));
            }
            if (this.max !== null) result = result.slice(0, this.max);
            return this.finish(result);
        }

        if (this.action === 'insert' || this.action === 'upsert') {
            const incoming = Array.isArray(this.payload) ? this.payload : [this.payload];
            const stored = [];
            for (const item of incoming) {
                let row = { id: crypto.randomUUID(), created_at: new Date(this.db.tick()).toISOString(), ...(DEFAULTS[this.table] ? DEFAULTS[this.table]() : {}), ...item };
                if (this.action === 'upsert' && this.options.onConflict) {
                    const existing = rows.find((r) => r[this.options.onConflict] === row[this.options.onConflict]);
                    if (existing) { Object.assign(existing, item); stored.push(existing); continue; }
                }
                if (this.violatesUnique(row, null)) {
                    return { data: null, error: { code: '23505', message: `duplicate key value violates unique constraint on ${this.table}` } };
                }
                rows.push(row);
                stored.push(row);
            }
            return this.returning ? this.finish(stored) : { data: null, error: null };
        }

        if (this.action === 'update') {
            const targets = rows.filter((r) => this.matches(r));
            for (const row of targets) {
                const merged = { ...row, ...this.payload };
                if (this.violatesUnique(merged, row)) return { data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } };
            }
            targets.forEach((r) => Object.assign(r, this.payload));
            return this.returning ? this.finish(targets) : { data: null, error: null };
        }

        if (this.action === 'delete') {
            const keep = rows.filter((r) => !this.matches(r));
            const removed = rows.length - keep.length;
            this.db.tables[this.table] = keep;
            return this.returning ? this.finish([]) : { data: null, error: null, removed };
        }
        return { data: null, error: { code: 'XX000', message: 'unsupported action' } };
    }
}

class FakeSupabase {
    constructor({ requireEmailConfirmation = false } = {}) {
        this.requireEmailConfirmation = requireEmailConfirmation;
        this.clock = Date.now();
        this.failures = [];
        this.reset();
        this.auth = this.buildAuth();
        this.storage = { from: () => ({ upload: async () => ({ data: null, error: { message: 'storage not available in tests' } }) }) };
    }

    reset() {
        this.tables = {
            profiles: [], startups: [], startup_members: [], startup_updates: [], investor_interest: [],
            mentor_requests: [], follows: [], saved_startups: [], message_requests: [], conversations: [],
            messages: [], notifications: []
        };
        this.users = new Map();
        this.sessions = new Map();
        this.refreshTokens = new Map();
        this.failures = [];
    }

    tick() { this.clock += 1000; return this.clock; }
    from(table) { return new Query(this, table); }

    failNext(table, action, error = { code: 'XX000', message: 'injected failure' }) {
        this.failures.push({ table, action, error });
    }
    takeFailure(table, action) {
        const i = this.failures.findIndex((f) => f.table === table && f.action === action);
        if (i === -1) return null;
        return this.failures.splice(i, 1)[0].error;
    }

    issueSession(user) {
        const access = `at_${user.id}_${crypto.randomBytes(4).toString('hex')}`;
        const refresh = `rt_${crypto.randomBytes(8).toString('hex')}`;
        this.sessions.set(access, user.id);
        this.refreshTokens.set(refresh, user.id);
        return { access_token: access, refresh_token: refresh };
    }

    publicUser(user) {
        return { id: user.id, email: user.email, user_metadata: user.metadata, identities: [{ id: user.id }] };
    }

    buildAuth() {
        const fake = this;
        return {
            async signUp({ email, password, options }) {
                const existing = [...fake.users.values()].find((u) => u.email === email);
                if (existing) {
                    return { data: { user: { id: crypto.randomUUID(), email, identities: [], user_metadata: {} }, session: null }, error: null };
                }
                const user = { id: crypto.randomUUID(), email, password, metadata: options?.data || {}, confirmed: !fake.requireEmailConfirmation };
                fake.users.set(user.id, user);
                const session = user.confirmed ? fake.issueSession(user) : null;
                return { data: { user: fake.publicUser(user), session }, error: null };
            },
            async signInWithPassword({ email, password }) {
                const user = [...fake.users.values()].find((u) => u.email === email);
                if (!user || user.password !== password) return { data: { user: null, session: null }, error: { message: 'Invalid login credentials', status: 400 } };
                if (!user.confirmed) return { data: { user: null, session: null }, error: { message: 'Email not confirmed', status: 400 } };
                return { data: { user: fake.publicUser(user), session: fake.issueSession(user) }, error: null };
            },
            async refreshSession({ refresh_token }) {
                const id = fake.refreshTokens.get(refresh_token);
                const user = id && fake.users.get(id);
                if (!user) return { data: { user: null, session: null }, error: { message: 'Invalid Refresh Token', status: 400 } };
                fake.refreshTokens.delete(refresh_token);
                return { data: { user: fake.publicUser(user), session: fake.issueSession(user) }, error: null };
            },
            async getUser(token) {
                const id = fake.sessions.get(token);
                const user = id && fake.users.get(id);
                if (!user) return { data: { user: null }, error: { message: 'invalid JWT', status: 401 } };
                return { data: { user: fake.publicUser(user) }, error: null };
            },
            admin: {
                async getUserById(id) {
                    const user = fake.users.get(id);
                    return user ? { data: { user: fake.publicUser(user) }, error: null } : { data: { user: null }, error: { message: 'not found' } };
                },
                async deleteUser(id) { fake.users.delete(id); return { data: null, error: null }; },
                async signOut(token) { fake.sessions.delete(token); return { data: null, error: null }; }
            }
        };
    }
}

module.exports = { FakeSupabase };
