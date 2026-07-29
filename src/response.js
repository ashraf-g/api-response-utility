const { isResponseLike, buildSuccessPayload, buildErrorPayload } = require("./core");

/**
 * Standardized success response builder.
 *
 * Supports two calling styles:
 *
 * 1. Legacy / pure mode - returns the payload object, unchanged since v1:
 *    `success(data, message, statusCode)`
 *
 * 2. Express "send" mode - detected automatically when the first argument
 *    looks like a response object (`res.status`/`res.json`), and sends the
 *    response for you:
 *    `success(res, statusCode, message, data)`
 *
 * @param {*} arg1 - `data` (legacy) or an Express `res` object.
 * @param {*} [arg2] - `message` (legacy) or `statusCode` (res mode).
 * @param {*} [arg3] - `statusCode` (legacy) or `message` (res mode).
 * @param {*} [arg4] - unused (legacy) or `data` (res mode).
 * @returns {Object|*} the response payload, or the `res` object when in send mode.
 */
function success(arg1, arg2, arg3, arg4) {
  if (isResponseLike(arg1)) {
    const res = arg1;
    const statusCode = typeof arg2 === "number" ? arg2 : 200;
    const message = typeof arg3 === "string" ? arg3 : "Request successful";
    const data = arg4 !== undefined ? arg4 : {};
    return res.status(statusCode).json(buildSuccessPayload(data, message, statusCode));
  }

  const data = arg1 !== undefined ? arg1 : {};
  const message = typeof arg2 === "string" ? arg2 : "Success";
  const statusCode = typeof arg3 === "number" ? arg3 : 200;
  return buildSuccessPayload(data, message, statusCode);
}

/**
 * Standardized error response builder.
 *
 * Supports two calling styles:
 *
 * 1. Legacy / pure mode - returns the payload object, unchanged since v1:
 *    `error(message, statusCode, errors)`
 *
 * 2. Express "send" mode - detected automatically when the first argument
 *    looks like a response object, and sends the response for you:
 *    `error(res, statusCode, message, errors)`
 *
 * In both modes, a 5th argument (`originalError`, an `Error` instance) may
 * be supplied to attach a `stack` field, but only while
 * `process.env.NODE_ENV === "development"`.
 *
 * @param {*} arg1 - `message` (legacy) or an Express `res` object.
 * @param {*} [arg2] - `statusCode` (legacy) or `statusCode` (res mode).
 * @param {*} [arg3] - `errors` (legacy) or `message` (res mode).
 * @param {*} [arg4] - `originalError` (legacy) or `errors` (res mode).
 * @param {Error} [arg5] - `originalError` (res mode only).
 * @returns {Object|*} the response payload, or the `res` object when in send mode.
 */
function error(arg1, arg2, arg3, arg4, arg5) {
  if (isResponseLike(arg1)) {
    const res = arg1;
    const statusCode = typeof arg2 === "number" ? arg2 : 500;
    const message = typeof arg3 === "string" ? arg3 : "Something went wrong";
    const errors = arg4 !== undefined ? arg4 : [];
    return res.status(statusCode).json(buildErrorPayload(message, statusCode, errors, arg5));
  }

  const message = typeof arg1 === "string" ? arg1 : "Something went wrong";
  const statusCode = typeof arg2 === "number" ? arg2 : 500;
  const errors = arg3 !== undefined ? arg3 : [];
  return buildErrorPayload(message, statusCode, errors, arg4);
}

/**
 * Generates a validation error response (HTTP 422).
 *
 * @param {Array} [errors=[]] - An array of validation error objects (e.g., field-level errors)
 * @param {string} [message="Validation failed"]
 * @returns {Object} Validation error response object
 */
function validationError(errors = [], message = "Validation failed") {
  return error(message, 422, errors);
}

/**
 * Generates a route-not-found response (HTTP 404).
 *
 * @param {string} [path=""] - The requested route path (used in the error message)
 * @returns {Object} Route not found error response object
 */
function routeNotFound(path = "") {
  return {
    success: false,
    statusCode: 404,
    message: `Route${path ? ` "${path}"` : ""} not found`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates a generic not found error (HTTP 404).
 *
 * @param {string} [message="Resource not found"]
 * @returns {Object} Not found error response object
 */
function notFound(message = "Resource not found") {
  return error(message, 404);
}

/**
 * Generates an unauthorized access error (HTTP 401).
 *
 * @param {string} [message="Unauthorized access"]
 * @returns {Object} Unauthorized error response object
 */
function unauthorized(message = "Unauthorized access") {
  return error(message, 401);
}

/**
 * Generates a forbidden access error (HTTP 403).
 *
 * @param {string} [message="Forbidden"]
 * @returns {Object} Forbidden error response object
 */
function forbidden(message = "Forbidden") {
  return error(message, 403);
}

/**
 * Generates a conflict error (HTTP 409).
 *
 * @param {string} [message="Conflict detected"]
 * @returns {Object} Conflict error response object
 */
function conflict(message = "Conflict detected") {
  return error(message, 409);
}

/**
 * Generates a too many requests error (HTTP 429).
 *
 * @param {string} [message="Too many requests"]
 * @returns {Object} Too many requests error response object
 */
function tooManyRequests(message = "Too many requests") {
  return error(message, 429);
}

/**
 * Generates an internal server error (HTTP 500).
 *
 * @param {string} [message="Internal server error"]
 * @returns {Object} Internal server error response object
 */
function internalServerError(message = "Internal server error") {
  return error(message, 500);
}

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
