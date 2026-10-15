const { getAdminClient, getAuthClient } = require('../../config/supabase');
const { TABLES, cols } = require('../../config/schema');
const { ROLES, normalizeRole } = require('../../utils/constants');
const { unwrap, toApiError, isAuthServiceFailure } = require('../../utils/db');
const ApiError = require('../../utils/ApiError');
const { USERNAME_REGEX } = require('../../utils/validators');
const { formatOwnProfile, calculateProfileCompletion } = require('./profile');

const PROFILE_COLUMNS = cols('profiles');
const INVALID_CREDENTIALS = 'Invalid login credentials';

class AuthService {
    get db() {
        return getAdminClient();
    }

    normalizeUsername(raw) {
        return String(raw || '').trim().toLowerCase();
    }

    async isUsernameAvailable(username, excludeUserId = null) {
        const normalized = this.normalizeUsername(username);
        if (!USERNAME_REGEX.test(normalized)) return false;

        let query = this.db.from(TABLES.profiles).select('id').eq('username', normalized);
        if (excludeUserId) query = query.neq('id', excludeUserId);
        const rows = unwrap(await query.limit(1), 'Check username');
        return !rows || rows.length === 0;
    }

    async findProfileById(userId) {
        const result = await this.db.from(TABLES.profiles).select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();
        return unwrap(result, 'Load profile');
    }

