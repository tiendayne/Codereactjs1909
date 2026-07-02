import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async ({ username, password }) => {
  const response = await api.post('/users/login', { username, password });
  return response.data;
};

export const register = async ({ username, password, security_question, security_answer }) => {
  const response = await api.post('/users/register', {
    username,
    password,
    security_question,
    security_answer,
  });
  return response.data;
};

export const forgotPassword = async ({ username, security_answer, new_password }) => {
  const response = await api.post('/users/forgot-password', {
    username,
    security_answer,
    new_password,
  });
  return response.data;
};
