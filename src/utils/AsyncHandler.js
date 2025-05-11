import ApiError from "./ApiError.js";

const AsyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!(err instanceof ApiError)) {
      const message = err.message || "Something went wrong";
      err = new ApiError(message, err.statusCode || 500);
    }
    next(err);
  });
};

export default AsyncHandler;
