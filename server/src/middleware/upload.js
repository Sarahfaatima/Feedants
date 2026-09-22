const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
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
  // multer.MulterError's 2nd constructor arg is a field name, not a custom
  // message (its message is always looked up from the error code), so an
  // unsupported type is surfaced as a plain ApiError instead to keep a
  // useful message reaching the client.
  if (!ALLOWED_MIME_TO_TYPE[file.mimetype]) {
    cb(new ApiError(400, 'Unsupported file type. Upload a video (mp4/mov/mkv) or image (jpg/png/webp).', 'UNSUPPORTED_FILE_TYPE'));
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
