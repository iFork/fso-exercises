/* eslint-disable key-spacing */
const supertest = require('supertest');
const app = require('../app');

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

module.exports = {
  initialBlogs,
  blogsInDb,
};
