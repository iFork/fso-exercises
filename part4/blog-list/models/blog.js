const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  virtuals: true, // add `id` prop
  versionKey: false, // remove `__v` prop
  transform: (_doc, returnedObj, _opt) => { // remove `_id` prop
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete returnedObj._id;
    return returnedObj;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
