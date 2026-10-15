const { normalizeRole } = require('../../utils/constants');

const COMPLETION_FIELDS = [
    'full_name', 'username', 'bio', 'college', 'specialization',
    'company', 'designation', 'location', 'skills', 'avatar_url'
];

function parseSkills(skills) {
    if (Array.isArray(skills)) return skills.filter(Boolean);
    if (typeof skills === 'string') return skills.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
}

function isFilled(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return Boolean(value);
}

function calculateProfileCompletion(profile) {
    if (!profile) return 0;
    const filled = COMPLETION_FIELDS.filter((field) => isFilled(profile[field])).length;
    return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

/** Profile as seen by its owner (includes private contact fields and email). */
function formatOwnProfile(profile, email = '') {
    const completion = calculateProfileCompletion(profile);
    return {
        id: profile.id,
        email,
        username: profile.username || '',
        full_name: profile.full_name || '',
        role: normalizeRole(profile.role),
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null,
        college: profile.college || '',
        specialization: profile.specialization || '',
        company: profile.company || '',
        designation: profile.designation || '',
        location: profile.location || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        whatsapp_number: profile.whatsapp_number || '',
        skills: parseSkills(profile.skills),
        created_at: profile.created_at || null,
        profile_completed: Boolean(profile.profile_completed),
        completion_percentage: completion
    };
}

/** Profile as seen by other authenticated users: no email, no phone number. */
function formatPublicProfile(profile) {
    return {
        id: profile.id,
        username: profile.username || '',
        full_name: profile.full_name || '',
        role: normalizeRole(profile.role),
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null,
        college: profile.college || '',
        specialization: profile.specialization || '',
        company: profile.company || '',
        designation: profile.designation || '',
        location: profile.location || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        skills: parseSkills(profile.skills),
        created_at: profile.created_at || null
    };
}

module.exports = {
    calculateProfileCompletion,
    formatOwnProfile,
    formatPublicProfile,
    parseSkills,
    COMPLETION_FIELDS
};
