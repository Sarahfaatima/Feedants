const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after an array of express-validator checks and turns the first
// failure into a consistent ApiError instead of leaking express-validator's
// shape to the client.
module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const first = result.array({ onlyFirstError: true })[0];
  next(new ApiError(422, first.msg, 'VALIDATION_ERROR'));
};
