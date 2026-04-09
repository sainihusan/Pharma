import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = async (endpoint, { body, method, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    method: method || (body ? 'POST' : 'GET'),
    url: `${BASE_URL}${endpoint}`,
    headers: { ...headers, ...customConfig.headers },
    ...customConfig,
  };

  if (body) config.data = body;

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || error.response.data?.error || 'Something went wrong');
    }
    throw new Error(error.message || 'Something went wrong');
  }
};

export default apiClient;
