const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: [true, '{PATH} is required'] },
  // title: { type: String, required: '{PATH} is required' },
  author: String,
  url: { type: String, required: [true, '{PATH} is required'] },
  likes: { type: Number, default: 0 },
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
