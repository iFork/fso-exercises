import axios from 'axios';

const baseUrl = "http://localhost:3001/notes";
const getAll = () => {
    return axios.get(baseUrl)
                .then(response => response.data)
                .then(response => response.concat({id: 200, content: "NON-existant note", 
                                        date: "2020", important: true}))
}

const create = (newNoteObj) => {
    return axios.post(baseUrl, newNoteObj)
                .then(response => response.data);
            //obj is stringified and content type is set by axios
}

const update = (id, changedNoteObj) => {
    return axios.put(`${baseUrl}/${id}`, changedNoteObj)
                .then(response => response.data);
}

export default { getAll, create, update };
