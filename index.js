/**
 * Generates a standardized success response
 *
 * @param {Object} data - The payload or result data to send back
 * @param {string} message - A custom success message (default: "Success")
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Standardized success response object
 */
function success(data = {}, message = "Success", statusCode = 200) {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

/**
 * Generates a standardized error response
 *
 * @param {string} message - A custom error message (default: "Something went wrong")
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array} errors - An optional array of specific error details (default: [])
 * @returns {Object} Standardized error response object
 */
function error(
  message = "Something went wrong",
  statusCode = 500,
  errors = []
) {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
}

/**
 * Generates a validation error response (HTTP 422)
 *
 * @param {Array} errors - An array of validation error objects (e.g., field-level errors)
 * @param {string} message - Optional custom message (default: "Validation failed")
 * @returns {Object} Validation error response object
 */
function validationError(errors = [], message = "Validation failed") {
  return error(message, 422, errors);
}

/**
 * Generates a route-not-found response (HTTP 404)
 *
 * @param {string} path - The requested route path (used in the error message)
 * @returns {Object} Route not found error response object
 */
function routeNotFound(path = "") {
  return {
    success: false,
    message: `Route${path ? ` "${path}"` : ""} not found`,
    statusCode: 404,
  };
}

/**
 * Generates a generic not found error (HTTP 404)
 *
 * @param {string} message - Custom message (default: "Resource not found")
 * @returns {Object} Not found error response object
 */
function notFound(message = "Resource not found") {
  return error(message, 404);
}

/**
 * Generates an unauthorized access error (HTTP 401)
 *
 * @param {string} message - Custom message (default: "Unauthorized access")
 * @returns {Object} Unauthorized error response object
 */
function unauthorized(message = "Unauthorized access") {
  return error(message, 401);
}

/**
 * Generates a forbidden access error (HTTP 403)
 *
 * @param {string} message - Custom message (default: "Forbidden")
 * @returns {Object} Forbidden error response object
 */
function forbidden(message = "Forbidden") {
  return error(message, 403);
}

/**
 * Generates a conflict error (HTTP 409)
 *
 * @param {string} message - Custom message (default: "Conflict detected")
 * @returns {Object} Conflict error response object
 */
function conflict(message = "Conflict detected") {
  return error(message, 409);
}

/**
 * Generates a too many requests error (HTTP 429)
 *
 * @param {string} message - Custom message (default: "Too many requests")
 * @returns {Object} Too many requests error response object
 */
function tooManyRequests(message = "Too many requests") {
  return error(message, 429);
}

/**
 * Generates an internal server error (HTTP 500)
 *
 * @param {string} message - Custom message (default: "Internal server error")
 * @returns {Object} Internal server error response object
 */
function internalServerError(message = "Internal server error") {
  return error(message, 500);
}

// Export all utility functions
module.exports = {
  success,
  error,
  validationError,
  routeNotFound,
  notFound,
  unauthorized,
  forbidden,
  conflict,
  tooManyRequests,
  internalServerError,
};
