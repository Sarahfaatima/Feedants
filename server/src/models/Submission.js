const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    mediaType: { type: String, enum: ['video', 'image'], required: true },
  },
  { timestamps: true }
);

// One submission per user per competition (v1: resubmission is not
// supported - see README "future improvements").
submissionSchema.index({ competition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
