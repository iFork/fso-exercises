import { useDispatch } from 'react-redux';
import { createNote } from './reducers/noteReducer'

function AddNote () { 
  // this is *uncontrolled form*, in react terms, since source of truth is DOM,
  // not react state (i.e. value of input node does not come from prop/state)
  // TODO: harmonize - const or let ?? 
  const dispatch = useDispatch();
  let noteInput = null;
  function handleSubmit (e) {
    // NOTE: if no `preventDefault`, page is reloaded and if store is not
    // persistent, it resets.
    e.preventDefault();
    // get value from DOM
    // const noteContent = e.target.note.value;
    // createNote(noteContent);
    // e.target.note.value = '';

    // or, alternatively, using *createRef() or callback refs* to hold a reference
    // to a specific DOM node.
    // TODO: Q: Check for null noteInput or not?
    dispatch(createNote(noteInput.value));
    noteInput.value = '';
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="note"
        type="text"
        ref={textInputEl => noteInput = textInputEl}
      />
      <button type="submit">
        Add note
      </button>
    </form>
  )
}

export default AddNote;
