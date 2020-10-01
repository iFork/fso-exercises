const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  // clean
  await Blog.deleteMany({});

  // initialize db w initial blogs
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blogObj) => blogObj.save());
  await Promise.all(promiseArray);
});

describe('blog api', () => {
  test('response is json', async () => {
    // NOTE: Remember to await, otherwise you get
    // `ReferenceError: You are trying to `import` a file after the Jest
    // environment has been torn down`
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/);
  });
  test('number of blogs in response', async () => {
    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });
});

// Note: close db connectio to avoid jest error :
// `Jest did not exit one second after the test run has completed.
// This usually means that there are asynchronous operations that weren't
// stopped in your tests`
afterAll(() => {
  mongoose.connection.close();
});
