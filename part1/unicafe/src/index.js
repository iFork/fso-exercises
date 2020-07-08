import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';


const Button = ({handleClick, text}) => 
{
    return (
        <button onClick={handleClick}>
        {text}
        </button>
    );
}

const Feedback = () =>
{
    return (
        <h1>Give Feedback</h1>
    );
    
}

const StatisticRow = ({label, value}) =>
{
    return (
        <tr>
            <td>{label}</td> 
            <td>{value}</td> 
        </tr>
    );
}
const Statistics = (props) =>
{
    console.log("Props passed to Statistics: ", props);
    const {good, neutral, bad, total, average, positivesPercent} = props;
    if (total === 0) {
        return (
            <div>
                <h1>Statistics</h1>
                <p>Give feedback to see the statistics.</p>
            </div>
        );
    }
    return (
        <div>
            <h1>Statistics</h1>
        <table>
            <StatisticRow label="good" value={good} /> 
            <StatisticRow label="neutral" value={neutral} /> 
            <StatisticRow label="bad" value={bad} /> 
            <StatisticRow label="total" value={total} /> 
            <StatisticRow label="average" value={average} /> 
            <StatisticRow label="positive" value={positivesPercent} /> 
        </table>
        </div>

    );
}

const App = () =>
{
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const evalAverage = (good, neutral, bad, total) => {
        const goodScore = 1;
        const neutralScore = 0;
        const badScore = -1;
        if(total===0) return 0;
        return (good * goodScore + neutral * neutralScore + bad * badScore)/total;
    }

    const evalPositivesPercent = (good, total) => {
        const positivesPrc = good*100/total;
        if(total===0) return 0 + " %";
        return positivesPrc + " %";
    }

    let total = good + neutral + bad;
    let average = evalAverage(good, neutral, bad, total);
    let positivesPercent = evalPositivesPercent(good, total);

    const castFeedback = (bin) => {
        let handler;
        switch (bin) {
            case "good":
                handler = () => {
                    const newGood = good + 1;
                    setGood(newGood);
                }
                break;
            case "neutral":
                handler = () => {
                    const newNeutral = neutral + 1;
                    setNeutral(newNeutral);
                }
                break;
            case "bad":
                handler = () => {
                    const newBad = bad + 1;
                    setBad(newBad);
                }
                break;
            default:
                console.log("Feedback bin is not specified");
                break;
        }
        return handler;
    }
    return (
        <div>
            <Feedback />
            <Button handleClick={castFeedback("good")} text="good" />
            <Button handleClick={castFeedback("neutral")} text="neutral" />
            <Button handleClick={castFeedback("bad")} text="bad" />
            <Statistics good={good} neutral={neutral} bad={bad} total={total}
                average={average} positivesPercent={positivesPercent} />
        </div>

    );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
