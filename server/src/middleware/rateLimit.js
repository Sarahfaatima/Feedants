const rateLimit = require('express-rate-limit');

// Applied to login/register to slow down credential-stuffing / brute force
// attempts without needing an external store for a single-instance deploy.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' } },
});

// Applied to the register endpoint to blunt scripted spam registrations
// that could otherwise be used to exhaust competition capacity.
const registrationLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many registration attempts. Please slow down.', code: 'RATE_LIMITED' } },
});

module.exports = { authLimiter, registrationLimiter };
