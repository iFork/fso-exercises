import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import anecdoteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

const reducers = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer,
  filter: filterReducer
});

export default createStore(
  reducers,
  // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    // && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);
