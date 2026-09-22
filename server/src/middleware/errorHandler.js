const multer = require('multer');
const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: { message: err.message, code: 'UPLOAD_ERROR' },
    });
  }

  if (err.name === 'ValidationError') {
    // Mongoose schema validation error
    return res.status(400).json({
      error: { message: err.message, code: 'VALIDATION_ERROR' },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: { message: 'Duplicate resource', code: 'DUPLICATE' },
    });
  }

  const statusCode = err instanceof ApiError ? err.statusCode : err.statusCode || 500;
  const code = err instanceof ApiError ? err.code : 'INTERNAL_ERROR';
  const message = statusCode === 500 ? 'Something went wrong' : err.message;

  if (statusCode === 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({ error: { message, code } });
}

module.exports = { notFound, errorHandler };
