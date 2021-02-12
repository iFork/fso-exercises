import { useSelector, useDispatch } from 'react-redux';
import { toggleImportance } from './reducers/noteReducer'

import Note from './Note';


function Notes () { 
  // useSelector hook also subscribes component to the store (set in Provider),
  // it is called when component renders (except when component reference remains
  // invariant?), when action is dispatched to a store and it forces re-render
  // if returned value is different from previous returned value (using strict
  // `===` equality).
  const notes = useSelector(state => state);
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
