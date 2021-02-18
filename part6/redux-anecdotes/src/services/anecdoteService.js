import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

async function getAll() {
  const resp = await axios.get(baseUrl)/*.data */ // <- NOTE: Remember to honor
  // async calls before traversing response.
  return resp.data
}

const anecdoteService = {
  getAll,
}

export default anecdoteService
