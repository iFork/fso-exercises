import React from 'react';
import AddNote from './AddNote'
import Notes from './Notes';

function App() {
  return (
    <div className="App">
      <header className="App-header">Notes</header>
      <AddNote />
      <Notes />
    </div>
  );
}

export default App;
