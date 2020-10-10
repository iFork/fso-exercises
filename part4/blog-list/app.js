const express = require('express');
require('express-async-errors'); // to avoid calling next(err) in catch blocks
// of routers

const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogRouter');
const usersRouter = require('./controllers/users');
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
app.use('/api/blogs/', blogRouter);
app.use('/api/users', usersRouter);
app.use(middleware.errorHandler);

module.exports = app;
