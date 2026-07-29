// Type definitions for api-response-utility
// Dependency-free: request/response objects are described structurally,
// so no @types/express is required to consume this package.
//
// Usage:
//   import apiResponse from "api-response-utility";
//   apiResponse.success(res, 200, "OK", data);
//
//   const response: apiResponse.ApiResponse<User> = { ... };
//
// (The `apiResponse` default import doubles as a namespace for types,
// because this module uses `export =` under the hood - see below.)

/**
 * Wraps an async handler so rejected promises are forwarded to `next(err)`.
 * This is also the module's default export, so
 * `require("api-response-utility")(fn)` / `import apiResponse from "..."`
 * both work directly as the async wrapper, while every other helper is
 * attached as a property of the same function (see the merged namespace
 * below).
 */
declare function asyncHandler<Req = asyncHandler.RequestLike, Res = asyncHandler.ResponseLike>(
  fn: asyncHandler.AsyncRequestHandler<Req, Res>
): asyncHandler.RequestHandlerLike<Req, Res>;

declare namespace asyncHandler {
  /** Minimal structural shape of an Express-like response object. */
  export interface ResponseLike {
    status(code: number): this;
    json(body: unknown): this;
    headersSent?: boolean;
  }

  /** Minimal structural shape of an Express-like request object. */
  export type RequestLike = Record<string, unknown>;

  /** Minimal structural shape of Express's `next`. */
  export type NextFunctionLike = (err?: unknown) => void;

  /** A route/middleware handler that may return a promise. */
  export type AsyncRequestHandler<Req = RequestLike, Res = ResponseLike> = (
    req: Req,
    res: Res,
    next: NextFunctionLike
  ) => Promise<unknown> | unknown;

  /** A plain (synchronous-signature) Express middleware/handler. */
  export type RequestHandlerLike<Req = RequestLike, Res = ResponseLike> = (
    req: Req,
    res: Res,
    next: NextFunctionLike
  ) => void;

  /** An Express error-handling middleware. */
  export type ErrorRequestHandlerLike<Req = RequestLike, Res = ResponseLike> = (
    err: unknown,
    req: Req,
    res: Res,
    next: NextFunctionLike
  ) => void;

  /** Standard success response shape. */
  export interface ApiResponse<T = unknown> {
    success: true;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
  }

  /** Standard error response shape. */
  export interface ApiErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors: unknown[];
    timestamp: string;
    /** Only present when `NODE_ENV === "development"`. */
    stack?: string;
  }

  export interface PaginationMeta {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  }

  export interface PaginationOptions {
    page?: number;
    limit?: number;
    totalRecords?: number;
  }

  /** Standard paginated response shape. */
  export interface PaginationResponse<T = unknown> {
    success: true;
    statusCode: number;
    message: string;
    data: T[];
    pagination: PaginationMeta;
    timestamp: string;
  }

  export interface StatusCodesMap {
    OK: 200;
    CREATED: 201;
    ACCEPTED: 202;
    NO_CONTENT: 204;
    BAD_REQUEST: 400;
    UNAUTHORIZED: 401;
    FORBIDDEN: 403;
    NOT_FOUND: 404;
    METHOD_NOT_ALLOWED: 405;
    CONFLICT: 409;
    UNPROCESSABLE_ENTITY: 422;
    TOO_MANY_REQUESTS: 429;
    INTERNAL_SERVER_ERROR: 500;
    NOT_IMPLEMENTED: 501;
    BAD_GATEWAY: 502;
    SERVICE_UNAVAILABLE: 503;
  }

  /** Base class for all operational API errors. */
  export class ApiError extends Error {
    statusCode: number;
    errors: unknown[];
    isOperational: boolean;
    constructor(message?: string, statusCode?: number, errors?: unknown[]);
  }

  export class ValidationError extends ApiError {
    constructor(errors?: unknown[], message?: string);
  }

  export class NotFoundError extends ApiError {
    constructor(message?: string);
  }

  export class UnauthorizedError extends ApiError {
    constructor(message?: string);
  }

  export class ForbiddenError extends ApiError {
    constructor(message?: string);
  }

  export class ConflictError extends ApiError {
    constructor(message?: string);
  }

  export class TooManyRequestsError extends ApiError {
    constructor(message?: string);
  }

  export class InternalServerError extends ApiError {
    constructor(message?: string);
  }

  // --- success() overloads ---------------------------------------------

  /** Legacy/pure mode: builds and returns the payload object. */
  export function success<T = unknown>(
    data?: T,
    message?: string,
    statusCode?: number
  ): ApiResponse<T>;
  /** Express "send" mode: sends the response and returns `res`. */
  export function success<T = unknown, Res extends ResponseLike = ResponseLike>(
    res: Res,
    statusCode?: number,
    message?: string,
    data?: T
  ): Res;

  // --- error() overloads -------------------------------------------------

  /** Legacy/pure mode: builds and returns the payload object. */
  export function error(
    message?: string,
    statusCode?: number,
    errors?: unknown[],
    originalError?: Error
  ): ApiErrorResponse;
  /** Express "send" mode: sends the response and returns `res`. */
  export function error<Res extends ResponseLike = ResponseLike>(
    res: Res,
    statusCode?: number,
    message?: string,
    errors?: unknown[],
    originalError?: Error
  ): Res;

  export function validationError(errors?: unknown[], message?: string): ApiErrorResponse;
  export function routeNotFound(path?: string): Partial<ApiErrorResponse>;
  export function notFound(message?: string): ApiErrorResponse;
  export function unauthorized(message?: string): ApiErrorResponse;
  export function forbidden(message?: string): ApiErrorResponse;
  export function conflict(message?: string): ApiErrorResponse;
  export function tooManyRequests(message?: string): ApiErrorResponse;
  export function internalServerError(message?: string): ApiErrorResponse;

  export function buildPagination<T = unknown>(
    data: T[],
    options?: PaginationOptions,
    message?: string
  ): PaginationResponse<T>;

  export function paginated<T = unknown, Res extends ResponseLike = ResponseLike>(
    res: Res,
    data: T[],
    options?: PaginationOptions,
    message?: string
  ): Res;

  export function attachResponseMethods(
    req: RequestLike,
    res: ResponseLike & {
      success?: (data?: unknown, message?: string, statusCode?: number) => ResponseLike;
      error?: (message?: string, statusCode?: number, errors?: unknown[], originalError?: Error) => ResponseLike;
      paginated?: (data: unknown[], options?: PaginationOptions, message?: string) => ResponseLike;
    },
    next: NextFunctionLike
  ): void;

  export function errorHandler(
    err: (Error & { statusCode?: number; errors?: unknown[]; isOperational?: boolean }) | unknown,
    req: RequestLike,
    res: ResponseLike,
    next: NextFunctionLike
  ): void;

  export const StatusCodes: StatusCodesMap;

  export { asyncHandler };
}

export = asyncHandler;
