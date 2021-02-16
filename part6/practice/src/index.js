import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/filterReducer';


// Steps:
// import redux (createStore, combineReducers) -- in index?
// define reducer funcs
// define action creators along with a reducer
// combine reducers w/ a combineReducers() to have a complex/namespaced state
// create store w/ (combined) reducers callback
// wrap root component by <Provider> of react-redux and pass store as its prop.
// in component:
// useSelector() hook of react-redux to get slices of state (like as namespaced
// by combineReducers()) and subscribe component with store.
// useDispatch() hook of redux to dispatch actions (via action creators)

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

