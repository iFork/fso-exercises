import {createStore} from 'redux';
import noteReducer from './reducers/noteReducer';

// create store with a reducer callback
export default createStore(noteReducer);

