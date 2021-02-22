import { connect } from 'react-redux';
import { createNote } from './reducers/noteReducer';

function AddNote ({ createNote }) { 
  // this is *uncontrolled form*, in react terms, since source of truth is DOM,
  // not react state (i.e. value of input node does not come from prop/state)
  let noteInput = null;
  function handleSubmit (e) {
    // NOTE: if no `preventDefault`, page is reloaded and if store is not
    // persistent, it resets.
    e.preventDefault();
    // get value from DOM
    // e.target.note.value
    // Or, alternatively, using *createRef() or callback refs* to hold a reference
    // to a specific DOM node.
    // TODO: Q: Check for null noteInput or not?
    // TODO: Research: Q: how dispatch() (or prop mapped to dispatch, in this
    // version) waits for async calls inside thunk to
    // finish before proceeding? (next line nullifies its param and it works like
    // synchronous flow.)
    createNote(noteInput.value);
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
  );
}

const mapDispatchToProps  =  { createNote };
export default connect(null, mapDispatchToProps)(AddNote);
