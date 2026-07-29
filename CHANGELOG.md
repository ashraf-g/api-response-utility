# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-07-28

### Added
- `success(res, statusCode, message, data)` / `error(res, statusCode, message, errors)` -
  new Express "send" mode, auto-detected when the first argument is a
  response-like object. The original `success(data, message, statusCode)` /
  `error(message, statusCode, errors)` signatures still work unchanged.
- `timestamp` (ISO 8601) added to every response payload.
- `StatusCodes` - frozen map of common HTTP status code constants.
- `buildPagination(data, options, message)` / `paginated(res, data, options, message)` -
  pagination helper with automatic `totalPages` calculation and safe
  defaults for missing/invalid `page`/`limit`/`totalRecords`.
- `asyncHandler` - the module's default export now doubles as an async
  Express handler wrapper, forwarding rejected promises/synchronous throws
  to `next(err)`.
- Custom error classes: `ApiError`, `ValidationError`, `NotFoundError`,
  `UnauthorizedError`, `ForbiddenError`, `ConflictError`,
  `TooManyRequestsError`, `InternalServerError`.
- `errorHandler` - centralized Express error-handling middleware that
  understands `ApiError` subclasses and hides internal error details in
  production (`NODE_ENV !== "development"`).
- `attachResponseMethods` - middleware adding `res.success()`, `res.error()`
  and `res.paginated()` convenience methods.
- Optional 5th argument (`originalError`) on `error()` to attach a `stack`
  trace, only included when `NODE_ENV === "development"`.
- Full TypeScript definitions (`index.d.ts`), dependency-free (no
  `@types/express` required): `ApiResponse<T>`, `ApiErrorResponse`,
  `PaginationResponse<T>`, `PaginationMeta`, `PaginationOptions`,
  `StatusCodesMap`.
- Test suite (Jest) covering success/error responses, pagination, error
  classes, the async handler, middleware, backward compatibility, and the
  type definitions (`tsc --noEmit`).
- `src/` module structure (`core`, `response`, `errors`, `pagination`,
  `asyncHandler`, `middleware`, `statusCodes`) - the root `index.js` now
  re-exports from `src/index.js`.

### Changed
- Internal project layout moved from a single `index.js` file to `src/`.
  The public require path (`require("api-response-utility")`) is unaffected.

### Fixed
- N/A

No breaking changes. See the [Migration guide](./README.md#migration-guide-10x--110)
in the README.

## [1.0.0] - 2025

### Added
- Initial release: `success`, `error`, `validationError`, `routeNotFound`,
  `notFound`, `unauthorized`, `forbidden`, `conflict`, `tooManyRequests`,
  `internalServerError`.
