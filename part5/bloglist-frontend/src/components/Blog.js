import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({
  blog, updateBlog, deleteBlog, currentUsername,
}) => {
  const [viewDetailed, setViewDetailed] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const toggleViewDetailed = () => {
    setViewDetailed((prevState) => !prevState);
  };

  const likeHandler = async () => {
    // NOTE: Remember that setState is async operation and state is not updated
    // right away.
    // NOTE: this cb is called on each click and on each click this component
    // rerenders (and setState resolves) so state cannot become stale between
    // clicks, as I understand. Right?
    const updatedLikes = likes + 1;
    // NOTE: Remember to not do `state++`
    setLikes(updatedLikes);
    try {
      const updatePayload = {
        ...blog,
        // override likes and user prop of blog
        likes: updatedLikes,
        user: blog.user.id,
        // NOTE: Remember to undo `populate` of mongoose and send just id not a
        // populated user object
      };
      await updateBlog(updatePayload);
      // NOTE: response is applied to blogs array state of App inside
      // updateBlog() since `blogs` state is owned by App.
    } catch {
      // NOTE: catches also payload error due to missing user property
      // That error should be dealt with (notified) here
      console.log('Error: Like cannot be casted');
      // reset back in case of request fails
      setLikes(updatedLikes - 1);
    }
  };

  const deleteHandler = async () => {
    // console.log("deleting blog", blog.id);
    await deleteBlog(blog);
  };

  const ownerIsCurrentUser = blog.user
    && blog.user.username === currentUsername;
  // console.log({ title: blog.title, ownerIsCurrentUser });

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 3,
    marginBottom: 5,
  };

  const compactView = (
    <div>
      {blog.title}
      {' '}
      {blog.author}
      <button
        type="button"
        onClick={() => toggleViewDetailed()}
      >
        View
      </button>
    </div>
  );

  // NOTE: Better to factor out components into *functions* instead of assigning
  // jsx expression to a *variable* since sooner or later we may want to add
  // e.g. inline style to it or even separate it into its own component and
  // make it stetefull
  const deleteButton = () => {
    const deleteButtonStyle = {
      backgroundColor: 'pink',
    };
    return (
      <button
        style={deleteButtonStyle}
        type="button"
        onClick={deleteHandler}
      >
        Delete
      </button>
    );
  };

  const detailedView = (
    <div>
      {blog.title}
      {' '}
      {blog.author}
      <button
        type="button"
        onClick={() => toggleViewDetailed()}
      >
        Hide
      </button>
      <div>{blog.url}</div>
      <div>
        likes
        {' '}
        {likes}
        <button
          type="button"
          onClick={likeHandler}
        >
          Like
        </button>
      </div>
      <div>{blog.user ? blog.user.name : ''}</div>
      { ownerIsCurrentUser && deleteButton() }
    </div>
  );

  return (
    <div style={blogStyle}>
      { viewDetailed || compactView }
      { viewDetailed && detailedView }
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
    url: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default Blog;
