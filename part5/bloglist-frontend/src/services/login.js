import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data; // axios parses json in data to a js object.
};
export default { login };
