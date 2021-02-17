import axios from 'axios'
// axios
// json-server

const baseUrl = 'http://localhost:3001/notes'
async function getAll() {
  const response = await axios.get(baseUrl)
  return response.data
}

async function createNote(noteContent) {
  const response = await axios.post(baseUrl, {
    content: noteContent,
    important: false,
    // id shell be managed by server
  })
  return response.data
}

const noteService = {
  getAll,
  createNote,
}
 export default noteService
