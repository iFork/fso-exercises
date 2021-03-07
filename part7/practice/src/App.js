import React, { useState }  from 'react';
import {
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Users from './components/Users';
import Notes from './components/Notes';
import Note from './components/Note';

const notes = [
  {
    content: 'first note',
    id: 1,
    important: true,
    user: 'Amy'
  }, 
  {
    content: 'second note',
    id: 2,
    important: false,
    user: 'Bob'
  }
];

function App() {
  const [ user, setUser ] = useState(null);

  const login = (user) => {
    setUser(user);
  }
  const padding = {
    padding: 3
  }
  return (
    <div className="App">
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/notes">Notes</Link>
        <Link style={padding} to="/users">Users</Link>
        { user ? <em>logged in as {user}</em> : <Link to="/login">Login</Link> }
      </div>

      <Switch>
        <Route path="/login">
          <Login onLogin={login} />
        </Route>
        <Route path="/notes/:id">
          <Note notes={notes}/>
        </Route>
        <Route path="/notes">
          <Notes notes={notes}/>
        </Route>
        <Route path="/users">
          { user ? <Users /> : <Redirect to="/login" />}
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <div className="footer">
        <i>A fine footer</i>
      </div>
    </div>
  );
}
export default App;
