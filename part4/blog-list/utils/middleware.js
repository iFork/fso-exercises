// TODO
// Q: How get error msg from Mongoose validator?

// create error handler middleware
const errorHandler = (err, _req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  }
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).json({ error: err.message });
  }
  if (err.name === 'CastError') {
    res.status(400).json({ error: err.message });
  }
  if (err.name === 'MongoError') {
    // e.g. thrown when trying to overwrite `_id` field which is immutable
    res.status(500).json({ error: err.message });
  }
  // NOTE: in case of validation error,
  // next() produces response w status code 404 and an html with e.g. 'Cannot
  // Post', while
  // next(err) jumps to the default error handeler and produces response w
  // status code 500 and html w stack trace.

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: err.message });
  }

  // TODO: add also error logger

  next(err);
};

module.exports = {
  errorHandler,
};
