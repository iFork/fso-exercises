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

const mostBlogs = (blogs) => {
  let authorsChart = {};
  return blogs.reduce((topAuthor, blog) => {
    const currentAuthor = blog.author;
    authorsChart[currentAuthor]
      ? authorsChart[currentAuthor] ++
      : authorsChart[currentAuthor] = 1;
    // console.log("authorsChart is:", authorsChart);
    const currentAuthorBlogs = authorsChart[currentAuthor];
    const topAuthorBlogs = topAuthor.blogs || 0;
    if (currentAuthorBlogs > topAuthorBlogs) {
      topAuthor = { author: currentAuthor, blogs: currentAuthorBlogs };
      // console.log("current topAuthor:", topAuthor);
      return topAuthor;
    } else {
      return topAuthor;
    }
  }, {})
};

const mostLikes = (blogs) => {
  let authorsChart = {};
  return blogs.reduce( (topAuthor, blog) => {
    const currentAuthor = blog.author;
    const currentLikes = blog.likes;
    authorsChart[currentAuthor]
      ? authorsChart[currentAuthor] += currentLikes
      : authorsChart[currentAuthor] = currentLikes;
    // console.log('authorsChart', authorsChart);
    const currentAuthorTotalLikes = authorsChart[currentAuthor];
    const topAuthorTotalLikes = topAuthor.likes || 0;
    if (currentAuthorTotalLikes > topAuthorTotalLikes) {
      topAuthor = { author: currentAuthor, likes: currentAuthorTotalLikes };
      // console.log('current topAuthor', topAuthor);
      return topAuthor;
    } else {
      return topAuthor;
      // if no one has likes, return will be {}, not just first author w 0 likes
      // Is it fine?
    }
  }, {} )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}

