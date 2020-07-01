import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

const Header = (props) =>
{
    console.log(props)
    return (
        <h1>{props.text}</h1>
    )
}

const Content = (props) =>
{
    console.log(props)
    return (
        <>
        <Part part={props.parts[0]} />
        <Part part={props.parts[1]} />
        <Part part={props.parts[2]} />
        </>
    )
}

const Part  = (props) =>
{
    console.log(props)
    return (
        <p>{props.part.name} {props.part.exercises}</p>
    )
}


const Total = (props) =>
{
    console.log(props)
    const total = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
    return (
            <p>Number of exercises {total}</p>
    )

}

const App = () => 
{
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }
    return (
        <div>
            <Header text = {course.name} />
            <Content 
                parts={course.parts}
            />
            <Total 
                parts={course.parts}
            />
        </div>
    )

}

ReactDOM.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// serviceWorker.unregister();
