import React from 'react';
import { connect } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setVoteNotification } from '../reducers/notificationReducer';


function AnecdoteList ({ anecdotes, vote, setVoteNotification }) { 
  
  const handleVote = (anecdote) => {
    vote(anecdote);
    setVoteNotification(anecdote.content);
  };  

  // sort by descending order
  const anecdotesSorted = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return ( 
    <div>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
}

function mapStateToProps({ filter, anecdotes }) {
  return {
    anecdotes: ( 
      filter === ''
      ? anecdotes
      : anecdotes.filter(a => {
        return a.content.toLowerCase().includes(filter.toLowerCase());
      })
    )};
}
const mapDispatchToProps = {
  vote,
  setVoteNotification,
};
export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
