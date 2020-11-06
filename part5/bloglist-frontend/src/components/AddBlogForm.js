import React, { useState } from 'react'

const AddBlogForm = ({ createBlog,  togglableRef }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    const blog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }
    // reset fields only if creation succeeds
    try {
      await createBlog(blog)
      // NOTE: we can still change states here as this will not unmount
      // at the end of 'await' (hiding is only via css, not conditional rendering)
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      togglableRef.current.toggleVisibility()
    } catch {
      // no-op
    }
  }
  return (
    <form onSubmit={handleBlogCreation}>
      <h2>Add new blog</h2>
      <div>
        <label htmlFor="id_title">Title:</label>
        <input
          type="text"
          name="title"
          id="id_title"
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="id_author">Author:</label>
        <input
          type="text"
          name="author"
          id="id_author"
          value={newBlogAuthor}
          onChange={(e) => setNewBlogAuthor(e.target.value)} />
      </div>
      <div>
        <label htmlFor="id_url">Url:</label>
        <input
          type="text"
          name="url"
          id="id_url"
          value={newBlogUrl}
          onChange={(e) => setNewBlogUrl(e.target.value)} />
      </div>
      <button type="submit">Add Post</button>
    </form>
  )
}

export default AddBlogForm
