// Catches any error passed to next(err), or thrown inside an async route
// wrapped with express's default behavior. Keeps error responses consistent.
function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = errorHandler;