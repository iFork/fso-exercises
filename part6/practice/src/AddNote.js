import { createNote } from './reducers/noteReducer'
import store from './store';
// TODO: pass store via <Provider>

function NewNote () { 
  // this is *uncontrolled form*, in react terms, since source of truth is DOM,
  // not react state (i.e. value of input node does not come from prop/state)
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
    store.dispatch(createNote(noteInput.value));
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

export default NewNote;
