const uploadService = require('./service');

class UploadController {
    async upload(req, res) {
        const rawBucket = req.body.bucket || req.query.bucket || 'pitch-decks';
        const uploadResult = await uploadService.uploadFile(rawBucket, req.file);

        res.status(200).json({
            message: 'File uploaded successfully',
            url: uploadResult.publicUrl,
            path: uploadResult.path
        });
    }
}

module.exports = new UploadController();
