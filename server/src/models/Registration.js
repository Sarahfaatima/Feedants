const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// One registration per user per competition. This is the hard guarantee that
// prevents duplicate registrations even under concurrent requests - the
// database rejects the second insert with a duplicate key error rather than
// the application having to serialize access itself.
registrationSchema.index({ competition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
