import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

// Steps:
// import redux (createStore) 
// define reducer func
// create store w/ reducer callback
// in component - onClick - dispatch actions to the store
// subscribe render callback w/ store (completes substitution of useState hook)
//

function counterReducer(state = 0, action) {
  console.log(action.type);
  switch (action.type) {
    case 'INCREMENT':
      console.log('increment');
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'ZERO':
      return 0;
    default:
      return state;
  }
}

// create store with a reducer callback
let store = createStore(counterReducer);


function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">Counter</header>
      {store.getState()}
      <button onClick={() => store.dispatch({type: 'INCREMENT'})}>
        Increment
      </button>
      <button onClick={() => store.dispatch({type: 'DECREMENT'})}>
        Decrement
      </button>
      <button onClick={() => store.dispatch({type: 'ZERO'})}>
        Zero
      </button>

    </div>
  );
}


function renderApp() { 
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// first render
renderApp();

store.subscribe(renderApp);

