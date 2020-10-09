const mongoose = require('mongoose'); // for error type checking

const logger = require('../utils/logger');

const requestLogger = (req, _res, next) => {
    logger.info('baseUrl   : ', req.baseUrl);
    logger.info('method    : ', req.method);
    logger.info('path      : ', req.path);
    logger.info('body      : ', req.body);
    logger.info('---');
    next();
};
const unknownEndpoint = (_req, res, _next) => {
    res.status(404).send({ error: 'unknown endpoint' });
    // next();
    // here absence of next() does not cause hanging of the client
    // while next() missing in logger cause client to wait for response in vain.
    // This is because here .send() terminates the req-res cycle.
};

const errorHandler = (err, _req, res, next) => {
    logger.error('error :', err.message);
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).json({ error: 'Not found' });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Malformatted id' });
    }
    if (err.name === 'ValidationError') { // or instanceof mongoose.Error.ValidationError
        // return res.status(400).json({error: err.errors});
        return res.status(400).json({ error: err.message });
    }
    if (err.name === 'userIdError') {
        // return res.status(400).json({error: err.errors});
        return res.status(400).json({ error: err.message });
    }
    if (err.name === 'JsonWebTokenError') {
        // return res.status(400).json({error: err.errors});
        return res.status(401).json({ error: err.message });
    }
    return next(err);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
