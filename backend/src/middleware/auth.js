const { getAdminClient } = require('../config/supabase');
const { TABLES } = require('../config/schema');
const { normalizeRole } = require('../utils/constants');
const { toApiError, isAuthServiceFailure } = require('../utils/db');
const ApiError = require('../utils/ApiError');

/**
 * Verifies the Supabase access token sent as `Authorization: Bearer <token>` and attaches
 * `req.authUser` (the Supabase auth user) and `req.user` (identity + role from public.profiles).
 * There is deliberately no local-token fallback: only Supabase-issued sessions are accepted.
 */
async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new ApiError(401, 'Unauthorized: access token is missing');
        }

        const db = getAdminClient();
        const { data, error } = await db.auth.getUser(token);
        if (error || !data?.user) {
            if (isAuthServiceFailure(error) && error.status !== 401) throw new ApiError(502, 'Authentication service unavailable');
            throw new ApiError(401, 'Unauthorized: invalid or expired session');
        }

        const result = await db.from(TABLES.profiles).select('id, username, full_name, role, avatar_url').eq('id', data.user.id).maybeSingle();
        if (result.error) throw toApiError(result.error, 'Load profile');
        const profile = result.data;

        req.accessToken = token;
        req.authUser = data.user;
        req.user = {
            id: data.user.id,
            email: data.user.email,
            username: profile?.username || '',
            name: profile?.full_name || '',
            role: normalizeRole(profile?.role),
            avatar_url: profile?.avatar_url || null,
            hasProfile: Boolean(profile)
        };
        next();
    } catch (err) {
        next(err);
    }
}

/** Authorization gate: the authenticated user's profile role must be one of `roles` (canonical names). */
function allowedRoles(roles) {
    return (req, res, next) => {
        if (!req.user) return next(new ApiError(401, 'Unauthorized: user not authenticated'));
        if (!req.user.role || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `Forbidden: restricted to ${roles.join(' / ')}`));
        }
        next();
    };
}

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.allowedRoles = allowedRoles;
