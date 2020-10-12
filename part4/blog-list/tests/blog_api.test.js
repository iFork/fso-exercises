const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('blog api when there are some initial blogs', () => {
  beforeEach(async () => {
    // clean
    await Blog.deleteMany({});

    // initialize db w initial blogs
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blogObj) => blogObj.save());
    await Promise.all(promiseArray);
  });
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
  test('blog user prop is populated', async () => {
    // FIXME: this fails due to db initialization specifies no user prop in blogs
    const blogs = await helper.blogsInDb();
    const blog = blogs[0];
    expect(blog.user.id).toBeDefined();
    expect(blog.user.username).toBeDefined();
    expect(blog.user.name).toBeDefined();
    expect(blog.user.blogs).not.toBeDefined();
  });

  describe('creating a new blog', () => {
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

    test('default likes to 0 if prop is missing', async () => {
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

    test('cannot create blogs missing title prop', async () => {
      // create, post invalid note
      const blog = {
        author: 'Bob Blogger',
        url: 'https://bobo',
      };
      // verify response status is 400
      await api
        .post('/api/blogs')
        .send(blog)
        .type('json')
        .expect(400);
    });
    test('cannot create blogs missing url prop', async () => {
      // create, post invalid note
      const blog = {
        title: 'Blog misses likes',
        author: 'Bob Blogger',
      };
      // verify response status is 400
      await api
        .post('/api/blogs')
        .send(blog)
        .type('json')
        .expect(400);
    });
  });
  describe('delete a blog', () => {
    test('delete a blog', async () => {
      // get a valid id to delete
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const blogId = blog.id;
      // delete
      await api
        .delete(`/api/blogs/${blogId}`)
        .expect(204);
      // verify response status, db content
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
      expect(blogsAtEnd).not.toContainEqual(blog);
    });
  });

  describe('update a blog', () => {
    test('update a blog w valid id', async () => {
      // get a valid id
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const blogId = blog.id;
      const updatedLikes = blog.likes + 1;
      // blog.likes = updatedLikes;
      const updatedBlog = { ...blog, likes: updatedLikes };
      const responseOfPut = await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .type('json')
        .expect(200)
        .expect('Content-Type', /json/);
      // verify response, db state
      const blogInResponse = responseOfPut.body;
      expect(blogInResponse.likes).toBe(updatedLikes);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toContainEqual(updatedBlog);
    });
    test('partial update request updates partially', async () => {
      // get a valid id
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const blogId = blog.id;
      const updatedLikes = blog.likes + 1;
      // blog.likes = updatedLikes;
      const blogPatch = { likes: updatedLikes };
      const responseOfPut = await api
        .put(`/api/blogs/${blogId}`)
        .send(blogPatch)
        .type('json')
        .expect(200)
        .expect('Content-Type', /json/);
      // verify response, db state
      const blogInResponse = responseOfPut.body;
      expect(blogInResponse.likes).toBe(updatedLikes);
      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogId);
      expect(updatedBlog.likes).toBe(updatedLikes);
    });
    test('attempt to overwrite _id is handled', async () => {
      // get a blog and invalid id to patch with
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const blogId = blog.id;
      const invalidId = await helper.getInvalidId();
      const blogPatch = { _id: invalidId };
      // console.log('blog', blog, 'patch', blogPatch);
      await api
        .put(`/api/blogs/${blogId}`)
        .send(blogPatch)
        .type('json')
        .expect(500) // since this falls under generic 'MongoError' category
        .expect('Content-Type', /json/);
      // verify response, db state
      const blogsAtEnd = await helper.blogsInDb();
      // const updatedBlog = blogsAtEnd.find((b) => b.id === blogId);
      // expect(updatedBlog).toBeEqual(blog);
      expect(blogsAtEnd).toContainEqual(blog);
    });
    test('cannot update a blog w invalid id', async () => {
      // get an invalid id
      const invalidId = await helper.getInvalidId();
      const blogPatch = { author: 'Author Nothinger' };
      await api
        .put(`/api/blogs/${invalidId}`)
        .send(blogPatch)
        .type('json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });
});

// Note: close db connectio to avoid jest error :
// `Jest did not exit one second after the test run has completed.
// This usually means that there are asynchronous operations that weren't
// stopped in your tests`
afterAll(() => {
  mongoose.connection.close();
});