    /**
     * Returns the profile for an authenticated Supabase user, creating it from the user's own auth
     * metadata when it is missing (idempotent: upsert on the primary key, never a second row).
     */
    async ensureProfile(authUser) {
        const existing = await this.findProfileById(authUser.id);
        if (existing) return existing;

        const meta = authUser.user_metadata || {};
        const emailLocal = String(authUser.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';

        let username = this.normalizeUsername(meta.username);
        if (!USERNAME_REGEX.test(username)) {
            username = `${emailLocal.slice(0, 20)}_${authUser.id.slice(0, 6)}`;
        }
        if (!(await this.isUsernameAvailable(username))) {
            username = `${emailLocal.slice(0, 16)}_${authUser.id.replace(/-/g, '').slice(0, 10)}`;
        }

        const row = {
            id: authUser.id,
            username,
            full_name: meta.full_name || emailLocal,
            role: normalizeRole(meta.role) || ROLES.INNOVATOR,
            profile_completed: false
        };
        const created = await this.db.from(TABLES.profiles).upsert(row, { onConflict: 'id' }).select(PROFILE_COLUMNS).single();
        return unwrap(created, 'Create profile');
    }

    async registerUser({ email, password, full_name, username, role }) {
        if (!(await this.isUsernameAvailable(username))) {
            throw new ApiError(409, 'Username already taken');
        }

        const { data, error } = await getAuthClient().auth.signUp({
            email,
            password,
            options: { data: { full_name, username, role } }
        });

        if (error) {
            const msg = (error.message || '').toLowerCase();
            if (msg.includes('already') && msg.includes('registered')) throw new ApiError(409, 'An account with this email already exists');
            if (isAuthServiceFailure(error)) throw new ApiError(502, 'Authentication service unavailable');
            if (error.status === 429) throw new ApiError(429, 'Too many signup attempts, please try again later');
            throw new ApiError(400, error.message);
        }

        const authUser = data.user;
        // Supabase returns an obfuscated user with no identities when the email is already registered.
        if (!authUser || (Array.isArray(authUser.identities) && authUser.identities.length === 0)) {
            throw new ApiError(409, 'An account with this email already exists');
        }

        let profile;
        try {
            profile = await this.ensureProfile({ ...authUser, user_metadata: { ...authUser.user_metadata, full_name, username, role } });
            // A signup trigger may have created the row already; make sure the submitted identity is what's stored.
            if (profile.username !== username || normalizeRole(profile.role) !== role || profile.full_name !== full_name) {
                const fixed = await this.db.from(TABLES.profiles)
                    .update({ username, role, full_name })
                    .eq('id', authUser.id).select(PROFILE_COLUMNS).single();
                profile = unwrap(fixed, 'Finalize profile');
            }
        } catch (profileError) {
            // Partial failure: the auth user exists but has no usable profile. Remove it so the person can retry.
            console.error(`[AUTH] Profile creation failed for new user ${authUser.id}: ${profileError.message}`);
            const { error: rollbackError } = await this.db.auth.admin.deleteUser(authUser.id);
            if (rollbackError) {
                console.error(`[AUTH] Rollback of auth user ${authUser.id} failed: ${rollbackError.message}`);
            }
            if (profileError instanceof ApiError && profileError.statusCode === 409) throw profileError;
            throw new ApiError(500, 'Registration could not be completed. Please try again.');
        }

        const session = data.session;
        return {
            user: formatOwnProfile(profile, authUser.email),
            accessToken: session?.access_token || null,
            refreshToken: session?.refresh_token || null,
            requiresEmailConfirmation: !session
        };
    }

    /** Resolves a username to its auth email using the privileged client; never exposed to callers. */
    async resolveEmailForUsername(username) {
        const rows = unwrap(
            await this.db.from(TABLES.profiles).select('id').eq('username', this.normalizeUsername(username)).limit(1),
            'Resolve username'
        );
        if (!rows || rows.length === 0) return null;
        const { data, error } = await this.db.auth.admin.getUserById(rows[0].id);
        if (error || !data?.user?.email) return null;
        return data.user.email;
    }

    async validateUser(loginInput, password) {
        const identifier = loginInput.trim();
        const email = identifier.includes('@') ? identifier.toLowerCase() : await this.resolveEmailForUsername(identifier);

        // Same response for unknown username and wrong password: no account enumeration.
        if (!email) throw new ApiError(401, INVALID_CREDENTIALS);

        const { data, error } = await getAuthClient().auth.signInWithPassword({ email, password });
        if (error || !data?.user || !data?.session) {
            const msg = (error?.message || '').toLowerCase();
            if (isAuthServiceFailure(error)) throw new ApiError(502, 'Authentication service unavailable');
            if (msg.includes('email not confirmed')) throw new ApiError(403, 'Please confirm your email address before signing in');
            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        const profile = await this.ensureProfile(data.user);
        return {
            user: formatOwnProfile(profile, data.user.email),
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token
        };
    }

    async refreshAccessToken(refreshToken) {
        if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

        const { data, error } = await getAuthClient().auth.refreshSession({ refresh_token: refreshToken });
        if (error || !data?.session || !data?.user) {
            if (isAuthServiceFailure(error)) throw new ApiError(502, 'Authentication service unavailable');
            throw new ApiError(401, 'Session expired, please sign in again');
        }

        const profile = await this.ensureProfile(data.user);
        return {
            user: formatOwnProfile(profile, data.user.email),
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token
        };
    }

    async revokeSession(accessToken) {
        if (!accessToken) return;
        const { error } = await this.db.auth.admin.signOut(accessToken);
        if (error) console.warn(`[AUTH] Session revoke failed: ${error.message}`);
    }

    async getProfile(authUser) {
        const profile = await this.ensureProfile(authUser);
        return formatOwnProfile(profile, authUser.email);
    }

    async updateProfile(authUser, updates) {
        const changes = { ...updates };

        if (changes.username !== undefined) {
            if (!(await this.isUsernameAvailable(changes.username, authUser.id))) {
                throw new ApiError(409, 'Username already taken');
            }
        }

        if (Object.keys(changes).length === 0) {
            throw new ApiError(400, 'No profile fields supplied');
        }

        // Persist completion based on the resulting profile, not on client-supplied flags.
        const current = await this.ensureProfile(authUser);
        changes.profile_completed = calculateProfileCompletion({ ...current, ...changes }) >= 80;

        const result = await this.db.from(TABLES.profiles).update(changes).eq('id', authUser.id).select(PROFILE_COLUMNS).single();
        if (result.error) throw toApiError(result.error, 'Update profile');
        return formatOwnProfile(result.data, authUser.email);
    }
}

module.exports = new AuthService();
