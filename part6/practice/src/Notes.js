import { connect } from 'react-redux';
import { toggleImportance } from './reducers/noteReducer';
import Note from './Note';
import noteService from './services/noteService';


function Notes ({ notes, toggleImportance }) { 
  // TODO: here we pass inline callback with a dispatch to another component.
  // Do we need to use useCallback() or useMemo() to optimize out excessive renders?
  async function handleImportanceToggling(note) {
    // /* const updatedNote = */ await noteService.toggleImportance(note)
    await noteService.updateNote({
      ...note,
      important: !note.important
    });
    // TODO: catch errors
    toggleImportance(note.id);
  }
  return ( 
    <ul>
      {notes.map(note => {
        return (
          // NOTE: key attribute belongs to the top/precise element being
          // mapped to array, to <li> here, not <Note> nested in <li>.
          <li key={note.id}>
            <Note
              note={note}
              handleImportanceToggling={
                () => handleImportanceToggling(note)
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

// passing mapStateToProps to connect subscribes component to the store (set in Provider),
// it is called whenever store has updated. 
function mapStateToProps({ notes, filter }) {
  // NOTE: note OBSOLETED after using connect() instead of useSelector() hook.
  // Now (w/ connect()) it runs once on filter change.
  // Q: why this runs 2 times on filter change?
  // OBSOLETE A: (maybe) because it runs once an action is dispatched (in filter component
  // setFilter) and checks if re-rendering is due and once after re-rendering (?)
  // TODO: capitalize string constants of filter values?
  if ( filter === 'all' )
    return { notes };
  return {
    notes: (filter === 'important'
      // NOTE: pay attention that value of important is *boolean*, not string
      ?  notes.filter(note => note.important) 
      :  notes.filter(note => !note.important)
    )
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     toggleImportance: (id) => dispatch(toggleImportance(id)),
//   };
// }
// or object shorthand form where redux  binds each action creator to
// dispatch, like above, but does it internally
const mapDispatchToProps = { toggleImportance };

const ConnectedNotes = connect(mapStateToProps, mapDispatchToProps)(Notes);
export default ConnectedNotes;
