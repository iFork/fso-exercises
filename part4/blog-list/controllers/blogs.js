/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
    // .exec();
  response.json(blogs);
});

// get token from header
const getTokenFrom = (request) => {
  const authorizationHeader = request.get('Authorization');
  if (!authorizationHeader
    || !authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return authorizationHeader.substring(7);
};

blogRouter.post('/', async (request, response, _next) => {
  // NOTE: no need to add a catch block with call to next(err) since we are
  // using express-async-errors package
  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({
      error: 'Token is invlid or missing',
    });
  }
  // TODO: convert to async w callback?
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const { id, username } = decodedToken;
  if (!id || !username) {
    return response.status(401).json({
      error: 'Token verification failed',
    });
  }
  const user = await User
    .findById(id)
    .orFail();

  // **NOTE**: mongoose seems to have no problem with **casting an
  // object/document to ObjectId**.
  // Also when a document is supplied to a field of type ObjectId, returned
  // result (of save) seems to be **already populated** (without us calling
  // .populate()), and `saveResult.populated()` returns truthy value (id of
  // user).
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\/
  // blog = { ...blog, user: someUser };

  const { body } = request;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const saveResult = await blog.save();
  // update user, too
  user.blogs = user.blogs.concat(saveResult._id);
  await user.save();

  await saveResult.populate('user', { username: 1, name: 1 }).execPopulate();
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
