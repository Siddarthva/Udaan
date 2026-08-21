const ROLES = {
    INNOVATOR: 'innovator',
    MENTOR: 'mentor',
    SPONSOR: 'sponsor'
};

const ROLE_MAP_CLIENT = {
    'innovator': 'innovator',
    'mentor': 'mentor',
    'sponsor': 'sponsor',
    'founder': 'innovator',
    'investor': 'sponsor',
    'admin': 'innovator'
};

const ROLE_MAP_DB = {
    'innovator': 'innovator',
    'mentor': 'mentor',
    'sponsor': 'sponsor',
    'founder': 'innovator',
    'investor': 'sponsor',
    'admin': 'innovator'
};

function mapRoleToClient(role) {
    if (!role) return ROLES.INNOVATOR;
    return ROLE_MAP_CLIENT[role.toLowerCase()] || role.toLowerCase() || ROLES.INNOVATOR;
}

function mapRoleToDb(role) {
    if (!role) return ROLES.INNOVATOR;
    return ROLE_MAP_DB[role.toLowerCase()] || role.toLowerCase() || ROLES.INNOVATOR;
}

function mapStageToDb(clientStage) {
    const stage = String(clientStage || '').toLowerCase();
    if (stage.includes('idea')) return 'idea';
    if (stage.includes('mvp')) return 'mvp';
    if (stage.includes('seed')) return 'mvp';
    if (stage.includes('scale') || stage.includes('scaling')) return 'scaling';
    return 'idea';
}

function mapStageToClient(dbStage) {
    const stage = String(dbStage || '').toLowerCase();
    if (stage === 'idea') return 'Idea';
    if (stage === 'mvp') return 'MVP';
    if (stage === 'scaling') return 'Scale';
    return dbStage || 'Idea';
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
    mapRoleToClient,
    mapRoleToDb,
    mapStageToDb,
    mapStageToClient,
    BUCKET_MAPPING
};
