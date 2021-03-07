import React  from 'react';
import {
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Home from './components/Home';
import Users from './components/Users';
import Notes from './components/Notes';

const notes = [
  {
    content: 'first note',
    id: 1,
    important: true
  }, 
  {
    content: 'second note',
    id: 2,
    important: false
  }
];

function App() {

  const padding = {
    padding: 3
  }
  return (
    <div className="App">
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/notes">Notes</Link>
        <Link style={padding} to="/users">Users</Link>
      </div>

      <Switch>
        <Route path="/notes">
          <Notes notes={notes}/>
        </Route>
        <Route path="/users">
          <Users />
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
