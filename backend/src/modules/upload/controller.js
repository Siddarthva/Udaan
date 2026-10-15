const uploadService = require('./service');

class UploadController {
    async upload(req, res) {
        const rawBucket = req.body.bucket || req.query.bucket;
        const result = await uploadService.uploadFile(req.user.id, rawBucket, req.file);
        res.status(200).json({ message: 'File uploaded successfully', url: result.publicUrl, path: result.path });
    }
}

module.exports = new UploadController();
