const express = require('express');
require('express-async-errors'); // to avoid calling next(err) in catch blocks
// of routers

const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

const app = express();

console.log('connecting to', config.MONGODB_URI);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);
app.use('/api/blogs/', blogRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorHandler);

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

module.exports = app;
