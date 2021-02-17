import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AddNote from './AddNote'
import Notes from './Notes'
import VisibilityFilter from './VisibilityFilter'
import { initializeNotes } from './reducers/noteReducer';
import noteService from './services/noteService'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // async function init() {
    //   const notes = await noteService.getAll()
    //   dispatch(initializeNotes(notes))
    // }
    // init()
    //
    // ar, alternatively use .then instead of async/await
    noteService.getAll()
      .then(notes => dispatch(initializeNotes(notes)))
  }, [dispatch]) // dispatch has stable identity, so this shell run only once

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
