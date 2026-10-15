const { getAdminClient } = require('../../config/supabase');
const { TABLES, cols } = require('../../config/schema');
const { unwrap } = require('../../utils/db');
const { formatPublicProfile } = require('../auth/profile');

/** Loads public profiles for a set of user ids; returns a Map(id -> public profile). */
async function loadPublicProfiles(ids) {
    const unique = [...new Set((ids || []).filter(Boolean))];
    const map = new Map();
    if (unique.length === 0) return map;

    const rows = unwrap(
        await getAdminClient().from(TABLES.profiles).select(cols('profiles')).in('id', unique),
        'Load profiles'
    );
    (rows || []).forEach((row) => map.set(row.id, formatPublicProfile(row)));
    return map;
}

async function profileExists(userId) {
    const rows = unwrap(
        await getAdminClient().from(TABLES.profiles).select('id').eq('id', userId).limit(1),
        'Check user'
    );
    return Boolean(rows && rows.length > 0);
}

module.exports = { loadPublicProfiles, profileExists };
