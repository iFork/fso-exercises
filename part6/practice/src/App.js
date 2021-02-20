import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AddNote from './AddNote';
import Notes from './Notes';
import VisibilityFilter from './VisibilityFilter';
import { initializeNotes } from './reducers/noteReducer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeNotes());
  }, [dispatch]); // dispatch has stable identity, so this shell run only once

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
