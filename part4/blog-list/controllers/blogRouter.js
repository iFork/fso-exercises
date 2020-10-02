const blogRouter = require('express').Router();

const Blog = require('../models/blog');

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  // NOTE: no need to add a catch block with call to next(err) since we are
  // using express-async-errors package
  const blog = request.body;
  const blogObj = new Blog(blog);
  const saveResult = await blogObj.save();
  return response.status(201).json(saveResult);
});

module.exports = blogRouter;
