/** Canonical application roles as persisted in `profiles.role`. */
const ROLES = {
    INNOVATOR: 'INNOVATOR',
    MENTOR: 'MENTOR',
    SPONSOR: 'SPONSOR'
};

const LEGACY_ROLE_ALIASES = {
    FOUNDER: ROLES.INNOVATOR,
    INVESTOR: ROLES.SPONSOR
};

/**
 * Normalize any stored / submitted role string (any case, legacy aliases) to a canonical role.
 * Returns null for unknown values: an unknown role grants no privileges and is never guessed.
 */
function normalizeRole(role) {
    if (typeof role !== 'string') return null;
    const upper = role.trim().toUpperCase();
    if (ROLES[upper]) return ROLES[upper];
    return LEGACY_ROLE_ALIASES[upper] || null;
}

// Stage persistence format. VERIFY against the real `startups.stage` values.
function mapStageToDb(clientStage) {
    const stage = String(clientStage || '').trim().toLowerCase();
    if (stage.includes('idea')) return 'idea';
    if (stage.includes('mvp') || stage.includes('seed')) return 'mvp';
    if (stage.includes('scal') || stage.includes('growth')) return 'scaling';
    return null;
}

function mapStageToClient(dbStage) {
    const stage = String(dbStage || '').toLowerCase();
    if (stage === 'idea') return 'Idea';
    if (stage === 'mvp') return 'MVP';
    if (stage === 'scaling') return 'Scale';
    return dbStage || null;
}

const BUCKET_MAPPING = {
    'pitch_decks': 'pitch-decks',
    'pitch-decks': 'pitch-decks',
    'logos': 'startup-logos',
    'startup-logos': 'startup-logos',
    'covers': 'startup-covers',
    'startup-covers': 'startup-covers',
    'avatars': 'avatars',
    'startup-updates': 'startup-updates',
    'startup-documents': 'startup-documents'
};

module.exports = {
    ROLES,
    normalizeRole,
    mapStageToDb,
    mapStageToClient,
    BUCKET_MAPPING
};
