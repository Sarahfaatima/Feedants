const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profession: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "12+ Years of Experience"
    imageUrl: { type: String, default: '' },
  },
  { _id: false }
);

const rewardSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true }, // 1, 2, 3...
    label: { type: String, required: true }, // "1st Winner"
    amount: { type: Number, required: true },
    icon: { type: String, default: 'star' }, // ionicon name used by the client
  },
  { _id: false }
);

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true }, // e.g. "Dance"
    tags: { type: [String], default: [] }, // e.g. ["Multi-Win"]
    winnersGetCertificate: { type: Boolean, default: true },

    description: { type: localizedTextSchema, default: () => ({}) },
    judgingParameters: { type: localizedTextSchema, default: () => ({}) },
    rules: { type: localizedTextSchema, default: () => ({}) },

    prizePool: { type: Number, required: true },
    entryFee: { type: Number, required: true },

    capacity: { type: Number, required: true, min: 1 },
    // bookedCount is the source of truth for "spots used" and is only ever
    // mutated via atomic $inc operations guarded by $expr (see
    // registrationService). It is denormalized from Registration documents
    // purely for fast reads; Registration documents remain the audit trail.
    bookedCount: { type: Number, required: true, default: 0, min: 0 },

    registrationStart: { type: Date, required: true },
    registrationClose: { type: Date, required: true },
    submissionStart: { type: Date, required: true },
    submissionEnd: { type: Date, required: true },
    resultDate: { type: Date, required: true },

    judge: { type: judgeSchema, required: true },

    featuredImage: { type: String, default: '' },
    // Shown behind the judge card's "Intro Video" button.
    introVideoUrl: { type: String, default: '' },
    // Shown behind the "How will you receive prize money?" info card.
    prizeInfoVideoUrl: { type: String, default: '' },

    languages: { type: [String], default: ['en', 'hi'] },

    rewards: { type: [rewardSchema], default: [] },

    allowedSubmissionTypes: {
      type: [String],
      default: ['video', 'image'],
    },
    maxSubmissionSizeBytes: { type: Number, default: 50 * 1024 * 1024 },

    referralUrl: { type: String, default: '' },
    referralRewardText: { type: localizedTextSchema, default: () => ({}) },

    // Admin-controlled flag independent of the time-derived lifecycle state.
    // A competition can be time-eligible for registration but still disabled
    // by an admin (e.g. taken down for moderation).
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

competitionSchema.index({ status: 1 });

module.exports = mongoose.model('Competition', competitionSchema);
