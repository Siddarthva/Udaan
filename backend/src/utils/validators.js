const { z } = require('zod');
const ApiError = require('./ApiError');
const { ROLES, normalizeRole } = require('./constants');

const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

const roleField = z.string()
    .refine((r) => normalizeRole(r) !== null, { message: 'Role must be INNOVATOR, MENTOR or SPONSOR' })
    .transform((r) => normalizeRole(r));

const usernameField = z.string().trim().toLowerCase()
    .regex(USERNAME_REGEX, 'Username must be 3-30 characters: lowercase letters, numbers, "_" or "-"');

const optionalText = (max) => z.string().trim().max(max).optional();
const optionalUrl = z.string().trim().max(500).refine(
    (v) => v === '' || /^https?:\/\/\S+$/i.test(v),
    { message: 'Must be a valid http(s) URL' }
).optional();

const schemas = {
    register: z.object({
        email: z.string().trim().toLowerCase().email('A valid email is required'),
        password: z.string().min(8, 'Password must be at least 8 characters').max(128),
        full_name: z.string().trim().min(1, 'Full name is required').max(120),
        username: usernameField,
        role: roleField.default(ROLES.INNOVATOR)
    }),
    login: z.object({
        loginInput: z.string().trim().min(1, 'Email or username is required'),
        password: z.string().min(1, 'Password is required')
    }),
    profileUpdate: z.object({
        full_name: z.string().trim().min(1).max(120).optional(),
        username: usernameField.optional(),
        role: roleField.optional(),
        bio: optionalText(1000),
        avatar_url: optionalUrl,
        college: optionalText(200),
        specialization: optionalText(200),
        company: optionalText(200),
        designation: optionalText(200),
        location: optionalText(200),
        github_url: optionalUrl,
        linkedin_url: optionalUrl,
        portfolio_url: optionalUrl,
        whatsapp_number: z.string().trim().max(30).regex(/^[0-9+()\-\s]*$/, 'Invalid phone number').optional(),
        skills: z.union([z.array(z.string().trim().min(1).max(60)).max(50), z.string().max(1000)]).optional()
    }).strict(),
    startupCreate: z.object({
        title: z.string().trim().min(1, 'Title is required').max(150),
        description: z.string().trim().max(5000).optional(),
        domain: z.string().trim().min(1, 'Domain is required').max(100),
        stage: z.string().trim().min(1, 'Stage is required'),
        funding_required: z.coerce.number().nonnegative().finite().optional(),
        team_size: z.coerce.number().int().positive().max(10000).optional(),
        pitch_deck_url: optionalUrl,
        logo_url: optionalUrl
    }),
    startupUpdate: z.object({
        title: z.string().trim().min(1).max(150).optional(),
        description: z.string().trim().max(5000).optional(),
        domain: z.string().trim().min(1).max(100).optional(),
        stage: z.string().trim().min(1).optional(),
        funding_required: z.coerce.number().nonnegative().finite().optional(),
        team_size: z.coerce.number().int().positive().max(10000).optional(),
        pitch_deck_url: optionalUrl,
        logo_url: optionalUrl
    }),
    message: z.object({
        conversation_id: z.string().uuid().optional(),
        receiver_id: z.string().uuid().optional(),
        message: z.string().trim().min(1, 'Message cannot be empty').max(5000)
    }).refine((v) => v.conversation_id || v.receiver_id, { message: 'conversation_id or receiver_id is required' }),
    messageRequest: z.object({
        receiver_id: z.string().uuid('receiver_id must be a UUID'),
        request_type: z.string().trim().min(1).max(40),
        startup_id: z.string().uuid().nullish(),
        initial_message: z.string().trim().max(2000).optional()
    })
};

/** Express middleware factory: validates req.body against a zod schema and replaces it with the parsed data. */
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body ?? {});
        if (!result.success) {
            const errors = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
            const first = errors[0];
            return next(new ApiError(400, first ? `${first.field ? first.field + ': ' : ''}${first.message}` : 'Invalid request', errors));
        }
        req.body = result.data;
        next();
    };
}

module.exports = { schemas, validateBody, USERNAME_REGEX };
