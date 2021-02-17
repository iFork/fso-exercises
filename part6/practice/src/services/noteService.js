import axios from 'axios'
// axios
// json-server

const baseUrl = 'http://localhost:3001/notes'
async function getAll() {
  const response = await axios.get(baseUrl)
  return response.data
}

const noteService = {
  getAll,
}
 export default noteService
