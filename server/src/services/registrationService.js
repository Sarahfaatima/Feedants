const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const ApiError = require('../utils/ApiError');
const { deriveLifecycleStatus, LIFECYCLE } = require('./lifecycleService');

/**
 * Registers a user for a competition in a way that is safe under concurrent
 * requests for the same competition.
 *
 * Two problems have to be solved atomically:
 *  1. Never let bookedCount exceed capacity, even if many requests race.
 *  2. Never let the same user register twice, even if they double-submit.
 *
 * Strategy: run both writes inside a single MongoDB transaction.
 *  - The capacity check + increment is a single findOneAndUpdate using
 *    $expr: bookedCount < capacity as part of the query filter, so the
 *    "read the count, then decide, then write" race is impossible - the
 *    comparison and the increment happen atomically in one document
 *    operation.
 *  - The duplicate-registration check is enforced by a unique compound
 *    index on (competition, user) at the database level, not by an
 *    application-level "check then insert", which would itself race.
 * If the Registration insert fails (duplicate key), the transaction aborts
 * and the bookedCount increment is rolled back automatically - no manual
 * compensation logic needed.
 */
async function registerUserForCompetition(competitionId, userId) {
  const session = await mongoose.startSession();

  try {
    let registration;

    await session.withTransaction(async () => {
      const competition = await Competition.findById(competitionId).session(session);

      if (!competition) {
        throw new ApiError(404, 'Competition not found');
      }
      if (competition.status !== 'active') {
        throw new ApiError(409, 'This competition is not open for registration', 'COMPETITION_INACTIVE');
      }

      const lifecycle = deriveLifecycleStatus(competition);
      if (lifecycle === LIFECYCLE.UPCOMING) {
        throw new ApiError(409, 'Registration has not opened yet', 'REGISTRATION_NOT_STARTED');
      }
      if (lifecycle !== LIFECYCLE.REGISTRATION_OPEN) {
        throw new ApiError(409, 'Registration is closed for this competition', 'REGISTRATION_CLOSED');
      }

      const updatedCompetition = await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          status: 'active',
          $expr: { $lt: ['$bookedCount', '$capacity'] },
        },
        { $inc: { bookedCount: 1 } },
        { new: true, session }
      );

      if (!updatedCompetition) {
        throw new ApiError(409, 'This competition is full', 'COMPETITION_FULL');
      }

      try {
        const created = await Registration.create(
          [{ competition: competitionId, user: userId }],
          { session }
        );
        registration = created[0];
      } catch (err) {
        if (err.code === 11000) {
          throw new ApiError(409, 'You have already registered for this competition', 'ALREADY_REGISTERED');
        }
        throw err;
      }
    });

    return registration;
  } finally {
    await session.endSession();
  }
}

module.exports = { registerUserForCompetition };
