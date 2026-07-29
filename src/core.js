/**
 * Internal payload builders shared by the public response helpers,
 * the pagination helper and the Express middleware. Not part of the
 * public API surface directly, but re-used to keep response shapes
 * perfectly consistent everywhere.
 */

/**
 * Detects whether a value looks like an Express (or Express-like)
 * response object, i.e. it exposes `.status()` and `.json()`.
 * Used to let `success()`/`error()` operate in two modes:
 * a pure "build the object" mode and a "send it on `res`" mode.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isResponseLike(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.status === "function" &&
    typeof value.json === "function"
  );
}

/**
 * Builds a standardized success payload.
 *
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 * @returns {{success: true, statusCode: number, message: string, data: *, timestamp: string}}
 */
function buildSuccessPayload(data, message, statusCode) {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Builds a standardized error payload. Stack traces are only attached
 * when `process.env.NODE_ENV === "development"` and an `Error`
 * instance is supplied, so production responses never leak internals.
 *
 * @param {string} message
 * @param {number} statusCode
 * @param {Array} errors
 * @param {Error} [originalError]
 * @returns {{success: false, statusCode: number, message: string, errors: Array, timestamp: string, stack?: string}}
 */
function buildErrorPayload(message, statusCode, errors, originalError) {
  const payload = {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  if (
    process.env.NODE_ENV === "development" &&
    originalError instanceof Error &&
    originalError.stack
  ) {
    payload.stack = originalError.stack;
  }

  return payload;
}

module.exports = {
  isResponseLike,
  buildSuccessPayload,
  buildErrorPayload,
};
