import { useSelector, useDispatch } from 'react-redux';
import { toggleImportance } from './reducers/noteReducer'

import Note from './Note';


function Notes () { 
  // useSelector hook also subscribes component to the store (set in Provider),
  // it is called when component renders (except when component reference remains
  // invariant?), when action is dispatched to a store and it forces re-render
  // if returned value is different from previous returned value (using strict
  // `===` equality).
  const notes = useSelector(({ notes, filter }) => {
    // NOTE: Q: why this runs 2 times on filter change?
    // A: (maybe) because it runs once an action is dispatched (in filter component
    // setFilter) and checks if re-rendering is due and once after re-rendering (?)
    //
    // console.log({ filter });
    // TODO: capitalize string constants of filter values?
    if ( filter === 'all' )
      return notes;
    return filter === 'important'
      // NOTE: pay attention that value of important is *boolean*, not string
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)

  });
  // TODO: here we pass inline callback with a dispatch to another component.
  // Do we need to use useCallback() or useMemo() to optimize out excessive renders?
  const dispatch = useDispatch();
  return ( 
    <ul>
      {notes.map(note => {
        return (
          <li>
            <Note
              key={note.id}
              note={note}
              handleImportanceToggling={
                () => dispatch(toggleImportance(note.id))
              }
            />
          </li>
        );
      })}
    </ul>
  )
}

export default Notes;
