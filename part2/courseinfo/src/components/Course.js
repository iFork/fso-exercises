import React from 'react';

const Header = (props) => {
    console.log("in Header, props:", props);
    const {course} = props;
  return (
    <h2>{course.name}</h2>
  )
}

const Total = (props) => {
    const {course} = props;
    const parts = course.parts;
    const sum = parts.reduce(
        (prev, currentPart) =>
            prev + currentPart.exercises 
        , 0);
  return(
    <p><b>Total of {sum} exercises</b></p>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}

const Content = (props) => {
    console.log("in Content, props:", props);
    const {course} = props;
    const parts = course.parts;
    return (
        parts.map(part => <Part key={part.id} part={part} />)
    );
}

const Course = (props) => {
    console.log("in Course, props:", props);
    const {course} = props;
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    );
}

export default Course;

