const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    name: { type: String, required: true },
    position: { type: Number, required: true }, // 1, 2, 3...
    positionLabel: { type: String, required: true }, // "1st Winner"
    imageUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

winnerSchema.index({ competition: 1, position: 1 });

module.exports = mongoose.model('Winner', winnerSchema);
