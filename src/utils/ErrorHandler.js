import ApiError from "./ApiError.js";

/**
 * Wraps async route handlers to automatically catch errors
 * @param {Function} fn - The async route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // If error is already our ApiError, pass it through
      if (error instanceof ApiError) {
        return next(error);
      }
      // Otherwise, wrap it in our ApiError
      return next(new ApiError(error.message, error.status || 500));
    });
  };
};

/**
 * Global error handling middleware
 * @param {Error} error - Express error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Log error for server-side visibility
  console.error(`[Error] ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error(error.stack);
  }

  return res.status(statusCode).json({
    status:
      error.status ||
      (statusCode >= 400 && statusCode < 500 ? "fail" : "error"),
    message: message,
    // Only include stack trace in development environment
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
