const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error({ err, path: req.path }, 'Unhandled error');

  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: code,
    message: err.message || 'Internal server error'
  });
};
