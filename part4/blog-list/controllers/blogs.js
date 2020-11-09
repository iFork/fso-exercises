/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

// NOTE: no need to add a catch block with call to next(err) since we are
// using express-async-errors package

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog
    .find({})
    // NOTE: `populate` keeps original value of the field (i.e. id) along with
    // the 'populated' fields. Having `id: 1` or not, is the same.
    .populate('user', { /* id: 1, */ username: 1, name: 1 });
    // .exec();
  response.json(blogs);
});

blogRouter.post('/', async (request, response, _next) => {
  if (!request.token) {
    return response.status(401).json({
      error: 'Token is invlid or missing',
    });
  }
  // TODO: convert to async w callback?
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

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
  // if token is null JWT error has message 'jwt required'
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const requesterId = decodedToken.id;
  // console.log('requesterId', requesterId);

  const blogId = request.params.id;
  const blog = await Blog.findById(blogId).orFail();
  // TODO: check that blog has user path (safeguard agianst outdated schemas) ?
  // NOTE: field of type `ObjectId` is returned as such from db.
  // Use its `.toString()` methiod for string comparison.
  const blogCreatorId = blog.user.toString();
  if (requesterId !== blogCreatorId) {
    return response.status(401).json({
      error: 'You are not the creator of the blog',
    });
  }
  await blog.deleteOne();
  // TODO: Update also user obj, filtering out this blog id from its 'blogs'
  // field console.log('deleted blog', blog);
  response.status(204).send(); // or .end()
});

blogRouter.put('/:id', async (request, response, _next) => {
  const blogId = request.params.id;
  const { body } = request;
  // NOTE: if using following - remember to check for
  // undefined/missing fields in request (e.g. newVal || oldVal) to not
  // override existing values with nulls if field is not sent in a request.
  // BUT putting body directly in findByIdAndUpdate() is a simpler way to
  // achive the same effect.
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
  const responsePayload = await savedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate();
  response.status(200).json(responsePayload);
});
module.exports = blogRouter;
