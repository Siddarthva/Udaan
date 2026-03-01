/**
 * Projects Module Entity 🏗️
 * Reprsents the startups/innovations being built on Udaan.
 */

const ProjectSchema = {
    id: 'uuid',
    ownerId: 'uuid', // Foreign key to users
    title: 'string',
    description: 'string',
    domain: 'string', // AgriTech, HealthTech, etc.
    stage: 'string', // Idea, MVP, Seed, Scale
    fundingRequired: 'decimal',
    raised: 'decimal',
    teamMembers: 'array', // array of userIds
    mediaUrls: 'array', // array of strings
    createdAt: 'datetime',
    updatedAt: 'datetime'
};

module.exports = { ProjectSchema };
