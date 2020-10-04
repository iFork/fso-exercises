const blogRouter = require('express').Router();

const Blog = require('../models/blog');

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response, _next) => {
  // NOTE: no need to add a catch block with call to next(err) since we are
  // using express-async-errors package
  const blog = request.body;
  const blogObj = new Blog(blog);
  const saveResult = await blogObj.save();
  return response.status(201).json(saveResult);
});

blogRouter.delete('/:id', async (request, response, _next) => {
  const blogId = request.params.id;
  // or not use 404 code (per errorHandler middleware when findAndDelete()
  // fails (.orFail()), maybe 204 code is sufficient ?
  await Blog.findByIdAndDelete(blogId).orFail(); // no need to .exec() w await too
  response.status(204).send();
});

blogRouter.put('/:id', async (request, response, _next) => {
  const blogId = request.params.id;
  const { body } = request;
  // NOTE: if using following - remember to check for
  // undefined/missing fields in request (e.g. newVal || oldVal)
  // BUT putting body directly in findByIdAndUpdate() is simpler.
  //
  // const updatedBlog = {
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes,
  // };
  // NOTE: fields not in schema are silently ignored, by default.
  const savedBlog = await Blog
    .findByIdAndUpdate(
      blogId,
      { $set: { ...body } }, // or, instead, put just `body` as arg
      { new: true },
    )
    .orFail(); // otherwise no match returns `null` w status code 200
  // console.log('savedBlog', savedBlog.toJSON());
  response.status(200).json(savedBlog);
});
module.exports = blogRouter;
