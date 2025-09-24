// Not Found handler
export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// Global error handler
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(statusCode).json(payload);
}

