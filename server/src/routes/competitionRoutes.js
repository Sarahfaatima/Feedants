const express = require('express');
const { requireAuth, attachUserIfPresent } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { registrationLimiter } = require('../middleware/rateLimit');
const {
  getCompetition,
  listCompetitions,
  getWinners,
  getTestimonials,
  getRewards,
  getParticipation,
  registerForCompetition,
} = require('../controllers/competitionController');
const { createSubmission, getSubmission } = require('../controllers/submissionController');

const router = express.Router();

router.get('/', listCompetitions);
router.get('/:id', attachUserIfPresent, getCompetition);
router.get('/:id/winners', getWinners);
router.get('/:id/testimonials', getTestimonials);
router.get('/:id/rewards', getRewards);

router.get('/:id/participation', requireAuth, getParticipation);
router.post('/:id/register', requireAuth, registrationLimiter, registerForCompetition);

router.post('/:id/submission', requireAuth, upload.single('file'), createSubmission);
router.get('/:id/submission', requireAuth, getSubmission);

module.exports = router;
