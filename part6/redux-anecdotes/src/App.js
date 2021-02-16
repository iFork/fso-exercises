import React from 'react'
import Notification from './components/Notification';
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <Notification />      
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
