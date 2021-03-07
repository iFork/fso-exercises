import React, { useState }  from 'react';
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
  const [ page, setPage ] = useState('home');

  const toPage = (page) => (evt) => {
    evt.preventDefault();
    setPage(page);
  }
  
  const pageContent = (page) => {
    if (page === 'home') { return <Home /> }
    if (page === 'notes') { return <Notes notes={notes} /> }
    if (page === 'users') { return <Users /> }
  }
  const padding = {
    padding: 3
  }
  return (
    <div className="App">
      <header className="App-header">Notes</header>
      <a href="" style={padding} onClick={toPage('home')}>Home</a>
      <a href="" style={padding} onClick={toPage('notes')}>Notes</a>
      <a href="" style={padding} onClick={toPage('users')}>Users</a>
      {pageContent(page)}
    </div>
  );
}

export default App;
