import React from 'react';
import AddNote from './AddNote'
import Notes from './Notes'
import VisibilityFilter from './VisibilityFilter'

function App() {
  return (
    <div className="App">
      <header className="App-header">Notes</header>
      <AddNote />
      <VisibilityFilter />
      <Notes />
    </div>
  );
}

export default App;
