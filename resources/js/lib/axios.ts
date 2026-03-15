import Axios from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here if needed
    return Promise.reject(error);
  }
);

export default axios;
