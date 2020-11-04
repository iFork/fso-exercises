import React, { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [viewDetailed, setViewDetailed] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleViewDetailed = () => {
    setViewDetailed((prevState) => !prevState)
  }

  const likeHandler = async () => {
    // NOTE: Remember that setState is async operation and state is not updated
    // right away. 
    // NOTE: this cb is called on each click and on each click this component
    // rerenders (and setState resolves) so state cannot become stale between
    // clicks, as I understand. Right?
    const updatedLikes = likes + 1; 
    // NOTE: Remember to not do `state++`
    setLikes(updatedLikes)
    const updatePayload = {
      ...blog,
      // override likes and user prop of blog
      likes: updatedLikes, 
      user: blog.user.id 
      // NOTE: Remember to undo `populate` of mongoose and send just id not a
      // populated user object
    }
    try {
      await updateBlog(updatePayload);
      // NOTE: response is applied to blogs array state of App inside
      // updateBlog() since `blogs` state is owned by App.
    } catch {
      // reset back in case of request fails
      setLikes(updatedLikes - 1)
    }
  }

  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 3,
    marginBottom: 5,
  }

  const compactView = (
    <div>
      {blog.title} {blog.author}
      <button
        type="button"
        onClick={()=> toggleViewDetailed()}
      >
        View
      </button>
    </div>
    );

  const detailedView = (
    <div>
      {blog.title} {blog.author}
      <button
        type="button"
        onClick={()=> toggleViewDetailed()}
      >
        Hide
      </button>
      <div>{blog.url}</div>
      <div>likes {likes}
        <button
          onClick={likeHandler}
        >
          Like
        </button>
      </div>
      <div>{blog.user ? blog.user.name : ""}</div>
    </div>
  )
  return (
    <div style={blogStyle}>
      { viewDetailed || compactView }
      { viewDetailed && detailedView }
    </div>
  )
}

export default Blog
