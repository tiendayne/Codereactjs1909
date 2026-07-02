import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeError = (error) => {
  const status = error?.response?.status || error?.status || 500;
  const message = error?.response?.data?.message || error?.message || 'Yêu cầu không thành công';

  const normalizedError = new Error(message);
  normalizedError.status = status;
  normalizedError.code = status;
  normalizedError.response = error?.response;

  return normalizedError;
};

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

export { normalizeError };
export default api;
