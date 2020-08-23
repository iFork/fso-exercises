import axios from 'axios';

// const baseUrl = "http://localhost:3001/api/persons";
// const baseUrl = "https://ancient-lowlands-07089.herokuapp.com/api/persons";
const baseUrl = "/api/persons";

const getAll = () => {
    return axios.get(baseUrl)
                .then(response => response.data);
}

const create = (newPersonObj) => {
    return axios.post(baseUrl, newPersonObj)
                .then(response => response.data);
}

const update = (id, newPersonObj) => {
    //NOTE: when confusing `post` for `put`, we get '404 Not found' error. 
    return axios.put(`${baseUrl}/${id}`, newPersonObj)
                .then(response => response.data);
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}
export default {getAll, create, update, deletePerson};
