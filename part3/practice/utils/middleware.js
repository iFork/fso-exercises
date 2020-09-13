const mongoose = require('mongoose'); // for error type checking

const requestLogger = (req, _res, next) => {
    console.log('baseUrl   : ', req.baseUrl);
    console.log('method    : ', req.method);
    console.log('path      : ', req.path);
    console.log('body      : ', req.body);
    console.log('---');
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
    console.log('error :', err.message);
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
    return next(err);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
