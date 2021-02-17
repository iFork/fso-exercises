import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/filterReducer';

// Steps:
// wire up json-server (bd.json, npm script)
// install axios
// add data fetching/API-communication services under services folder, use axios

const reducers = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
// create store with a reducer callback
const store = createStore(
  reducers,
  // connect to Redux Dev Tools (extension of Chrome)
  // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    // && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeWithDevTools()
);


// NOTE: wrapping render in renderApp() to pass a callback to store.subscribe() 
// pattern is needed no more, since useSelector() hooks of react-redux ensure
// subscription of compoenents with store.
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

