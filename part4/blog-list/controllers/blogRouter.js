const blogRouter = require('express').Router();

const Blog = require('../models/blog');

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const saveResult = await blog.save();
  response.status(201).json(saveResult);
});

module.exports = blogRouter;
