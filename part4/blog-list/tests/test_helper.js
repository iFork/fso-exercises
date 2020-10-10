/* eslint-disable key-spacing */
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title:  'First blog ti',
    author: 'Bob Blogger',
    url:    'https://bobo',
    likes:  3,
  },
  {
    title:  'Second blog Ti',
    author: 'John Blogger',
    url:    'url://url',
    likes:  1,
  },
];

// saving into bd will be in beforeEach() hook

const blogsInDb = async () => {
  const response = await api.get('/api/blogs');
  return response.body; // response body parsed by superagent (of supertest)
};

const getInvalidId = async () => {
  // get a valid id
  // NOTE: keep both creation and deletion here to AVOID SIDE EFFECT on db state!
  // Otherwise, when deleteing blog from initial db state, - call to this
  // func must be before other helper calls as it modifies bd state !!

  const blog = {
    title:  'Blog To Be Deleted',
    author: 'Bob Blogger',
    url:    'https://bobo',
    likes:  3,
  };
  const blogObj = new Blog(blog);
  const savedBlog = await blogObj.save();
  const blogId = savedBlog.id;

  // delete a blog and return its id
  await api
    .delete(`/api/blogs/${blogId}`)
    // .send()
    // .expect('204');
  return blogId;
};

const initialUsers = [
  {
    username: 'root',
    password: 'rootpass',
    name: 'Root User',
  },
];

const usersInDb = async () => {
  const response = await api
    .get('/api/users');
  const users = response.body;
  return users;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  getInvalidId,
  initialUsers,
  usersInDb,
};
