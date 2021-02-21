import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

async function getAll() {
  const resp = await axios.get(baseUrl);/*.data */ // <- NOTE: Remember to honor
  // async calls before traversing response.
  return resp.data;
}


/**
 * Post anecdote to server.
 *
 * @async
 * @param {{content: string, vote: number}} anecdote - anecdote object to post
 * @return {Promise<{id: string, content: string, vote: number}>}
 */
async function create(anecdote) {
  const resp = await axios.post(baseUrl, anecdote);
  return resp.data;
}

async function update (anecdote) {
  // NOTE: Precondition: json-server ignores `id` in payload of put request.
  const resp = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote);
  return resp.data;
}

const anecdoteService = {
  getAll,
  create,
  update,
};

export default anecdoteService;
