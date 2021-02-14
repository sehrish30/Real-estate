function errorHandler(err, req, res, next) {
  // jwt authentication error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user isn't authorized" });
  }

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  return res.status(500).json({ message: err });
}
module.exports = errorHandler;
