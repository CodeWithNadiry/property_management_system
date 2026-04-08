export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500; // read statusCode from AppError
  const message = err.message || "Internal Server Error";
  const data = err.data || null;

  res.status(status).json({ message, data });
}

// super() calls the constructor of the parent class.
