/**
 * Base class for all operational API errors. Carries an HTTP status
 * code and an optional list of granular error details so it can be
 * thrown from anywhere (services, controllers, validators) and later
 * converted into a standardized response by `errorHandler` middleware.
 */
class ApiError extends Error {
  /**
   * @param {string} [message="Something went wrong"]
   * @param {number} [statusCode=500]
   * @param {Array} [errors=[]]
   */
  constructor(message = "Something went wrong", statusCode = 500, errors = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** 422 - one or more fields failed validation. */
class ValidationError extends ApiError {
  /**
   * @param {Array} [errors=[]] - Field-level validation error details.
   * @param {string} [message="Validation failed"]
   */
  constructor(errors = [], message = "Validation failed") {
    super(message, 422, errors);
  }
}

/** 404 - the requested resource does not exist. */
class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/** 401 - authentication is missing or invalid. */
class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

/** 403 - authenticated but not allowed to access the resource. */
class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/** 409 - the request conflicts with the current state of the resource. */
class ConflictError extends ApiError {
  constructor(message = "Conflict detected") {
    super(message, 409);
  }
}

/** 429 - the client has sent too many requests. */
class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

/** 500 - an unexpected server-side failure. */
class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
};
