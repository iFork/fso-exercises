// TODO
// Q: How get error msg from Mongoose validator?

// create error handler middleware
const errorHandler = (err, _req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  }
  // NOTE: in case of validation error,
  // next() produces response w status code 404 and an html with e.g. 'Cannot
  // Post', while
  // next(err) jumps to the default error handeler and produces response w
  // status code 500 and html w stack trace.
  next(err);
};

module.exports = {
  errorHandler,
};
