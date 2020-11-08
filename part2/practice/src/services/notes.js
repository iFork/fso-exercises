import axios from 'axios'

// json-server endpoint
// const baseUrl = "http://localhost:3001/notes";
// our local endpoint
// const baseUrl = "http://localhost:3001/api/notes";
// heroku endpoint
// const baseUrl = "https://young-mesa-19211.herokuapp.com/api/notes";
// endpoint when frontend and backend are in the same root
const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  console.log(`setting token to ${newToken}`)
  token = `bearer ${newToken}`
}


const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .then(response => response.concat({ id: 200, content: 'NON-existant note',
      date: '2020', important: true }))
}

const create = async (newNoteObj) => {
  // Q: Will `config` in global scope be bound to stale token value ?
  // A: Yes
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const response = await axios.post(baseUrl, newNoteObj, config)
  //obj is stringified and content type is set by axios
  // console.log('posting', { baseUrl, newNoteObj, config });
  return response.data
}

const update = (id, changedNoteObj) => {
  return axios.put(`${baseUrl}/${id}`, changedNoteObj)
    .then(response => response.data)
}

export default { getAll, create, update, setToken }
