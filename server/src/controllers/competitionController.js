const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Winner = require('../models/Winner');
const Testimonial = require('../models/Testimonial');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { deriveLifecycleStatus, LIFECYCLE } = require('../services/lifecycleService');
const { registerUserForCompetition } = require('../services/registrationService');

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, 'Competition not found');
  }
}

function serializeCompetition(competition, now = new Date()) {
  const lifecycleStatus = deriveLifecycleStatus(competition, now);
  const remainingSpots = Math.max(competition.capacity - competition.bookedCount, 0);

  return {
    ...competition.toJSON(),
    lifecycleStatus,
    remainingSpots,
    isFull: remainingSpots === 0,
  };
}

const getCompetition = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const competition = await Competition.findById(req.params.id);
  if (!competition) throw new ApiError(404, 'Competition not found');

  const payload = serializeCompetition(competition);

  if (req.user) {
    const registration = await Registration.findOne({
      competition: competition._id,
      user: req.user._id,
      status: 'confirmed',
    });
    payload.viewer = { isAuthenticated: true, isRegistered: Boolean(registration) };
  } else {
    payload.viewer = { isAuthenticated: false, isRegistered: false };
  }

  res.json({ competition: payload });
});

const listCompetitions = asyncHandler(async (req, res) => {
  const competitions = await Competition.find({ status: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
  res.json({ competitions: competitions.map((c) => serializeCompetition(c)) });
});

const getWinners = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const winners = await Winner.find({ competition: req.params.id }).sort({ position: 1 });
  res.json({ winners });
});

const getTestimonials = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const testimonials = await Testimonial.find({ competition: req.params.id }).sort({ createdAt: -1 });
  res.json({ testimonials });
});

const getRewards = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const competition = await Competition.findById(req.params.id).select('rewards');
  if (!competition) throw new ApiError(404, 'Competition not found');
  res.json({ rewards: competition.rewards });
});

const getParticipation = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const competition = await Competition.findById(req.params.id);
  if (!competition) throw new ApiError(404, 'Competition not found');

  const lifecycleStatus = deriveLifecycleStatus(competition);
  const remainingSpots = Math.max(competition.capacity - competition.bookedCount, 0);
  const isFull = remainingSpots === 0;

  let registration = null;
  let submission = null;

  if (req.user) {
    registration = await Registration.findOne({
      competition: competition._id,
      user: req.user._id,
      status: 'confirmed',
    });
    submission = await Submission.findOne({ competition: competition._id, user: req.user._id });
  }

  const isRegistered = Boolean(registration);
  const canRegister =
    Boolean(req.user) &&
    !isRegistered &&
    competition.status === 'active' &&
    lifecycleStatus === LIFECYCLE.REGISTRATION_OPEN &&
    !isFull;

  const canSubmit =
    Boolean(req.user) &&
    isRegistered &&
    !submission &&
    competition.status === 'active' &&
    lifecycleStatus === LIFECYCLE.SUBMISSION_OPEN;

  res.json({
    lifecycleStatus,
    remainingSpots,
    isFull,
    isRegistered,
    registration,
    submission,
    canRegister,
    canSubmit,
  });
});

const registerForCompetition = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);
  const registration = await registerUserForCompetition(req.params.id, req.user._id);
  res.status(201).json({ registration });
});

module.exports = {
  getCompetition,
  listCompetitions,
  getWinners,
  getTestimonials,
  getRewards,
  getParticipation,
  registerForCompetition,
  serializeCompetition,
};
