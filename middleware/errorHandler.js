/**
 * Production-grade Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Determine HTTP status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId / CastError
  if (err.name === 'CastError') {
    message = `Resource not found with id ${err.value}`;
    statusCode = 404;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Must be unique.`;
    statusCode = 400;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ [${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
