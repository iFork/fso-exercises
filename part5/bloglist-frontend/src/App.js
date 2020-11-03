import React, { useState, useEffect, useRef } from 'react'
import Notifications from './components/Notifications'
import Togglable from './components/Togglable';
import AddBlogForm from './components/AddBlogForm'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogUrl, setNewBlogUrl] = useState("")
  const [notifications, setNotifications] = useState([])

  const notificationId = useRef(0)
  const popNotification = (notification) => {
    const id = ++notificationId.current
    setNotifications(notifications.concat({
      ...notification,
      id,
    }))
    // NOTE: when func is passed to setTimeout(), it captures vars
    // referenced in it (e.g. `notifications`), which may become *stale* before
    // setTimeout executes callback. 
    // Therefore here we use 'functional' state updater, passing a callback with
    // previous state as an argument.
    // NOTE: Chrome make me think that setTimeout does not work since changing
    // time length had no effect. At the end I just *refreshed the Chrome page*
    // and it started to work.
    setTimeout(() => setNotifications((previousNotifications) => 
        previousNotifications.filter((ntf) => ntf.id !== id)),
      6_000)
  }

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
      blogService.setToken(loggedUser.token)
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
      blogService.setToken(loggedUser.token)
      const loggedUserJSON = JSON.stringify(loggedUser);
      window.localStorage.setItem("loggedBlogappUser", loggedUserJSON);
      popNotification({
        type: "success",
        content: `Logged in as ${loggedUser.username}`
      })
    } catch (err) {
      console.log(err.response.data.error);
      popNotification({
        type: "error",
        content: err.response.data.error
      })
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.clear();
    popNotification({
      type: "success",
      content: 'Logged out'
    })
  }

  const addBlogFormToggleRef = useRef()

  const handleBlogCreation = async (event) => {
    event.preventDefault();
    // console.log('creating new blog', { target: event.target });
    // const blog = {
    //     title:  event.target.title.value,
    //     author: event.target.author.value,
    //     url:    event.target.url.value,
    // };
    const blog = {
        title: newBlogTitle, 
        author: newBlogAuthor,
        url: newBlogUrl,
    };
    try {
      const blogReturned = await blogService.create(blog);
      setBlogs(blogs.concat(blogReturned));
      setNewBlogTitle("");
      setNewBlogAuthor("");
      setNewBlogUrl("");
      popNotification({
        type: "success",
        content: `Blog '${blogReturned.title}' was added`
      })
      addBlogFormToggleRef.current.toggleVisibility()
    } catch (err) {
      console.log('error is:', err.response.data.error);
      popNotification({
        type: "error",
        content: err.response.data.error
      })
    }
  }

  if (!user) {
    return (
      <div>
        <Notifications notifications={notifications} />
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
      <Notifications notifications={notifications} />
      <div>
        <p>{user.username} logged in</p>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      <Togglable ref={addBlogFormToggleRef} buttonLabel="Add Blog">
        <AddBlogForm
          handleBlogCreation={handleBlogCreation}
          newBlogTitle={newBlogTitle}
          setNewBlogTitle={setNewBlogTitle}
          newBlogAuthor={newBlogAuthor}
          setNewBlogAuthor={setNewBlogAuthor}
          newBlogUrl={newBlogUrl}
          setNewBlogUrl={setNewBlogUrl}
        />
      </Togglable>
      <h2>Blogs</h2>
      { blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </div>
  ) 

}

export default App
