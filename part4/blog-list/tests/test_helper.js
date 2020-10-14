/* eslint-disable no-underscore-dangle */
/* eslint-disable key-spacing */
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

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
  {
    username: 'guest',
    password: 'guestpass',
    name: 'Guest User',
  },
];

const usersInDb = async () => {
  const response = await api
    .get('/api/users');
  const users = response.body;
  return users;
};

const getAuthorizationHeaderValueFor = async (username, password) => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .type('json');
  const { token } = loginResponse.body;
  return `Bearer ${token}`;
};

const initUsersDb = async () => {
  const saltRounds = 10;
  const usersPromises = initialUsers.map(async (u) => {
    const passwordHash = await bcrypt.hash(u.password, saltRounds);
    return {
      username: u.username,
      name: u.name,
      passwordHash,
    };
  });
  const users = await Promise.all(usersPromises);
  const savedUsersPromises = users.map(async (u) => {
    const userObj = new User(u);
    return userObj.save();
  });
  await Promise.all(savedUsersPromises);
};

const initDb = async () => {
  await initUsersDb();
  // const users = await usersInDb();
  // const user = await User.find({})[0] <- Wrong way
  const [user /* ...rest */] = await User.find({});
  // console.log({ user });
  const userId = user._id;
  const blogObjects = initialBlogs.map((blog) => new Blog({
    ...blog,
    // Q: Will mongoose cast provided string userId to ObjectId ?
    // A: Yes
    user: userId,
  }));
  const promiseArray = blogObjects.map((blogObj) => blogObj.save());
  const savedBlogs = await Promise.all(promiseArray);
  // update user's blog field
  const savedBlogIds = savedBlogs.map((blog) => blog._id);
  // console.log({ savedBlogIds });
  user.blogs = user.blogs.concat(savedBlogIds);
  await user.save();
  // console.log({ user });
};

/**
 * cleanDb.
 * Since initDb() affects multiple collections, this
 * cleans all affected collections
 */
const cleanDb = async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
};

module.exports = {
  initialBlogs,
  blogsInDb,
  getInvalidId,
  initialUsers,
  usersInDb,
  getAuthorizationHeaderValueFor,
  initUsersDb,
  initDb,
  cleanDb,
};
