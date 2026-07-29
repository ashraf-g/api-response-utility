const asyncHandler = require("./asyncHandler");
const StatusCodes = require("./statusCodes");
const {
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
} = require("./response");
const { buildPagination, paginated } = require("./pagination");
const { attachResponseMethods, errorHandler } = require("./middleware");
const {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
} = require("./errors");

/**
 * `api-response-utility` public API.
 *
 * The module itself is `asyncHandler` (so `require("api-response-utility")(fn)`
 * works out of the box), with every other helper attached as a property so
 * both of these styles work:
 *
 *   const asyncHandler = require("api-response-utility");
 *   router.get("/", asyncHandler(handler));
 *
 *   const apiResponse = require("api-response-utility");
 *   apiResponse.success(res, 200, "OK", data);
 */
const apiResponse = asyncHandler;

apiResponse.asyncHandler = asyncHandler;
apiResponse.success = success;
apiResponse.error = error;
apiResponse.validationError = validationError;
apiResponse.routeNotFound = routeNotFound;
apiResponse.notFound = notFound;
apiResponse.unauthorized = unauthorized;
apiResponse.forbidden = forbidden;
apiResponse.conflict = conflict;
apiResponse.tooManyRequests = tooManyRequests;
apiResponse.internalServerError = internalServerError;

apiResponse.buildPagination = buildPagination;
apiResponse.paginated = paginated;

apiResponse.StatusCodes = StatusCodes;

apiResponse.attachResponseMethods = attachResponseMethods;
apiResponse.errorHandler = errorHandler;

apiResponse.ApiError = ApiError;
apiResponse.ValidationError = ValidationError;
apiResponse.NotFoundError = NotFoundError;
apiResponse.UnauthorizedError = UnauthorizedError;
apiResponse.ForbiddenError = ForbiddenError;
apiResponse.ConflictError = ConflictError;
apiResponse.TooManyRequestsError = TooManyRequestsError;
apiResponse.InternalServerError = InternalServerError;

module.exports = apiResponse;
