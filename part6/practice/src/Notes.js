// TODO: pass store?
import store from './store';

import { toggleImportance } from './reducers/noteReducer'

import Note from './Note';


function Notes () { 
  return ( 
    <ul>
      {store.getState().map(note => {
        return (
          <li>
            <Note
              key={note.id}
              note={note}
              handleImportanceToggling={
                () => store.dispatch(toggleImportance(note.id))
              }
            />
          </li>
        );
      })}
    </ul>
  )
}

export default Notes;
