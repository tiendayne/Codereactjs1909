import api from '../../config/axios/axiosConfig';

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
