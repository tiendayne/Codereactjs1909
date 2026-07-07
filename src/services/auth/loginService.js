import api from '../../config/axios/axiosConfig';

export const login = async ({ username, password }) => {
  const response = await api.post('/users/login', { username, password });
  return response.data;
};
