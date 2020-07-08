// import React from 'react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

const Hello = ({name, age}) =>
{   
    // const {name, age} = props;
    const bornYear = () => new Date().getFullYear - age;
    return (
        <div>
            <p>Hello {name}, you are {age}</p>
            <p>You are probably born in {bornYear()}</p>
        </div>
    );

}

/* const CounterStateless = ({counter}) => {
    console.log('rendering CounterStateless... ', counter);
    return (
        <div>Counting w/o state... {counter}</div>
    );
} */

/* const CounterStateful = () => 
{
    const [ counter, setCounter ] = useState(0);
    setTimeout(
        () => setCounter(counter + 1), 
        1000);
    console.log('rendering CounterStateful... ', counter);
    return (
        <div>Counting with  state ... {counter}</div>
    );
} */

const CounterWithButtons = () => 
{
    const [ counter, setCounter ] = useState(0);
    console.log('rendering CounterWithButtons... ', counter);
    const increaseByOne = () => {
        console.log('Plus: Mouse clicked');
        setCounter(counter + 1);
    }
    const setToZero = () => {
        console.log('Reset: Mouse clicked');
        setCounter(0);
    }

    return (
        <div>
            <div>Counting with state and button... {counter}</div>
            <button onClick={increaseByOne}> 
                plus
            </button>
            <button onClick={setToZero}> 
                reset
            </button>
        </div>
    )
}

const Counter = () => 
{
    const [ counter, setCounter ] = useState(0);
    const setToZero = () => {
        console.log('Mouse: reset clicked');
        setCounter(0);
    }
    const increaseByOne = () => {
        console.log('Mouse: plus clicked');
        setCounter(counter + 1);
    }
    const decreaseByOne = () => {
        console.log('Mouse: minus clicked');
        setCounter(counter - 1);
    }
    return (
        <div>
            <Display counter={counter} />
            <Button  handleClick={increaseByOne} text='Plus' />
            <Button  handleClick={decreaseByOne} text='Minus' />
            <Button  handleClick={setToZero} text='Reset' />
        </div>
    );
    
}

const Display = ({counter}) =>
{
    return (
        <div> Counter display: {counter} </div>
    );
}

const Button = ({text, handleClick}) =>
{
    return (
        <button onClick={handleClick}>
            {text}
        </button>
    );
}

const ClickHistory = ({allClicks}) =>
{
    if (allClicks.length === 0) {
        return (
            <p>Usage: click on buttons.</p>
        );
    }
    else {
        return (
            <p>Click history: {allClicks.join(' ')}</p>
        );
    }
}
const ClickCounter = () =>
{
    const [lefClick, setLeftClick] = useState(0);
    const [rightClick, setRightClick] = useState(0);
    const [anyClick, setAnyClick] = useState([]);

    //click handlers
    const handleClick = (button) => {
        let handler;
        switch (button) {
            case "l":
                // return () => {
                    // setLeftClick(lefClick + 1);
                    // setAnyClick(anyClick.concat('l'));
                // };
                handler = () => {
                    setLeftClick(lefClick + 1);
                    setAnyClick(anyClick.concat('l'));
                }
                break;
            case "r":
                handler = () => {
                    setRightClick(rightClick + 1);
                    setAnyClick(anyClick.concat('r'));
                };
                break;
            default:
                    console.log("Not specified key");
                    break;
        }
        return handler;
    }
    return (
        <div>
            {lefClick}
            <Button  handleClick={handleClick('l')} text='Left' />
            {rightClick}
            <Button  handleClick={handleClick('r')} text='Right' />
            <ClickHistory allClicks={anyClick}/>
        </div>
    );
}


const App = ({counter}) => 
{
    console.log('Hello from App component')
    const name = 'Peto'
    const age = 12
    // debugger;
    return (
        <div>
            <h1>Greetings</h1>
            <Counter />
            <ClickCounter />
            <p> ...... </p>
            <Hello name="Sara" age={18}/>
            <Hello name={name} age={age}/>
        </div>
    )
            // <CounterStateless counter={counter} />
            // <CounterStateful />
            // <CounterWithButtons />
}

const refresh = () => {
    console.log('refresh() called');
    ReactDOM.render(
    // <React.StrictMode>
        <App counter={counter} />
    // </React.StrictMode>,
    , document.getElementById('root')
    );
}

let counter = 0;

setInterval( () => {
    refresh();
    counter++;
    }, 1000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// serviceWorker.unregister();
