import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'


function AnecdoteForm () {
  const dispatch = useDispatch()

  function handleSubmit (evt) {
    evt.preventDefault();
    dispatch(addAnecdote(evt.target.content.value))
    evt.target.content.value = ''
  }

  return ( 
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="content"/>
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
