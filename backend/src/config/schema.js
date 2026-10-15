/**
 * Database contract for UDAAN (Supabase / PostgreSQL).
 *
 * Every table and column name the backend relies on lives here so that verifying or correcting the
 * contract against the real database is a change to this single file. Entries marked VERIFY come
 * from the project's schema notes but have NOT been confirmed by introspecting the live database.
 */
const TABLES = {
    profiles: 'profiles',
    startups: 'startups',
    startupMembers: 'startup_members',
    startupUpdates: 'startup_updates',
    investorInterest: 'investor_interest',
    mentorRequests: 'mentor_requests',
    follows: 'follows',
    savedStartups: 'saved_startups',
    messageRequests: 'message_requests',
    conversations: 'conversations',
    messages: 'messages',
    notifications: 'notifications'
};

const COLUMNS = {
    profiles: [
        'id', 'username', 'full_name', 'role', 'bio', 'avatar_url', 'college', 'specialization',
        'company', 'designation', 'location', 'skills', 'github_url', 'linkedin_url',
        'portfolio_url', 'whatsapp_number', 'profile_completed', 'created_at'
    ], // VERIFY (email is read from auth.users, not profiles)
    startups: [
        'id', 'founder_id', 'title', 'description', 'domain', 'stage', 'funding_required',
        'funding_received', 'team_size', 'pitch_deck_url', 'logo_url', 'status', 'created_at'
    ], // VERIFY nullability; stage / status enumerations
    startupMembers: ['id', 'startup_id', 'user_id', 'role'], // VERIFY
    startupUpdates: ['id', 'startup_id', 'author_id', 'content', 'created_at'], // VERIFY
    investorInterest: ['id', 'startup_id', 'investor_id', 'message', 'status', 'created_at'], // VERIFY
    mentorRequests: ['id', 'startup_id', 'mentor_id', 'message', 'status', 'created_at'], // VERIFY
    follows: ['id', 'follower_id', 'following_id', 'created_at'], // VERIFY direction / names
    savedStartups: ['id', 'user_id', 'startup_id', 'created_at'], // VERIFY
    messageRequests: [
        'id', 'sender_id', 'receiver_id', 'request_type', 'status', 'startup_id', 'initial_message', 'created_at'
    ], // VERIFY startup_id / initial_message
    conversations: ['id', 'founder_id', 'participant_id', 'startup_id', 'created_at'],
    messages: ['id', 'conversation_id', 'sender_id', 'message', 'is_read', 'created_at'],
    notifications: ['id', 'user_id', 'actor_id', 'type', 'message', 'is_read', 'created_at'] // VERIFY is_read vs read
};

/** Comma separated column list for `.select()`. Never use `select('*')`. */
function cols(table, extra = []) {
    return [...COLUMNS[table], ...extra].join(', ');
}

/** Status values persisted in request-like tables. */
const STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
};

module.exports = { TABLES, COLUMNS, STATUS, cols };
