const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('blog api when there are some initial blogs', () => {
  beforeEach(async () => {
    // NOTE: Remember to clean ALL collections affected by inintDB to avoid
    // duplicate entries
    await helper.cleanDb();
    await helper.initDb();
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
      const { username, password } = helper.initialUsers[0];
      // NOTE: ATTENTION: When you forget **await** async func calls, Jest even
      // FAILS to print CONSOLE.LOG()s and complains like you are trying to do
      // something `after the Jest environment has been torn down`
      const authHeaderValue = await helper
        .getAuthorizationHeaderValueFor(username, password);

      const blog = {
        title: 'First blog ti',
        author: 'Bob Blogger',
        url: 'https://bobo',
        likes: 3,
      };
      const response = await api
        .post('/api/blogs')
        // NOTE: REMEMBER to include authorization type before token
        .set('Authorization', authHeaderValue)
        .send(blog)
        .type('json')
        .expect(201);
      expect(response.body).toMatchObject(blog);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
      expect(blogsAtEnd).toContainEqual(response.body);
    });
    test('a new blog can not be added w/o authorization', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blog = {
        title: 'First blog ti',
        author: 'Bob Blogger',
        url: 'https://bobo',
        likes: 3,
      };
      const response = await api
        .post('/api/blogs')
        .set('Authorization', 'wrong authorization')
        .send(blog)
        .type('json')
        .expect(401);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });

    test('default likes to 0 if prop is missing', async () => {
      const { username, password } = helper.initialUsers[0];
      const authHeaderValue = await helper
        .getAuthorizationHeaderValueFor(username, password);
      // post blog with missing likes prop
      const blog = {
        title: 'Blog misses likes',
        author: 'Bob Blogger',
        url: 'https://bobo',
      };
      const response = await api
        .post('/api/blogs')
        .set('Authorization', authHeaderValue)
        .send(blog)
        .type('json')
        .expect(201);
      const blogReturned = response.body;
      const blogId = blogReturned.id;
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogReturned.likes).toBe(0);
      // NOTE: can use `expect.arrayContaining(array)`,
      // `expect.objectContaining(object)` (can nest similar matchers) in place
      // of literal expectations inside `toEqual()`.
      const expected = [{
        ...blog,
        id: blogId,
        likes: 0,
        user: expect.anything(),
      }];
      expect(blogsAtEnd).toEqual(expect.arrayContaining(expected));
    });
    test('cannot create blogs missing title prop', async () => {
      const { username, password } = helper.initialUsers[0];
      const authHeaderValue = await helper
        .getAuthorizationHeaderValueFor(username, password);
      // post invalid note
      const blog = {
        author: 'Bob Blogger',
        url: 'https://bobo',
      };
      await api
        .post('/api/blogs')
        .set('Authorization', authHeaderValue)
        .send(blog)
        .type('json')
        .expect(400);
    });
    test('cannot create blogs missing url prop', async () => {
      const { username, password } = helper.initialUsers[0];
      const authHeaderValue = await helper
        .getAuthorizationHeaderValueFor(username, password);
      // post invalid note
      const blog = {
        title: 'Blog misses likes',
        author: 'Bob Blogger',
      };
      await api
        .post('/api/blogs')
        .set('Authorization', authHeaderValue)
        .send(blog)
        .type('json')
        .expect(400);
    });
  });
  describe('delete a blog', () => {
    test('creator can delete his/her blog ', async () => {
      // get a valid id to delete
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const { id: blogId, user: { username } } = blog;
      // console.log({ blogId, user: { username } });
      // find user by username in initialUsers to get password
      const { password } = helper.initialUsers.find(
        (user) => user.username === username,
      );
      // console.log({ password });
      const authHeaderValue = await helper.getAuthorizationHeaderValueFor(
        username,
        password,
      );
      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', authHeaderValue)
        .expect(204);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
      expect(blogsAtEnd).not.toContainEqual(blog);
    });
    test('can not delete blog w/o author', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const { id: blogId } = blogsAtStart[0];
      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', 'wrong header')
        .expect(401);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });
    test('one can not delete other\'s blog ', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blog = blogsAtStart[0];
      const { id: blogId, user: { username } } = blog;
      // console.log({ blogId, user: { username } });
      // find another user
      const {
        username: otherUsername,
        password: otherPassword,
      } = helper.initialUsers.find((user) => user.username !== username);
      // console.log({ otherUsername, otherPassword });
      const otherAuthHeaderValue = await helper.getAuthorizationHeaderValueFor(
        otherUsername,
        otherPassword,
      );
      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', otherAuthHeaderValue)
        .expect(401);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
      expect(blogsAtEnd).toContainEqual(blog);
    });
  });

  describe('update a blog', () => {
    // TODO: FIXME: broken sometime around authorization introduction
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
