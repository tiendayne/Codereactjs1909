import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

let isAuthExpiredNotified = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const notifyAuthExpired = (message) => {
  if (isAuthExpiredNotified) return;

  isAuthExpiredNotified = true;
  window.dispatchEvent(new CustomEvent('auth-expired', {
    detail: {
      message: message || 'Phien dang nhap da het han. Vui long dang nhap lai.',
    },
  }));
};

const normalizeError = (error) => {
  const status = error?.response?.status || error?.status || 500;
  const message = error?.response?.data?.message || error?.message || 'Yeu cau khong thanh cong';

  const normalizedError = new Error(message);
  normalizedError.status = status;
  normalizedError.code = status;
  normalizedError.response = error?.response;

  return normalizedError;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeError(error);

    if ([401, 403].includes(normalizedError.status) && localStorage.getItem('auth_token')) {
      notifyAuthExpired(normalizedError.message);
    }

    return Promise.reject(normalizedError);
  }
);

export const resetAuthExpiredNotification = () => {
  isAuthExpiredNotified = false;
};

export { normalizeError };
export default api;
