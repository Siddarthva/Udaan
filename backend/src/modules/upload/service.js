const { getAdminClient } = require('../../config/supabase');
const { BUCKET_MAPPING } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');

const ALLOWED_MIME = new Set([
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/webp'
]);

class UploadService {
    async uploadFile(userId, rawBucket, file) {
        if (!file) throw new ApiError(400, 'No file provided');
        const bucket = BUCKET_MAPPING[rawBucket || 'pitch-decks'];
        if (!bucket) throw new ApiError(400, 'Unknown upload bucket');
        if (!ALLOWED_MIME.has(file.mimetype)) throw new ApiError(400, `File type ${file.mimetype} is not allowed`);

        // Namespaced by user id so one user cannot overwrite another's files.
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').slice(-80);
        const objectPath = `${userId}/${Date.now()}_${safeName}`;

        const db = getAdminClient();
        const { data, error } = await db.storage.from(bucket).upload(objectPath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (error) {
            console.error(`[UPLOAD] ${bucket}/${objectPath} failed: ${error.message}`);
            throw new ApiError(502, 'File upload failed');
        }

        const { data: { publicUrl } } = db.storage.from(bucket).getPublicUrl(data.path);
        return { path: data.path, publicUrl };
    }
}

module.exports = new UploadService();
