import api from '../../config/axios/axiosConfig';

export const forgotPassword = async ({ username, security_answer, new_password }) => {
  const response = await api.post('/users/forgot-password', {
    username,
    security_answer,
    new_password,
  });
  return response.data;
};
















