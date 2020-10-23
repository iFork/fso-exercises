import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm';
import blogService from './services/blogs'
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      // console.log('useEffect: there is a saved user', { loggedUser });
      setUser(loggedUser)
    }
  }, [])

  // Q: why we nest handleLogin() func inside App component?
  // A: It is simpler since it depends on app state. 
  // Also a new func will be 'instantiated' on every render but 
  // it seems to harm performance not noticeably.
  const handleLogin = async (event) => {
    // NOTE: REMEMBER to prevent default to avoid reloading (and url encoded
    // 'get' request) onSubmit
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({
        username: event.target.username.value,
        password: event.target.password.value,
      }) // axios parses json in response.data to an object
      // console.log({ loggedUser })
      setUsername("")
      setPassword("")
      setUser(loggedUser)
      const loggedUserJSON = JSON.stringify(loggedUser);
      window.localStorage.setItem("loggedBlogappUser", loggedUserJSON);
    } catch (err) {
      console.log(err.response.data.error);
      // TODO: set error message
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.clear();
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm
          loginHandler={handleLogin}
          username={username}
          setUsername={setUsername} 
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return (
    <div>
      <div>
        <p>{user.username} logged in</p>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Blogs</h2>
      { blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </div>
  ) 

}

export default App
