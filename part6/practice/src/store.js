import {createStore} from 'redux';
import noteReducer from './noteReducer';

// create store with a reducer callback
export default createStore(noteReducer);

