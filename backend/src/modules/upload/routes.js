const express = require('express');
const multer = require('multer');
const uploadController = require('./controller');
const authenticate = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/error');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', authenticate, upload.single('file'), asyncHandler((req, res) => uploadController.upload(req, res)));

module.exports = router;
