const { buildSuccessPayload, buildErrorPayload } = require("./core");
const { buildPagination } = require("./pagination");

/**
 * Express middleware that attaches `res.success`, `res.error` and
 * `res.paginated` convenience methods, so route handlers can call
 * `res.success(data)` directly instead of importing the helpers.
 *
 * @example
 * app.use(attachResponseMethods);
 * app.get("/users", asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.success(users);
 * }));
 *
 * @param {*} req
 * @param {*} res
 * @param {Function} next
 */
function attachResponseMethods(req, res, next) {
  res.success = function (data = {}, message = "Request successful", statusCode = 200) {
    return res.status(statusCode).json(buildSuccessPayload(data, message, statusCode));
  };

  res.error = function (message = "Something went wrong", statusCode = 500, errors = [], originalError) {
    return res.status(statusCode).json(buildErrorPayload(message, statusCode, errors, originalError));
  };

  res.paginated = function (data, options = {}, message = "Data fetched successfully") {
    return res.status(200).json(buildPagination(data, options, message));
  };

  next();
}

/**
 * Centralized Express error-handling middleware. Register it last, after
 * all routes. Understands `ApiError` (and subclasses) for their
 * `statusCode`/`errors`; any other thrown value is treated as an
 * unexpected 500 and its message is hidden in production.
 *
 * @example
 * app.use(errorHandler);
 *
 * @param {Error & { statusCode?: number, errors?: Array, isOperational?: boolean }} err
 * @param {*} req
 * @param {*} res
 * @param {Function} next
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isOperational = err && err.isOperational === true;
  const statusCode = Number.isInteger(err && err.statusCode) ? err.statusCode : 500;
  const isDevelopment = process.env.NODE_ENV === "development";

  const message = isOperational || statusCode < 500 || isDevelopment
    ? (err && err.message) || "Something went wrong"
    : "Internal server error";

  const errors = (err && err.errors) || [];

  res.status(statusCode).json(buildErrorPayload(message, statusCode, errors, err));
}

module.exports = {
  attachResponseMethods,
  errorHandler,
};
