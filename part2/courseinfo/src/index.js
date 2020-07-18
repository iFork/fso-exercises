import React from 'react';
import ReactDOM from 'react-dom';
import Course from './components/Course'

const Courses = (props) => {
    const {courses} = props;
    return (
        <>
            <h1>Web Development Curriculum</h1>
            {courses.map(course => <Course key={course.id} course={course} />)}
        </>
    );
}

const App = () =>
{
    const courses = [ {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            },
            {
                name: 'Redux',
                exercises: 11,
                id: 4
            }
        ]
    },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    name: 'Routing',
                    exercises: 3,
                    id: 1
                },
                {
                    name: 'Middlewares',
                    exercises: 7,
                    id: 2
                }
            ]
        }
    ]

    return ( 
        <div>
            <Courses courses={courses} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))
