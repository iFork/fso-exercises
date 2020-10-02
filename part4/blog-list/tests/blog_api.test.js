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
  test('blog has id prop', async () => {
    const blogs = await helper.blogsInDb();
    const blog = blogs[0];
    expect(blog.id).toBeDefined();
  });
  test('a new blog can be added', async () => {
    const blogsAtStart = await helper.blogsInDb();

    // create a new blog obj, post
    const blog = {
      title: 'First blog ti',
      author: 'Bob Blogger',
      url: 'https://bobo',
      likes: 3,
    };

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .type('json')
      .expect(201);

    // verify response matches what has been posted
    expect(response.body).toMatchObject(blog);
    // verify count increase, inclusion in db after post
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
    expect(blogsAtEnd).toContainEqual(response.body);
  });
  test.only('default likes to 0 if prop is missing', async () => {
    // post blog with missing likes prop
    const blog = {
      title: 'Blog misses likes',
      author: 'Bob Blogger',
      url: 'https://bobo',
    };

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .type('json')
      .expect(201);

    const blogReturned = response.body;
    const blogId = blogReturned.id;
    const blogsAtEnd = await helper.blogsInDb();
    // verify response
    expect(blogReturned.likes).toBe(0);
    // verify db
    expect(blogsAtEnd).toContainEqual({ ...blog, id: blogId, likes: 0 });
  });
});

// Note: close db connectio to avoid jest error :
// `Jest did not exit one second after the test run has completed.
// This usually means that there are asynchronous operations that weren't
// stopped in your tests`
afterAll(() => {
  mongoose.connection.close();
});
