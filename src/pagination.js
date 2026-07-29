const { buildSuccessPayload } = require("./core");

/**
 * Coerces a value into a positive integer, falling back to `fallback`
 * when the value is missing, not finite, or not positive. Keeps
 * pagination safe against bad/missing query params (e.g. `?page=abc`).
 *
 * @param {*} value
 * @param {number} fallback
 * @param {{ allowZero?: boolean }} [opts]
 * @returns {number}
 */
function toPositiveInt(value, fallback, opts = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  const floored = Math.floor(num);
  if (opts.allowZero ? floored < 0 : floored <= 0) return fallback;
  return floored;
}

/**
 * Builds a standardized paginated response payload. Automatically
 * computes `totalPages` and safely defaults `page`/`limit`/`totalRecords`
 * when they are missing or invalid - handy for wiring straight up to a
 * database query (e.g. Mongoose `.skip().limit()` or SQL `LIMIT/OFFSET`).
 *
 * @template T
 * @param {T[]} data - The current page of records.
 * @param {{ page?: number, limit?: number, totalRecords?: number }} [options={}]
 * @param {string} [message="Data fetched successfully"]
 * @returns {{success: true, statusCode: number, message: string, data: T[], pagination: {page: number, limit: number, totalRecords: number, totalPages: number}, timestamp: string}}
 */
function buildPagination(data, options = {}, message = "Data fetched successfully") {
  const list = Array.isArray(data) ? data : data === undefined || data === null ? [] : [data];

  const page = toPositiveInt(options.page, 1);
  const limit = toPositiveInt(options.limit, 10);
  const totalRecords = toPositiveInt(options.totalRecords, list.length, { allowZero: true });
  const totalPages = limit > 0 ? Math.ceil(totalRecords / limit) : 0;

  const payload = buildSuccessPayload(list, message, 200);
  payload.pagination = { page, limit, totalRecords, totalPages };
  return payload;
}

/**
 * Builds a paginated response and sends it directly on an Express `res`.
 *
 * @template T
 * @param {import('express').Response} res
 * @param {T[]} data
 * @param {{ page?: number, limit?: number, totalRecords?: number }} [options={}]
 * @param {string} [message="Data fetched successfully"]
 * @returns {*} the `res` object, for chaining.
 */
function paginated(res, data, options = {}, message = "Data fetched successfully") {
  if (!res || typeof res.status !== "function" || typeof res.json !== "function") {
    throw new TypeError("paginated(res, ...) expects a valid Express response object as the first argument");
  }
  return res.status(200).json(buildPagination(data, options, message));
}

module.exports = {
  buildPagination,
  paginated,
};
