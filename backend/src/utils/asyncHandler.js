/**
 * Reusable Async Handler Utility
 * Wraps async express controllers to pass errors automatically to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
