const { supabase } = require('../../config/supabase');
const { BUCKET_MAPPING } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');

class UploadService {
    async uploadFile(rawBucket, file) {
        if (!file) throw new ApiError(400, 'No file provided');

        const bucket = BUCKET_MAPPING[rawBucket] || rawBucket || 'pitch-decks';

        const timestamp = Date.now();
        const cleanName = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(cleanName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (!error && data) {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(cleanName);

                return {
                    path: data.path,
                    publicUrl
                };
            }
        } catch (e) {
            // Fallback URL generation if bucket publicUrl is active
        }

        return {
            path: cleanName,
            publicUrl: `https://vmaeoglebmtdczsgiehe.supabase.co/storage/v1/object/public/${bucket}/${cleanName}`
        };
    }
}

module.exports = new UploadService();
