const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogRouter');

const app = express();
const cors = require('cors');

console.log('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/api/blogs/', blogRouter);

module.exports = app;
