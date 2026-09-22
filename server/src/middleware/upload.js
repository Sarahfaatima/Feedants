const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { maxUploadBytes } = require('../config/env');

const ALLOWED_MIME_TO_TYPE = {
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/x-matroska': 'video',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TO_TYPE[file.mimetype]) {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type. Upload a video (mp4/mov/mkv) or image (jpg/png/webp).'));
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxUploadBytes },
});

module.exports = { upload, ALLOWED_MIME_TO_TYPE };
