/**
 * User Model Entity (JS Example) 👥
 * Defines the schema based on user and role system requirements.
 */

const UserRole = {
    INNOVATOR: 'Innovator',
    INVESTOR: 'Investor',
    MENTOR: 'Mentor',
    ADMIN: 'Admin'
};

const UserSchema = {
    id: 'uuid',
    email: 'string', // unique
    passwordHash: 'string',
    role: 'string', // enum: Innovator, Investor, Mentor, Admin
    name: 'string',
    avatarUrl: 'string',
    bio: 'string',
    skills: 'array', // array of strings
    verified: 'boolean',
    createdAt: 'datetime',
    updatedAt: 'datetime'
};

module.exports = { UserRole, UserSchema };
