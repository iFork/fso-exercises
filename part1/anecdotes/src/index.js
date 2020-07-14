import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Button = ({handleClick, text}) => 
{
    return (
        <button onClick={handleClick}>
            {text}
        </button>
    );
}

const Display = ({text}) => 
{
    return (
        <p>{text}</p>
    );
}

const Anecdote = ({anecdotes, selected}) =>
{
    return (
        <p>{anecdotes[selected]}</p>
    );
    
}

/**
 * indexOfMax.
 *
 * @param {array} arr Argument is non empty array.
 * @return Index of a largest number in a given array
 */
const indexOfMax = (arr) => {
    let maxIndex = 0;
    let max = arr[maxIndex];
    let len = arr.length;
    for (let i = 0;  i !== len; i++) {
        if (arr[i] > max) {
            max = arr[i];
            maxIndex = i;
        }
    }
    return maxIndex;
}

const TopAnecdote = (props) =>
{
    console.log("props in TopAnecdote", props);
    const {anecdotes, votes} = props;
    const topIndex = indexOfMax(votes);
    console.log("topIndex is: ", topIndex);
    return (
        <div>
            <h1>Anecdote with the most votes</h1>
            <p>{anecdotes[topIndex]}</p>
            {"Votes: " + votes[topIndex]}
        </div>
    );
    
}
/**
 * getRandomNum.
 *
 * @param {number} max Non-inclusive upper bound of a random number
 * @return A random number from a [0, max) range.
 */
function getRandomNum(max) 
{
    max = Math.floor(max);
    const res =  Math.floor(Math.random() * max);
    console.log("Random number is: ", res, ", max is: ", max);
    return res;
}


const App = ({anecdotes}) =>
{
    const len = anecdotes.length;

    let randNum = (() => { console.log("randNum initializer called"); return getRandomNum(len);})();
    const [selected, setSelected] = useState( (() => {
                                    console.log("useState() called");
                                    return randNum})() );

    // const [selected, setSelected] = useState(getRandomNum(len));
    // const [selected, setSelected] = useState(0);

    const [votes, setVotes] = useState(new Array(len).fill(0));
    /**
     * Cast a vote for a selected quote
     */
    const vote = (selected) => {
        let newVotes = [...votes];
        newVotes[selected] += 1;
        setVotes(newVotes);
    }


	// RE-RENDER ISSUE related to the vlaue passed to setStatus().
    // TODO: ToEXPLAIN: NOTE: App does NOT re-render when same (as in state initializer)
    // number is used in click handler setSelected.
    // ToEXPLAIN: NOTE: Also having randNumDummy = randNum + 1 causes re-render but after multiple 
    // clicks it stops to cause re-render. 
    // Check: shouldComponentUpdate(nextProp, nextState) or forceUpdate()
    //
            // <Button handleClick={() => setSelected(randNum)}
	// or
    // let randNumDummy = randNum + 1;
    // console.log("randNumDummy is", randNumDummy);
            // <Button handleClick={() => {
                // console.log("Click handler called");
                // setSelected(randNum);
                // }
            // }
            // text="Next" />

	/* console log - one can see no re-render occures at the last line of log:
		randNum initializer called
		Random number is:  1 , max is:  6
		useState() called
		randNumDummy is 2
		Click handler called
		randNum initializer called
		Random number is:  4 , max is:  6
		useState() called
		randNumDummy is 5
	(33)    Click handler called  //<-- no other calls get logged
	*/

    return (
        <div>
            <Anecdote anecdotes={anecdotes} selected={selected} />
            <Display text={"Votes casted: " + votes[selected]} />
            <Button handleClick={() => {
                console.log("Next Click handler called");
                setSelected(getRandomNum(len))
                //TODO: putting in setSelected() randNum 
                //breaks/stops re-rendering immediately,
                //putting randNum+1 or some fixed number breaks/stops 
                //re-render after 3-4 re-renders
                }
            }
            text="Next" />
            <Button handleClick={() => {
                console.log("Vote Click handler called");
                vote(selected);
                }
            }
            text="Vote" />
            <TopAnecdote anecdotes={anecdotes} votes={votes} />
        </div>
    );
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(
    <App anecdotes={anecdotes} />
  , document.getElementById('root')
);

