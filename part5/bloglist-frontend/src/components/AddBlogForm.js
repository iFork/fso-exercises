import React from 'react';

export default ({
  handleBlogCreation,
  newBlogTitle,
  setNewBlogTitle,
  newBlogAuthor,
  setNewBlogAuthor,
  newBlogUrl,
  setNewBlogUrl}) => {
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
  );
};

