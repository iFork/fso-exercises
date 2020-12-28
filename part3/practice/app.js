/* eslint-disable no-console */

const express = require('express');
require('express-async-errors'); // this patches 'express' lib to drop the need
// for try/catch blocks in express routers which use async callbacks. This will
// pass errors to error handling middleware without us calling next(error) in a
// catch block.
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

logger.info('connecting to', config.MONGODB_URI);

// global configs for mongoose
// to settle deprecation warnings
mongoose.set('useFindAndModify', false);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('connected to MongoDB'))
    .catch((err) => logger.error('error connecting to MongoDB:', err.message));

const app = express();

// middleware to serve static pages, for our frontend
app.use(express.static('build'));
// cors middleware to allow cross-origin access from any origin
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line global-require
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
}

app.get('/', (_req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.use(middleware.unknownEndpoint);

// Error handler middleware
// NOTE: if error handler middleware is 'use()'ed before a router which may
// throw an error (i.e. `next(error)`), e.g., before get(../:id) router above,
// then it has no effect and default error handler middleware of express is in
// effect.
// **NB**: Therefore always 'use()' error handler middleware at the very END.
app.use(middleware.errorHandler);

module.exports = app;
