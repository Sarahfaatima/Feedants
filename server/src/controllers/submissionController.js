const fs = require('fs/promises');
const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { deriveLifecycleStatus, LIFECYCLE } = require('../services/lifecycleService');
const { ALLOWED_MIME_TO_TYPE } = require('../middleware/upload');

async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // best-effort cleanup only
  }
}

const createSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    if (req.file) await safeUnlink(req.file.path);
    throw new ApiError(404, 'Competition not found');
  }

  const competition = await Competition.findById(id);
  if (!competition) {
    if (req.file) await safeUnlink(req.file.path);
    throw new ApiError(404, 'Competition not found');
  }

  if (!req.file) {
    throw new ApiError(400, 'A file is required', 'FILE_REQUIRED');
  }

  try {
    const registration = await Registration.findOne({
      competition: id,
      user: req.user._id,
      status: 'confirmed',
    });
    if (!registration) {
      throw new ApiError(403, 'You must be registered for this competition to submit an entry', 'NOT_REGISTERED');
    }

    const lifecycleStatus = deriveLifecycleStatus(competition);
    if (lifecycleStatus !== LIFECYCLE.SUBMISSION_OPEN) {
      throw new ApiError(409, 'The submission window is not currently open', 'SUBMISSION_WINDOW_CLOSED');
    }

    const existing = await Submission.findOne({ competition: id, user: req.user._id });
    if (existing) {
      throw new ApiError(409, 'You have already submitted an entry for this competition', 'ALREADY_SUBMITTED');
    }

    const submission = await Submission.create({
      competition: id,
      user: req.user._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      mediaType: ALLOWED_MIME_TO_TYPE[req.file.mimetype],
    });

    res.status(201).json({ submission });
  } catch (err) {
    await safeUnlink(req.file.path);
    if (err.code === 11000) {
      throw new ApiError(409, 'You have already submitted an entry for this competition', 'ALREADY_SUBMITTED');
    }
    throw err;
  }
});

const getSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, 'Competition not found');
  }

  const submission = await Submission.findOne({ competition: id, user: req.user._id });
  res.json({ submission });
});

module.exports = { createSubmission, getSubmission };
