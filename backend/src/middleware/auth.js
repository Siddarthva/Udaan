const { supabase, getAuthClient } = require('../config/supabase');
const { mapRoleToClient } = require('../utils/constants');
const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    let token = authHeader?.split(' ')[1];

    if (!token && req.cookies) {
        token = req.cookies.accessToken || req.cookies.refreshToken;
    }

    if (!token) {
        return next(new ApiError(401, 'Unauthorized: Access token is missing'));
    }

    try {
        const authClient = getAuthClient();
        const { data: { user }, error } = await authClient.auth.getUser(token);

        if (!error && user) {
            // Ensure profile exists in profiles table
            const authService = require('../modules/auth/service');
            const profile = await authService.ensureUserProfile(user);

            req.user = {
                id: user.id,
                email: user.email,
                username: profile?.username || '',
                role: mapRoleToClient(profile?.role || user.user_metadata?.role),
                name: profile?.full_name || user.user_metadata?.full_name || 'User',
                avatar_url: profile?.avatar_url || profile?.profile_picture || null,
                profile
            };
            return next();
        }
    } catch (e) {
        // Fallthrough to local JWT check
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return next(new ApiError(401, 'Unauthorized: Invalid or expired session'));
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${decoded.id},email.eq.${decoded.email}`)
        .maybeSingle();

    req.user = {
        id: decoded.id || profile?.id,
        email: decoded.email || profile?.email,
        username: profile?.username || '',
        role: mapRoleToClient(profile?.role || decoded.role),
        name: profile?.full_name || profile?.name || 'User',
        avatar_url: profile?.avatar_url || profile?.profile_picture || null,
        profile
    };

    next();
}

function allowedRoles(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Unauthorized: User not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, `Forbidden: Access restricted to roles: [${roles.join(', ')}]`));
        }
        next();
    };
}

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.allowedRoles = allowedRoles;
