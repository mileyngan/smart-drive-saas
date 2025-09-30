import axios from 'axios';

// The backend server will be running on port 5001
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * We can add an interceptor here later to automatically
 * attach the auth token to every request.
 */
// api.interceptors.request.use(config => {
//   const token = // get token from state management
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;