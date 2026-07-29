/**
 * Wraps an async Express route/middleware handler so that any rejected
 * promise (or thrown error) is automatically forwarded to `next(err)`,
 * instead of crashing the process or requiring a manual try/catch in
 * every controller.
 *
 * @param {(req: *, res: *, next: *) => Promise<*>} fn
 * @returns {(req: *, res: *, next: *) => void}
 *
 * @example
 * router.get("/users", asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.success(users);
 * }));
 */
function asyncHandler(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("asyncHandler expects a function, received " + typeof fn);
  }

  return function wrappedAsyncHandler(req, res, next) {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncHandler;
