import React, { useState } from 'react'

const Blog = ({ blog }) => {
  console.log({ blog });
  const [viewDetailed, setViewDetailed] = useState(false)

  const toggleViewDetailed = () => {
    setViewDetailed((prevState) => !prevState)
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
      <div>likes {blog.likes}
        <button>Like</button>
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
