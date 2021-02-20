import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

// Steps:
// wire up json-server (bd.json, npm script)
// install axios
// add data fetching/API-communication services under services folder, use axios


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

