import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (token_) => {
  // NOTE: Beware of local var names shadowing global/outer vars
  // Also, global var 'token' will be better named smth like 'authHeaderValue'
  token = `Bearer ${token_}`
  console.log('set token to', token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const config = {
    headers: {
      'Authorization': token,
    }
  }
  // console.log('post', { baseUrl, blog, config });
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  // console.log('putting', `${baseUrl}/${blog.id}`, { blog, config });
  const response = await axios.put(
    `${baseUrl}/${blog.id}`, blog, config
  )
  return response.data
}

const deleteById = async (blogId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

export default {
  getAll,
  create,
  update,
  deleteById,
  setToken,
}
