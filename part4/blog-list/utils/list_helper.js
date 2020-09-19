const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce( (favorite, blog) => {
    // console.log('favorite is:', favorite, 'current blog is:', blog);
    const favLikes  = favorite.likes || 0;
    const blogLikes = blog.likes     || 0;
    // console.log('favLikes', favLikes, 'blogLikes', blogLikes);
    if ( blogLikes > favLikes ) {
      return favorite = (({ title, author, likes }) => 
          ({ title, author, likes }))(blog);
    } else {
      return favorite;
    }
  }, {} ); // may put 1st elem for optimizing
  // 1 > undefined // false
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}

