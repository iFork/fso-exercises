/**
 * requestLogger.
 * pre-cond middlewares: JSON, tokenExtractor
 * @param {} req
 * @param {} _res
 * @param {} next
 */
const requestLogger = (req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log(req.method);
  // eslint-disable-next-line no-console
  console.log('path:', req.path);
  // eslint-disable-next-line no-console
  console.log('has token?:', !!req.token);
  // eslint-disable-next-line no-console
  console.log('body:', req.body);
  // eslint-disable-next-line no-console
  console.log('---');
  next();
};

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

// get token from header
const tokenExtractor = (req, _res, next) => {
  const authorizationHeader = req.get('Authorization');
  if (!authorizationHeader
    || !authorizationHeader.toLowerCase().startsWith('bearer ')) {
    req.token = null;
  } else {
    req.token = authorizationHeader.substring(7); // drop 'Bearer '
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
};
