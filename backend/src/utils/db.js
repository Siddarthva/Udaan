const ApiError = require('./ApiError');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
    return typeof value === 'string' && UUID_REGEX.test(value);
}

function assertUuid(value, label = 'id') {
    if (!isUuid(value)) throw new ApiError(400, `Invalid ${label}: must be a valid UUID`);
    return value;
}

/**
 * Convert a Supabase / PostgREST error into an ApiError with a truthful status code.
 * Schema problems (missing table/column) surface as 500 so they are never mistaken for empty data.
 */
function toApiError(error, action) {
    const code = error.code || '';
    if (code === '23505') return new ApiError(409, `${action}: a record with these values already exists`);
    if (code === '23503') return new ApiError(409, `${action}: referenced record does not exist`);
    if (code === '23502' || code === '23514') return new ApiError(400, `${action}: ${error.message}`);
    if (code === '22P02') return new ApiError(400, `${action}: malformed value supplied`);
    if (code === 'PGRST116') return new ApiError(404, `${action}: record not found`);
    if (code === '42501') return new ApiError(500, `${action}: database permission denied (check service-role configuration)`);
    if (code === '42703' || code === '42P01' || code === 'PGRST204' || code === 'PGRST200' || code === 'PGRST205') {
        console.error(`[DB SCHEMA MISMATCH] ${action}: ${error.message} (code ${code}) - verify backend/src/config/schema.js against the database`);
        return new ApiError(500, `${action}: database schema mismatch`);
    }
    console.error(`[DB ERROR] ${action}: ${error.message} (code ${code})`);
    return new ApiError(500, `${action} failed`);
}

/** Unwrap a `{ data, error }` result, throwing on error. Returns `data` (may be null / []). */
function unwrap(result, action) {
    if (result.error) throw toApiError(result.error, action);
    return result.data;
}

/** Like unwrap but 404s when no row came back (for maybeSingle / single lookups). */
function unwrapOrNotFound(result, action, notFoundMessage) {
    const data = unwrap(result, action);
    if (!data) throw new ApiError(404, notFoundMessage || `${action}: record not found`);
    return data;
}

/** True when a Supabase Auth error means the service itself failed (network error has no HTTP status; 5xx). */
function isAuthServiceFailure(error) {
    return Boolean(error) && (!error.status || error.status >= 500);
}

module.exports = { isAuthServiceFailure, isUuid, assertUuid, toApiError, unwrap, unwrapOrNotFound, UUID_REGEX };
