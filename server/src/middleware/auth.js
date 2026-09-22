const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Requires a valid JWT. Populates req.user with the authenticated user
// document (never trust a client-supplied userId anywhere downstream).
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = user;
  next();
});

// Same as requireAuth but does not fail the request when no/invalid token is
// present - it just leaves req.user undefined. Used on public read endpoints
// that still want to know "is this viewer registered?" when logged in.
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme === 'Bearer' && token) {
    try {
      const payload = verifyToken(token);
      const user = await User.findById(payload.sub);
      if (user) req.user = user;
    } catch (err) {
      // ignore invalid token on optional-auth routes
    }
  }

  next();
});

module.exports = { requireAuth, attachUserIfPresent };
