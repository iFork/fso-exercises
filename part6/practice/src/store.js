import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/filterReducer';

const reducers = combineReducers({
  notes: noteReducer,
  filter: filterReducer
});
// create store with a reducer callback
const store = createStore(
  reducers,
  // connect to Redux Dev Tools (extension of Chrome)
  // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    // && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeWithDevTools()
);

export default store;
