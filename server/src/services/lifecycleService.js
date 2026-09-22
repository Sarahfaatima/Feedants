// Derives the competition's time-based lifecycle state from server
// timestamps. Never trust a client-supplied or pre-computed status for this -
// it is recalculated on every read from registrationStart/Close,
// submissionStart/End and resultDate.
const LIFECYCLE = {
  UPCOMING: 'upcoming',
  REGISTRATION_OPEN: 'registration_open',
  REGISTRATION_CLOSED: 'registration_closed',
  SUBMISSION_OPEN: 'submission_open',
  SUBMISSION_CLOSED: 'submission_closed',
  RESULTS_PUBLISHED: 'results_published',
};

function deriveLifecycleStatus(competition, now = new Date()) {
  const t = now.getTime();
  const regStart = new Date(competition.registrationStart).getTime();
  const regClose = new Date(competition.registrationClose).getTime();
  const subStart = new Date(competition.submissionStart).getTime();
  const subEnd = new Date(competition.submissionEnd).getTime();
  const resultDate = new Date(competition.resultDate).getTime();

  if (t < regStart) return LIFECYCLE.UPCOMING;
  if (t < regClose) return LIFECYCLE.REGISTRATION_OPEN;
  if (t < subStart) return LIFECYCLE.REGISTRATION_CLOSED;
  if (t < subEnd) return LIFECYCLE.SUBMISSION_OPEN;
  if (t < resultDate) return LIFECYCLE.SUBMISSION_CLOSED;
  return LIFECYCLE.RESULTS_PUBLISHED;
}

function isRegistrationWindowOpen(competition, now = new Date()) {
  return deriveLifecycleStatus(competition, now) === LIFECYCLE.REGISTRATION_OPEN;
}

function isSubmissionWindowOpen(competition, now = new Date()) {
  return deriveLifecycleStatus(competition, now) === LIFECYCLE.SUBMISSION_OPEN;
}

module.exports = {
  LIFECYCLE,
  deriveLifecycleStatus,
  isRegistrationWindowOpen,
  isSubmissionWindowOpen,
};
