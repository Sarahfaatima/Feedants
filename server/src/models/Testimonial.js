const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    userName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ competition: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
